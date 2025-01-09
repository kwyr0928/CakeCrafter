/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
    reactStrictMode: false,
    eslint: { // eslintのlint checkをbuild時にoff
        ignoreDuringBuilds: true,
      },
      typescript: { // type checkをbuild時にoff
        ignoreBuildErrors: true,
      },
};

export default config;