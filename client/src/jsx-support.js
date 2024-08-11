const createElement = (tag, props, ...children) => {
  // NOTE: render class component
  if (typeof tag === "function") {
    if (isClass(tag)) {
      return new tag(props, ...children).element;
    }

    return tag(props, ...children);
  }

  // NOTE: create DOM element
  const element = document.createElement(tag);

  Object.entries(props || {}).forEach(([name = "", value = ""]) => {
    if (name.startsWith("on") && name.toLowerCase() in window) {
      element.addEventListener(name.toLowerCase().substr(2), value);
    } else {
      element.setAttribute(name, value.toString());
    }
  });

  children.forEach((child) => {
    appendChild(element, child);
  });

  return element;
};

function isClass(func) {
  return (
    typeof func === "function" &&
    /^class\s/.test(Function.prototype.toString.call(func))
  );
}

const appendChild = (parent, child) => {
  if (Array.isArray(child)) {
    child.forEach((nestedChild) => appendChild(parent, nestedChild));
  } else {
    if (child !== undefined) {
      parent.appendChild(
        child.nodeType ? child : document.createTextNode(child),
      );
    }
  }
};

const initJsxSupport = () => {
  // NOTE: use this for pragma comment
  globalThis[Symbol.for("createElement")] = createElement;
};

export default initJsxSupport;
