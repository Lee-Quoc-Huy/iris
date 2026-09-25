"""
train.py — Huấn luyện AI phân loại Iris bằng 5 kernel SVM thật sự:
1. RBF (Radial Basis Function - Phi tuyến)
2. Linear (Tuyến tính phẳng)
3. Polynomial (Đa thức bậc d)
4. Sigmoid (Hàm Hyperbolic Tangent)
5. Precomputed (Kernel ma trận Gram thực sự với SVC(kernel='precomputed'))

Đặc tả:
- Dataset: Iris với đầy đủ 4 đặc trưng (Sepal Length, Sepal Width, Petal Length, Petal Width).
- Phân chia: 80% Train (120 mẫu) / 20% Test (30 mẫu) với random_state=42 và stratify=y.
- Mỗi kernel được train và đánh giá độc lập:
  * Accuracy
  * Precision (Macro)
  * Recall (Macro)
  * F1-score (Macro)
  * Confusion Matrix (3x3)
- Tham số C, gamma, degree, coef0 được lưu rõ ràng với giá trị số cụ thể (không dùng chuỗi 'scale').
- Xuất:
  * svm_models.pkl: Dictionary chứa cả 5 mô hình SVM
  * svm_model.pkl: Mô hình Linear mặc định
  * weights.json: Thống kê chi tiết & tham số toán học của 5 kernel
"""
import os
import sys

# Thiết lập encoding UTF-8 cho console Windows
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

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
    confusion_matrix
)

# ==============================================================================
# 1. Định nghĩa PrecomputedSVCWrapper thực thụ cho kernel='precomputed'
# ==============================================================================
class PrecomputedSVCWrapper:
    """
    Wrapper mô hình SVM sử dụng kernel='precomputed' thực thụ từ scikit-learn.
    Ma trận hạt nhân tích vô hướng (Linear Gram Matrix):
        K_train = X_train @ X_train.T
        K_test  = X_test  @ X_train.T
    """
    def __init__(self, C=1.0, random_state=42):
        self.C = C
        self.random_state = random_state
        self.model = SVC(kernel='precomputed', C=C, random_state=random_state)
        self.X_train = None

    def fit(self, X, y):
        self.X_train = np.array(X, dtype=float)
        # Tính toán ma trận Kernel thực sự giữa các mẫu Train
        K_train = np.dot(self.X_train, self.X_train.T)
        self.model.fit(K_train, y)
        return self

    def predict(self, X):
        X = np.array(X, dtype=float)
        if X.ndim == 1:
            X = X.reshape(1, -1)
        # Tính Kernel giữa mẫu cần dự đoán và tập Train đã lưu
        K = np.dot(X, self.X_train.T)
        return self.model.predict(K)

    def decision_function(self, X):
        X = np.array(X, dtype=float)
        if X.ndim == 1:
            X = X.reshape(1, -1)
        K = np.dot(X, self.X_train.T)
        return self.model.decision_function(K)

    @property
    def support_vectors_(self):
        if self.X_train is not None and hasattr(self.model, 'support_'):
            return self.X_train[self.model.support_]
        return np.empty((0, 4))

    @property
    def support_(self):
        return self.model.support_


# ==============================================================================
# 2. Tải Dataset Iris và chia tập Train / Test
# ==============================================================================
print("=" * 70)
print("HUẤN LUYỆN 5 MÔ HÌNH SVM THẬT SỰ CHO TẬP DỮ LIỆU IRIS (4 ĐẶC TRƯNG)")
print("=" * 70)

iris = datasets.load_iris()
X = iris.data       # 150 mẫu x 4 đặc trưng
y = iris.target     # 3 loài: 0: setosa, 1: versicolor, 2: virginica

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

print(f"Tổng số mẫu dữ liệu : {len(X)}")
print(f"Số đặc trưng        : {X.shape[1]} ({', '.join(iris.feature_names)})")
print(f"Số mẫu tập Train    : {len(X_train)} (80%)")
print(f"Số mẫu tập Test     : {len(X_test)} (20%)")
print("-" * 70)

# Tính toán giá trị gamma cụ thể (số thực, không dùng chuỗi 'scale')
# Công thức scale của scikit-learn: 1 / (n_features * X.var())
gamma_val = round(float(1.0 / (X_train.shape[1] * X_train.var())), 6)
print(f"Giá trị Gamma tính toán cụ thể cho RBF / Poly / Sigmoid: gamma = {gamma_val}")
print("-" * 70)

# ==============================================================================
# 3. Cấu hình 5 Kernel SVM thật sự
# ==============================================================================
kernel_configs = {
    'rbf': {
        'name': 'RBF (Radial Basis - Phi tuyến)',
        'model': SVC(kernel='rbf', C=1.0, gamma=gamma_val, random_state=42),
        'params': {'kernel': 'rbf', 'C': 1.0, 'gamma': gamma_val, 'degree': None, 'coef0': 0.0}
    },
    'linear': {
        'name': 'Linear (Tuyến tính phẳng)',
        'model': SVC(kernel='linear', C=1.0, random_state=42),
        'params': {'kernel': 'linear', 'C': 1.0, 'gamma': None, 'degree': None, 'coef0': 0.0}
    },
    'poly': {
        'name': 'Polynomial (Đa thức bậc 3)',
        'model': SVC(kernel='poly', degree=3, C=1.0, gamma=gamma_val, coef0=1.0, random_state=42),
        'params': {'kernel': 'poly', 'C': 1.0, 'gamma': gamma_val, 'degree': 3, 'coef0': 1.0}
    },
    'sigmoid': {
        'name': 'Sigmoid (Hàm Hyperbolic Tangent)',
        'model': SVC(kernel='sigmoid', C=1.0, gamma=gamma_val, coef0=0.0, random_state=42),
        'params': {'kernel': 'sigmoid', 'C': 1.0, 'gamma': gamma_val, 'degree': None, 'coef0': 0.0}
    },
    'precomputed': {
        'name': 'Precomputed (Tích vô hướng ma trận Gram)',
        'model': PrecomputedSVCWrapper(C=1.0, random_state=42),
        'params': {'kernel': 'precomputed', 'C': 1.0, 'gamma': None, 'degree': None, 'coef0': 0.0}
    }
}

trained_models = {}
metrics_summary = {}

# ==============================================================================
# 4. Huấn luyện & Đánh giá từng Kernel độc lập
# ==============================================================================
for k_key, cfg in kernel_configs.items():
    print(f"\n>> Huấn luyện Kernel: {cfg['name']} [{k_key}]")
    model = cfg['model']
    
    # Train
    model.fit(X_train, y_train)
    
    # Predict trên Test 20%
    y_pred = model.predict(X_test)
    
    acc = float(accuracy_score(y_test, y_pred))
    prec = float(precision_score(y_test, y_pred, average='macro', zero_division=0))
    rec = float(recall_score(y_test, y_pred, average='macro', zero_division=0))
    f1 = float(f1_score(y_test, y_pred, average='macro', zero_division=0))
    cm = confusion_matrix(y_test, y_pred).tolist()
    
    print(f"  * Accuracy         : {acc * 100:.2f}%")
    print(f"  * Precision (Macro): {prec * 100:.2f}%")
    print(f"  * Recall (Macro)   : {rec * 100:.2f}%")
    print(f"  * F1-score (Macro) : {f1 * 100:.2f}%")
    print(f"  * Confusion Matrix : {cm}")
    
    trained_models[k_key] = model
    metrics_summary[k_key] = {
        'name': cfg['name'],
        'kernel': k_key,
        'params': cfg['params'],
        'accuracy': round(acc, 4),
        'precision': round(prec, 4),
        'recall': round(rec, 4),
        'f1_score': round(f1, 4),
        'confusion_matrix': cm
    }

print("\n" + "=" * 70)
print("BẢNG ĐỐI CHIẾU HIỆU NĂNG 5 KERNEL SVM TRÊN TẬP TEST (30 MẪU)")
print("=" * 70)
print(f"{'Kernel':<38} | {'Accuracy':>9} | {'Precision':>9} | {'Recall':>9} | {'F1-score':>9}")
print("-" * 70)
for k_key, m in metrics_summary.items():
    print(f"{m['name']:<38} | {m['accuracy']*100:>8.2f}% | {m['precision']*100:>8.2f}% | {m['recall']*100:>8.2f}% | {m['f1_score']*100:>8.2f}%")

# ==============================================================================
# 5. Lưu mô hình & thông số ra đĩa
# ==============================================================================
# Lưu dictionary chứa đủ cả 5 model SVM thật sự
joblib.dump(trained_models, "svm_models.pkl")
print("\n[OK] Đã lưu thành công 5 mô hình SVM vào 'svm_models.pkl'")

# Lưu model Linear mặc định vào 'svm_model.pkl'
joblib.dump(trained_models['linear'], "svm_model.pkl")
print("[OK] Đã lưu mô hình Linear mặc định vào 'svm_model.pkl'")

# Lưu thông số & metrics vào 'weights.json'
with open('weights.json', 'w', encoding='utf-8') as f:
    json.dump({
        'models_metrics': metrics_summary,
        'classes': iris.target_names.tolist(),
        'feature_names': iris.feature_names,
        'test_size': 0.2,
        'random_state': 42,
        'stratify': True,
        'default_kernel': 'linear'
    }, f, indent=2, ensure_ascii=False)
print("[OK] Đã lưu metrics và tham số chi tiết vào 'weights.json'")

print("\n>>> HOÀN TẤT HUẤN LUYỆN 5 KERNEL SVM THẬT SỰ THÀNH CÔNG! <<<")
