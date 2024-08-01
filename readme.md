# RAG LLMs investigation

https://docs.unstructured.io/api-reference/api-services/free-api

```curl
curl -vX POST $UNSTRUCTURED_API_URL \
     -H 'accept: application/json' \
     -H 'Content-Type: multipart/form-data' \
     -H 'unstructured-api-key: '"$UNSTRUCTURED_API_KEY"'' \
     -F 'files=@/Users/volodymyr/Projects/ELEKS/rag-llms-investigation/docs/main.md' \
     -o '/Users/volodymyr/Projects/ELEKS/rag-llms-investigation/docs/foo.json'
```
