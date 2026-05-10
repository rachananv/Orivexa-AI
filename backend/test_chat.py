import requests

data = {"message": "how to study one day before exams"}
response = requests.post("http://localhost:8000/api/chat", json=data)
print(response.json())
