import openai

def generate_tags(title: str, content: str, tags: list[str]):
    tags_str = ", ".join(tags) if tags else "none"

    prompt = f"""
Suggest 5-7 relevant tags for the following note. Return only a list of tags.

Title: {title}
Tags: {tags_str}

Content:
{content}
"""

    response = openai.ChatCompletion.create(
        model="gpt-4o-mini",     # veya gpt-4o
        messages=[
            {"role": "system", "content": "You are an assistant that suggests concise tags for notes."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
        max_tokens=60
    )

    raw_tags = response["choices"][0]["message"]["content"].strip()
    tags_list = [t.strip() for t in raw_tags.split(",") if t.strip()]

    return {"tags": tags_list}
