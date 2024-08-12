import MarkdownIt from "markdown-it";
import highlightjs from "markdown-it-highlightjs/core";
import hljs from "highlight.js/lib/core";
import copyCode from "./copy-code-plugin.js";
import linkAttrs from "markdown-it-link-attributes";
import javascript from "highlight.js/lib/languages/javascript";

hljs.registerLanguage("javascript", javascript);

// TODO: move from MarkdownIt to Remark, because of https://github.com/kevin940726/remark-code-import
const md = new MarkdownIt({
  html: true,
});

md.use(highlightjs, { hljs });
md.use(linkAttrs, { attrs: { target: "_blank", rel: "noopener" } });
md.use(copyCode);

const markdownRender = (text = "") => {
  try {
    return md.render(text);
  } catch (error) {
    console.error("Error MarkdownIt: ", error.message);
    throw error;
  }
};

export default markdownRender;
