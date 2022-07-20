import { readFileSync } from "fs";
import matter from "gray-matter";
import type { GetStaticProps, NextPage } from "next";
import {
  NOTES_PATH,
  NOTE_FILE_PATHS,
  parseMetadata,
  renderDate,
} from "../utils/mdxUtils";
import { join } from "path";
import Link from "next/link";
import { ResolveStaticPropsReturnType } from "../utils/typeUtils";
import { NextSeo } from "next-seo";

const getHomeProps = async () => {
  const posts = NOTE_FILE_PATHS.map((filePath) => {
    const source = readFileSync(join(NOTES_PATH, filePath));
    const { data } = matter(source);
    const metadata = parseMetadata.parse(data);
    const date = new Date(metadata.created);
    const renderedDate = renderDate(date);
    return { data: { ...metadata, created: renderedDate }, filePath, date };
  })
    .sort((a, b) => {
      return b.date.valueOf() - a.date.valueOf();
    })
    .map(({ data, filePath }) => ({ data, filePath }));
  return {
    props: {
      posts,
    },
  };
};

type HomeProps = ResolveStaticPropsReturnType<typeof getHomeProps>;
export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  return await getHomeProps();
};

const Home: NextPage<HomeProps> = ({ posts }) => {
  return (
    <>
      <NextSeo
        title="Tiny Stuff"
        description="These are some of my projects and notes. It's pretty empty right now."
        canonical="https://tinystuff.dev/"
        openGraph={{
          url: "https://tinystuff.dev/",
          title: "tinystuff",
          type: "website",
          description:
            "These are some of my projects and notes. It's pretty empty right now.",
        }}
      />
      <div className="max-w-full prose-sm prose prose-blue dark:prose-invert">
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
    </>
  );
};

export default Home;
