/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
};

const withImages = require("next-images");
module.exports = withImages({
  nextConfig,
  images: {
    disableStaticImages: true,
  }
});
