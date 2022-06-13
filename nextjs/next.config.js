/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
};

const withImages = require("next-images");
module.exports = withImages({
  reactStrictMode: true,
  trailingSlash: true,
  images: {
    disableStaticImages: true,
  }
});
