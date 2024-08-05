# Install guide

In order to run the app, you need to install both python and JS dependencies. Run following commands from the project's root folder.

## Install Python dependencies

Create virtual environment

```bash
python3 -m venv ./venv
```

Activate virtual environment

```bash
source ./venv/bin/activate
```

After activation of virtual environment you should see a `(venv)` prefix in the console. Now you can run all python commands from this console.

Install python dependencies

```bash
pip install -r requirements.txt
```

## Install JS dependencies

```bash
npm install
```

## Run the project

If you need to run `ChromaDB` execute the following command from `(venv)` console

```bash
chroma run --path ./chroma-data
```

To start "chromadb" with ALLOW_RESET flag

```bash
 ALLOW_RESET=TRUE chroma run --path ./chroma-data
```

Execute the desired JS script

```bash
node '/path/to/file.js'
```

### RAG LLMs investigation

https://docs.unstructured.io/api-reference/api-services/free-api

```curl
curl -vX POST $UNSTRUCTURED_API_URL \
     -H 'accept: application/json' \
     -H 'Content-Type: multipart/form-data' \
     -H 'unstructured-api-key: '"$UNSTRUCTURED_API_KEY"'' \
     -F 'files=@/Users/volodymyr/Projects/ELEKS/rag-llms-investigation/docs/main.md' \
     -o '/Users/volodymyr/Projects/ELEKS/rag-llms-investigation/docs/foo.json'
```
