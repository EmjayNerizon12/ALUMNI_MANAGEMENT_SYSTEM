(() => {
  const STORAGE_KEY = "theme";

  function getPreferredTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark") return saved;
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  }

  function applyTheme(theme) {
    const resolved = theme === "dark" ? "dark" : "light";
    document.documentElement.setAttribute("data-bs-theme", resolved);
    localStorage.setItem(STORAGE_KEY, resolved);

    const label = resolved === "dark" ? "Light mode" : "Dark mode";
    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      if (button.dataset.themeToggleInitialized === "1") return;
      button.dataset.themeToggleInitialized = "1";
      button.addEventListener("click", () => toggleTheme());
    });

    document.querySelectorAll("[data-theme-toggle-label]").forEach((el) => {
      el.textContent = label;
    });
    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      button.setAttribute("aria-label", label);
      button.setAttribute("title", label);
    });
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute("data-bs-theme") || "light";
    applyTheme(current === "dark" ? "light" : "dark");
  }

  window.setTheme = applyTheme;
  window.toggleTheme = toggleTheme;

  document.addEventListener("DOMContentLoaded", () => {
    applyTheme(getPreferredTheme());
  });
})();
