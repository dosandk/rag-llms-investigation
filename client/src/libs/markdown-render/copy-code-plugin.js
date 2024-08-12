const strokeValue = 50;
const changeIconsDuration = 1500;

const buttonStyle = `
  position: absolute;
  right: 5px;
  top: 5px;
  opacity: 0.75;
  height: 18px;
  width: 18px;
  cursor: pointer;
  outline: none;
  border: 0;
  background: transparent;
`;

const iconSVGStyle = `
  position: absolute;
  top: 0;
  left: 0;
  stroke-dasharray: ${strokeValue};
  transition: all 300ms ease-in-out;
`;

const flippyStyles = `
  stroke-dashoffset: 0;
`;

const checkStyles = `
  stroke-dashoffset: -${strokeValue};
  color: darkgreen;
`;

const buttonClass = "markdown-it-code-copy";

const defaultOptions = {
  buttonStyle,
  buttonClass,
};

function renderCode(origRule, userOptions = {}) {
  const options = { ...defaultOptions, ...userOptions };

  return (...args) => {
    const [tokens, idx] = args;
    const { content } = tokens[idx];
    const origRendered = origRule(...args);

    if (content.length === 0) {
      return origRendered;
    }

    globalThis[Symbol.for("markdown-it-code-copy")] = (event) => {
      const btn = event.currentTarget;

      if (btn.classList.contains("active")) {
        return;
      }

      const clippy = btn.querySelector(".clippy");
      const check = btn.querySelector(".check");
      const toggleDashoffset = () => {
        clippy.style.strokeDashoffset -= strokeValue;
        check.style.strokeDashoffset -= strokeValue;
      };

      btn.classList.add("active");

      toggleDashoffset();

      navigator.clipboard.writeText(decodeURI(btn.dataset.clipboardText));

      setTimeout(() => {
        btn.classList.remove("active");
        toggleDashoffset();
      }, changeIconsDuration);
    };

    return `
      <div style="position: relative">
        ${origRendered}
        <button class="${options.buttonClass}"
          data-clipboard-text="${encodeURI(content)}"
          style="${options.buttonStyle}"
          title="Copy"
          onclick="globalThis[Symbol.for('markdown-it-code-copy')](event)"
        >
          <svg class='clippy' viewBox="0 0 16 16" fill="none" stroke="currentColor" style="${flippyStyles} ${iconSVGStyle}">
            <path d="M5.75 4.75H10.25V1.75H5.75V4.75Z" />
            <path d="M3.25 2.88379C2.9511 3.05669 2.75 3.37987 2.75 3.75001V13.25C2.75 13.8023 3.19772 14.25 3.75 14.25H12.25C12.8023 14.25 13.25 13.8023 13.25 13.25V3.75001C13.25 3.37987 13.0489 3.05669 12.75 2.88379" />
          </svg>

          <svg class='check' viewBox="0 0 16 16" fill="none" stroke="currentColor" style="${checkStyles} ${iconSVGStyle}">
            <path d="M13.25 4.75L6 12L2.75 8.75" />
          </svg>
        </button>
      </div>
    `;
  };
}

export default (md, options) => {
  md.renderer.rules.code_block = renderCode(
    md.renderer.rules.code_block,
    options,
  );
  md.renderer.rules.fence = renderCode(md.renderer.rules.fence, options);
};
