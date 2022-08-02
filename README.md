# Notes

The posts are in `./content/posts/`.
Each post should have the following front matter.

```yaml
title: Title Goes Here
created: { creation date }
```

You can get the creation time in UTC format with `date -u` in linux.

## Basic Proofreading

To check for basic spelling errors, you can use `npx -y markdown-spellcheck -r "**/*.md"`.

## TODO

- `remarkPrism` escapes quotes and single quotes when a language is not specified or when the specified language is text.
  Figure out how to make it not do that.
  A workaround is to set the language to `markup.`
