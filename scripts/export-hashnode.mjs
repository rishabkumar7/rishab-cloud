#!/usr/bin/env node

import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const API_URL = process.env.HASHNODE_API_URL || "https://gql-beta.hashnode.com";

const options = parseArgs(process.argv.slice(2));
const publicationHost = options.publication || process.env.HASHNODE_HOST || "blog.rishabkumar.com";
const outputRoot = path.resolve(options.output || "hashnode-export");
const outputFormat = options.format || "both";
const shouldDownloadImages = !options.noImages;
const errors = [];

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});

async function main() {
  const shouldExportPosts = !options.draftsOnly;
  const shouldExportDrafts = options.includeDrafts || options.draftsOnly;
  const publicationDir = path.join(outputRoot, sanitizePathSegment(publicationHost));

  let exportedCount = 0;

  if (shouldExportPosts) {
    const posts = await fetchAllPosts(publicationHost);
    exportedCount += await exportCollection(posts, path.join(publicationDir, "posts"), "posts");
    await writePostAnalytics(posts, path.join(publicationDir, "analytics"));
  }

  if (shouldExportDrafts) {
    const drafts = await fetchAllDrafts(publicationHost);
    exportedCount += await exportCollection(drafts, path.join(publicationDir, "drafts"), "drafts");
  }

  await writeErrors(publicationDir);
  console.log(`Exported ${exportedCount} entries to ${relativePath(publicationDir)}.`);
}

async function exportCollection(entries, collectionDir, label) {
  const markdownDir = path.join(collectionDir, "markdown");
  const jsonDir = path.join(collectionDir, "json");
  const imagesDir = path.join(collectionDir, "images");

  if (outputFormat !== "json") {
    await mkdir(markdownDir, { recursive: true });
  }
  if (outputFormat !== "markdown") {
    await mkdir(jsonDir, { recursive: true });
  }
  if (shouldDownloadImages) {
    await mkdir(imagesDir, { recursive: true });
  }

  for (const entry of entries) {
    const exportedEntry = shouldDownloadImages
      ? await localizePostImages(entry, imagesDir)
      : normalizePost(entry);

    if (outputFormat !== "markdown") {
      await writeFile(
        path.join(jsonDir, `${exportedEntry.slug}.json`),
        `${JSON.stringify(exportedEntry, null, 2)}\n`,
        "utf8",
      );
    }

    if (outputFormat !== "json") {
      const datePrefix = formatDate(exportedEntry.publishedAt || exportedEntry.updatedAt);
      const filename = datePrefix ? `${datePrefix}-${exportedEntry.slug}.md` : `${exportedEntry.slug}.md`;
      await writeFile(path.join(markdownDir, filename), renderExportMarkdown(exportedEntry), "utf8");
    }

    console.log(`Exported ${label}: ${exportedEntry.title}`);
  }

  return entries.length;
}

async function fetchAllPosts(host) {
  const posts = [];
  let after = null;

  do {
    const data = await requestGraphql(
      `query PublicationPosts($host: String!, $first: Int!, $after: String) {
        publication(host: $host) {
          posts(first: $first, after: $after) {
            pageInfo {
              hasNextPage
              endCursor
            }
            edges {
              node {
                id
                title
                subtitle
                brief
                slug
                url
                canonicalUrl
                publishedAt
                updatedAt
                readTimeInMinutes
                views
                reactionCount
                responseCount
                replyCount
                coverImage {
                  url
                }
                tags {
                  name
                  slug
                }
                content {
                  markdown
                }
              }
            }
          }
        }
      }`,
      { host, first: Number(options.pageSize || 25), after },
    );

    const publication = data.publication;
    if (!publication) {
      throw new Error(`Hashnode publication ${host} was not found.`);
    }

    const page = publication.posts;
    posts.push(...page.edges.map((edge) => normalizePost(edge.node)));
    after = page.pageInfo.hasNextPage ? page.pageInfo.endCursor : null;
  } while (after && (!options.limit || posts.length < Number(options.limit)));

  return options.limit ? posts.slice(0, Number(options.limit)) : posts;
}

async function writePostAnalytics(posts, analyticsDir) {
  await mkdir(analyticsDir, { recursive: true });

  const rows = posts.map((post) => ({
    id: post.id || "",
    title: post.title || "",
    slug: post.slug || "",
    url: post.url || "",
    publishedAt: post.publishedAt || "",
    updatedAt: post.updatedAt || "",
    views: post.views ?? null,
    reactionCount: post.reactionCount ?? 0,
    responseCount: post.responseCount ?? 0,
    replyCount: post.replyCount ?? 0,
    readTimeInMinutes: post.readTimeInMinutes ?? 0,
  }));

  const totals = rows.reduce(
    (acc, row) => ({
      views: acc.views + (row.views || 0),
      reactionCount: acc.reactionCount + row.reactionCount,
      responseCount: acc.responseCount + row.responseCount,
      replyCount: acc.replyCount + row.replyCount,
      readTimeInMinutes: acc.readTimeInMinutes + row.readTimeInMinutes,
    }),
    { views: 0, reactionCount: 0, responseCount: 0, replyCount: 0, readTimeInMinutes: 0 },
  );

  const analytics = {
    exportedAt: new Date().toISOString(),
    postCount: rows.length,
    totals,
    posts: rows,
  };

  await writeFile(path.join(analyticsDir, "posts.json"), `${JSON.stringify(analytics, null, 2)}\n`, "utf8");
  await writeFile(path.join(analyticsDir, "posts.csv"), renderAnalyticsCsv(rows), "utf8");
}

function renderAnalyticsCsv(rows) {
  const headers = [
    "id",
    "title",
    "slug",
    "url",
    "publishedAt",
    "updatedAt",
    "views",
    "reactionCount",
    "responseCount",
    "replyCount",
    "readTimeInMinutes",
  ];

  return [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => csvValue(row[header])).join(",")),
    "",
  ].join("\n");
}

function csvValue(value) {
  if (value === null || value === undefined) {
    return "";
  }

  const stringValue = String(value);
  return /[",\n]/.test(stringValue) ? `"${stringValue.replaceAll('"', '""')}"` : stringValue;
}

async function fetchAllDrafts(host) {
  const drafts = [];
  let after = null;

  do {
    const data = await requestGraphql(
      `query PublicationDrafts($host: String!, $first: Int!, $after: String) {
        publication(host: $host) {
          drafts(first: $first, after: $after) {
            pageInfo {
              hasNextPage
              endCursor
            }
            edges {
              node {
                id
                title
                canonicalUrl
                updatedAt
                coverImage {
                  url
                }
                tags {
                  name
                  slug
                }
                content {
                  markdown
                }
              }
            }
          }
        }
      }`,
      { host, first: Number(options.pageSize || 25), after },
    );

    const publication = data.publication;
    if (!publication) {
      throw new Error(`Hashnode publication ${host} was not found.`);
    }

    const page = publication.drafts;
    drafts.push(
      ...page.edges.map((edge) =>
        normalizePost({
          ...edge.node,
          draft: true,
          slug: generateDraftSlug(edge.node.title, edge.node.id),
        }),
      ),
    );
    after = page.pageInfo.hasNextPage ? page.pageInfo.endCursor : null;
  } while (after && (!options.limit || drafts.length < Number(options.limit)));

  return options.limit ? drafts.slice(0, Number(options.limit)) : drafts;
}

async function requestGraphql(query, variables) {
  const headers = {
    accept: "application/json",
    "content-type": "application/json",
  };
  const token = process.env.HASHNODE_TOKEN || process.env.HASHNODE_API_KEY || process.env.HASHNODE_API_TOKEN;

  if (token) {
    headers.authorization = token;
  }

  const response = await fetch(API_URL, {
    method: "POST",
    redirect: "manual",
    headers,
    body: JSON.stringify({ query, variables }),
  });
  const body = await response.text();
  let payload;

  if (response.status >= 300 && response.status < 400) {
    const location = response.headers.get("location") || "an unknown location";
    throw new Error(
      `Hashnode redirected the GraphQL request to ${location}. ` +
        `Using ${API_URL}. Confirm the GraphQL endpoint shown in your Hashnode dashboard.`,
    );
  }

  try {
    payload = JSON.parse(body);
  } catch {
    const contentType = response.headers.get("content-type") || "unknown content-type";
    const hint = hashnodeHtmlHint(body);
    const snippet = stripHtml(body).slice(0, 240);

    throw new Error(
      `Hashnode returned ${response.status} ${response.statusText || ""} from ${response.url} ` +
        `with ${contentType}, not GraphQL JSON. ${hint}` +
        `Response preview: ${snippet || "(empty response)"}`,
    );
  }

  if (!response.ok) {
    throw new Error(`Hashnode returned ${response.status}: ${JSON.stringify(payload)}`);
  }

  if (payload.errors?.length) {
    throw new Error(payload.errors.map((error) => error.message).join("; "));
  }

  return payload.data;
}

function hashnodeHtmlHint(body) {
  if (/graphql-api-paid-access|GraphQL API is moving to a paid offering/i.test(body)) {
    return (
      "This looks like Hashnode's paid GraphQL API access page. " +
      "The token may be valid, but the account/publication may not have GraphQL API access. "
    );
  }

  return (
    `Using ${API_URL}. Set HASHNODE_TOKEN/HASHNODE_API_KEY and confirm the endpoint matches ` +
    "the GraphQL API endpoint shown in your Hashnode dashboard. "
  );
}

function stripHtml(value) {
  return String(value || "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizePost(post) {
  const slug = sanitizeSlug(post.slug || slugFromUrl(post.url) || post.title || post.id);

  return {
    ...post,
    slug,
    content: {
      ...post.content,
      markdown: post.content?.markdown || "",
    },
  };
}

function generateDraftSlug(title, id) {
  const slug = sanitizeSlug(title || "");
  return slug || `draft-${String(id || "untitled").slice(0, 8)}`;
}

async function localizePostImages(post, imagesDir) {
  const normalizedPost = normalizePost(post);
  const postImagesDir = path.join(imagesDir, normalizedPost.slug);
  await mkdir(postImagesDir, { recursive: true });

  const imageMap = new Map();
  let markdown = normalizedPost.content.markdown;

  for (const imageUrl of extractMarkdownImageUrls(markdown)) {
    const localPath = await downloadImage(imageUrl, postImagesDir, normalizedPost.slug);
    if (localPath) {
      const relativePath = `../images/${normalizedPost.slug}/${path.basename(localPath)}`;
      imageMap.set(imageUrl, relativePath);
      markdown = markdown.split(imageUrl).join(relativePath);
    }
  }

  const coverUrl = normalizedPost.coverImage?.url || "";
  let localCoverImage = "";

  if (coverUrl) {
    const localCoverPath = await downloadImage(coverUrl, postImagesDir, normalizedPost.slug);
    if (localCoverPath) {
      localCoverImage = `../images/${normalizedPost.slug}/${path.basename(localCoverPath)}`;
    }
  }

  return {
    ...normalizedPost,
    content: {
      ...normalizedPost.content,
      markdown,
    },
    localCoverImage,
    localImageMap: Object.fromEntries(imageMap),
  };
}

function extractMarkdownImageUrls(markdown) {
  const imagePattern = /!\[[^\]]*\]\((<https?:\/\/[^>]+>|https?:\/\/[^\s)]+)(?:\s+[^)]*)?\)/g;
  const urls = new Set();

  for (const match of markdown.matchAll(imagePattern)) {
    const value = match[1];
    urls.add(value.startsWith("<") && value.endsWith(">") ? value.slice(1, -1) : value);
  }

  return [...urls];
}

async function downloadImage(url, destinationDir, slug) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }

    const bytes = Buffer.from(await response.arrayBuffer());
    const filename = imageFilename(url, response.headers.get("content-type"), bytes, slug);
    const destinationPath = path.join(destinationDir, filename);
    await writeFile(destinationPath, bytes);
    return destinationPath;
  } catch (error) {
    errors.push({
      url,
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
    return "";
  }
}

function imageFilename(url, contentType, bytes, slug) {
  const hash = createHash("sha256").update(bytes).digest("hex").slice(0, 10);
  const urlPath = safeDecodePathname(url);
  const originalName = sanitizeFilename(path.basename(urlPath));
  const ext = path.extname(originalName) || extensionFromContentType(contentType) || ".bin";
  const base = path.basename(originalName || "image", path.extname(originalName || ""));
  return `${base || slug}-${hash}${ext}`;
}

function renderExportMarkdown(post) {
  const frontMatter = [
    "---",
    `title: ${yamlString(post.title || "Untitled")}`,
    `slug: ${yamlString(post.slug)}`,
    ...(post.publishedAt ? [`date: ${yamlString(post.publishedAt)}`] : []),
    ...(post.updatedAt ? [`updated: ${yamlString(post.updatedAt)}`] : []),
    ...(post.brief ? [`brief: ${yamlString(post.brief)}`] : []),
    ...(post.draft ? ['status: "draft"', "draft: true"] : []),
    ...(post.tags?.length
      ? [`tags: ${JSON.stringify(post.tags.map((tag) => tag.name).filter(Boolean))}`]
      : []),
    ...(post.coverImage?.url ? [`coverImage: ${yamlString(post.coverImage.url)}`] : []),
    ...(post.localCoverImage ? [`localCoverImage: ${yamlString(post.localCoverImage)}`] : []),
    ...(post.url ? [`url: ${yamlString(post.url)}`] : []),
    ...(post.canonicalUrl ? [`canonicalUrl: ${yamlString(post.canonicalUrl)}`] : []),
    "---",
  ];

  return [...frontMatter, "", post.content?.markdown?.trim() || "", ""].join("\n");
}

async function writeErrors(publicationDir) {
  if (errors.length === 0) {
    return;
  }

  await writeFile(path.join(publicationDir, "export_errors.json"), `${JSON.stringify(errors, null, 2)}\n`);
  await writeFile(
    path.join(publicationDir, "export_errors.log"),
    `${errors.map((error) => `${error.timestamp} ${error.url} ${error.error}`).join("\n")}\n`,
  );
}

function formatDate(dateString) {
  if (!dateString) {
    return "";
  }

  const date = new Date(dateString);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
}

function safeDecodePathname(url) {
  try {
    return decodeURIComponent(new URL(url).pathname);
  } catch {
    return "";
  }
}

function slugFromUrl(url) {
  try {
    return new URL(url).pathname.split("/").filter(Boolean).pop() || "";
  } catch {
    return "";
  }
}

function extensionFromContentType(contentType) {
  if (!contentType) {
    return "";
  }

  const type = contentType.split(";")[0].trim().toLowerCase();
  return {
    "image/gif": ".gif",
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/svg+xml": ".svg",
    "image/webp": ".webp",
  }[type] || "";
}

function sanitizeSlug(value) {
  return sanitizePathSegment(value).toLowerCase();
}

function sanitizePathSegment(value) {
  return String(value || "post")
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function sanitizeFilename(value) {
  return sanitizePathSegment(value || "image");
}

function yamlString(value) {
  return JSON.stringify(String(value ?? ""));
}

function relativePath(value) {
  return path.relative(process.cwd(), value) || ".";
}

function parseArgs(args) {
  const parsed = {};

  for (const arg of args) {
    if (arg === "--no-images") {
      parsed.noImages = true;
    } else if (arg === "--include-drafts") {
      parsed.includeDrafts = true;
    } else if (arg === "--drafts-only") {
      parsed.draftsOnly = true;
    } else if (arg.startsWith("--publication=")) {
      parsed.publication = arg.slice("--publication=".length);
    } else if (arg.startsWith("--output=")) {
      parsed.output = arg.slice("--output=".length);
    } else if (arg.startsWith("--format=")) {
      parsed.format = arg.slice("--format=".length);
    } else if (arg.startsWith("--limit=")) {
      parsed.limit = arg.slice("--limit=".length);
    } else if (arg.startsWith("--page-size=")) {
      parsed.pageSize = arg.slice("--page-size=".length);
    }
  }

  if (!["json", "markdown", "both", undefined].includes(parsed.format)) {
    throw new Error("--format must be one of json, markdown, or both.");
  }

  return parsed;
}
