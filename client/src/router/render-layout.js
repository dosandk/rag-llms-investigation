export const renderLayout = async (path = "") => {
  const { default: Layout } = await import(`../layouts/${path}/index.js`);
  const root = document.getElementById("root");

  if (root === null) throw new Error("Root element not found");

  root.innerHTML = "";

  const app = new Layout();

  root.append(app.element);
};
