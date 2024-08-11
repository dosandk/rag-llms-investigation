export default `
# Contributing Guide

  > If you want to change something please use power of pull - request and issue tracker

## Table Of Contents

  - [How to contribute](#how - to - contribute)
  - [Types of issues](#types - of - issues)

## How to contribute

1. Make sure you have[SSL configured](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent) on your working machine as well as in your gitlab account.

  1. Create a fork version of the matrix repo (click ** Fork ** button on the right side of the repo name's row).

1. Clone the project forked:
\`\`\`
   git clone git @gitlab2.eleks-software.local: <firstname.lastname>/javascript-matrix.git
\`\`\`
1. Create branch:
\`\`\`
  git checkout - b < your - branch - name >
\`\`\`
1. Add, commit changes and push them by:
\`\`\`
    git push--set - upstream--progress origin < your - branch - name >
\`\`\`
1. Click ** Create merge request ** button appeared on top of the page.

      1. Create a Merge Request into the master branch of main repository with a clear title and description.

      ## Types of issues

  - ** bug ** - please submit if you found some kinds of typos, broken links, duplicates, etc
    - ** improvement ** - please submit if you want add something new to matrix.For example: section, question, recommendation links, etc.
      - ** change - request ** - please submit if you think that some matrix questions are not relevant to our stream
  - ** deprecation ** - please submit if you are think that some matrix question are not up to date
    - ** question ** - please submit if you have question about some matrix section

      `;
