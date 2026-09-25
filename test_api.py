import requests

url = "https://iris-fastapi-r415.onrender.com/predict"

data = {
    "sepal_length": 5.1,
    "sepal_width": 3.5,
    "petal_length": 1.4,
    "petal_width": 0.2,
}

connected = False
for local_port in [3000, 8000]:
    try:
        response = requests.post(f"http://localhost:{local_port}/predict", json=data, timeout=2)
        response.raise_for_status()
        print(f"✓ Kết quả từ Local API (http://localhost:{local_port}/predict):")
        print(response.json())
        connected = True
        break
    except Exception:
        pass

if not connected:
    print(f"Local API chưa mở, đang thử gọi Render API ({url})...")
    try:
        response = requests.post(url, json=data, timeout=30)
        response.raise_for_status()
        print("✓ Kết quả từ Render API:")
        print(response.json())
    except Exception as err:
        print(f"Lỗi kết nối API: {err}")
