import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import favicon from "../assets/favicon.ico";
import openGraphImage from '../assets/favicon-200.png'
import Head from "next/head";
import { DefaultSeo } from "next-seo";

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
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
