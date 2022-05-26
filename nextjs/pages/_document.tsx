import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from "next/document";

class MyDocument extends Document {
  static override async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return initialProps;
  }

  override render() {
    return (
      <Html lang="en">
        <Head>
          <script
            dangerouslySetInnerHTML={{
              __html: `
              try {
                var themeToStyle_1 = {
                    dark: "/prism-vsc-dark-plus.css",
                    light: "/prism-vs.css"
                };
                var link_1 = document.createElement("link");
                link_1.rel = "stylesheet";
                var mediaQuery_1 = window.matchMedia("(prefers-color-scheme: dark)");
                (_a = document.head).append.apply(_a, Object.values(themeToStyle_1).map(function (hrefLink) {
                    var cacheLink = document.createElement("link");
                    cacheLink.rel = "preload";
                    cacheLink.as = "style";
                    cacheLink.href = hrefLink;
                    return cacheLink;
                }));
                var update = function () {
                    var prefersDark = mediaQuery_1.matches;
                    var color = null;
                    if (prefersDark) {
                        color = "dark";
                    }
                    else {
                        color = "light";
                    }
                    link_1.href = themeToStyle_1[color];
                };
                update();
                mediaQuery_1.addEventListener("change", update);
                document.head.appendChild(link_1);
            }
            catch (_) { }
              `,
            }}
          />
        </Head>
        <body className="bg-zinc-100 dark:bg-zinc-950">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
