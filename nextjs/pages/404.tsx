import type { NextPage } from "next";

const ErrorPage: NextPage = () => {
  return (
    <div className="max-w-full prose-sm prose prose-blue dark:prose-invert">
      <h1>Error 404 (Not Found)</h1>
      <p>You have requested a page that was not found on this server.</p>
    </div>
  );
};

export default ErrorPage;
