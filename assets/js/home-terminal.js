(() => {
    const terminal = document.getElementById("terminal-briefing");
    if (!terminal) return;

    const sessionKey = "rishab-terminal-briefing-seen";
    const disabledKey = "rishab-terminal-briefing-disabled";
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let alreadySeen = false;
    let disabled = false;

    try {
        alreadySeen = sessionStorage.getItem(sessionKey) === "true";
        disabled = localStorage.getItem(disabledKey) === "true";
    } catch (_) {
        // Storage can be unavailable in strict privacy modes; the briefing still works.
    }

    if (alreadySeen || disabled || reducedMotion) return;

    const lines = [...terminal.querySelectorAll("[data-terminal-line]")];
    const previousFocus = document.activeElement;
    const timers = [];
    let isClosing = false;
    let autoDismissTimer;

    const rememberSession = () => {
        try {
            sessionStorage.setItem(sessionKey, "true");
        } catch (_) {}
    };

    const cleanup = () => {
        timers.forEach(window.clearTimeout);
        window.clearTimeout(autoDismissTimer);
        document.documentElement.classList.remove("terminal-is-open");
        document.body.classList.remove("terminal-is-open");
        document.removeEventListener("keydown", onKeydown);
        terminal.hidden = true;
        terminal.classList.remove("is-visible", "is-leaving");
        if (previousFocus && typeof previousFocus.focus === "function") {
            previousFocus.focus({ preventScroll: true });
        }
    };

    const dismiss = () => {
        if (isClosing) return;
        isClosing = true;
        rememberSession();
        terminal.classList.add("is-leaving");
        window.setTimeout(cleanup, 190);
    };

    const disable = () => {
        try {
            localStorage.setItem(disabledKey, "true");
        } catch (_) {}
        dismiss();
    };

    function onKeydown(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            dismiss();
        } else if (event.key === "Escape") {
            event.preventDefault();
            disable();
        }
    }

    terminal.querySelectorAll("[data-terminal-dismiss]").forEach((button) => {
        button.addEventListener("click", dismiss);
    });
    terminal.querySelector(".terminal-link")?.addEventListener("click", rememberSession);
    terminal.querySelector("[data-terminal-disable]")?.addEventListener("click", disable);
    document.addEventListener("keydown", onKeydown);

    terminal.hidden = false;
    document.documentElement.classList.add("terminal-is-open");
    document.body.classList.add("terminal-is-open");
    window.requestAnimationFrame(() => {
        terminal.classList.add("is-visible");
        terminal.querySelector(".terminal-enter")?.focus({ preventScroll: true });
    });

    lines.forEach((line, index) => {
        timers.push(window.setTimeout(() => line.classList.add("is-typed"), 120 + index * 210));
    });

    autoDismissTimer = window.setTimeout(dismiss, 2600);
})();
