from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import cohere
import os
from dotenv import load_dotenv
from newspaper import Article

load_dotenv()
api_key = os.getenv("COHERE_API_KEY")
co = cohere.Client(api_key)

app = FastAPI()

class RequestBody(BaseModel):
    url: str



from newspaper import Article
from bs4 import BeautifulSoup
import requests

def extract_content_from_url(url: str) -> str:
    # Try newspaper3k first
    print(url)
    try:
        article = Article(url)
        article.download()
        article.parse()
        if len(article.text.strip()) >= 250:
            return article.text
    except:
        pass  # silently fallback

    # Fallback: use BeautifulSoup to extract content
    try:
        response = requests.get(url, timeout=10)
        soup = BeautifulSoup(response.text, 'html.parser')

        # Remove script/style tags
        for tag in soup(["script", "style", "noscript"]):
            tag.extract()

        paragraphs = soup.find_all(['p', 'div'])
        text = "\n\n".join(p.get_text().strip() for p in paragraphs if p.get_text().strip())

        # Limit to first ~3000 characters to avoid overloading the LLM
        return text[:3000]
    except Exception as e:
        raise Exception(f"Failed to extract content: {str(e)}")


@app.post("/summarize")
async def summarize(body: RequestBody):
    try:
        content = extract_content_from_url(body.url)
        
        if len(content) < 250:
            raise HTTPException(status_code=400, detail="Extracted content is too short for summarization.")
        
        response = co.summarize(text=content, length='long', format='paragraph', model='summarize-xlarge')
        return {"summary": response.summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

