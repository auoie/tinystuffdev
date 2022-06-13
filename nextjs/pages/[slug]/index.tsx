import { readFileSync } from "fs";
import matter from "gray-matter";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import { join } from "path";
import {
  NOTES_PATH,
  NOTE_FILE_PATHS,
  parseMetadata,
  renderDate,
} from "../../utils/mdxUtils";
import {
  GetRehypePluginOptions,
  ResolveStaticPropsReturnType,
} from "../../utils/typeUtils";
import remarkPrism from "remark-prism";
import remarkGfm from "remark-gfm";
import Header from "../../components/Header";
import rehypeExternalLinks from "rehype-external-links";
import { NextSeo } from "next-seo";

const externalLinksOptions: GetRehypePluginOptions<typeof rehypeExternalLinks> =
  { rel: false };
const getPostPageProps = async (slug: string) => {
  const postFilePath = join(NOTES_PATH, `${slug}.md`);
  const source = readFileSync(postFilePath);
  const { content, data } = matter(source);
  const mdxSource = await serialize(content, {
    mdxOptions: {
      remarkPlugins: [remarkGfm, remarkPrism],
      rehypePlugins: [[rehypeExternalLinks, externalLinksOptions]],
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
type PostPageProps = ResolveStaticPropsReturnType<typeof getPostPageProps>;
export const getStaticProps: GetStaticProps<PostPageProps> = async ({
  params,
}) => {
  if (params === undefined) {
    throw new Error("params is undefined is");
  }
  const slug = params["slug"];
  if (slug === undefined) {
    throw new Error("slug is undefined");
  }
  return await getPostPageProps(`${slug}`);
};
const PostPage: NextPage<PostPageProps> = ({
  frontMatter,
  source,
  slug,
  description,
}) => {
  const { title, created } = frontMatter;
  return (
    <div className="mx-4 my-12">
      <NextSeo
        title={title}
        description={description}
        canonical={`https://tinystuff.dev/${slug}/`}
        openGraph={{
          url: `https://tinystuff.dev/${slug}/`,
          title: title,
          site_name: "tinystuff",
          description: description,
          type: "article",
          images: [
            {
              url: "https://tinystuff.dev/favicon-200.png",
              width: 200,
              height: 200,
              alt: "Gradient from light blue to purple",
              type: "image/png",
            },
          ],
        }}
      />
      <div className="mx-auto max-w-[38rem] ">
        <Header />
        <div className="max-w-full prose-sm prose break-words prose-blue dark:prose-invert">
          <div className="my-10">
            <h1 className="my-2">{title}</h1>
            <div className="opacity-80">{created}</div>
          </div>
          <MDXRemote {...source}></MDXRemote>
        </div>
      </div>
    </div>
  );
};
export const getStaticPaths: GetStaticPaths = async () => {
  const paths = NOTE_FILE_PATHS.map((path) => path.replace(/\.mdx?$/, "")).map(
    (slug) => ({ params: { slug } })
  );
  return {
    paths,
    fallback: false,
  };
};
export default PostPage;
