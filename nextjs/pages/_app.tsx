import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import favicon from "../assets/favicon.ico";
import openGraphImage from "../assets/favicon-200.png";
import Head from "next/head";
import { DefaultSeo } from "next-seo";
import Header from "../components/Header";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" disableTransitionOnChange>
      <DefaultSeo
        openGraph={{
          site_name: "tinystuff",
          images: [
            {
              url: `https://tinystuff.dev${openGraphImage}`,
              width: 200,
              height: 200,
              alt: "Gradient from light blue to purple",
              type: "image/png",
            },
          ],
        }}
      />
      <Head>
        <link rel="icon" href={favicon} type="image/x-icon" />
      </Head>
      <div className="mx-4 my-12">
        <div className="mx-auto max-w-[38rem] ">
          <Header className="mb-10" />
          <Component {...pageProps} />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default MyApp;
