import openai
import os
import numpy as np
from dotenv import load_dotenv

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

def get_embedding(text: str, model: str = "text-embedding-3-small") -> bytes:
    if not text:
        return b""

    response = openai.Embedding.create(
        model=model,
        input=text
    )

    embedding_list = response.data[0].embedding
    embedding_array = np.array(embedding_list, dtype=np.float32)
    return embedding_array.tobytes()
