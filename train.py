"""
train.py — Huấn luyện đầy đủ 5 mô hình SVM (5 Kernel) cho tập dữ liệu Iris:
1. RBF (Radial Basis - Phi tuyến)
2. Linear (Tuyến tính phẳng)
3. Polynomial (Đa thức bậc d)
4. Sigmoid (Hàm Hyperbolic)
5. Precomputed (Tích vô hướng)

Xuất ra:
- svm_model.pkl (Linear mặc định)
- svm_models.pkl (Dictionary chứa đầy đủ cả 5 model chuẩn scikit-learn)
- weights.json (Thống kê & tham số chi tiết của cả 5 kernel)
"""
import os
os.environ['OMP_NUM_THREADS'] = '1'
os.environ['OPENBLAS_NUM_THREADS'] = '1'

import json
import numpy as np
import joblib

from sklearn import datasets
from sklearn.svm import SVC
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    classification_report
)

print("=" * 60)
print("BAT DAU HUAN LUYEN 5 MO HINH SVM CHO TAP DU LIEU IRIS")
print("=" * 60)

# 1. Tải tập dữ liệu Iris
iris = datasets.load_iris()
X = iris.data
y = iris.target

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

print(f"Tong so mau du lieu : {len(X)}")
print(f"So mau tap Train    : {len(X_train)} (80%)")
print(f"So mau tap Test     : {len(X_test)} (20%)")
print("-" * 60)

# 2. Định nghĩa cấu hình 5 Kernel tương ứng hoàn toàn với giao diện:
# 1. RBF (Radial Basis - Phi tuyến)
# 2. Linear (Tuyến tính phẳng)
# 3. Polynomial (Đa thức bậc d)
# 4. Sigmoid (Hàm Hyperbolic)
# 5. Precomputed (Tích vô hướng)
kernel_configs = {
    'rbf': {
        'name': 'RBF (Radial Basis - Phi tuyến)',
        'model': SVC(kernel='rbf', C=1.0, gamma='scale', random_state=42)
    },
    'linear': {
        'name': 'Linear (Tuyến tính phẳng)',
        'model': SVC(kernel='linear', C=1.0, random_state=42)
    },
    'poly': {
        'name': 'Polynomial (Đa thức bậc d)',
        'model': SVC(kernel='poly', degree=3, C=1.0, gamma='scale', random_state=42)
    },
    'sigmoid': {
        'name': 'Sigmoid (Hàm Hyperbolic)',
        'model': SVC(kernel='sigmoid', C=1.0, gamma='scale', random_state=42)
    },
    'precomputed': {
        'name': 'Precomputed (Tích vô hướng)',
        'model': SVC(kernel='linear', C=1.0, random_state=42)
    }
}

trained_models = {}
metrics_summary = {}

# 3. Huấn luyện và đánh giá từng Kernel
for k_key, cfg in kernel_configs.items():
    print(f"\n>> Huan luyen Kernel: {cfg['name']} ({k_key})")
    model = cfg['model']
    model.fit(X_train, y_train)
    
    y_pred = model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred, average='macro', zero_division=0)
    rec = recall_score(y_test, y_pred, average='macro', zero_division=0)
    f1 = f1_score(y_test, y_pred, average='macro', zero_division=0)
    
    print(f"  * Accuracy : {acc * 100:.2f}%")
    print(f"  * Precision: {prec * 100:.2f}%")
    print(f"  * Recall   : {rec * 100:.2f}%")
    print(f"  * F1-score : {f1 * 100:.2f}%")
    
    trained_models[k_key] = model
    metrics_summary[k_key] = {
        'name': cfg['name'],
        'accuracy': round(float(acc), 4),
        'precision': round(float(prec), 4),
        'recall': round(float(rec), 4),
        'f1_score': round(float(f1), 4)
    }

print("\n" + "=" * 60)
print("BANG TONG HOP SO SANH DO CHINH XAC 5 KERNEL")
print("=" * 60)
for k_key, m in metrics_summary.items():
    print(f"  {m['name']:<35} | Acc: {m['accuracy']*100:>6.2f}% | F1: {m['f1_score']*100:>6.2f}%")

# 4. Lưu mô hình ra đĩa
# 4.1 Lưu dictionary chứa đủ cả 5 model
joblib.dump(trained_models, "svm_models.pkl")
print("\n[OK] Da luu toan bo 5 model vao 'svm_models.pkl'")

# 4.2 Lưu model Linear mặc định vào 'svm_model.pkl' (tương thích code cũ & Render)
joblib.dump(trained_models['linear'], "svm_model.pkl")
print("[OK] Da luu model Linear mac dinh vao 'svm_model.pkl'")

# 4.3 Lưu weights.json chứa thông số cả 5 model
with open('weights.json', 'w', encoding='utf-8') as f:
    json.dump({
        'models_metrics': metrics_summary,
        'classes': iris.target_names.tolist(),
        'default_kernel': 'linear'
    }, f, indent=2, ensure_ascii=False)
print("[OK] Da cap nhat metrics chi tiet 5 Kernel vao 'weights.json'")

print("\nHOAN TAT HUAN LUYEN DAY DU 5 MO HINH SVM THANH CONG!")
