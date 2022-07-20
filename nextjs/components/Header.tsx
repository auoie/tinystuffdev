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
              "no-underline absolute flex select-none",
              "leading-[0.95rem] items-end justify-end",
              "focus:ring-4 dark:focus:ring-zinc-200 focus:ring-zinc-800 border-none focus:outline-none",
              "h-8 w-8 relative",
              "dark:text-zinc-900 dark:bg-white dark:hover:bg-black",
              "text-white bg-black hover:bg-white",
              "hover:bg-gradient-to-br hover:from-zinc-50 hover:to-zinc-950",
              "dark:hover:from-zinc-950 dark:hover:to-zinc-50"
            )}
            onClick={(event) => {
              event.currentTarget.blur();
            }}
          >
            TS
          </a>
        </Link>
      </div>
      <div className="z-50 flex items-center justify-center">
        <ThemeSwitch className="w-[93.5156px]" />
      </div>
    </div>
  );
};
export default Header;
