const { GOOGLE_ANALYTICS } = globalThis[Symbol.for("app-config")];
const gaLoader = document.createElement("script");

gaLoader.src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS}`;
gaLoader.async = true;

document.querySelector("head").prepend(gaLoader);

window.dataLayer = window.dataLayer || [];

function gtag() {
  dataLayer.push(arguments);
}

gtag("js", new Date());
gtag("config", GOOGLE_ANALYTICS);
