import { TavilySearchResults } from "@langchain/community/tools/tavily_search";

const searchTool = new TavilySearchResults();

// const toolResult = await searchTool.invoke("what is the weather in SF?");
// console.log(toolResult);

export { searchTool }