# Notes

- https://github.com/vercel/next.js/tree/canary/examples/with-mdx-remote. Adding markdown parsing.
- https://github.com/leerob/nextjs-prism-markdown. https://stackoverflow.com/questions/62685856/use-prismjs-in-next-js-with-remark-to-hightlight-code-from-markdown. Adding syntax highlighting.
- https://mxd.codes/articles/syntax-highlighting-with-prism-and-next-js. Using Prism JS.
- Some example blogs are https://blog.jim-nielsen.com/ and https://leerob.io/

```bash
npx create-next-app@latest --ts nextjs
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install next-mdx-remote
npm install next-remote-watch
npm install gray-matter
npm install -D @tailwindcss/typography
npm install remark-prism
npm install @types/remark-prism
npm install zod
```

## Syntax Highlighting

```bash
cd styles
curl -OL https://raw.githubusercontent.com/PrismJS/prism-themes/master/themes/prism-vsc-dark-plus.css
curl -OL https://raw.githubusercontent.com/PrismJS/prism-themes/master/themes/prism-vs.css
```

## Color Theme

I transpile the code `./utils/dangerouslySetInner.ts` to javascript and then paste
it into `./pages/_document.tsx` in order to set the CSS style sheet to be used for syntax highlighting in
code blocks.

```bash
npx tsc utils/dangerouslySetInner.ts
```

## Prism Theme

I want to use a professional color scheme for the code blocks.
That's why I chose to use VSC Dark+ And VS.
But those two themes have inconsistent size values.
In order to make it more consistent, I had to add `!important`
CSS rules in `./styles/globals.css`.

## Extending Color Palette

To make a darker color, use [this GitHub repository](https://github.com/ameistad/tailwind-colors).
Note that the step size for the colors was too large for me.
To adjust it, I had to clone the repository and do `adjustShade(lastShade.hexCode, -10)`
rather than `adjustShade(lastShade.hexCode, -20)`.
Then I could run the UI with `npm install && npm run serve`.

## Todo

- [ ] Fix the font size in the VSC Dark+ Prism JS theme from [the repo](https://github.com/PrismJS/prism-themes/tree/master/themes).
      Also, add a VSC Light+ Prism JS theme.
- [ ] Add continuous deployment with `rsync`.
