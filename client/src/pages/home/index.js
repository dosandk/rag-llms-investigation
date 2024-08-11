import BaseComponent from "../../components/base.js";

// TODO: temp solution
import doc from "./document.js";

import "./style.css";

export default class HomePage extends BaseComponent {
  constructor() {
    super();
    this.init();
  }

  get template() {
    return `
      <div class="app-home-page d-flex flex-column">
        <h2 class="app-page-title">Home Page</h2>

        <div class="home-page-content">
          <div data-element="document-container" class="page-side p-3">
            ${doc}
          </div>
          <div class="page-delimeter h-100"></div>
          <div data-element="chat-conteiner" class="page-side p-3">

<div class="stChatMessage st-emotion-cache-4oy321 eeusbqq4" data-testid="stChatMessage"><div data-testid="chatAvatarIcon-assistant" class="st-emotion-cache-bho8sy eeusbqq1"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor" xmlns="http://www.w3.org/2000/svg" color="inherit" class="eyeqlp51 st-emotion-cache-1pbsqtx ex0cdmw0"><rect width="24" height="24" fill="none"></rect><path d="M20 9V7c0-1.1-.9-2-2-2h-3c0-1.66-1.34-3-3-3S9 3.34 9 5H6c-1.1 0-2 .9-2 2v2c-1.66 0-3 1.34-3 3s1.34 3 3 3v4c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-4c1.66 0 3-1.34 3-3s-1.34-3-3-3zm-2 10H6V7h12v12zm-9-6c-.83 0-1.5-.67-1.5-1.5S8.17 10 9 10s1.5.67 1.5 1.5S9.83 13 9 13zm7.5-1.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5zM8 15h8v2H8v-2z"></path></svg></div><div data-testid="stChatMessageContent" aria-label="Chat message from assistant" class="st-emotion-cache-1flajlm eeusbqq3"><div data-testid="stVerticalBlockBorderWrapper" data-test-scroll-behavior="normal" class="st-emotion-cache-0 e1f1d6gn0"><div class="st-emotion-cache-1wmy9hl e1f1d6gn1"><div width="648" data-testid="stVerticalBlock" class="st-emotion-cache-x2svlt e1f1d6gn2"><div data-stale="false" width="648" class="element-container st-emotion-cache-j795b7 e1f1d6gn4" data-testid="element-container"><div class="stMarkdown" data-testid="stMarkdown" style="width: 648px;"><div data-testid="stMarkdownContainer" class="st-emotion-cache-eqffof e1nzilvr5"><p>Hey! I am Magic Chat, your assistant for finding the best Magic The Gathering cards to build your dream deck. Let's get started!</p></div></div></div></div></div></div></div></div>


</div>
        </div>
      </div>
    `;
  }
}
