import { readFileSync } from "fs";
import matter from "gray-matter";
import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { join } from "path";
import { cwd } from "process";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";

const getHomeProps = async () => {
  const postFilePath = join(cwd(), "..", "content", "index.md");
  const source = readFileSync(postFilePath);
  const { content, data } = matter(source);
  const mdxSource = await serialize(content, {
    mdxOptions: {
      remarkPlugins: [],
      rehypePlugins: [],
    },
    scope: data,
  });
  return {
    props: {
      source: mdxSource,
    },
  };
};
type ResolveHomeProps<T extends () => Promise<{ props: any }>> =
  T extends () => Promise<{ props: infer U }> ? U : never;
type HomeProps = ResolveHomeProps<typeof getHomeProps>;
export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  return await getHomeProps();
};

const Home: NextPage<HomeProps> = ({ source }) => {
  return (
    <div>
      <Head>
        <title>tinystuff</title>
      </Head>
      <h1 className="text-3xl font-bold underline">Hello world</h1>
      <main>
        <MDXRemote {...source}></MDXRemote>
      </main>
    </div>
  );
};

export default Home;
