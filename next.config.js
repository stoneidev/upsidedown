/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@cloudscape-design/components",
    "@cloudscape-design/global-styles",
    "@cloudscape-design/component-toolkit",
  ],
  webpack: (config) => {
    // CSS 모듈 설정
    config.module.rules.push({
      test: /\.css$/,
      include: /node_modules\/@cloudscape-design\//,
      use: ["style-loader", "css-loader"],
    });

    return config;
  },
};

module.exports = nextConfig;
