import { readdirSync } from "fs";
import { join } from "path";
import { cwd } from "process";
import { z } from "zod";

export const NOTES_PATH = join(cwd(), "..", "content", "notes");
export const INDEX_MD_PATH = join(cwd(), "..", "content", "index.md");
export const NOTE_FILE_PATHS = readdirSync(NOTES_PATH).filter((path) =>
  /\.mdx?$/.test(path)
);
export const parseMetadata = z.object({
  title: z.string(),
  created: z.string(),
});
export const renderDate = (date: Date) => {
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
  const day = date.getUTCDate().toString().padStart(2, "0");
  const year = date.getUTCFullYear();
  return `${year.toPrecision(4)}-${month}-${day}`;
};
