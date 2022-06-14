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
      <div className="flex items-center text-xl font-medium font-header">
        <Link href="/">
          <a
            aria-label="Home"
            className={clsx(
              "no-underline absolute flex",
              "leading-[0.95rem] items-end justify-end",
              "focus:ring-4 focus:ring-solid-lavender border-none focus:outline-none",
              "h-8 w-8 relative",
              "dark:text-zinc-900 dark:bg-white dark:hover:bg-black",
              "text-white bg-black hover:bg-white",
              "hover:bg-gradient-to-br hover:from-solid-mint hover:to-solid-acai"
            )}
            onClick={(event) => {
              event.currentTarget.blur();
            }}
          >
            TS
          </a>
        </Link>
      </div>
      <ThemeSwitch />
    </div>
  );
};
export default Header;
