import { readFileSync } from "fs";
import matter from "gray-matter";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { serialize } from "next-mdx-remote/serialize";
import { join } from "path";
import {
  NOTES_PATH,
  NOTE_FILE_PATHS,
  parseMetadata,
  renderDate,
} from "../../utils/mdxUtils";
import { ResolveStaticPropsReturnType } from "../../utils/typeUtils";
import { NextSeo } from "next-seo";
import rehypePrettyCode from "rehype-pretty-code";
import type { Options } from "rehype-pretty-code";
import { MDXTheme } from "../../components/MdxTheme";

const getPostPageProps = async (slug: string) => {
  const postFilePath = join(NOTES_PATH, `${slug}.md`);
  const source = readFileSync(postFilePath);
  const { content, data } = matter(source);
  const rehypePrettyCodeOptions: Partial<Options> = {
    theme: {
      theme: "css-variables",
    },
  };
  const mdxSource = await serialize(content, {
    mdxOptions: {
      remarkPlugins: [],
      rehypePlugins: [[rehypePrettyCode, rehypePrettyCodeOptions]],
    },
    scope: data,
  });
  const metadata = parseMetadata.parse(data);
  const renderedDate = renderDate(new Date(metadata.created));
  return {
    props: {
      source: mdxSource,
      description: metadata.description,
      frontMatter: { ...metadata, created: renderedDate },
      slug,
    },
  };
};
type Props = ResolveStaticPropsReturnType<typeof getPostPageProps>;
type Params = { slug: string };
export const getStaticProps: GetStaticProps<Props, Params> = async ({
  params,
}) => {
  if (params === undefined) {
    throw new Error("params is undefined");
  }
  return await getPostPageProps(params.slug);
};
const PostPage: NextPage<Props> = ({
  frontMatter,
  source,
  slug,
  description,
}) => {
  const { title, created } = frontMatter;
  return (
    <>
      <NextSeo
        title={title}
        description={description}
        canonical={`https://tinystuff.dev/${slug}/`}
        openGraph={{
          url: `https://tinystuff.dev/${slug}/`,
          title: title,
          description: description,
          type: "article",
        }}
      />
      <div className="max-w-full prose-sm prose prose-blue dark:prose-invert">
        <h1 className="mb-2">{title}</h1>
        <div className="opacity-80 mb-10">{created}</div>
        <MDXTheme {...source} />
      </div>
    </>
  );
};
export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const paths = NOTE_FILE_PATHS.map((path) => path.replace(/\.mdx?$/, "")).map(
    (slug) => ({ params: { slug } })
  );
  return {
    paths,
    fallback: false,
  };
};
export default PostPage;
