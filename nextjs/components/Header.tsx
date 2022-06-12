import Link from "next/link";
import React, { FC } from "react";
import ThemeSwitch from "./ThemeSwitch";
import clsx from "clsx";
type DivProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;
type Props = Omit<DivProps, "children">;
const Header: FC<Props> = ({ className, ...props }) => {
  return (
    <div
      className={clsx("flex items-center justify-between", className)}
      {...props}
    >
      <div className="flex items-center font-mono text-lg">
        <Link href="/">
          <a
            className={clsx(
              "no-underline",
              "focus:ring-4 focus:ring-solid-lavender border-none focus:outline-none"
            )}
            onClick={(event) => {
              event.currentTarget.blur();
            }}
          >
            <div
              className={clsx(
                "h-8 w-8 transition",
                "dark:text-black dark:bg-white dark:hover:bg-black dark:hover:text-white",
                "text-white bg-black hover:bg-white hover:text-black",
                "hover:bg-gradient-to-br hover:from-solid-mint hover:to-solid-acai"
              )}
            ></div>
          </a>
        </Link>
      </div>
      <ThemeSwitch />
    </div>
  );
};
export default Header;
