import Link from "next/link";
import { useRouter } from "next/router";
import React, { FC } from "react";
import ThemeSwitch from "./ThemeSwitch";
import clsx from "clsx";
type DivProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;
type Props = Omit<DivProps, "children">;
const Header: FC<Props> = ({ className, ...props }) => {
  const router = useRouter();
  const parts = router.asPath.split("/").filter((val) => val != "");
  const links = [];
  let curPath = "";
  for (let i = 0; i < parts.length; i++) {
    curPath += "/" + parts[i];
    links.push({
      path: curPath,
      name: parts[i] as string,
    });
  }
  return (
    <div
      className={clsx("flex items-center justify-between", className)}
      {...props}
    >
      <div className="flex items-center font-mono text-lg">
        <Link href="/">
          <a
            className={clsx(
              "no-underline p-0.5",
              "focus:ring-2 focus:ring-solid-melon"
            )}
          >
            <div
              className={clsx(
                "h-7 w-7 transition",
                "dark:text-black dark:bg-white dark:hover:bg-black dark:hover:text-white",
                "text-white bg-black hover:bg-white hover:text-black",
                "hover:bg-gradient-to-br hover:from-solid-lemon hover:to-solid-mint"
              )}
            ></div>
          </a>
        </Link>
        {/* {links.map((link) => {
          return (
            <React.Fragment key={link.path}>
              {"/"}
              <Link href={link.path}>
                <a
                  className={clsx(
                    "px-2 py-1 no-underline transition",
                    "dark:text-black dark:bg-white dark:hover:bg-black dark:hover:text-white",
                    "text-white bg-black hover:bg-white hover:text-black"
                  )}
                >
                  {link.name}
                </a>
              </Link>
            </React.Fragment>
          );
        })} */}
      </div>
      <ThemeSwitch />
    </div>
  );
};
export default Header;
