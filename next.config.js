/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@cloudscape-design/components",
    "@cloudscape-design/global-styles",
    "@cloudscape-design/component-toolkit",
  ],
  webpack: (config) => {
    // CSS 모듈 설정
    const rules = config.module.rules
      .find((rule) => typeof rule.oneOf === "object")
      ?.oneOf.filter((rule) => Array.isArray(rule.use));

    if (rules) {
      rules.forEach((rule) => {
        const cssLoader = rule.use.find(({ loader }) =>
          loader?.includes("css-loader")
        );
        if (cssLoader) {
          cssLoader.options = {
            ...cssLoader.options,
            importLoaders: 1,
          };
        }
      });
    }

    config.module.rules.push({
      test: /\.css$/,
      use: ["style-loader", "css-loader"],
    });

    return config;
  },
  async rewrites() {
    return [
      {
        source: "/:path*",
        destination: "/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
