const routes = [
  {
    pattern: /^$/,
    path: "home",
    layout: "app",
    guards: [],
  },
  {
    pattern: /^home$/,
    path: "home",
    layout: "app",
    guards: [],
  },
];

export default routes;
