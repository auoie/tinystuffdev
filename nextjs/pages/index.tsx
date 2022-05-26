import { readFileSync } from "fs";
import matter from "gray-matter";
import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
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
import { ResolveStaticPropsReturnType } from "../utils/typeUtils";

const getHomeProps = async () => {
  const source = readFileSync(INDEX_MD_PATH);
  const { content, data } = matter(source);
  const mdxSource = await serialize(content, {
    mdxOptions: {
      remarkPlugins: [],
      rehypePlugins: [],
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
      <Head>
        <title>tinystuff</title>
      </Head>
      <div className="mx-auto max-w-[46rem] prose prose-blue dark:prose-invert">
        <div className="font-mono text-xl">
          <Link href="/">
            <a className="no-underline">$HOME</a>
          </Link>
          {" / "}
        </div>
        <MDXRemote {...source}></MDXRemote>
        <h2>Notes</h2>
        {posts.map((post) => (
          <div
            key={post.filePath}
            className="md:flex md:flex-row-reverse md:items-baseline md:justify-between"
          >
            <div className="text-sm whitespace-nowrap opacity-80">
              {post.data.created}
            </div>
            <Link
              as={`/${post.filePath.replace(/\.mdx?$/, "")}`}
              href={"/[slug]"}
              prefetch={false}
            >
              <a>{post.data.title}</a>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
