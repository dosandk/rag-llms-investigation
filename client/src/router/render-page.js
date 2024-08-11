export const renderPage = async (path, match, search) => {
  // NOTE: for lazy loading in browser or webpack use the next approach
  const { default: Page } = await import(`../pages/${path}/index.js`);
  const content = document.querySelector("#content");

  if (content === null) throw new Error("Content element not found");

  content.innerHTML = "";

  const page = new Page(match, search);

  content.append(page.element);

  return page;
};
