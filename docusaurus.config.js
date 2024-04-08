// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Rain Language",
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
          // {
          //   type: "docsVersionDropdown",
          //   position: "left",
          //   dropdownActiveClassDisabled: true,
          // },
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
