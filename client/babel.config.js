module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          browsers: "> 3%",
        },
      },
    ],
  ],
  plugins: [
    [
      "@babel/plugin-transform-react-jsx",
      {
        pragma: "createElement",
        pragmaFrag: "DocumentFragment",
      },
    ],
  ],
};
