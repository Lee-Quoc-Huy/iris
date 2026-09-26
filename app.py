import time
import json
import os
import joblib
import numpy as np
from typing import Literal
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(
    title="Iris Multi-Kernel SVM API",
    description="API Phân loại Hoa Diên Vĩ với 4 Kernel SVM chuyên sâu (Linear, RBF, Poly, Sigmoid)",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load trước 4 models vào RAM để phản hồi cực nhanh
models = {}
for k in ["linear", "rbf", "poly", "sigmoid"]:
    pkl_file = f"svm_{k}.pkl"
    if os.path.exists(pkl_file):
        models[k] = joblib.load(pkl_file)

# Load thông số metrics đã tính toán sẵn từ train.py
metrics_data = {}
if os.path.exists("metrics.json"):
    with open("metrics.json", "r", encoding="utf-8") as f:
        metrics_data = json.load(f)

class IrisInput(BaseModel):
    sepal_length: float = Field(..., description="Chiều dài đài hoa (cm)", example=5.1)
    sepal_width: float = Field(..., description="Chiều rộng đài hoa (cm)", example=3.5)
    petal_length: float = Field(..., description="Chiều dài cánh hoa (cm)", example=1.4)
    petal_width: float = Field(..., description="Chiều rộng cánh hoa (cm)", example=0.2)
    kernel: Literal["linear", "rbf", "poly", "sigmoid"] = "linear"

SPECIES_MAP = {0: "setosa", 1: "versicolor", 2: "virginica"}

@app.get("/")
def home():
    return {
        "message": "Iris Multi-Kernel SVM API is running",
        "supported_kernels": ["linear", "rbf", "poly", "sigmoid"],
        "version": "2.0.0"
    }

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "models_loaded": list(models.keys()),
        "total_kernels": len(models)
    }

@app.get("/metrics")
def get_metrics():
    # Trả về bảng đánh giá hiệu năng cả 5 mô hình
    if metrics_data:
        return metrics_data
    if os.path.exists("metrics.json"):
        with open("metrics.json", "r", encoding="utf-8") as f:
            return json.load(f)
    return {"error": "Metrics data not found. Please run train.py first."}

@app.post("/predict")
def predict(data: IrisInput):
    k = data.kernel.lower()
    if k not in models:
        raise HTTPException(
            status_code=400,
            detail=f"Kernel '{k}' không hợp lệ hoặc chưa được load. Các kernel hợp lệ: {list(models.keys())}"
        )

    selected_model = models[k]
    features = np.array([[data.sepal_length, data.sepal_width, data.petal_length, data.petal_width]])

    start_time = time.time()
    
    prediction = int(selected_model.predict(features)[0])

    exec_time_ms = round((time.time() - start_time) * 1000, 3)

    return {
        "kernel_used": k,
        "class_id": prediction,
        "prediction": SPECIES_MAP.get(prediction, "unknown"),
        "execution_time_ms": exec_time_ms,
        "input_features": {
            "sepal_length": data.sepal_length,
            "sepal_width": data.sepal_width,
            "petal_length": data.petal_length,
            "petal_width": data.petal_width
        }
    }
