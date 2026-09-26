import time
import json
import joblib
import numpy as np
from sklearn import datasets
from sklearn.svm import SVC
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix

print("================================================================")
print("=== BẮT ĐẦU HUẤN LUYỆN DỰ ÁN 5-KERNEL SVM CHO BỘ HOA IRIS ===")
print("================================================================")

# 1. Tải và chuẩn bị dữ liệu chuẩn R.A. Fisher Iris (150 mẫu, 4 đặc trưng)
iris = datasets.load_iris()
X, y = iris.data, iris.target
target_names = list(iris.target_names)
feature_names = list(iris.feature_names)

# Phân chia tập huấn luyện và kiểm thử (80% Train / 20% Test, stratify giữ cân bằng 3 lớp)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

print(f"Tổng số mẫu: {len(X)} | Tập Train: {len(X_train)} | Tập Test: {len(X_test)}")
print(f"Các loài hoa: {target_names}")
print(f"Các đặc trưng: {feature_names}\n")

# 4 Kernel chuẩn học máy SVM
kernels = ["linear", "rbf", "poly", "sigmoid"]
metrics_results = {}
full_weights_data = {
    "models_metrics": {},
    "classes": target_names,
    "feature_names": feature_names,
    "test_size": 0.2,
    "random_state": 42,
    "stratify": True,
    "trained_at": time.strftime("%Y-%m-%d %H:%M:%S"),
    "dataset_info": {
        "total_samples": len(X),
        "train_samples": len(X_train),
        "test_samples": len(X_test),
        "features_count": X.shape[1],
        "classes_count": len(target_names)
    }
}

for kernel in kernels:
    print(f"[*] Đang huấn luyện Kernel: {kernel.upper()}...")
    
    # Cấu hình siêu tham số chuẩn hóa tối ưu cho Iris
    if kernel == "poly":
        model = SVC(kernel="poly", degree=3, C=1.0, coef0=1.0, gamma="scale")
    elif kernel == "rbf":
        model = SVC(kernel="rbf", C=1.0, gamma="scale")
    elif kernel == "sigmoid":
        model = SVC(kernel="sigmoid", C=1.0, gamma="scale", coef0=0.0)
    else: # linear
        model = SVC(kernel="linear", C=1.0)

    start_train = time.time()
    model.fit(X_train, y_train)
    train_time = (time.time() - start_train) * 1000

    start_pred = time.time()
    y_pred = model.predict(X_test)
    pred_time = (time.time() - start_pred) * 1000

    # Tính toán toàn bộ các chỉ số chất lượng học máy
    acc = float(accuracy_score(y_test, y_pred))
    prec = float(precision_score(y_test, y_pred, average="macro", zero_division=0))
    rec = float(recall_score(y_test, y_pred, average="macro", zero_division=0))
    f1 = float(f1_score(y_test, y_pred, average="macro", zero_division=0))
    cm = confusion_matrix(y_test, y_pred).tolist()
    
    n_support = model.n_support_.tolist() if hasattr(model, 'n_support_') else []
    total_sv = int(sum(n_support)) if n_support else len(getattr(model, 'support_', []))

    # 4. Lưu mô hình ra file pkl
    joblib.dump(model, f"svm_{kernel}.pkl")

    # 5. Lưu kết quả metrics
    kernel_display_names = {
        "linear": "SVM (Linear - Tuyến tính)",
        "rbf": "SVM (RBF - Phi tuyến Gaussian)",
        "poly": "SVM (Polynomial - Đa thức bậc 3)",
        "sigmoid": "SVM (Sigmoid - Hàm Hyperbolic)"
    }

    metrics_results[kernel] = {
        "name": kernel_display_names.get(kernel, f"SVM ({kernel.capitalize()})"),
        "kernel": kernel,
        "accuracy": round(acc, 4),
        "precision": round(prec, 4),
        "recall": round(rec, 4),
        "f1_score": round(f1, 4),
        "support_vectors_count": total_sv,
        "support_vectors_per_class": n_support,
        "train_time_ms": round(train_time, 2),
        "pred_time_ms": round(pred_time, 2),
        "confusion_matrix": cm
    }

    full_weights_data["models_metrics"][kernel] = {
        "name": kernel_display_names.get(kernel, f"SVM ({kernel.capitalize()})"),
        "kernel": kernel,
        "params": {
            "kernel": kernel,
            "C": 1.0,
            "gamma": "scale" if kernel in ["rbf", "poly", "sigmoid"] else None,
            "degree": 3 if kernel == "poly" else None,
            "coef0": 1.0 if kernel == "poly" else 0.0
        },
        "accuracy": round(acc, 4),
        "precision": round(prec, 4),
        "recall": round(rec, 4),
        "f1_score": round(f1, 4),
        "support_vectors_count": total_sv,
        "confusion_matrix": cm,
        "train_time_ms": round(train_time, 2),
        "pred_time_ms": round(pred_time, 2)
    }

    print(f"   ✓ Huấn luyện hoàn tất: Acc={acc*100:.2f}%, F1={f1:.4f}, SVs={total_sv}, Train={train_time:.2f}ms")

# Xuất metrics.json cho FastAPI và Client
with open("metrics.json", "w", encoding="utf-8") as f:
    json.dump(metrics_results, f, indent=4, ensure_ascii=False)

# Xuất weights.json cho toàn bộ hệ thống web platform
with open("weights.json", "w", encoding="utf-8") as f:
    json.dump(full_weights_data, f, indent=2, ensure_ascii=False)

print("\n================================================================")
print("✓ ĐÃ XUẤT THÀNH CÔNG:")
print("  - 4 models: svm_linear.pkl, svm_rbf.pkl, svm_poly.pkl, svm_sigmoid.pkl")
print("  - File metrics.json")
print("  - File weights.json")
print("================================================================")
