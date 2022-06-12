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
          <link rel="icon" href="favicon.ico" type="image/x-icon" />
          {
            // eslint-disable-next-line @next/next/no-css-tags
          }<link rel="stylesheet" href="/prism-vs.css" />
          <script
            dangerouslySetInnerHTML={{
              __html: `
var _a;
try {
    var themeToStyle_1 = {
        dark: "/prism-vsc-dark-plus.css",
        light: "/prism-vs.css"
    };
    var link_1 = document.createElement("link");
    link_1.rel = "stylesheet";
    (_a = document.head).append.apply(_a, Object.values(themeToStyle_1).map(function (hrefLink) {
        var cacheLink = document.createElement("link");
        cacheLink.rel = "preload";
        cacheLink.as = "style";
        cacheLink.href = hrefLink;
        return cacheLink;
    }));
    var systemThemeUpdate_1 = function () {
        var prefersDark = document.documentElement.className === "dark";
        var color = null;
        if (prefersDark) {
            color = "dark";
        }
        else {
            color = "light";
        }
        link_1.href = themeToStyle_1[color];
    };
    document.head.appendChild(link_1);
    var mutationObserver = new MutationObserver(function () {
        systemThemeUpdate_1();
    });
    mutationObserver.observe(document.documentElement, { attributes: true });
}
catch (_) { }
              `,
            }}
          />
        </Head>
        <body className="bg-white dark:bg-zinc-900">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
