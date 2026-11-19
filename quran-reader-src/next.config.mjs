// The reader is served under /quran-reader on https://mj-ahmad.github.io (see the root workflow).
const BASE_PATH = "/quran-reader";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",          // fully static HTML/JS: GitHub Pages can host it
  basePath: BASE_PATH,
  trailingSlash: true,       // /surah/2/ -> surah/2/index.html, works on any static host
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: BASE_PATH },
};
export default nextConfig;
