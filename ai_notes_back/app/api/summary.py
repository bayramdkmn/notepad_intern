import openai
import os
from dotenv import load_dotenv

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

def generate_summary(title: str, content: str, tags: list[str]):
    tags_str = ", ".join(tags) if tags else "none"

    prompt = f"""
You are an expert assistant specializing in generating insightful summaries.
Your goal is NOT only to summarize the text but to:
- Highlight the main ideas clearly  
- Explain the reasoning or context behind them  
- Mention key insights or takeaways  
- Avoid generic or surface-level summaries  
- Produce a coherent, meaningful explanation in 3–5 sentences  

IMPORTANT:
Do NOT add conclusions that do not exist in the text.
Do NOT invent facts.
Do NOT add formal headers.

Here is the note you must summarize:

Title: {title}
Tags: {tags_str}

Content:
{content}
"""

    response = openai.ChatCompletion.create(
        model="gpt-4o-mini",     # veya gpt-4o
        messages=[
            {"role": "system", "content": "You summarize user notes."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.2,
        max_tokens=256
    )

    return response["choices"][0]["message"]["content"].strip()
