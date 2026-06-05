#!/usr/bin/env node

import { copyFile, mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const IMPORT_MARKER = "Imported from Hashnode by scripts/import-hashnode-export.mjs";

const options = parseArgs(process.argv.slice(2));

if (!options.input) {
  console.error(
    "Usage: npm run import:hashnode -- path/to/hashnode-export-or-directory " +
      "[--output=content/blog] [--assets-output=static/images/blog] " +
      "[--overwrite] [--dry-run] [--include-drafts]",
  );
  process.exit(1);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});

async function main() {
  const inputPath = path.resolve(options.input);
  const outputDir = path.resolve(options.output || "content/blog");
  const assetsOutputDir = path.resolve(options.assetsOutput || "static/images/blog");
  const exports = await loadJsonExports(inputPath);
  const posts = exports
    .flatMap(({ filePath, data }) => findPosts(data).map((post) => normalizePost(post, filePath)))
    .filter(Boolean);

  if (posts.length === 0) {
    throw new Error(`No posts with Markdown content were found under ${inputPath}.`);
  }

  const seen = new Set();
  await mkdir(outputDir, { recursive: true });
  if (!options.dryRun) {
    await mkdir(assetsOutputDir, { recursive: true });
  }

  for (const post of posts) {
    const slug = uniqueSlug(post.slug, seen);
    const filePath = path.join(outputDir, `${slug}.md`);
    const materializedPost = options.dryRun
      ? post
      : await materializeLocalAssets(post, slug, assetsOutputDir);
    const markdown = renderHugoMarkdown(materializedPost, slug);

    if (options.dryRun) {
      console.log(`Would import ${post.title} -> ${relativePath(filePath)}`);
      continue;
    }

    await writeFile(filePath, markdown, {
      encoding: "utf8",
      flag: options.overwrite ? "w" : "wx",
    });
    console.log(`Imported ${post.title} -> ${relativePath(filePath)}`);
  }

  console.log(`${options.dryRun ? "Checked" : "Imported"} ${posts.length} Hashnode posts.`);
}

async function loadJsonExports(inputPath) {
  const inputStat = await stat(inputPath);

  if (inputStat.isFile()) {
    return [{ filePath: inputPath, data: await parseJsonFile(inputPath) }];
  }

  if (!inputStat.isDirectory()) {
    throw new Error(`${inputPath} is not a file or directory.`);
  }

  const jsonFiles = await findJsonFiles(inputPath);

  if (jsonFiles.length === 0) {
    throw new Error(`No JSON files were found under ${inputPath}.`);
  }

  return Promise.all(jsonFiles.map(async (filePath) => ({ filePath, data: await parseJsonFile(filePath) })));
}

async function findJsonFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      if (shouldSkipDirectory(entry.name)) {
        continue;
      }

      files.push(...(await findJsonFiles(entryPath)));
    } else if (entry.isFile() && entry.name.endsWith(".json") && !entry.name.startsWith("export_errors")) {
      files.push(entryPath);
    }
  }

  return files;
}

function shouldSkipDirectory(name) {
  if (name === "drafts") {
    return !options.includeDrafts;
  }

  return name === "pages" || name === "series" || name === "images";
}

async function parseJsonFile(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

function findPosts(value, posts = []) {
  if (Array.isArray(value)) {
    for (const item of value) {
      findPosts(item, posts);
    }
    return posts;
  }

  if (!value || typeof value !== "object") {
    return posts;
  }

  if (looksLikePost(value)) {
    posts.push(value);
    return posts;
  }

  for (const child of Object.values(value)) {
    findPosts(child, posts);
  }

  return posts;
}

function looksLikePost(value) {
  return Boolean(firstString(value.title, value.name) && getMarkdown(value));
}

function normalizePost(rawPost, sourceFilePath = "") {
  const title = firstString(rawPost.title, rawPost.name);
  const markdown = getMarkdown(rawPost);

  if (!title || !markdown) {
    return null;
  }

  return {
    title,
    markdown: cleanHashnodeMarkdown(markdown),
    slug: sanitizeSlug(firstString(rawPost.slug, slugFromUrl(rawPost.url), title)),
    description: firstString(
      rawPost.brief,
      rawPost.subtitle,
      rawPost.description,
      rawPost.seo?.description,
    ),
    date: firstString(rawPost.publishedAt, rawPost.dateAdded, rawPost.date, rawPost.createdAt),
    updated: firstString(rawPost.updatedAt, rawPost.updated_at),
    tags: normalizeTags(rawPost.tags),
    cover: firstString(rawPost.coverImage?.url, rawPost.coverImage, rawPost.cover?.image),
    localCover: firstString(rawPost.localCoverImage),
    originalUrl: firstString(rawPost.url, rawPost.canonicalUrl),
    id: firstString(rawPost.id, rawPost._id),
    draft: rawPost.draft === true || rawPost.status === "draft",
    sourceFilePath,
  };
}

async function materializeLocalAssets(post, slug, assetsOutputDir) {
  const sourceDir = post.sourceFilePath ? path.dirname(post.sourceFilePath) : "";
  const postAssetsDir = path.join(assetsOutputDir, slug);
  const publicAssetBase = `/images/blog/${slug}`;

  await mkdir(postAssetsDir, { recursive: true });

  return {
    ...post,
    markdown: await rewriteLocalMarkdownImages(post.markdown, sourceDir, postAssetsDir, publicAssetBase),
    cover:
      (await copyLocalAsset(post.localCover || post.cover, sourceDir, postAssetsDir, publicAssetBase)) ||
      post.cover,
  };
}

async function rewriteLocalMarkdownImages(markdown, sourceDir, postAssetsDir, publicAssetBase) {
  const imagePattern = /!\[([^\]]*)\]\((<[^>]+>|[^)\s]+)([^)]*)\)/g;
  const replacements = [];

  for (const match of markdown.matchAll(imagePattern)) {
    const rawUrl = match[2];
    const url = rawUrl.startsWith("<") && rawUrl.endsWith(">") ? rawUrl.slice(1, -1) : rawUrl;
    const publicUrl = await copyLocalAsset(url, sourceDir, postAssetsDir, publicAssetBase);

    if (!publicUrl) {
      continue;
    }

    const replacementUrl = rawUrl.startsWith("<") ? `<${publicUrl}>` : publicUrl;
    replacements.push([match[0], `![${match[1]}](${replacementUrl}${match[3] || ""})`]);
  }

  return replacements.reduce((content, [from, to]) => content.replace(from, to), markdown);
}

async function copyLocalAsset(assetPath, sourceDir, postAssetsDir, publicAssetBase) {
  if (!assetPath || isExternalUrl(assetPath) || assetPath.startsWith("/")) {
    return "";
  }

  const sourcePath = path.resolve(sourceDir, assetPath);

  try {
    const assetStat = await stat(sourcePath);
    if (!assetStat.isFile()) {
      return "";
    }
  } catch {
    return "";
  }

  const filename = sanitizeFilename(path.basename(sourcePath));
  await copyFile(sourcePath, path.join(postAssetsDir, filename));
  return `${publicAssetBase}/${filename}`;
}

function renderHugoMarkdown(post, slug) {
  const frontMatter = [
    "---",
    `title: ${yamlString(post.title)}`,
    `date: ${yamlString(post.date || new Date().toISOString())}`,
    ...(post.updated ? [`lastmod: ${yamlString(post.updated)}`] : []),
    ...(post.description ? [`description: ${yamlString(post.description)}`] : []),
    `slug: ${yamlString(slug)}`,
    `url: ${yamlString(`/blog/${slug}/`)}`,
    `draft: ${post.draft ? "true" : "false"}`,
    ...(post.tags.length
      ? ["tags:", ...post.tags.map((tag) => `  - ${yamlString(tag)}`)]
      : ["tags: []"]),
    ...(post.cover
      ? ["cover:", `  image: ${yamlString(post.cover)}`, `  alt: ${yamlString(post.title)}`]
      : []),
    "hashnode:",
    ...(post.id ? [`  id: ${yamlString(post.id)}`] : []),
    ...(post.originalUrl ? [`  url: ${yamlString(post.originalUrl)}`] : []),
    "---",
  ];

  return [
    ...frontMatter,
    "",
    `<!-- ${IMPORT_MARKER}. Review embeds, images, and canonical settings before publishing. -->`,
    "",
    post.markdown.trim(),
    "",
  ].join("\n");
}

function getMarkdown(post) {
  return firstString(
    post.content?.markdown,
    post.markdown,
    post.contentMarkdown,
    post.bodyMarkdown,
    post.content,
    post.body,
  );
}

function cleanHashnodeMarkdown(markdown) {
  return markdown
    .replace(/^%\[(https?:\/\/[^\]]+)\]\s*$/gm, "[$1]($1)")
    .replace(/!\[([^\]]*)\]\(<([^>\s]+)>\s+align="[^"]+"\)/g, "![$1]($2)")
    .replace(/!\[([^\]]*)\]\(([^)\s]+)\s+align="[^"]+"\)/g, "![$1]($2)");
}

function isExternalUrl(value) {
  return /^https?:\/\//i.test(value);
}

function sanitizeFilename(value) {
  return String(value || "image")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeTags(tags) {
  if (!Array.isArray(tags)) {
    return [];
  }

  return tags
    .map((tag) => (typeof tag === "string" ? tag : firstString(tag.name, tag.slug)))
    .filter(Boolean);
}

function firstString(...values) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "";
}

function uniqueSlug(slug, seen) {
  let candidate = slug || "post";
  let index = 2;

  while (seen.has(candidate)) {
    candidate = `${slug}-${index}`;
    index += 1;
  }

  seen.add(candidate);
  return candidate;
}

function slugFromUrl(url) {
  if (!url) {
    return "";
  }

  try {
    const parsed = new URL(url);
    return parsed.pathname.split("/").filter(Boolean).pop() || "";
  } catch {
    return "";
  }
}

function sanitizeSlug(value) {
  return String(value || "post")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function yamlString(value) {
  return JSON.stringify(String(value ?? ""));
}

function relativePath(value) {
  return path.relative(process.cwd(), value) || ".";
}

function parseArgs(args) {
  const parsed = {
    overwrite: false,
    dryRun: false,
  };

  for (const arg of args) {
    if (arg === "--overwrite") {
      parsed.overwrite = true;
    } else if (arg === "--dry-run") {
      parsed.dryRun = true;
    } else if (arg === "--include-drafts") {
      parsed.includeDrafts = true;
    } else if (arg.startsWith("--assets-output=")) {
      parsed.assetsOutput = arg.slice("--assets-output=".length);
    } else if (arg.startsWith("--output=")) {
      parsed.output = arg.slice("--output=".length);
    } else if (!arg.startsWith("--") && !parsed.input) {
      parsed.input = arg;
    }
  }

  return parsed;
}
