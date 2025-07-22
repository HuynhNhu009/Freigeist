

import requests

OLLAMA_URL = "http://localhost:11434/api/generate"  # Ollama chạy local
MODEL_NAME = "llama3.2"

def analyze_entry(content):
    prompt = f"""
Bạn là một chuyên gia phân tích tâm lý. Dưới đây là nội dung nhật ký của người dùng:

"{content}"

1. Phân tích cảm xúc chính của người dùng trong nhật ký này.
2. Đưa ra điểm số từ 1 đến 10 cho cảm xúc này, với 1 là rất tiêu cực và 10 là rất tích cực.
3. Cung cấp một lời khuyên ngắn gọn để cải thiện tâm trạng của người dùng.
Định dạng phản hồi của bạn như sau, chỉ cần trả ời dạng Json như vậy thôi:
{{
  "de_emoState": "...",
  "de_emoScore": ...,
  "de_advice": "..."
}}
"""

    response = requests.post(OLLAMA_URL, json={
        "model": MODEL_NAME,
        "prompt": prompt,
        "stream": False
    })

    data = response.json()
    return data["response"]
