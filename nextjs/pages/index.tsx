import { readFileSync } from "fs";
import matter from "gray-matter";
import type { GetStaticProps, NextPage } from "next";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";
import {
  INDEX_MD_PATH,
  NOTES_PATH,
  NOTE_FILE_PATHS,
  parseMetadata,
  renderDate,
} from "../utils/mdxUtils";
import { join } from "path";
import Link from "next/link";
import {
  GetRehypePluginOptions,
  ResolveStaticPropsReturnType,
} from "../utils/typeUtils";
import Header from "../components/Header";
import rehypeExternalLinks from "rehype-external-links";
import { NextSeo } from "next-seo";

const externalLinksOptions: GetRehypePluginOptions<typeof rehypeExternalLinks> =
  { rel: false };
const getHomeProps = async () => {
  const source = readFileSync(INDEX_MD_PATH);
  const { content, data } = matter(source);
  const mdxSource = await serialize(content, {
    mdxOptions: {
      remarkPlugins: [],
      rehypePlugins: [[rehypeExternalLinks, externalLinksOptions]],
    },
    scope: data,
  });

  const posts = NOTE_FILE_PATHS.map((filePath) => {
    const source = readFileSync(join(NOTES_PATH, filePath));
    const { data } = matter(source);
    const metadata = parseMetadata.parse(data);
    const renderedDate = renderDate(new Date(metadata.created));
    return { data: { ...metadata, created: renderedDate }, filePath };
  });
  return {
    props: {
      source: mdxSource,
      posts,
    },
  };
};

type HomeProps = ResolveStaticPropsReturnType<typeof getHomeProps>;
export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  return await getHomeProps();
};

const Home: NextPage<HomeProps> = ({ source, posts }) => {
  return (
    <div className="mx-4 my-12">
      <NextSeo
        title="tinystuff"
        description="These are some of my projects and notes. It's pretty empty right now."
        canonical="https://tinystuff.dev/"
        openGraph={{
          url: "https://tinystuff.dev/",
          title: "tinystuff",
          site_name: "tinystuff",
          type: "website",
          description:
            "These are some of my projects and notes. It's pretty empty right now.",
          images: [
            {
              url: "https://tinystuff.dev/favicon-448.png",
              width: 448,
              height: 448,
              alt: "Gradient from light blue to purple",
              type: "image/png",
            },
          ],
        }}
      />
      <div className="mx-auto max-w-[38rem]">
        <Header className="mb-10" />
        <div className="max-w-full prose-sm prose prose-blue dark:prose-invert">
          <MDXRemote {...source}></MDXRemote>
          <h2>Notes</h2>
          {posts.map((post) => (
            <div
              className="mt-2 sm:flex sm:flex-row-reverse sm:items-baseline sm:justify-between"
              key={post.filePath}
            >
              <div className="text-sm whitespace-nowrap opacity-80">
                {post.data.created}
              </div>
              <Link
                as={`/${post.filePath.replace(/\.mdx?$/, "")}`}
                href={"/[slug]/"}
                prefetch={false}
              >
                <a>{post.data.title}</a>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
