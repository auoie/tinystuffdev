try {
  const themeToStyle = {
    dark: "/prism-vsc-dark-plus.css",
    light: "/prism-vs.css",
  } as const;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  document.head.append(
    ...Object.values(themeToStyle).map((hrefLink) => {
      const cacheLink = document.createElement("link");
      cacheLink.rel = "preload";
      cacheLink.as = "style";
      cacheLink.href = hrefLink;
      return cacheLink;
    })
  );
  const systemThemeUpdate = () => {
    const prefersDark = document.documentElement.className === "dark";
    let color: null | keyof typeof themeToStyle = null;
    if (prefersDark) {
      color = "dark";
    } else {
      color = "light";
    }
    link.href = themeToStyle[color];
  };
  document.head.appendChild(link);
  const mutationObserver = new MutationObserver(() => {
    systemThemeUpdate()
  });
  mutationObserver.observe(document.documentElement, { attributes: true });
} catch (_) {}
export {};
