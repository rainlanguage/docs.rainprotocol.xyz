// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Rainlang | Raindex",
  tagline: "Rainlang is defi's native language. If you know your way around a spreadsheet, you can learn Rain.",
  url: "https://docs.rainlang.xyz",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "throw",
  favicon: "img/favicon.png",
  organizationName: "rainlanguage", // Usually your GitHub org/user name.

  presets: [
    [
      "classic",
      {
        docs: {
          path: "./docs",
          routeBasePath: "/",
          // includeCurrentVersion: false, // seems to be breaking it
          exclude: ["**/*/test/**/*.md"],
          sidebarPath: require.resolve("./sidebars.js"),
          async sidebarItemsGenerator({
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            isCategoryIndex: defaultCategoryIndexMatcher, // The default matcher implementation, given below
            defaultSidebarItemsGenerator,
            ...args
          }) {
            return defaultSidebarItemsGenerator({
              isCategoryIndex() {
                // No doc will be automatically picked as category index
                return false;
              },
              ...args,
            });
          },
          includeCurrentVersion: true,
        },
        blog: {
          blogSidebarTitle: "All posts",
          blogSidebarCount: "ALL",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      announcementBar: {
        id: "support_us", // Any value that will identify this message.
        content:
          "<a href='https://docs.rainlang.xyz/blog/were-hiring'>We're hiring! Want to help us make Rain better?</a>",
        backgroundColor: "#0F2F83", // Defaults to `#fff`.
        textColor: "#FFF", // Defaults to `#000`.
      },
      metadata: [
        { name: 'description', content: "Rainlang is defi's native language. Write trading strategies in Rainlang with Raindex." },

        // Open Graph
        { property: 'og:title', content: 'Rainlang | Raindex' },
        { property: 'og:description', content: "Rainlang is defi's native language. Write trading strategies in Rainlang with Raindex." },
        { property: 'og:image', content: 'https://raw.githubusercontent.com/rainlanguage/rain.brand/main/Rainlang-og.png' },
        { property: 'og:url', content: 'https://rainlang.xyz/' },
        { property: 'og:type', content: 'website' },

        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Rainlang | Raindex' },
        { name: 'twitter:description', content: "Rainlang is defi's native language. Write trading strategies in Rainlang with Raindex." },
        { name: 'twitter:image', content: 'https://raw.githubusercontent.com/rainlanguage/rain.brand/main/Rainlang-og.png' },
      ],

      image: 'https://raw.githubusercontent.com/rainlanguage/rain.brand/main/Rainlang-og.png', // Default Open Graph image

      navbar: {
        logo: {
          alt: "Rain logo",
          src: "img/logo.svg",
          srcDark: "img/logo-dark.svg",
        },
        items: [
          {
            type: "doc",
            docId: "intro",
            position: "left",
            label: "Docs",
          },
          { to: "/blog", label: "Blog", position: "left" },
          {
            href: "https://github.com/rainlanguage",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),

  plugins: [require.resolve("@cmfcmf/docusaurus-search-local")],
};

module.exports = config;
