try {
  const themeToStyle = {
    dark: "/prism-vsc-dark-plus.css",
    light: "/prism-vs.css",
  } as const;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  let mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  document.head.append(
    ...Object.values(themeToStyle).map((hrefLink) => {
      const cacheLink = document.createElement("link");
      cacheLink.rel = "preload";
      cacheLink.as = "style";
      cacheLink.href = hrefLink;
      return cacheLink;
    })
  );
  const update = () => {
    const prefersDark = mediaQuery.matches;
    let color: null | keyof typeof themeToStyle = null;
    if (prefersDark) {
      color = "dark";
    } else {
      color = "light";
    }
    link.href = themeToStyle[color];
  };
  update();
  mediaQuery.addEventListener("change", update);
  document.head.appendChild(link);
} catch (_) {}
export {};
