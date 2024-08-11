export default {
  chat_history: [
    {
      lc: 1,
      type: "constructor",
      id: ["langchain_core", "messages", "HumanMessage"],
      kwargs: {
        content: "how to clone the project?",
        additional_kwargs: {},
        response_metadata: {},
      },
    },
    {
      lc: 1,
      type: "constructor",
      id: ["langchain_core", "messages", "AIMessage"],
      kwargs: {
        content:
          'To clone a project on GitHub, you can follow these steps:\n\n**Step 1:** Navigate to the repository you want to clone. In your case, it\'s the forked version of the matrix repo.\n\n**Step 2:** Click the "Code" button on the right side of the repository name\'s row.\n\n**Step 3:** Click the "HTTPS" or "SSH" button next to the URL. The URL will be copied to your clipboard.\n\n**Step 4:** Open a terminal on your machine and navigate to the directory where you want to clone the project.\n\n**Step 5:** Use the `git clone` command followed by the URL you copied in step 3, like this:\n```\ngit clone https://github.com/your-username/matrix.git\n```\nReplace "https" with "ssh" if you prefer to use SSH for cloning.\n\n**Step 6:** Press Enter to start the cloning process. This may take a few seconds depending on your internet connection and the size of the repository.\n\nOnce the cloning is complete, you can navigate into the newly created directory to explore and work with your project!',
        tool_calls: [],
        invalid_tool_calls: [],
        additional_kwargs: {},
        response_metadata: {},
      },
    },
  ],
  input: "how to clone the project?",
  context: [
    {
      pageContent:
        "- User Experience: Native apps offer the best performance and user experience, as they have direct access to the device's hardware and native APIs, allowing for seamless interactions and smooth animations. (work with complex interaction with graphics, 2D - 3D model development, etc.)",
      metadata: {
        loc: {
          lines: {
            from: 80,
            to: 80,
          },
        },
      },
    },
    {
      pageContent:
        'a web application and you need to use it as a "mobile application" on your mobile device and download it from the market.',
      metadata: {
        loc: {
          lines: {
            from: 23,
            to: 23,
          },
        },
      },
    },
    {
      pageContent:
        "1. Create a fork version of the matrix repo (click **Fork** button on the right side of the repo name's row).",
      metadata: {
        loc: {
          lines: {
            from: 14,
            to: 14,
          },
        },
      },
    },
    {
      pageContent:
        "## How to contribute\n\n1. Make sure you have [SSL configured](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent) on your working machine as well as in your gitlab account.",
      metadata: {
        loc: {
          lines: {
            from: 10,
            to: 12,
          },
        },
      },
    },
    {
      pageContent:
        "- SOLID principles\n- Modularity\n- Separation of concerns principle\n- Architectural Patterns:\n  - MV\\* (MVC, MVP, MVVM, MVI)\n  - Layered Architecture (3-tier):\n    - Pattern Description\n    - Key Concepts\n    - Trade-offs\n  - Microservice architecture:\n    - What Are Microservices?",
      metadata: {
        loc: {
          lines: {
            from: 14,
            to: 24,
          },
        },
      },
    },
    {
      pageContent:
        "1. Create a Merge Request into the master branch of main repository with a clear title and description.",
      metadata: {
        loc: {
          lines: {
            from: 30,
            to: 30,
          },
        },
      },
    },
    {
      pageContent:
        "- [EN] [Design Patterns](https://www.oodesign.com)\n- [EN] [A free book on design patterns in JS with animations & examples on CodeSandbox](https://www.patterns.dev/)\n- [EN] [Functional Vs. Non Functional Requirements](https://www.guru99.com/functional-vs-non-functional-requirements.html)",
      metadata: {
        loc: {
          lines: {
            from: 130,
            to: 132,
          },
        },
      },
    },
  ],
  answer:
    'To clone a project on GitHub, you can follow these steps:\n\n**Step 1:** Navigate to the repository you want to clone. In your case, it\'s the forked version of the matrix repo.\n\n**Step 2:** Click the "Code" button on the right side of the repository name\'s row.\n\n**Step 3:** Click the "HTTPS" or "SSH" button next to the URL. The URL will be copied to your clipboard.\n\n**Step 4:** Open a terminal on your machine and navigate to the directory where you want to clone the project.\n\n**Step 5:** Use the `git clone` command followed by the URL you copied in step 3, like this:\n```\ngit clone https://github.com/your-username/matrix.git\n```\nReplace "https" with "ssh" if you prefer to use SSH for cloning.\n\n**Step 6:** Press Enter to start the cloning process. This may take a few seconds depending on your internet connection and the size of the repository.\n\nOnce the cloning is complete, you can navigate into the newly created directory to explore and work with your project!',
};
