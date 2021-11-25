## setup
# python -m venv venv
# venv\Scripts\activate.bat

## requirements
# pip install fastapi elasticsearch "uvicorn[standard]" 

## run
# venv\Scripts\activate.bat
# uvicorn main:app --reload

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from elasticsearch import Elasticsearch

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins = ['*'],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
)

es = Elasticsearch(["http://localhost:9200/"])

@app.get("/search/{term}")
def read_dic_word(term: str):
    query = {
        "query": {
            "multi_match": {
                "query": term,
                "type": "phrase_prefix",
                "fields": [
                    "name^4",
                    "description",
                    "Age",
                    "Birth",
                    "From",
                    "Gender"
                ]
            }
        }
    }

    result = es.search(
        index = "prod_index",
        body = query,
    )
    return [hit["_source"] for hit in result['hits']['hits']]

# uvicorn main:app --reload


# $ curl -XPOST localhost:9200/prod_index/_bulk -H 'Content-Type: application/x-ndjson' --data-binary '@result.json'
