# Notes

- https://github.com/vercel/next.js/tree/canary/examples/with-mdx-remote. Adding markdown parsing.
- https://github.com/leerob/nextjs-prism-markdown. https://stackoverflow.com/questions/62685856/use-prismjs-in-next-js-with-remark-to-hightlight-code-from-markdown. Adding syntax highlighting.
- https://mxd.codes/articles/syntax-highlighting-with-prism-and-next-js. Using Prism JS.
- Some example blogs are https://blog.jim-nielsen.com/, https://leerob.io/, and https://www.seanmcp.com/. For an example of a personal website with good accessibility, see https://seirdy.one/.

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
npm install next-themes
npm install clsx
npm install remark-gfm
npm install rehype-external-links
npm install next-seo
npm install next-images
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

## Favicon

I'm just using apples icons for the favicon.

- To convert an image to a favicon, see [here](https://superuser.com/questions/227736/how-do-i-convert-a-png-into-a-ico).
- To get multiple resolutions in one, see [here](https://askubuntu.com/questions/867567/convert-jpg-or-png-to-ico-using-terminal-and-back)
- According to [this link](https://stackoverflow.com/questions/9943771/adding-a-favicon-to-a-static-html-page),
  you shouldn't use `shortcut icon` anymore.

```bash
convert full-moon-face_1f31d.png -scale 32 moon.ico
convert sun-with-face_1f31e.png -scale 32 sun.ico
convert face-with-monocle_1f9d0.png -define icon:auto-resize=256,64,48,32,16 favicon.ico # I used this one
```

## Custom Favicon

To make my own gradient favicon, I created a temporary Next.js project in `create-favicon/` and then
used the package [html2canvas](https://github.com/niklasvh/html2canvas).

## Max Width

The max with is set to `46rem` which is `2rem` less than `md:` size of `48rem`.
This is so that the corners for the code blocks are removed when the window is smaller than `48rem`.

## Adding a font

See [this link](https://dev.to/thomasvanholder/add-a-custom-tailwind-css-fonts-to-your-website-1nn6) for adding a font.
Basically, you need to add the import statements before the `@tailwind` CSS imports.
Then you extend the `fontFamily` property in `tailwind.config.js`.

## Add Event Listener to Class Change

- https://www.seanmcp.com/articles/event-listener-for-class-change/

## SEO

For search engine optimization, use [this package](https://github.com/garmeeh/next-seo).

## Make Next.js Respect `[slug]/index.tsx` folder structure

To do this, see [here](https://stackoverflow.com/questions/57157228/next-js-export-index-html).
Basically, I had to add `trailingSlash: true` to my `next.config.js` file.
This makes it compatible with the Caddy server.
If I choose to use the `try_files {path}.html {path}` directive, then I will
need to either figure out how to remove the trailing slash when there exists an .html file matching the path
with my Caddy server or I will need to update my Open Graph configuration to not use a trailing slash for my URLs.

## Adding Hashes to Favicon

In order to add hashes to favicons, I had to use the `next-images` npm package.
It did not work out of the box.
[This issue](https://github.com/twopluszero/next-images/issues/83) had the solution to
use the parameter `disableStaticImages: true` and to use `src={StaticImage}` rather than `src={StaticImage.src}`.
Then in cloudflare, I can just set the Browser Cache TTL value to 1 year.

## Todo

- [ ] Fix the font size in the VSC Dark+ Prism JS theme from [the repo](https://github.com/PrismJS/prism-themes/tree/master/themes).
      Also, add a VSC Light+ Prism JS theme. According to my Lighthouse score, my light mode code color scheme doesn't have enough contrast.
      I should address this.
- [ ] Figure out how to hash the CSS file names so that it's easier for me to edit them or switch them out.
- [ ] Make converting the markdown to html faster.
      One possible approach would be to make some kind of markdown-to-html microservice in a faster language such as golang.
