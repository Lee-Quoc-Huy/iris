"""
Iris SVM - FastAPI Production Server
Quy trình MLOps: Train bằng Python -> Tạo .pkl -> Nạp model lên FastAPI -> Web gọi FastAPI để dự đoán
"""
import time
import json
import os
import random
import joblib
import numpy as np
from typing import Literal, Optional, Dict, Any
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field

app = FastAPI(
    title="Iris Multi-Kernel SVM API",
    description="Hệ thống suy luận phân loại Hoa Diên Vĩ dựa trên 4 mô hình SVM .pkl huấn luyện bằng Python scikit-learn",
    version="2.1.0"
)

# Cấu hình CORS toàn diện để Web Frontend gọi trực tiếp không bị chặn
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. Nạp 4 mô hình SVM .pkl đã huấn luyện từ train.py vào RAM
SUPPORTED_KERNELS = ["linear", "rbf", "poly", "sigmoid"]
models: Dict[str, Any] = {}

base_dir = os.path.dirname(os.path.abspath(__file__))

for k in SUPPORTED_KERNELS:
    pkl_file = os.path.join(base_dir, f"svm_{k}.pkl")
    if os.path.exists(pkl_file):
        try:
            models[k] = joblib.load(pkl_file)
            print(f"[FastAPI] Đã nạp thành công mô hình: svm_{k}.pkl")
        except Exception as e:
            print(f"[FastAPI] Lỗi khi nạp svm_{k}.pkl: {e}")
    else:
        print(f"[FastAPI] Cảnh báo: Không tìm thấy file {pkl_file}. Hãy chạy python train.py trước.")

# 2. Nạp dữ liệu metrics và weights đánh giá
metrics_data = {}
metrics_path = os.path.join(base_dir, "metrics.json")
if os.path.exists(metrics_path):
    try:
        with open(metrics_path, "r", encoding="utf-8") as f:
            metrics_data = json.load(f)
    except Exception as e:
        print(f"[FastAPI] Lỗi đọc metrics.json: {e}")

SPECIES_MAP = {
    0: "setosa",
    1: "versicolor",
    2: "virginica"
}

SPECIES_VI_MAP = {
    0: "Hoa Diên Vĩ Setosa",
    1: "Hoa Diên Vĩ Versicolor",
    2: "Hoa Diên Vĩ Virginica"
}

class IrisInput(BaseModel):
    sepal_length: float = Field(..., description="Chiều dài đài hoa (cm)", ge=0.0, le=15.0, json_schema_extra={"example": 5.1})
    sepal_width: float = Field(..., description="Chiều rộng đài hoa (cm)", ge=0.0, le=15.0, json_schema_extra={"example": 3.5})
    petal_length: float = Field(..., description="Chiều dài cánh hoa (cm)", ge=0.0, le=15.0, json_schema_extra={"example": 1.4})
    petal_width: float = Field(..., description="Chiều rộng cánh hoa (cm)", ge=0.0, le=15.0, json_schema_extra={"example": 0.2})
    kernel: Optional[Literal["linear", "rbf", "poly", "sigmoid"]] = "linear"

@app.get("/")
def home():
    return {
        "message": "Iris Multi-Kernel SVM FastAPI Server is running",
        "pipeline": "Python train.py -> .pkl -> FastAPI app.py -> Web Client",
        "loaded_models": list(models.keys()),
        "total_models": len(models),
        "version": "2.1.0",
        "endpoints": {
            "predict": "POST /predict",
            "metrics": "GET /metrics",
            "health": "GET /health",
            "random_sample": "GET /random-sample",
            "docs": "/docs"
        }
    }

@app.get("/health")
def health():
    return {
        "status": "healthy" if len(models) > 0 else "degraded",
        "engine": "FastAPI (Python scikit-learn)",
        "models_loaded": list(models.keys()),
        "total_kernels": len(models),
        "available_kernels": SUPPORTED_KERNELS,
        "is_ready": len(models) == len(SUPPORTED_KERNELS)
    }

@app.get("/metrics")
def get_metrics(kernel: Optional[str] = None):
    data = metrics_data
    if not data and os.path.exists(metrics_path):
        with open(metrics_path, "r", encoding="utf-8") as f:
            data = json.load(f)
    if not data:
        raise HTTPException(status_code=404, detail="Chưa tìm thấy dữ liệu metrics.json. Vui lòng chạy python train.py.")

    if kernel:
        k = kernel.lower()
        if k in data:
            return data[k]
        raise HTTPException(status_code=404, detail=f"Không tìm thấy metrics cho kernel '{k}'")
    return data

class BatchIrisInput(BaseModel):
    samples: list[dict]
    kernel: Optional[Literal["linear", "rbf", "poly", "sigmoid"]] = "linear"

@app.post("/batch-predict")
def batch_predict(data: BatchIrisInput):
    k = (data.kernel or "linear").lower()
    if k not in models:
        raise HTTPException(
            status_code=400,
            detail=f"Kernel '{k}' không khả dụng. Các kernel đã nạp: {list(models.keys())}"
        )

    selected_model = models[k]
    results = []
    correct_count = 0
    labeled_count = 0
    counts = {"setosa": 0, "versicolor": 0, "virginica": 0}

    for s in data.samples:
        sl = float(s.get("sepal_length") or s.get("sl") or s.get("SepalLength") or 5.1)
        sw = float(s.get("sepal_width") or s.get("sw") or s.get("SepalWidth") or 3.5)
        pl = float(s.get("petal_length") or s.get("pl") or s.get("PetalLength") or 1.4)
        pw = float(s.get("petal_width") or s.get("pw") or s.get("PetalWidth") or 0.2)
        true_label = str(s.get("trueLabel") or s.get("label") or s.get("species") or s.get("Species") or "").strip().lower()

        features = np.array([[sl, sw, pl, pw]])
        pred_class = int(selected_model.predict(features)[0])
        pred_slug = SPECIES_MAP.get(pred_class, "setosa")
        counts[pred_slug] = counts.get(pred_slug, 0) + 1

        is_correct = None
        if true_label:
            labeled_count += 1
            is_correct = (pred_slug in true_label or true_label in pred_slug)
            if is_correct:
                correct_count += 1

        results.append({
            "sl": sl,
            "sw": sw,
            "pl": pl,
            "pw": pw,
            "trueLabel": true_label,
            "pred": pred_slug,
            "class_id": pred_class,
            "correct": is_correct
        })

    accuracy = round((correct_count / labeled_count * 100), 1) if labeled_count > 0 else 0.0

    return {
        "source": f"FastAPI svm_{k}.pkl (Scikit-learn)",
        "kernel_used": k,
        "total": len(results),
        "labeled_count": labeled_count,
        "correct_count": correct_count,
        "accuracy": accuracy,
        "counts": counts,
        "results": results
    }

@app.post("/predict")
def predict(data: IrisInput):
    k = (data.kernel or "linear").lower()
    if k not in models:
        raise HTTPException(
            status_code=400,
            detail=f"Kernel '{k}' không khả dụng. Các kernel đã nạp trong bộ nhớ: {list(models.keys())}"
        )

    selected_model = models[k]
    features = np.array([[data.sepal_length, data.sepal_width, data.petal_length, data.petal_width]])

    start_time = time.perf_counter()
    raw_pred = selected_model.predict(features)
    prediction_class = int(raw_pred[0])
    exec_time_ms = round((time.perf_counter() - start_time) * 1000, 3)

    species_slug = SPECIES_MAP.get(prediction_class, "unknown")
    species_vi = SPECIES_VI_MAP.get(prediction_class, "Không xác định")

    # Tính khoảng cách hàm quyết định (decision function) nếu hỗ trợ
    decision_scores = None
    if hasattr(selected_model, "decision_function"):
        try:
            df = selected_model.decision_function(features)[0]
            if isinstance(df, np.ndarray):
                decision_scores = [round(float(s), 4) for s in df]
            else:
                decision_scores = [round(float(df), 4)]
        except Exception:
            decision_scores = None

    return {
        "source": "FastAPI (scikit-learn .pkl)",
        "kernel_used": k,
        "class_id": prediction_class,
        "prediction": species_slug,
        "prediction_vi": species_vi,
        "execution_time_ms": exec_time_ms,
        "decision_scores": decision_scores,
        "model_file": f"svm_{k}.pkl",
        "input_features": {
            "sepal_length": data.sepal_length,
            "sepal_width": data.sepal_width,
            "petal_length": data.petal_length,
            "petal_width": data.petal_width
        }
    }

@app.get("/random-sample")
def random_sample():
    # Sinh mẫu ngẫu nhiên dựa trên các khoảng phân bố của Iris
    mode = random.random()
    if mode < 0.4:
        # Vùng ranh giới phức tạp
        is_versi_virgi = random.random() < 0.5
        if is_versi_virgi:
            pl = round(random.uniform(4.5, 5.3), 1)
            pw = round(random.uniform(1.4, 1.8), 1)
            sl = round(random.uniform(5.6, 6.8), 1)
            sw = round(random.uniform(2.5, 3.2), 1)
            difficulty = "Khó 🔥 (Vùng ranh giới Versicolor - Virginica)"
        else:
            pl = round(random.uniform(2.0, 2.8), 1)
            pw = round(random.uniform(0.6, 0.9), 1)
            sl = round(random.uniform(4.8, 5.6), 1)
            sw = round(random.uniform(2.8, 3.8), 1)
            difficulty = "Thử thách ⚡ (Vùng chuyển tiếp Setosa)"
    elif mode < 0.7:
        pl = round(random.uniform(1.0, 6.9), 1)
        pw = round(random.uniform(0.1, 2.5), 1)
        sl = round(random.uniform(4.3, 7.9), 1)
        sw = round(random.uniform(2.0, 4.4), 1)
        difficulty = "Khắp bảng 🎲 (Tọa độ tự do)"
    else:
        pl = round(random.uniform(1.2, 6.7), 1)
        pw = round(random.uniform(0.2, 2.4), 1)
        sl = round(random.uniform(4.5, 7.7), 1)
        sw = round(random.uniform(2.2, 4.2), 1)
        difficulty = "Tiêu chuẩn 🎯"

    # Dự đoán bằng model linear .pkl mặc định nếu có
    pred_class = 0
    pred_species = "setosa"
    if "linear" in models:
        feats = np.array([[sl, sw, pl, pw]])
        pred_class = int(models["linear"].predict(feats)[0])
        pred_species = SPECIES_MAP.get(pred_class, "setosa")

    return {
        "sepal_length": sl,
        "sepal_width": sw,
        "petal_length": pl,
        "petal_width": pw,
        "class_id": pred_class,
        "true_class": pred_species,
        "difficulty": difficulty
    }

# 3. Phục vụ tĩnh Web Frontend nếu thư mục dist đã được build
dist_dir = os.path.join(base_dir, "dist")
if os.path.exists(dist_dir):
    assets_dir = os.path.join(dist_dir, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    images_dir = os.path.join(dist_dir, "images")
    if os.path.exists(images_dir):
        app.mount("/images", StaticFiles(directory=images_dir), name="dist_images")
    elif os.path.exists(os.path.join(base_dir, "public", "images")):
        app.mount("/images", StaticFiles(directory=os.path.join(base_dir, "public", "images")), name="public_images")

    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        # Trả về các file tĩnh nếu tồn tại
        potential_file = os.path.join(dist_dir, full_path)
        if full_path and os.path.isfile(potential_file):
            return FileResponse(potential_file)
        # SPA Fallback về index.html
        index_file = os.path.join(dist_dir, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        return {"message": "Frontend chưa được build. Vui lòng chạy npm run build."}

if __name__ == "__main__":
    import uvicorn
    # Hỗ trợ chạy trực tiếp: python app.py
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("app:app", host="0.0.0.0", port=port, reload=True)
