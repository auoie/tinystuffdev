import type { NextPage } from "next";
import Header from "../components/Header";

const ErrorPage: NextPage = () => {
  return (
    <div className="mx-4 my-12">
      <div className="mx-auto max-w-[38rem]">
        <Header className="mb-10" />
        <div className="max-w-full prose-sm prose prose-blue dark:prose-invert">
          <h1>Error 404 (Not Found)</h1>
          <p>You have requested a page that was not found on this server.</p>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
