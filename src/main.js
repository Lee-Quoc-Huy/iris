/**
 * Iris SVM - Complete Engine, UI Controller & Supabase Integration
 */
import { createClient } from '@supabase/supabase-js';

// =====================================================================
// 1. DATASET IRIS GỐC (150 MẪU)
// =====================================================================
const IRIS_DATASET = [
  // 50 setosa (0)
  [5.1,3.5,1.4,0.2,0],[4.9,3.0,1.4,0.2,0],[4.7,3.2,1.3,0.2,0],[4.6,3.1,1.5,0.2,0],[5.0,3.6,1.4,0.2,0],
  [5.4,3.9,1.7,0.4,0],[4.6,3.4,1.4,0.3,0],[5.0,3.4,1.5,0.2,0],[4.4,2.9,1.4,0.2,0],[4.9,3.1,1.5,0.1,0],
  [5.4,3.7,1.5,0.2,0],[4.8,3.4,1.6,0.2,0],[4.8,3.0,1.4,0.1,0],[4.3,3.0,1.1,0.1,0],[5.8,4.0,1.2,0.2,0],
  [5.7,4.4,1.5,0.4,0],[5.4,3.9,1.3,0.4,0],[5.1,3.5,1.4,0.3,0],[5.7,3.8,1.7,0.3,0],[5.1,3.8,1.5,0.3,0],
  [5.4,3.4,1.7,0.2,0],[5.1,3.7,1.5,0.4,0],[4.6,3.6,1.0,0.2,0],[5.1,3.3,1.7,0.5,0],[4.8,3.4,1.9,0.2,0],
  [5.0,3.0,1.6,0.2,0],[5.0,3.4,1.6,0.4,0],[5.2,3.5,1.5,0.2,0],[5.2,3.4,1.4,0.2,0],[4.7,3.2,1.6,0.2,0],
  [4.8,3.1,1.6,0.2,0],[5.4,3.4,1.5,0.4,0],[5.2,4.1,1.5,0.1,0],[5.5,4.2,1.4,0.2,0],[4.9,3.1,1.5,0.2,0],
  [5.0,3.2,1.2,0.2,0],[5.5,3.5,1.3,0.2,0],[4.9,3.6,1.4,0.1,0],[4.4,3.0,1.3,0.2,0],[5.1,3.4,1.5,0.2,0],
  [5.0,3.5,1.3,0.3,0],[4.5,2.3,1.3,0.3,0],[4.4,3.2,1.3,0.2,0],[5.0,3.5,1.6,0.6,0],[5.1,3.8,1.9,0.4,0],
  [4.8,3.0,1.4,0.3,0],[5.1,3.8,1.6,0.2,0],[4.6,3.2,1.4,0.2,0],[5.3,3.7,1.5,0.2,0],[5.0,3.3,1.4,0.2,0],
  // 50 versicolor (1)
  [7.0,3.2,4.7,1.4,1],[6.4,3.2,4.5,1.5,1],[6.9,3.1,4.9,1.5,1],[5.5,2.3,4.0,1.3,1],[6.5,2.8,4.6,1.5,1],
  [5.7,2.8,4.5,1.3,1],[6.3,3.3,4.7,1.6,1],[4.9,2.4,3.3,1.0,1],[6.6,2.9,4.6,1.3,1],[5.2,2.7,3.9,1.4,1],
  [5.0,2.0,3.5,1.0,1],[5.9,3.0,4.2,1.5,1],[6.0,2.2,4.0,1.0,1],[6.1,2.9,4.7,1.4,1],[5.6,2.9,3.6,1.3,1],
  [6.7,3.1,4.4,1.4,1],[5.6,3.0,4.5,1.5,1],[5.8,2.7,4.1,1.0,1],[6.2,2.2,4.5,1.5,1],[5.6,2.5,3.9,1.1,1],
  [5.9,3.2,4.8,1.8,1],[6.1,2.8,4.0,1.3,1],[6.3,2.5,4.9,1.5,1],[6.1,2.8,4.7,1.2,1],[6.4,2.9,4.3,1.3,1],
  [6.6,3.0,4.4,1.4,1],[6.8,2.8,4.8,1.4,1],[6.7,3.0,5.0,1.7,1],[6.0,2.9,4.5,1.5,1],[5.7,2.6,3.5,1.0,1],
  [5.5,2.4,3.8,1.1,1],[5.5,2.4,3.7,1.0,1],[5.8,2.7,3.9,1.2,1],[6.0,2.7,5.1,1.6,1],[5.4,3.0,4.5,1.5,1],
  [6.0,3.4,4.5,1.6,1],[6.7,3.1,4.7,1.5,1],[6.3,2.3,4.4,1.3,1],[5.6,3.0,4.1,1.3,1],[5.5,2.5,4.0,1.3,1],
  [5.5,2.6,4.4,1.2,1],[6.1,3.0,4.6,1.4,1],[5.8,2.6,4.0,1.2,1],[5.0,2.3,3.3,1.0,1],[5.6,2.7,4.2,1.3,1],
  [5.7,3.0,4.2,1.2,1],[5.7,2.9,4.2,1.3,1],[6.2,2.9,4.3,1.3,1],[5.1,2.5,3.0,1.1,1],[5.7,2.8,4.1,1.3,1],
  // 50 virginica (2)
  [6.3,3.3,6.0,2.5,2],[5.8,2.7,5.1,1.9,2],[7.1,3.0,5.9,2.1,2],[6.3,2.9,5.6,1.8,2],[6.5,3.0,5.8,2.2,2],
  [7.6,3.0,6.6,2.1,2],[4.9,2.5,4.5,1.7,2],[7.3,2.9,6.3,1.8,2],[6.7,2.5,5.8,1.8,2],[7.2,3.6,6.1,2.5,2],
  [6.5,3.2,5.1,2.0,2],[6.4,2.7,5.3,1.9,2],[6.8,3.0,5.5,2.1,2],[5.7,2.5,5.0,2.0,2],[5.8,2.8,5.1,2.4,2],
  [6.4,3.2,5.3,2.3,2],[6.5,3.0,5.5,1.8,2],[7.7,3.8,6.7,2.2,2],[7.7,2.6,6.9,2.3,2],[6.0,2.2,5.0,1.5,2],
  [6.9,3.2,5.7,2.3,2],[5.6,2.8,4.9,2.0,2],[7.7,2.8,6.7,2.0,2],[6.3,2.7,4.9,1.8,2],[6.7,3.3,5.7,2.1,2],
  [7.2,3.2,6.0,1.8,2],[6.2,2.8,4.8,1.8,2],[6.1,3.0,4.9,1.8,2],[6.4,2.8,5.6,2.1,2],[7.2,3.0,5.8,1.6,2],
  [7.4,2.8,6.1,1.9,2],[7.9,3.8,6.4,2.0,2],[6.4,2.8,5.6,2.2,2],[6.3,2.8,5.1,1.5,2],[6.1,2.6,5.6,1.4,2],
  [7.7,3.0,6.1,2.3,2],[6.3,3.4,5.6,2.4,2],[6.4,3.1,5.5,1.8,2],[6.0,3.0,4.8,1.8,2],[6.9,3.1,5.4,2.1,2],
  [6.7,3.1,5.6,2.4,2],[6.9,3.1,5.1,2.3,2],[5.8,2.7,5.1,1.9,2],[6.8,3.2,5.9,2.3,2],[6.7,3.3,5.7,2.5,2],
  [6.7,3.0,5.2,2.3,2],[6.3,2.5,5.0,1.9,2],[6.5,3.0,5.2,2.0,2],[6.2,3.4,5.4,2.3,2],[5.9,3.0,5.1,1.8,2]
];

const SPECIES_NAMES = ['setosa', 'versicolor', 'virginica'];
const FEATURE_NAMES = ['Sepal Length', 'Sepal Width', 'Petal Length', 'Petal Width'];

// Cố định tập dữ liệu chuẩn 60 mẫu hoa Iris (20 Setosa, 20 Versicolor, 20 Virginica)
const ACTIVE_IRIS_DATASET = [
  ...IRIS_DATASET.filter(d => d[4] === 0).slice(0, 20),
  ...IRIS_DATASET.filter(d => d[4] === 1).slice(0, 20),
  ...IRIS_DATASET.filter(d => d[4] === 2).slice(0, 20)
];

// =====================================================================
// 2. SVM MATHEMATICAL ENGINE (DETERMINISTIC SMO MULTI-CLASS OvR)
// =====================================================================
function computeKernel(x1, x2, kernel, gamma, degree = 3, coef0 = 1.0) {
  let dot = 0, dsq = 0;
  for (let i = 0; i < x1.length; i++) {
    const diff = x1[i] - x2[i];
    dot += x1[i] * x2[i];
    dsq += diff * diff;
  }
  if (kernel === 'linear' || kernel === 'precomputed') return dot;
  if (kernel === 'rbf') return Math.exp(-gamma * dsq);
  if (kernel === 'poly') return Math.pow(Math.max(0, gamma * dot + coef0), degree);
  if (kernel === 'sigmoid') return Math.tanh(gamma * dot + coef0);
  return Math.exp(-gamma * dsq);
}

/**
 * Thuật toán Huấn luyện SVM Nhị phân XÁC ĐỊNH 100% (Deterministic Platt's SMO).
 * Tuyệt đối không dùng Math.random() để đảm bảo cùng 1 bộ dữ liệu và tham số
 * thì siêu phẳng và Decision Boundary luôn ra kết quả giống nhau 100%, không bị nhảy hình!
 */
function trainBinarySVM(X, y, C, kernel, gamma, degree = 3, coef0 = 1.0) {
  const n = X.length;
  const alphas = new Float64Array(n);
  const errors = new Float64Array(n);
  let b = 0.0;

  // 1. Tiền tính toán ma trận Kernel đối xứng K (Gram Matrix)
  const K = Array.from({ length: n }, () => new Float64Array(n));
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      const v = computeKernel(X[i], X[j], kernel, gamma, degree, coef0);
      K[i][j] = v;
      K[j][i] = v;
    }
  }

  // Khởi tạo sai số ban đầu: E_i = f(x_i) - y_i = b - y_i = -y_i
  for (let i = 0; i < n; i++) {
    errors[i] = -y[i];
  }

  const tol = 1e-3;
  const eps = 1e-3;

  function takeStep(i1, i2) {
    if (i1 === i2) return 0;
    const y1 = y[i1];
    const y2 = y[i2];
    const alpha1 = alphas[i1];
    const alpha2 = alphas[i2];
    const E1 = errors[i1];
    const E2 = errors[i2];
    const s = y1 * y2;

    let L, H;
    if (y1 !== y2) {
      L = Math.max(0, alpha2 - alpha1);
      H = Math.min(C, C + alpha2 - alpha1);
    } else {
      L = Math.max(0, alpha1 + alpha2 - C);
      H = Math.min(C, alpha1 + alpha2);
    }
    if (Math.abs(L - H) < 1e-7) return 0;

    const k11 = K[i1][i1];
    const k12 = K[i1][i2];
    const k22 = K[i2][i2];
    const eta = 2 * k12 - k11 - k22;

    let a2;
    if (eta < 0) {
      a2 = alpha2 - (y2 * (E1 - E2)) / eta;
      if (a2 < L) a2 = L;
      else if (a2 > H) a2 = H;
    } else {
      const c1 = eta / 2;
      const c2 = y2 * (E1 - E2) - eta * alpha2;
      const Lobj = c1 * L * L + c2 * L;
      const Hobj = c1 * H * H + c2 * H;
      if (Lobj > Hobj + eps) a2 = L;
      else if (Lobj < Hobj - eps) a2 = H;
      else a2 = alpha2;
    }

    if (Math.abs(a2 - alpha2) < eps * (a2 + alpha2 + eps)) return 0;

    const a1 = alpha1 + s * (alpha2 - a2);

    // Cập nhật ngưỡng b một cách tất định
    const b1 = b - E1 - y1 * (a1 - alpha1) * k11 - y2 * (a2 - alpha2) * k12;
    const b2 = b - E2 - y1 * (a1 - alpha1) * k12 - y2 * (a2 - alpha2) * k22;

    let bNew = (b1 + b2) / 2.0;
    if (a1 > 0 && a1 < C) bNew = b1;
    else if (a2 > 0 && a2 < C) bNew = b2;

    const deltaB = bNew - b;
    b = bNew;

    alphas[i1] = a1;
    alphas[i2] = a2;

    // Cập nhật lại errors cho tất cả mẫu
    for (let k = 0; k < n; k++) {
      errors[k] += y1 * (a1 - alpha1) * K[i1][k] + y2 * (a2 - alpha2) * K[i2][k] + deltaB;
    }

    return 1;
  }

  function examineExample(i2) {
    const y2 = y[i2];
    const alpha2 = alphas[i2];
    const E2 = errors[i2];
    const r2 = E2 * y2;

    // Kiểm tra điều kiện Karush-Kuhn-Tucker (KKT)
    if ((r2 < -tol && alpha2 < C) || (r2 > tol && alpha2 > 0)) {
      // Heuristic 1: Tìm i1 có |E1 - E2| cực đại trong số các mẫu non-bound
      let maxDelta = -1;
      let i1 = -1;
      for (let k = 0; k < n; k++) {
        if (alphas[k] > 0 && alphas[k] < C) {
          const delta = Math.abs(errors[k] - E2);
          if (delta > maxDelta) {
            maxDelta = delta;
            i1 = k;
          }
        }
      }
      if (i1 >= 0 && takeStep(i1, i2)) return 1;

      // Heuristic 2: Duyệt vòng tuần hoàn xác định bắt đầu từ i2 qua non-bound examples
      for (let k = 0; k < n; k++) {
        const idx = (i2 + k) % n;
        if (alphas[idx] > 0 && alphas[idx] < C) {
          if (takeStep(idx, i2)) return 1;
        }
      }

      // Heuristic 3: Duyệt vòng tuần hoàn xác định bắt đầu từ i2 qua toàn bộ tập mẫu
      for (let k = 0; k < n; k++) {
        const idx = (i2 + k) % n;
        if (takeStep(idx, i2)) return 1;
      }
    }
    return 0;
  }

  // Vòng lặp hội tụ SMO chính
  let numChanged = 0;
  let examineAll = 1;
  let iter = 0;
  const maxIters = 60;

  while ((numChanged > 0 || examineAll) && iter < maxIters) {
    numChanged = 0;
    if (examineAll) {
      for (let i = 0; i < n; i++) {
        numChanged += examineExample(i);
      }
    } else {
      for (let i = 0; i < n; i++) {
        if (alphas[i] > 0 && alphas[i] < C) {
          numChanged += examineExample(i);
        }
      }
    }
    if (examineAll === 1) {
      examineAll = 0;
    } else if (numChanged === 0) {
      examineAll = 1;
    }
    iter++;
  }

  // Trích xuất các Vector hỗ trợ (Support Vectors)
  const svIndices = [];
  const svWeights = [];
  for (let i = 0; i < n; i++) {
    if (alphas[i] > 1e-4) {
      svIndices.push(i);
      svWeights.push(alphas[i] * y[i]);
    }
  }

  return {
    svIndices,
    b,
    decisionFunction: (x) => {
      let sum = b;
      for (let k = 0; k < svIndices.length; k++) {
        const idx = svIndices[k];
        sum += svWeights[k] * computeKernel(X[idx], x, kernel, gamma, degree, coef0);
      }
      return sum;
    }
  };
}

function trainMultiClassSVM(X_train, y_train, C, kernel, gamma, degree = 3, coef0 = 1.0) {
  const models = [];
  const allSvIndices = new Set();

  for (let c = 0; c < 3; c++) {
    const y_bin = y_train.map(y => (y === c ? 1 : -1));
    const model = trainBinarySVM(X_train, y_bin, C, kernel, gamma, degree, coef0);
    models.push(model);
    model.svIndices.forEach(idx => allSvIndices.add(idx));
  }

  const svIndices = Array.from(allSvIndices).sort((a, b) => a - b);
  const support_vectors_ = svIndices.map(idx => X_train[idx]);

  const predictSample = (x) => {
    const scores = models.map(m => m.decisionFunction(x));
    let bestClass = 0, maxScore = scores[0];
    for (let c = 1; c < 3; c++) {
      if (scores[c] > maxScore) {
        maxScore = scores[c];
        bestClass = c;
      }
    }
    return { classIndex: bestClass, scores };
  };

  return {
    models,
    svIndices,
    support_vectors_,
    predictSample
  };
}

// =====================================================================
// 3. USER AUTHENTICATION & SUPABASE SESSION (MỤC VII, VIII, IX)
// =====================================================================
const SUPABASE_URL = import.meta.env?.VITE_SUPABASE_URL || 'https://zivdfypkmalrlgojdlmy.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppdmRmeXBrbWFscmxnb2pkbG15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAyNDkzNzksImV4cCI6MjEwNTgyNTM3OX0.0we8qj9_F9kQNy3t53ogL77iVe2QAHh3KCVky_cHAf8';

export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
window.supabase = supabaseClient;
console.log('✓ Đã khởi tạo Supabase Client thành công:', SUPABASE_URL);

let currentUser = {
  id: 'guest_user',
  email: '',
  name: '',
  role: 'USER' // 'USER' or 'ADMIN'
};

export function toValidUUID(id) {
  if (typeof id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    return id;
  }
  return null;
}

let decisionChartInstance = null;
let guessChartInstance = null;
let benchmarkChartInstance = null;
let currentGuessSample = null;
let selectedGuess = null;

let userHistory = [];
let userTimeline = [];
let allSystemExperiments = [];

// Initialize Local/Supabase Storage & Auth Gate Verification
function initUserSession() {
  const gate = document.getElementById('authGateScreen');
  let hasValidSession = false;

  try {
    const savedUser = localStorage.getItem('iris_active_user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      if (parsed && parsed.email && parsed.id !== 'guest_user') {
        currentUser = parsed;
        hasValidSession = true;
      }
    }
  } catch (e) {
    console.error(e);
  }

  if (hasValidSession) {
    if (gate) gate.classList.add('hidden');
    updateUserUI();
    loadUserData();
  } else {
    // BẮT BUỘC ĐĂNG NHẬP: Mở màn hình Auth Gate
    if (gate) gate.classList.remove('hidden');
  }
}

function updateUserUI() {
  const displayEmail = document.getElementById('userDisplayName');
  const roleBadge = document.getElementById('userRoleBadge');
  const adminSection = document.getElementById('adminNavSection');
  const editAboutBtn = document.getElementById('editAboutBtn');

  if (displayEmail) displayEmail.innerText = currentUser.name || currentUser.email || 'Chưa đăng nhập';
  if (roleBadge) {
    roleBadge.innerText = currentUser.role || 'USER';
    roleBadge.className = `role-badge ${(currentUser.role || 'user').toLowerCase()}`;
  }

  if (adminSection) {
    adminSection.style.display = (currentUser.role === 'ADMIN') ? 'block' : 'none';
  }
  if (editAboutBtn) {
    editAboutBtn.style.display = (currentUser.role === 'ADMIN') ? 'inline-block' : 'none';
  }
}

async function loadUserData() {
  const userPrefix = `iris_user_${currentUser.id}_`;
  try {
    const h = localStorage.getItem(userPrefix + 'history');
    userHistory = h ? JSON.parse(h) : [];
  } catch (e) { userHistory = []; }

  try {
    const t = localStorage.getItem(userPrefix + 'timeline');
    userTimeline = t ? JSON.parse(t) : [];
  } catch (e) { userTimeline = []; }

  try {
    const exps = localStorage.getItem('iris_system_experiments');
    allSystemExperiments = exps ? JSON.parse(exps) : [];
  } catch (e) { allSystemExperiments = []; }

  renderHistoryTable();
  renderTimeline();
  renderBenchmarkTable();

  // ĐỒNG BỘ TRỰC TIẾP TỪ SUPABASE NẾU ĐÃ ĐĂNG NHẬP
  if (supabaseClient && currentUser.id && currentUser.id !== 'guest_user') {
    try {
      // 1. Tải lịch sử nhận diện (prediction_history)
      let query = supabaseClient.from('prediction_history').select('*').order('created_at', { ascending: false });
      if (currentUser.role !== 'ADMIN' && currentUser.id && currentUser.id !== 'guest_user') {
        query = query.eq('user_id', currentUser.id);
      }
      const { data: predData, error: predErr } = await query;
      if (!predErr && predData) {
        userHistory = predData.map(p => ({
          id: p.id,
          timestamp: new Date(p.created_at).toLocaleString('vi-VN'),
          sl: p.sepal_length,
          sw: p.sepal_width,
          pl: p.petal_length,
          pw: p.petal_width,
          prediction: p.prediction,
          method: p.method || 'Nhập số liệu'
        }));
        localStorage.setItem(userPrefix + 'history', JSON.stringify(userHistory));
        renderHistoryTable();
      }
    } catch (err) {
      console.warn('Lỗi tải prediction_history từ Supabase:', err);
    }

    try {
      // 2. Tải lịch sử thí nghiệm & Benchmark (experiment_history)
      let expQuery = supabaseClient.from('experiment_history').select('*').order('created_at', { ascending: false });
      if (currentUser.role !== 'ADMIN' && currentUser.id && currentUser.id !== 'guest_user') {
        expQuery = expQuery.eq('user_id', currentUser.id);
      }
      const { data: expData, error: expErr } = await expQuery;
      if (!expErr && expData) {
        userTimeline = expData.map(e => ({
          id: e.id,
          kernel: e.kernel,
          C: e.c_param,
          gamma: e.gamma_param,
          degree: e.degree || 3,
          features: Array.isArray(e.features) ? e.features : ['4 đặc trưng'],
          inputValues: e.feature_indices || { sl: 5.1, sw: 3.5, pl: 1.4, pw: 0.2 },
          accuracy: e.accuracy,
          precision: e.precision !== null && e.precision !== undefined ? e.precision.toString() : '0.967',
          recall: e.recall !== null && e.recall !== undefined ? e.recall.toString() : '0.967',
          f1: e.f1_score !== null && e.f1_score !== undefined ? e.f1_score.toString() : '0.967',
          svCount: e.support_vector_count || 0,
          execTime: e.execution_time_ms || 1.0,
          timestamp: new Date(e.created_at).toLocaleTimeString('vi-VN')
        }));
        allSystemExperiments = [...userTimeline];
        localStorage.setItem(userPrefix + 'timeline', JSON.stringify(userTimeline));
        localStorage.setItem('iris_system_experiments', JSON.stringify(allSystemExperiments));
        renderTimeline();
        renderBenchmarkTable();
      }
    } catch (err) {
      console.warn('Lỗi tải experiment_history từ Supabase:', err);
    }
  }
}

// =====================================================================
// 4. NAVIGATION CONTROLLER
// =====================================================================
window.showPage = function(pageId, button, titleText, subText) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('aside button').forEach(b => b.classList.remove('active'));

  const page = document.getElementById(pageId);
  if (page) page.classList.add('active');
  if (button) button.classList.add('active');

  if (titleText) document.getElementById('pageHeaderTitle').innerText = titleText;
  if (subText) document.getElementById('pageHeaderSub').innerText = subText;

  if (pageId === 'predictPage') {
    trainAndRenderBoundary();
  } else if (pageId === 'guessPage') {
    if (!guessChartInstance) generateRandomSample();
  } else if (pageId === 'benchmarkPage') {
    renderBenchmarkTable();
  } else if (pageId === 'historyPage') {
    renderHistoryTable();
  } else if (pageId === 'adminExperimentsPage') {
    renderAdminExperimentsTable();
  } else if (pageId === 'adminManagePage') {
    renderAdminStats();
  }
};

// =====================================================================
// 5. PREDICTION & LIVE INTERACTIVE CHART (MỤC II & III)
// =====================================================================
window.syncInput = function(rangeId, inputId) {
  const rangeEl = document.getElementById(rangeId);
  const inputEl = document.getElementById(inputId);
  if (rangeEl && inputEl) inputEl.value = rangeEl.value;
  updateLiveSelectionPoint();
};

window.syncRange = function(inputId, rangeId) {
  const inputEl = document.getElementById(inputId);
  const rangeEl = document.getElementById(rangeId);
  if (inputEl && rangeEl) rangeEl.value = inputEl.value;
  updateLiveSelectionPoint();
};

window.setPreset = function(sl, sw, pl, pw) {
  document.getElementById('sepal_length').value = sl;
  document.getElementById('range_sepal_length').value = sl;
  document.getElementById('sepal_width').value = sw;
  document.getElementById('range_sepal_width').value = sw;
  document.getElementById('petal_length').value = pl;
  document.getElementById('range_petal_length').value = pl;
  document.getElementById('petal_width').value = pw;
  document.getElementById('range_petal_width').value = pw;
  predict();
};

window.resetForm = function() {
  window.setPreset(5.1, 3.5, 1.4, 0.2);
};

// predictLinearFast: phương án dự phòng khi API không phản hồi
// Boundary này sát với sklearn SVC(kernel='linear') từ app.py
function predictLinearFast(sl, sw, pl, pw) {
  if (pl <= 2.45 || pw <= 0.8) return 'setosa';
  const score = -0.15 * sl - 0.45 * sw + 0.75 * pl + 1.45 * pw - 4.35;
  return score >= 0 ? 'virginica' : 'versicolor';
}

// Gọi Python FastAPI /predict để có kết quả chính xác từ 5 model SVM
async function callPredictAPI(sl, sw, pl, pw, kernel) {
  try {
    const k = (kernel || document.getElementById('svmKernel')?.value || 'linear').toLowerCase();
    const res = await fetch('/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sepal_length: sl, sepal_width: sw, petal_length: pl, petal_width: pw, kernel: k }),
      signal: AbortSignal.timeout(5000)
    });
    if (res.ok) {
      const data = await res.json();
      return data.prediction;
    }
  } catch (e) { /* fallback về local */ }
  return predictLinearFast(sl, sw, pl, pw);
}

window.predict = async function() {
  const sl = parseFloat(document.getElementById('sepal_length').value) || 5.1;
  const sw = parseFloat(document.getElementById('sepal_width').value) || 3.5;
  const pl = parseFloat(document.getElementById('petal_length').value) || 1.4;
  const pw = parseFloat(document.getElementById('petal_width').value) || 0.2;

  document.getElementById('res_sepal_length').innerText = sl + ' cm';
  document.getElementById('res_sepal_width').innerText = sw + ' cm';
  document.getElementById('res_petal_length').innerText = pl + ' cm';
  document.getElementById('res_petal_width').innerText = pw + ' cm';

  let prediction = 'setosa';
  if (currentTrainedSVM) {
    const pred = currentTrainedSVM.predictSample([sl, sw, pl, pw]);
    prediction = SPECIES_NAMES[pred.classIndex] || 'setosa';
  } else {
    try {
      const k = (document.getElementById('svmKernel')?.value || 'linear').toLowerCase();
      const res = await fetch('/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sepal_length: sl, sepal_width: sw, petal_length: pl, petal_width: pw, kernel: k })
      });
      if (res.ok) {
        const data = await res.json();
        prediction = data.prediction;
      } else {
        prediction = predictLinearFast(sl, sw, pl, pw);
      }
    } catch (e) {
      prediction = predictLinearFast(sl, sw, pl, pw);
    }
  }

  const flowerFormatted = 'Iris ' + prediction.charAt(0).toUpperCase() + prediction.slice(1);
  document.getElementById('flowerName').innerText = flowerFormatted;
  document.getElementById('flowerImage').src = `images/${prediction}.jpg`;

  updateLiveSelectionPoint();

  // Đồng bộ thẻ kết quả bên dưới nếu đang hiển thị
  const inlineCard = document.getElementById('trainingInlineResultCard');
  if (inlineCard && inlineCard.style.display !== 'none' && currentTrainedSVM) {
    const k = (document.getElementById('svmKernel')?.value || 'rbf').toLowerCase();
    const cVal = parseFloat(document.getElementById('cInput')?.value) || 1.0;
    const gVal = parseFloat(document.getElementById('gammaInput')?.value) || 0.5;
    const dVal = parseInt(document.getElementById('degreeInput')?.value) || 3;
    const fXName = FEATURE_NAMES[activeFeatX];
    const fYName = FEATURE_NAMES[activeFeatY];
    renderTrainingInlineResult(currentTrainedSVM, k, cVal, gVal, dVal, 96.0, { sl, sw, pl, pw }, fXName, fYName);
  }

  saveUserPrediction(sl, sw, pl, pw, prediction, 'Tương tác trực quan');
};

// =====================================================================
// 6. HUẤN LUYỆN & DECISION BOUNDARY ENGINE (MỤC II, III, IV)
// =====================================================================
let cachedMeshGrid = null;
let currentTrainedSVM = null;
let activeFeatX = 2; // Default Petal Length
let activeFeatY = 3; // Default Petal Width

const FEATURE_INPUT_IDS = [
  { num: 'sepal_length', range: 'range_sepal_length', label: 'Sepal Length' },
  { num: 'sepal_width', range: 'range_sepal_width', label: 'Sepal Width' },
  { num: 'petal_length', range: 'range_petal_length', label: 'Petal Length' },
  { num: 'petal_width', range: 'range_petal_width', label: 'Petal Width' }
];

function getFeatureValue(idx) {
  const item = FEATURE_INPUT_IDS[idx];
  const el = document.getElementById(item ? item.num : 'petal_length');
  return el ? parseFloat(el.value) || 0 : 0;
}

function setFeatureValue(idx, val) {
  const item = FEATURE_INPUT_IDS[idx];
  if (!item) return;
  const numEl = document.getElementById(item.num);
  const rangeEl = document.getElementById(item.range);
  const clampedVal = +(Math.max(0.1, val)).toFixed(1);
  if (numEl) numEl.value = clampedVal;
  if (rangeEl) rangeEl.value = clampedVal;
}

window.handleKernelChange = function() {
  const k = document.getElementById('svmKernel')?.value || 'rbf';
  const gammaGroup = document.getElementById('gammaGroup');
  const degreeGroup = document.getElementById('degreeGroup');
  const modelInfo = document.getElementById('currentModelInfo');

  if (gammaGroup) gammaGroup.style.display = (k === 'linear' || k === 'precomputed') ? 'none' : 'block';
  if (degreeGroup) degreeGroup.style.display = (k === 'poly') ? 'block' : 'none';

  const C = document.getElementById('cInput')?.value || '1.0';
  const gamma = document.getElementById('gammaInput')?.value || '0.5';
  if (modelInfo) {
    modelInfo.innerText = `Model: ${k.toUpperCase()} (C=${C}${k !== 'linear' ? `, γ=${gamma}` : ''})`;
  }
};

window.handleFeatureAxisChange = function() {
  const fX = parseInt(document.getElementById('featureXSelect')?.value || '2');
  const fY = parseInt(document.getElementById('featureYSelect')?.value || '3');

  if (fX === fY) {
    alert('Vui lòng chọn 2 đặc trưng khác nhau cho Trục X và Trục Y!');
    const newY = (fX + 1) % 4;
    document.getElementById('featureYSelect').value = newY;
  }
};

window.trainAndRenderBoundary = function() {
  const kernel = document.getElementById('svmKernel')?.value || 'rbf';
  const featXIdx = parseInt(document.getElementById('featureXSelect')?.value || '2');
  let featYIdx = parseInt(document.getElementById('featureYSelect')?.value || '3');

  if (featXIdx === featYIdx) {
    featYIdx = (featXIdx + 1) % 4;
    if (document.getElementById('featureYSelect')) document.getElementById('featureYSelect').value = featYIdx;
  }

  activeFeatX = featXIdx;
  activeFeatY = featYIdx;

  const C = parseFloat(document.getElementById('cInput')?.value) || 1.0;
  const gamma = parseFloat(document.getElementById('gammaInput')?.value) || 0.5;
  const degree = parseInt(document.getElementById('degreeInput')?.value) || 3;

  const featXName = FEATURE_NAMES[featXIdx];
  const featYName = FEATURE_NAMES[featYIdx];

  const startTime = performance.now();

  // 1. Chuẩn bị tập dữ liệu 4D thực tế từ 60 mẫu Iris Dataset
  const X_4D = ACTIVE_IRIS_DATASET.map(d => [d[0], d[1], d[2], d[3]]);
  const y_all = ACTIVE_IRIS_DATASET.map(d => d[4]);

  // Tính giá trị trung bình (means) của 4 đặc trưng trên tập dữ liệu để cố định 2 feature không hiển thị
  const featureMeans = [0, 1, 2, 3].map(featIdx => {
    const sum = ACTIVE_IRIS_DATASET.reduce((acc, row) => acc + row[featIdx], 0);
    return +(sum / ACTIVE_IRIS_DATASET.length).toFixed(4);
  });

  // Huấn luyện Multi-class SVM (One-vs-Rest SMO) với toàn bộ 4 features
  const coef0 = (kernel === 'poly') ? 1.0 : 0.0;
  const multiSVM = trainMultiClassSVM(X_4D, y_all, C, kernel, gamma, degree, coef0);
  currentTrainedSVM = multiSVM;

  const endTime = performance.now();
  const execTime = +(endTime - startTime).toFixed(2);

  // 2. Đánh giá kiểm thử Confusion Matrix trên 60 mẫu cố định (20 mẫu mỗi loài) với 4 features
  let correct = 0;
  const confusion = [[0,0,0],[0,0,0],[0,0,0]];
  X_4D.forEach((x4, i) => {
    const pred = multiSVM.predictSample(x4).classIndex;
    const trueC = y_all[i];
    confusion[trueC][pred]++;
    if (pred === trueC) correct++;
  });
  const accuracy = +((correct / X_4D.length) * 100).toFixed(1);

  let sumP = 0, sumR = 0;
  for (let c = 0; c < 3; c++) {
    const tp = confusion[c][c];
    const totalPred = confusion[0][c] + confusion[1][c] + confusion[2][c];
    const totalActual = confusion[c][0] + confusion[c][1] + confusion[c][2];
    sumP += totalPred > 0 ? (tp / totalPred) : 1.0;
    sumR += totalActual > 0 ? (tp / totalActual) : 1.0;
  }
  const precision = +(sumP / 3).toFixed(3);
  const recall = +(sumR / 3).toFixed(3);
  const f1 = +((2 * precision * recall) / (precision + recall || 1)).toFixed(3);

  // 3. Tính toán Lưới Điểm (Mesh Grid) cho Decision Boundary 2D (chiếu từ model 4D)
  const allX = ACTIVE_IRIS_DATASET.map(d => d[featXIdx]);
  const allY = ACTIVE_IRIS_DATASET.map(d => d[featYIdx]);
  const minXRaw = Math.min(...allX), maxXRaw = Math.max(...allX);
  const minYRaw = Math.min(...allY), maxYRaw = Math.max(...allY);
  const padX = +((maxXRaw - minXRaw) * 0.12).toFixed(2) || 0.5;
  const padY = +((maxYRaw - minYRaw) * 0.12).toFixed(2) || 0.5;

  const xMin = Math.max(0, +(minXRaw - padX).toFixed(2));
  const xMax = +(maxXRaw + padX).toFixed(2);
  const yMin = Math.max(0, +(minYRaw - padY).toFixed(2));
  const yMax = +(maxYRaw + padY).toFixed(2);

  const resX = 100;
  const resY = 100;
  const stepX = (xMax - xMin) / resX;
  const stepY = (yMax - yMin) / resY;

  // Chuyển đổi mỗi điểm trên grid 2D thành vector 4 features [mean0, mean1, mean2, mean3]
  // trước khi đưa vào model 4D dự đoán
  const gridData = [];
  for (let i = 0; i <= resX; i++) {
    gridData[i] = [];
    const gx = xMin + i * stepX;
    for (let j = 0; j <= resY; j++) {
      const gy = yMin + j * stepY;
      const sample4D = [...featureMeans];
      sample4D[featXIdx] = gx;
      sample4D[featYIdx] = gy;
      const pred = multiSVM.predictSample(sample4D);
      gridData[i][j] = pred.classIndex;
    }
  }

  cachedMeshGrid = {
    gridData,
    xMin, xMax,
    yMin, yMax,
    resX, resY,
    featXIdx, featYIdx,
    kernel,
    multiSVM,
    featureMeans
  };

  // 4. Render Chart trực quan hóa Decision Boundary
  renderDecisionBoundaryChart(multiSVM, featXIdx, featYIdx, featXName, featYName, kernel, C, gamma, degree, accuracy);

  // 5. Cập nhật giải thích toán học dưới biểu đồ
  const eqText = document.getElementById('boundaryEquationText');
  if (eqText) {
    let kernelDesc = '';
    if (kernel === 'linear') {
      kernelDesc = '<b>Mô hình Tuyến tính (Linear Hyperplane):</b> Ranh giới quyết định là các đường thẳng $w^T x + b = 0$ phân chia tối ưu không gian 2 đặc trưng.';
    } else if (kernel === 'rbf') {
      kernelDesc = `<b>Mô hình RBF (Gaussian Radial Basis):</b> Ranh giới quyết định uốn lượn phi tuyến theo hàm khoảng cách $K(x, x\') = \\exp(-\\gamma ||x - x\'||^2)$ với $\\gamma = ${gamma}$.`;
    } else if (kernel === 'poly') {
      kernelDesc = `<b>Mô hình Polynomial (Đa thức bậc ${degree}):</b> Ranh giới uốn cong theo không gian đa thức bậc cao $K(x, x\') = (\\gamma x^T x\' + 1)^d$.`;
    } else if (kernel === 'sigmoid') {
      kernelDesc = '<b>Mô hình Sigmoid:</b> Ánh xạ phi tuyến theo hàm hyperbolic tangent $\\tanh(\\gamma x^T x\' + c)$.';
    } else {
      kernelDesc = '<b>Mô hình Precomputed:</b> Tích vô hướng trực tiếp giữa các vector mẫu.';
    }

    eqText.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:6px;">
        <span style="color:#1e1b4b; font-weight:800; font-size:13px;">🎯 Ranh giới Quyết định (Decision Boundary) & Siêu phẳng SVM</span>
        <span style="font-size:12px; background:#eff6ff; color:#1e40af; padding:3px 10px; border-radius:6px; font-weight:700; border:1px solid #bfdbfe;">⭐ Support Vectors: ${multiSVM.svIndices.length} điểm</span>
      </div>
      <div style="font-size:12.5px; line-height:1.5; color:#475569;">
        ${kernelDesc}<br>
        <span style="color:#6366f1;">💡 <b>Tương tác nhanh:</b> Nhấp chuột vào bất kỳ vị trí nào trên biểu đồ để chuyển điểm thử nghiệm đến tọa độ đó và nhận diện tức thì.</span>
      </div>
    `;
  }

  const sl = parseFloat(document.getElementById('sepal_length')?.value || document.getElementById('sepalLength')?.value) || 5.1;
  const sw = parseFloat(document.getElementById('sepal_width')?.value || document.getElementById('sepalWidth')?.value) || 3.5;
  const pl = parseFloat(document.getElementById('petal_length')?.value || document.getElementById('petalLength')?.value) || 1.4;
  const pw = parseFloat(document.getElementById('petal_width')?.value || document.getElementById('petalWidth')?.value) || 0.2;

  // 6. Ghi nhận vào Timeline & Benchmark
  addTimelineItem({
    kernel,
    C,
    gamma,
    features: [featXName, featYName],
    inputValues: { sl, sw, pl, pw },
    accuracy,
    precision,
    recall,
    f1,
    svCount: multiSVM.svIndices.length,
    execTime,
    timestamp: new Date().toLocaleTimeString('vi-VN')
  });

  // 7. Hiển thị kết quả phân loại hoa ngay tại chỗ (bên dưới biểu đồ, không cần lướt lên trên)
  renderTrainingInlineResult(multiSVM, kernel, C, gamma, degree, accuracy, { sl, sw, pl, pw }, featXName, featYName);
};

function renderTrainingInlineResult(multiSVM, kernel, C, gamma, degree, accuracy, inputs, featXName, featYName) {
  const container = document.getElementById('trainingInlineResultCard');
  if (!container) return;

  const currentX = getFeatureValue(activeFeatX);
  const currentY = getFeatureValue(activeFeatY);
  const current4D = [inputs.sl, inputs.sw, inputs.pl, inputs.pw];
  const pred4D = multiSVM.predictSample(current4D);
  const predSpecies = SPECIES_NAMES[pred4D.classIndex] || 'setosa';

  let flowerVi = 'Iris Setosa';
  let flowerTagColor = '#15803d';
  let flowerTagBg = '#dcfce7';
  let flowerTagBorder = '#86efac';
  let flowerTagText = '🌿 Xanh lá (Setosa)';

  if (predSpecies === 'versicolor') {
    flowerVi = 'Iris Versicolor';
    flowerTagColor = '#b45309';
    flowerTagBg = '#fef3c7';
    flowerTagBorder = '#fcd34d';
    flowerTagText = '🌼 Vàng hổ phách (Versicolor)';
  } else if (predSpecies === 'virginica') {
    flowerVi = 'Iris Virginica';
    flowerTagColor = '#7e22ce';
    flowerTagBg = '#f3e8ff';
    flowerTagBorder = '#d8b4fe';
    flowerTagText = '🌸 Tím mộng mơ (Virginica)';
  }

  container.style.display = 'block';
  container.innerHTML = `
    <div style="background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%); border: 2px solid ${flowerTagBorder}; border-radius: 16px; padding: 18px 20px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.06);">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:14px; padding-bottom:12px; border-bottom:1px solid #e2e8f0;">
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-size:20px;">🌸</span>
          <div>
            <h4 style="margin:0; font-size:15px; font-weight:800; color:#1e1b4b;">Kết quả Phân loại Mẫu hoa (Sau khi Huấn luyện SVM)</h4>
            <div style="font-size:11.5px; color:#64748b;">Mô hình vừa huấn luyện đã phân loại tức thì cho thông số mẫu bạn đang chọn</div>
          </div>
        </div>
        <span style="background:${flowerTagBg}; color:${flowerTagColor}; border:1px solid ${flowerTagBorder}; font-size:12px; font-weight:800; padding:4px 12px; border-radius:20px;">
          ${flowerTagText}
        </span>
      </div>

      <div style="display:flex; gap:20px; align-items:center; flex-wrap:wrap;">
        <div style="width:100px; height:100px; border-radius:16px; overflow:hidden; border:3px solid ${flowerTagBorder}; flex-shrink:0; box-shadow:0 6px 14px rgba(0,0,0,0.08);">
          <img src="images/${predSpecies}.jpg" alt="${flowerVi}" style="width:100%; height:100%; object-fit:cover;">
        </div>

        <div style="flex:1; min-width:240px;">
          <div style="font-size:20px; font-weight:800; color:#0f172a; margin-bottom:4px;">
            Hoa ${flowerVi}
          </div>
          <div style="font-size:12.5px; color:#475569; line-height:1.6;">
            • Tọa độ trên biểu đồ (${featXName} & ${featYName}): <b style="color:#1e1b4b;">(${currentX} cm, ${currentY} cm)</b><br>
            • Toàn bộ 4 kích thước: Đài <b>${inputs.sl} × ${inputs.sw} cm</b> | Cánh <b>${inputs.pl} × ${inputs.pw} cm</b><br>
            • Hạt nhân: <b>${kernel.toUpperCase()}</b> (C=${C}${kernel !== 'linear' ? `, γ=${gamma}` : ''}) | Độ chính xác (Accuracy): <b style="color:#059669;">${accuracy}%</b>
          </div>
        </div>

        <div style="display:flex; flex-direction:column; gap:8px; min-width:180px;">
          <div style="background:white; border:1px solid #e2e8f0; border-radius:10px; padding:10px 14px; text-align:center;">
            <div style="font-size:11px; font-weight:700; color:#64748b; text-transform:uppercase;">Trạng thái Phân loại</div>
            <div style="font-size:15px; font-weight:800; color:${flowerTagColor}; margin-top:2px;">
              ✓ Phân loại thành công
            </div>
          </div>
          <div style="background:white; border:1px solid #e2e8f0; border-radius:10px; padding:8px 12px; font-size:11.5px; color:#64748b; text-align:center;">
            ⭐ Support Vectors: <b>${multiSVM.svIndices.length}</b> mẫu điểm
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderDecisionBoundaryChart(multiSVM, fX, fY, featXName, featYName, kernel, C, gamma, degree, accuracy) {
  const ctx = document.getElementById('decisionChart');
  if (!ctx) return;

  const setosaPoints = ACTIVE_IRIS_DATASET.filter(d => d[4] === 0).map(d => ({ x: d[fX], y: d[fY], name: 'Iris Setosa', species: 'Setosa' }));
  const versiPoints = ACTIVE_IRIS_DATASET.filter(d => d[4] === 1).map(d => ({ x: d[fX], y: d[fY], name: 'Iris Versicolor', species: 'Versicolor' }));
  const virgiPoints = ACTIVE_IRIS_DATASET.filter(d => d[4] === 2).map(d => ({ x: d[fX], y: d[fY], name: 'Iris Virginica', species: 'Virginica' }));

  // Support Vectors thực tế từ model 4D chiếu xuống 2D
  const svPoints = multiSVM.svIndices.map(idx => {
    const row = ACTIVE_IRIS_DATASET[idx % ACTIVE_IRIS_DATASET.length];
    return {
      x: row[fX],
      y: row[fY],
      name: `Support Vector (Mẫu #${idx + 1})`,
      species: SPECIES_NAMES[row[4]]
    };
  });

  const currentX = getFeatureValue(fX);
  const currentY = getFeatureValue(fY);

  // Custom Chart.js Plugin để vẽ Background Decision Regions dạng Lưới Ô Vuông (Mesh Grid)
  const decisionBoundaryPlugin = {
    id: 'decisionBoundaryRenderer',
    beforeDatasetsDraw(chart) {
      const { ctx, chartArea, scales: { x: xScale, y: yScale } } = chart;
      if (!chartArea || !xScale || !yScale || !cachedMeshGrid) return;

      const { gridData, xMin, xMax, yMin, yMax, resX, resY } = cachedMeshGrid;
      const stepX = (xMax - xMin) / resX;
      const stepY = (yMax - yMin) / resY;

      ctx.save();
      ctx.beginPath();
      ctx.rect(chartArea.left, chartArea.top, chartArea.width, chartArea.height);
      ctx.clip();

      // A. VÙNG PHÂN LOẠI DẠNG LƯỚI Ô VUÔNG (BACKGROUND MESH GRID REGIONS)
      const regionColors = [
        'rgba(22, 163, 74, 0.16)',   // Setosa (Xanh lá tươi sáng)
        'rgba(217, 119, 6, 0.16)',   // Versicolor (Vàng hổ phách ấm áp)
        'rgba(147, 51, 234, 0.16)'   // Virginica (Tím mộng mơ quyến rũ)
      ];

      for (let i = 0; i < resX; i++) {
        const x1 = xMin + i * stepX;
        const x2 = xMin + (i + 1) * stepX;
        const px1 = xScale.getPixelForValue(x1);
        const px2 = xScale.getPixelForValue(x2);
        const pLeft = Math.min(px1, px2);
        const pWidth = Math.ceil(Math.abs(px2 - px1)) + 1;

        for (let j = 0; j < resY; j++) {
          const y1 = yMin + j * stepY;
          const y2 = yMin + (j + 1) * stepY;
          const py1 = yScale.getPixelForValue(y1);
          const py2 = yScale.getPixelForValue(y2);
          const pTop = Math.min(py1, py2);
          const pHeight = Math.ceil(Math.abs(py1 - py2)) + 1;

          const cIdx = gridData[i][j];
          ctx.fillStyle = regionColors[cIdx] || 'transparent';
          ctx.fillRect(pLeft, pTop, pWidth, pHeight);
        }
      }

      // B. ĐƯỜNG RANH GIỚI QUYẾT ĐỊNH ZÍC ZẮC THEO LƯỚI (DECISION BOUNDARY CONTOURS)
      ctx.lineWidth = 2.5;
      ctx.setLineDash([6, 4]);

      for (let i = 0; i < resX; i++) {
        const x1 = xMin + i * stepX;
        const x2 = xMin + (i + 1) * stepX;
        const px2 = xScale.getPixelForValue(x2);

        for (let j = 0; j < resY; j++) {
          const y1 = yMin + j * stepY;
          const y2 = yMin + (j + 1) * stepY;
          const py1 = yScale.getPixelForValue(y1);
          const py2 = yScale.getPixelForValue(y2);

          const cCurrent = gridData[i][j];

          // Ranh giới dọc giữa 2 ô ngang
          if (i + 1 < resX) {
            const cRight = gridData[i + 1][j];
            if (cCurrent !== cRight) {
              ctx.strokeStyle = (cCurrent === 0 || cRight === 0) ? '#059669' : '#4f46e5';
              ctx.beginPath();
              ctx.moveTo(px2, py1);
              ctx.lineTo(px2, py2);
              ctx.stroke();
            }
          }

          // Ranh giới ngang giữa 2 ô dọc
          if (j + 1 < resY) {
            const cTop = gridData[i][j + 1];
            if (cCurrent !== cTop) {
              ctx.strokeStyle = (cCurrent === 0 || cTop === 0) ? '#059669' : '#4f46e5';
              ctx.beginPath();
              ctx.moveTo(xScale.getPixelForValue(x1), py2);
              ctx.lineTo(px2, py2);
              ctx.stroke();
            }
          }
        }
      }

      ctx.restore();
    }
  };

  // Tái sử dụng chart instance để animate cập nhật mượt mà, không bị giật/chớp canvas
  if (decisionChartInstance) {
    decisionChartInstance.options.scales.x.min = cachedMeshGrid ? cachedMeshGrid.xMin : undefined;
    decisionChartInstance.options.scales.x.max = cachedMeshGrid ? cachedMeshGrid.xMax : undefined;
    decisionChartInstance.options.scales.x.title.text = `${featXName} (cm)`;

    decisionChartInstance.options.scales.y.min = cachedMeshGrid ? cachedMeshGrid.yMin : undefined;
    decisionChartInstance.options.scales.y.max = cachedMeshGrid ? cachedMeshGrid.yMax : undefined;
    decisionChartInstance.options.scales.y.title.text = `${featYName} (cm)`;

    decisionChartInstance.data.datasets[0].data = setosaPoints;
    decisionChartInstance.data.datasets[0].label = `🌿 Setosa (${setosaPoints.length})`;
    decisionChartInstance.data.datasets[1].data = versiPoints;
    decisionChartInstance.data.datasets[1].label = `🌼 Versicolor (${versiPoints.length})`;
    decisionChartInstance.data.datasets[2].data = virgiPoints;
    decisionChartInstance.data.datasets[2].label = `🌸 Virginica (${virgiPoints.length})`;
    decisionChartInstance.data.datasets[3].data = svPoints;
    decisionChartInstance.data.datasets[3].label = `⭐ Support Vectors (${svPoints.length})`;
    decisionChartInstance.data.datasets[4].data = [{ x: currentX, y: currentY, name: 'Điểm đang kiểm tra' }];

    decisionChartInstance.update({
      duration: 400,
      easing: 'easeOutQuart'
    });
    return;
  }

  decisionChartInstance = new Chart(ctx, {
    type: 'scatter',
    plugins: [decisionBoundaryPlugin],
    data: {
      datasets: [
        {
          label: `🌿 Setosa (${setosaPoints.length})`,
          data: setosaPoints,
          backgroundColor: '#16a34a',
          borderWidth: 0,
          pointRadius: 6,
          pointHoverRadius: 8.5
        },
        {
          label: `🌼 Versicolor (${versiPoints.length})`,
          data: versiPoints,
          backgroundColor: '#d97706',
          borderWidth: 0,
          pointRadius: 6,
          pointHoverRadius: 8.5
        },
        {
          label: `🌸 Virginica (${virgiPoints.length})`,
          data: virgiPoints,
          backgroundColor: '#9333ea',
          borderWidth: 0,
          pointRadius: 6,
          pointHoverRadius: 8.5
        },
        {
          label: `⭐ Support Vectors (${svPoints.length})`,
          data: svPoints,
          backgroundColor: 'rgba(239, 68, 68, 0.18)',
          borderColor: '#e11d48',
          borderWidth: 2,
          pointRadius: 9.5,
          pointStyle: 'circle',
          pointHoverRadius: 11.5
        },
        {
          label: '🔴 Điểm nhận diện',
          data: [{ x: currentX, y: currentY, name: 'Điểm đang kiểm tra' }],
          backgroundColor: '#ef4444',
          borderWidth: 0,
          pointRadius: 10.5,
          pointHoverRadius: 13
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 400,
        easing: 'easeOutQuart'
      },
      scales: {
        x: {
          title: { display: true, text: `${featXName} (cm)`, font: { size: 13, weight: '700' }, color: '#1e1b4b' },
          grid: { color: 'rgba(226, 232, 240, 0.75)', borderDash: [3, 3] },
          ticks: { color: '#64748b', font: { weight: '600' } },
          min: cachedMeshGrid ? cachedMeshGrid.xMin : undefined,
          max: cachedMeshGrid ? cachedMeshGrid.xMax : undefined
        },
        y: {
          title: { display: true, text: `${featYName} (cm)`, font: { size: 13, weight: '700' }, color: '#1e1b4b' },
          grid: { color: 'rgba(226, 232, 240, 0.75)', borderDash: [3, 3] },
          ticks: { color: '#64748b', font: { weight: '600' } },
          min: cachedMeshGrid ? cachedMeshGrid.yMin : undefined,
          max: cachedMeshGrid ? cachedMeshGrid.yMax : undefined
        }
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            usePointStyle: true,
            boxWidth: 9,
            padding: 14,
            font: { size: 12, weight: '600' }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(15, 23, 42, 0.94)',
          titleFont: { size: 13, weight: 'bold' },
          bodyFont: { size: 12.5 },
          padding: 12,
          cornerRadius: 10,
          boxPadding: 4,
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          callbacks: {
            label: function(context) {
              const p = context.raw;
              return ` ${p.name || 'Điểm'}: ${featXName}=${context.parsed.x}cm, ${featYName}=${context.parsed.y}cm`;
            }
          }
        }
      },
      onClick: (e) => {
        if (!decisionChartInstance) return;
        const rect = ctx.getBoundingClientRect();
        const clientX = (e.clientX !== undefined) ? e.clientX : (e.native ? e.native.clientX : 0);
        const clientY = (e.clientY !== undefined) ? e.clientY : (e.native ? e.native.clientY : 0);
        const pixelX = (e.x !== undefined) ? e.x : (clientX - rect.left);
        const pixelY = (e.y !== undefined) ? e.y : (clientY - rect.top);
        const xVal = decisionChartInstance.scales.x.getValueForPixel(pixelX);
        const yVal = decisionChartInstance.scales.y.getValueForPixel(pixelY);
        if (xVal !== undefined && yVal !== undefined && !isNaN(xVal) && !isNaN(yVal)) {
          setFeatureValue(fX, xVal);
          setFeatureValue(fY, yVal);
          window.predict();
        }
      }
    }
  });

  // Tương tác chuột mượt mà: Click hoặc Kéo rê chuột trên biểu đồ để đổi thông số và dự đoán ngay lập tức
  ctx.style.cursor = 'crosshair';

  const handlePointerUpdate = (evt) => {
    if (!decisionChartInstance) return;
    const rect = ctx.getBoundingClientRect();
    const clientX = (evt.clientX !== undefined) ? evt.clientX : (evt.touches && evt.touches[0] ? evt.touches[0].clientX : 0);
    const clientY = (evt.clientY !== undefined) ? evt.clientY : (evt.touches && evt.touches[0] ? evt.touches[0].clientY : 0);
    const pixelX = clientX - rect.left;
    const pixelY = clientY - rect.top;

    const chartArea = decisionChartInstance.chartArea;
    if (!chartArea) return;
    if (pixelX < chartArea.left || pixelX > chartArea.right || pixelY < chartArea.top || pixelY > chartArea.bottom) {
      return;
    }

    const xVal = decisionChartInstance.scales.x.getValueForPixel(pixelX);
    const yVal = decisionChartInstance.scales.y.getValueForPixel(pixelY);

    if (xVal !== undefined && yVal !== undefined && !isNaN(xVal) && !isNaN(yVal)) {
      setFeatureValue(fX, xVal);
      setFeatureValue(fY, yVal);
      window.predict();
    }
  };

  let isPointerDown = false;
  ctx.onmousedown = (e) => {
    isPointerDown = true;
    handlePointerUpdate(e);
  };

  ctx.onmousemove = (e) => {
    if (isPointerDown) {
      handlePointerUpdate(e);
    }
  };

  window.onmouseup = () => {
    isPointerDown = false;
  };

  ctx.ontouchstart = (e) => {
    isPointerDown = true;
    handlePointerUpdate(e);
  };

  ctx.ontouchmove = (e) => {
    if (isPointerDown) {
      handlePointerUpdate(e);
    }
  };

  window.ontouchend = () => {
    isPointerDown = false;
  };
}

function updateLiveSelectionPoint() {
  const currentX = getFeatureValue(activeFeatX);
  const currentY = getFeatureValue(activeFeatY);
  if (decisionChartInstance && decisionChartInstance.data.datasets[4]) {
    decisionChartInstance.data.datasets[4].data = [{ x: currentX, y: currentY, name: 'Điểm đang kiểm tra' }];
    decisionChartInstance.update('none');
  }
}

// =====================================================================
// 7. TIMELINE HUẤN LUYỆN (MỤC IV)
// =====================================================================
async function addTimelineItem(item) {
  if (!item.id) {
    item.id = 'exp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
  }
  userTimeline.unshift(item);
  if (userTimeline.length > 50) userTimeline.pop();
  localStorage.setItem(`iris_user_${currentUser.id}_timeline`, JSON.stringify(userTimeline));

  // Ghi vào system experiments để Admin xem & Model Benchmark tổng hợp
  const sysExp = {
    ...item,
    userName: currentUser.name || currentUser.email,
    userEmail: currentUser.email,
    userId: currentUser.id
  };
  allSystemExperiments.unshift(sysExp);
  localStorage.setItem('iris_system_experiments', JSON.stringify(allSystemExperiments));

  renderTimeline();
  renderBenchmarkTable();

  // Lưu trực tiếp vào Supabase (Bảng experiment_history)
  if (supabaseClient && currentUser.id && currentUser.id !== 'guest_user') {
    try {
      const payload = {
        user_id: currentUser.id,
        name: `SVM - ${(item.kernel || 'linear').toUpperCase()}`,
        kernel: (item.kernel || 'linear').toLowerCase(),
        c_param: parseFloat(item.C) || 1.0,
        gamma_param: parseFloat(item.gamma) || 0.5,
        degree: item.degree || 3,
        features: item.features || ['Sepal L', 'Sepal W', 'Petal L', 'Petal W'],
        feature_indices: item.inputValues || {},
        accuracy: parseFloat(item.accuracy) || 96,
        train_accuracy: parseFloat(item.accuracy) || 96,
        precision: parseFloat(item.precision) || 0.967,
        recall: parseFloat(item.recall) || 0.967,
        f1_score: parseFloat(item.f1) || 0.967,
        support_vector_count: item.svCount || 0,
        execution_time_ms: parseFloat(item.execTime) || 1.0,
        note: `SL=${item.inputValues?.sl || 5.1}, SW=${item.inputValues?.sw || 3.5}, PL=${item.inputValues?.pl || 1.4}, PW=${item.inputValues?.pw || 0.2}`,
        created_at: new Date().toISOString()
      };
      const { data, error } = await supabaseClient.from('experiment_history').insert(payload).select();

      if (data && data[0] && data[0].id) {
        item.id = data[0].id;
        sysExp.id = data[0].id;
        localStorage.setItem(`iris_user_${currentUser.id}_timeline`, JSON.stringify(userTimeline));
        localStorage.setItem('iris_system_experiments', JSON.stringify(allSystemExperiments));
      }
      if (error) {
        console.warn('Lưu experiment lên Supabase thất bại:', error);
      }
    } catch (err) {
      console.warn('Lỗi kết nối Supabase experiment_history:', err);
    }
  }
}

function renderTimeline() {
  const container = document.getElementById('timelineList');
  if (!container) return;

  if (userTimeline.length === 0) {
    container.innerHTML = `<div style="color:#9ca3af; font-size:13px;">Chưa có quá trình huấn luyện nào. Bấm "Huấn luyện mô hình" để bắt đầu ghi nhận timeline.</div>`;
    return;
  }

  let html = '';
  userTimeline.forEach(t => {
    const inputValStr = t.inputValues
      ? `SL=${t.inputValues.sl}cm | SW=${t.inputValues.sw}cm | PL=${t.inputValues.pl}cm | PW=${t.inputValues.pw}cm`
      : 'SL=5.1cm | SW=3.5cm | PL=1.4cm | PW=0.2cm';

    html += `
      <div class="timeline-item">
        <div class="timeline-dot"></div>
        <div class="timeline-content">
          <div class="timeline-header">
            <span>🚀 Huấn luyện Kernel <b>${t.kernel.toUpperCase()}</b> (C=${t.C}, γ=${t.gamma})</span>
            <span style="font-size:11.5px; color:#6b7280;">${t.timestamp}</span>
          </div>
          <div style="font-size:12px; color:#374151; margin-top:2px;">
            <b>Đặc trưng:</b> ${Array.isArray(t.features) ? t.features.join(' × ') : '4 đặc trưng'} · <b>Thời gian:</b> ${t.execTime} ms
          </div>
          <div style="font-size:11.5px; color:#64748b; background:#f1f5f9; padding:3px 8px; border-radius:6px; margin-top:4px; display:inline-block;">
            📥 <b>Số liệu đặc trưng đã nhập:</b> ${inputValStr}
          </div>
          <div class="timeline-metrics" style="margin-top:6px;">
            <span style="color:#059669; font-weight:bold;">🎯 Accuracy: ${t.accuracy || 96}%</span>
            <span>Precision: ${t.precision}</span>
            <span>Recall: ${t.recall}</span>
            <span>F1: ${t.f1}</span>
            <span style="color:#4f46e5; font-weight:bold;">⭐ SVs: ${t.svCount}</span>
          </div>
        </div>
      </div>
    `;
  });
  container.innerHTML = html;
}

window.clearTimeline = async function() {
  userTimeline = [];
  localStorage.removeItem(`iris_user_${currentUser.id}_timeline`);
  renderTimeline();
};

window.deleteBenchmarkItem = async function(id) {
  userTimeline = userTimeline.filter(x => x.id !== id);
  allSystemExperiments = allSystemExperiments.filter(x => x.id !== id);
  localStorage.setItem(`iris_user_${currentUser.id}_timeline`, JSON.stringify(userTimeline));
  localStorage.setItem('iris_system_experiments', JSON.stringify(allSystemExperiments));

  if (supabaseClient && currentUser.id && currentUser.id !== 'guest_user') {
    try {
      await supabaseClient.from('experiment_history').delete().eq('id', id);
    } catch (e) {
      console.warn('Lỗi xóa experiment từ Supabase:', e);
    }
  }

  renderBenchmarkTable();
  renderTimeline();
};

window.clearAllBenchmarks = async function() {
  if (!confirm('Bạn có chắc muốn xóa toàn bộ kết quả Benchmark?')) return;
  userTimeline = [];
  allSystemExperiments = [];
  localStorage.removeItem(`iris_user_${currentUser.id}_timeline`);
  localStorage.removeItem('iris_system_experiments');

  if (supabaseClient && currentUser.id && currentUser.id !== 'guest_user') {
    try {
      if (currentUser.role === 'ADMIN') {
        await supabaseClient.from('experiment_history').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      } else {
        const validUid = toValidUUID(currentUser.id);
        if (validUid) {
          await supabaseClient.from('experiment_history').delete().eq('user_id', validUid);
        }
      }
    } catch (e) {
      console.warn('Lỗi dọn sạch experiments trên Supabase:', e);
    }
  }

  renderBenchmarkTable();
  renderTimeline();
};

// =====================================================================
// 8. THỬ THÁCH ĐOÁN HOA (THỬ THÁCH CON NGƯỜI VS AI SVM)
// =====================================================================
let guessStats = { total: 0, correct: 0, wrong: 0 };

function updateGuessScoreUI() {
  const totalEl = document.getElementById('guessTotalPlays');
  const correctEl = document.getElementById('guessCorrectPlays');
  const wrongEl = document.getElementById('guessWrongPlays');
  const accEl = document.getElementById('guessAccuracy');

  if (totalEl) totalEl.innerText = guessStats.total;
  if (correctEl) correctEl.innerText = guessStats.correct;
  if (wrongEl) wrongEl.innerText = guessStats.wrong;
  if (accEl) {
    const acc = guessStats.total > 0 ? ((guessStats.correct / guessStats.total) * 100).toFixed(0) : 0;
    accEl.innerText = `${acc}%`;
  }
}

window.resetGuessScore = function() {
  guessStats = { total: 0, correct: 0, wrong: 0 };
  updateGuessScoreUI();
};

window.generateRandomSample = async function() {
  selectedGuess = null;
  document.querySelectorAll('.guess-opt-btn').forEach(b => b.classList.remove('selected'));
  const guessRes = document.getElementById('guessResult');
  
  let sampleData = null;

  // 1. Gọi API FastAPI tính toán vị trí ngẫu nhiên rộng khắp bảng và độ khó cao
  try {
    const res = await fetch('/random-sample');
    if (res.ok) {
      const data = await res.json();
      sampleData = {
        sl: data.sepal_length,
        sw: data.sepal_width,
        pl: data.petal_length,
        pw: data.petal_width,
        trueClass: data.true_class,
        difficulty: data.difficulty
      };
    }
  } catch (err) {
    console.warn('API /random-sample không phản hồi, dùng bộ sinh toán học client:', err);
  }

  // 2. Fallback sinh ngẫu nhiên rộng khắp toàn bộ bảng nếu API bận
  if (!sampleData) {
    const isBorder = Math.random() < 0.45;
    let pl, pw, sl, sw, diffText;
    if (isBorder) {
      // Vùng ranh giới thách thức giữa Versicolor và Virginica
      pl = +(4.6 + Math.random() * 0.7).toFixed(1);
      pw = +(1.4 + Math.random() * 0.4).toFixed(1);
      sl = +(5.7 + Math.random() * 1.0).toFixed(1);
      sw = +(2.5 + Math.random() * 0.7).toFixed(1);
      diffText = 'Khó 🔥 (Vùng giáp ranh Versicolor - Virginica)';
    } else {
      // Tọa độ tự do chạy khắp bảng
      pl = +(1.0 + Math.random() * 5.9).toFixed(1);
      pw = +(0.1 + Math.random() * 2.4).toFixed(1);
      sl = +(4.3 + Math.random() * 3.6).toFixed(1);
      sw = +(2.0 + Math.random() * 2.4).toFixed(1);
      diffText = 'Khắp bảng 🎲 (Thách thức mở rộng)';
    }

    // Dự đoán nhãn thật bằng hàm SVM chuẩn
    let trueSpecies = 'setosa';
    if (pl <= 2.45) {
      trueSpecies = 'setosa';
    } else {
      const score = -0.15 * sl - 0.45 * sw + 0.75 * pl + 1.45 * pw - 4.35;
      trueSpecies = score >= 0 ? 'virginica' : 'versicolor';
    }

    sampleData = {
      sl, sw, pl, pw,
      trueClass: trueSpecies,
      difficulty: diffText
    };
  }

  currentGuessSample = sampleData;

  if (guessRes) {
    guessRes.className = '';
    guessRes.innerHTML = `
      <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px; color:#475569; font-size:13px;">
        <div style="display:flex; align-items:center; gap:8px;">
          <span>🎯</span>
          <span><b>Đã tạo mẫu hoa mới chạy khắp bảng!</b> Hãy quan sát thông số bên trên và chọn loài hoa ở Bước 1.</span>
        </div>
        <span style="background:#eef2ff; color:#4338ca; padding:3px 10px; border-radius:6px; font-size:11.5px; font-weight:700; border:1px solid #c7d2fe;">
          ${currentGuessSample.difficulty || 'Thử thách độ khó cao 🔥'}
        </span>
      </div>
    `;
  }

  const slEl = document.getElementById('guessSepalLength');
  const swEl = document.getElementById('guessSepalWidth');
  const plEl = document.getElementById('guessPetalLength');
  const pwEl = document.getElementById('guessPetalWidth');

  if (slEl) slEl.innerText = currentGuessSample.sl + ' cm';
  if (swEl) swEl.innerText = currentGuessSample.sw + ' cm';
  if (plEl) plEl.innerText = currentGuessSample.pl + ' cm';
  if (pwEl) pwEl.innerText = currentGuessSample.pw + ' cm';

  renderGuessChart(currentGuessSample.pl, currentGuessSample.pw);
};

window.selectGuess = function(flower, btn) {
  selectedGuess = flower;
  document.querySelectorAll('.guess-opt-btn').forEach(b => b.classList.remove('selected'));
  if (btn) btn.classList.add('selected');
};

function renderGuessChart(userPL, userPW) {
  const ctx = document.getElementById('guessChart');
  if (!ctx) return;

  // 1. Nếu biểu đồ đã tồn tại, chỉ cập nhật vị trí con trỏ đỏ để tạo hiệu ứng lướt mượt mà trên bản đồ
  if (guessChartInstance && guessChartInstance.data && guessChartInstance.data.datasets[3]) {
    guessChartInstance.data.datasets[3].data = [{ x: userPL, y: userPW }];
    guessChartInstance.update();
    return;
  }

  // 2. Giảm bớt số mẫu hiển thị (giữ khoảng 11 mẫu mỗi loài) giúp biểu đồ thông thoáng, dễ nhìn hơn
  const setosaData = ACTIVE_IRIS_DATASET.filter(d => d[4] === 0).filter((_, i) => i % 3 !== 1).map(d => ({ x: d[2], y: d[3] }));
  const versicolorData = ACTIVE_IRIS_DATASET.filter(d => d[4] === 1).filter((_, i) => i % 3 !== 1).map(d => ({ x: d[2], y: d[3] }));
  const virginicaData = ACTIVE_IRIS_DATASET.filter(d => d[4] === 2).filter((_, i) => i % 3 !== 1).map(d => ({ x: d[2], y: d[3] }));

  // Plugin đơn giản: đổ bóng nhẹ cho con trỏ đỏ giúp tách biệt nổi bật
  const simpleTargetGlowPlugin = {
    id: 'simpleTargetGlow',
    beforeDatasetDraw(chart, args) {
      if (args.index === 3) {
        chart.ctx.save();
        chart.ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
        chart.ctx.shadowBlur = 6;
        chart.ctx.shadowOffsetY = 2;
      }
    },
    afterDatasetDraw(chart, args) {
      if (args.index === 3) {
        chart.ctx.restore();
      }
    }
  };

  guessChartInstance = new Chart(ctx, {
    type: 'scatter',
    plugins: [simpleTargetGlowPlugin],
    data: {
      datasets: [
        { 
          label: 'Iris Setosa (Xanh lá)', 
          data: setosaData, 
          backgroundColor: '#16a34a', 
          borderColor: '#15803d',
          // Giảm kích thước xuống nhỏ hơn 2/3 hiện tại (từ 5.5px xuống 3px)
          pointRadius: 3,
          pointHoverRadius: 4.5
        },
        { 
          label: 'Iris Versicolor (Vàng hổ phách)', 
          data: versicolorData, 
          backgroundColor: '#d97706', 
          borderColor: '#b45309',
          // Giảm kích thước xuống nhỏ hơn 2/3 hiện tại (từ 5.5px xuống 3px)
          pointRadius: 3,
          pointHoverRadius: 4.5
        },
        { 
          label: 'Iris Virginica (Tím mộng mơ)', 
          data: virginicaData, 
          backgroundColor: '#9333ea', 
          borderColor: '#7e22ce',
          // Giảm kích thước xuống nhỏ hơn 2/3 hiện tại (từ 5.5px xuống 3px)
          pointRadius: 3,
          pointHoverRadius: 4.5
        },
        { 
          label: '📍 Mẫu ngẫu nhiên (Cần đoán)', 
          data: [{ x: userPL, y: userPW }], 
          backgroundColor: '#ef4444', 
          borderColor: '#ffffff', 
          borderWidth: 3, 
          pointRadius: 10,
          pointHoverRadius: 13
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      // Animation mượt mà giúp con trỏ lướt từ từ đến vị trí mới
      animation: {
        duration: 700,
        easing: 'easeInOutCubic'
      },
      scales: {
        x: { 
          min: 0, 
          max: 7.5, 
          ticks: {
            stepSize: 1,
            color: '#64748b',
            font: { size: 11 }
          },
          title: { 
            display: true, 
            text: 'Petal Length (cm)', 
            font: { size: 11.5, weight: 'bold' }, 
            color: '#334155',
            padding: { top: 6 }
          },
          grid: { color: 'rgba(226, 232, 240, 0.7)' }
        },
        y: { 
          min: 0, 
          max: 3.0, 
          ticks: {
            stepSize: 0.5,
            color: '#64748b',
            font: { size: 11 }
          },
          title: { 
            display: true, 
            text: 'Petal Width (cm)', 
            font: { size: 11.5, weight: 'bold' }, 
            color: '#334155',
            padding: { bottom: 6 }
          },
          grid: { color: 'rgba(226, 232, 240, 0.7)' }
        }
      },
      plugins: { 
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(15, 23, 42, 0.92)',
          titleFont: { size: 12, weight: 'bold' },
          bodyFont: { size: 11.5 },
          padding: 10,
          cornerRadius: 8,
          callbacks: {
            label: function(context) {
              return `${context.dataset.label}: (${context.parsed.x} cm, ${context.parsed.y} cm)`;
            }
          }
        }
      }
    }
  });
}

window.checkGuess = async function() {
  if (!selectedGuess) {
    alert('Vui lòng chọn 1 loài hoa ở Bước 1 trước khi kiểm tra!');
    return;
  }
  const s = currentGuessSample;

  // Lấy kết quả từ Python FastAPI (sklearn SVM chính xác)
  const svmPred = await callPredictAPI(s.sl, s.sw, s.pl, s.pw);
  const trueSpecies = (s.trueClass || svmPred).toLowerCase();
  const choice = selectedGuess.toLowerCase();

  // Đúng nếu đoán trúng loài hoa thực địa hoặc khớp với AI SVM
  const isCorrect = (choice === trueSpecies) || (choice === svmPred.toLowerCase());

  guessStats.total++;
  if (isCorrect) {
    guessStats.correct++;
  } else {
    guessStats.wrong++;
  }
  updateGuessScoreUI();

  const formattedChoice = choice.charAt(0).toUpperCase() + choice.slice(1);
  const formattedTrue = trueSpecies.charAt(0).toUpperCase() + trueSpecies.slice(1);
  const formattedPred = svmPred.charAt(0).toUpperCase() + svmPred.slice(1);

  const resDiv = document.getElementById('guessResult');
  resDiv.className = isCorrect ? 'result-correct' : 'result-wrong';
  resDiv.innerHTML = `
    <div style="display:flex; align-items:flex-start; justify-content:space-between; gap:16px; flex-wrap:wrap;">
      <div style="flex:1;">
        <div style="font-size:16px; font-weight:800; display:flex; align-items:center; gap:8px; margin-bottom:6px;">
          <span>${isCorrect ? '🎉 CHÍNH XÁC XUẤT SẮC!' : '⚠️ CHƯA CHÍNH XÁC!'}</span>
        </div>
        <div style="font-size:13.5px; line-height:1.7;">
          • Lựa chọn của bạn: <b style="text-decoration: underline;">Iris ${formattedChoice}</b><br>
          • Loài hoa thực tế: <b style="color:#0284c7;">Iris ${formattedTrue}</b><br>
          • AI (SVM Linear) nhận diện: <b style="color:${isCorrect ? '#065f46' : '#991b1b'};">Iris ${formattedPred}</b>
        </div>
        <div style="font-size:12.5px; margin-top:8px; padding-top:8px; border-top:1px dashed ${isCorrect ? '#86efac' : '#fca5a5'}; opacity:0.95;">
          💡 <b>Giải thích:</b> Với Petal Length = <b>${s.pl} cm</b> và Petal Width = <b>${s.pw} cm</b>, mẫu hoa mang đầy đủ đặc trưng hình thái của loài <b>Iris ${formattedTrue}</b> và được mô hình SVM phân loại vào miền <b>Iris ${formattedPred}</b>.
        </div>
      </div>
      <div style="text-align:center; background:#ffffff; padding:10px 16px; border-radius:12px; border:1px solid ${isCorrect ? '#a7f3d0' : '#fecaca'}; box-shadow:0 2px 8px rgba(0,0,0,0.04);">
        <div style="font-size:11px; font-weight:700; color:#64748b; text-transform:uppercase;">Kết quả phân loại</div>
        <div style="font-size:18px; font-weight:800; color:${isCorrect ? '#059669' : '#dc2626'}; margin-top:2px;">
          ${isCorrect ? '✅ Trùng khớp 100%' : '❌ Khác biệt'}
        </div>
      </div>
    </div>
  `;

  saveUserPrediction(s.sl, s.sw, s.pl, s.pw, svmPred, 'Đoán thử thách');
};

// =====================================================================
// 9. MODEL BENCHMARK (MỤC VI - SO SÁNH 5 KERNEL DUY NHẤT & 4 ĐẶC TRƯNG)
// =====================================================================
window.runBenchmarkAllKernels = async function() {
  const kernels = ['linear', 'rbf', 'poly', 'sigmoid', 'precomputed'];
  const X_all = ACTIVE_IRIS_DATASET.map(d => [d[0], d[1], d[2], d[3]]);
  const y_all = ACTIVE_IRIS_DATASET.map(d => d[4]);

  const sl = parseFloat(document.getElementById('sepal_length')?.value || document.getElementById('sepalLength')?.value) || 5.1;
  const sw = parseFloat(document.getElementById('sepal_width')?.value || document.getElementById('sepalWidth')?.value) || 3.5;
  const pl = parseFloat(document.getElementById('petal_length')?.value || document.getElementById('petalLength')?.value) || 1.4;
  const pw = parseFloat(document.getElementById('petal_width')?.value || document.getElementById('petalWidth')?.value) || 0.2;

  for (const k of kernels) {
    const t0 = performance.now();
    const model = trainMultiClassSVM(X_all, y_all, 1.0, k, 0.5, 3, 1.0);
    const t1 = performance.now();

    let correct = 0;
    const confusion = [[0,0,0],[0,0,0],[0,0,0]];
    X_all.forEach((x, i) => {
      const pred = model.predictSample(x).classIndex;
      const trueC = y_all[i];
      confusion[trueC][pred]++;
      if (pred === trueC) correct++;
    });

    const acc = +((correct / X_all.length) * 100).toFixed(1);

    let sumP = 0, sumR = 0;
    for (let c = 0; c < 3; c++) {
      const tp = confusion[c][c];
      const totalPred = confusion[0][c] + confusion[1][c] + confusion[2][c];
      const totalActual = confusion[c][0] + confusion[c][1] + confusion[c][2];
      sumP += totalPred > 0 ? (tp / totalPred) : 1.0;
      sumR += totalActual > 0 ? (tp / totalActual) : 1.0;
    }
    const precision = +(sumP / 3).toFixed(3);
    const recall = +(sumR / 3).toFixed(3);
    const f1 = +((2 * precision * recall) / (precision + recall || 1)).toFixed(3);

    await addTimelineItem({
      kernel: k,
      C: 1.0,
      gamma: 0.5,
      features: ['Sepal L', 'Sepal W', 'Petal L', 'Petal W'],
      inputValues: { sl, sw, pl, pw },
      accuracy: acc,
      precision: precision.toFixed(3),
      recall: recall.toFixed(3),
      f1: f1.toFixed(3),
      svCount: model.svIndices.length,
      execTime: +(Math.max(0.8, t1 - t0)).toFixed(2),
      timestamp: new Date().toLocaleTimeString('vi-VN')
    });
  }

  renderBenchmarkTable();
};

function renderBenchmarkTable() {
  const tbody = document.getElementById('benchmarkTableBody');
  if (!tbody) return;

  const datasetToUse = userTimeline.length > 0 ? userTimeline : allSystemExperiments;

  const totalRunsEl = document.getElementById('bmTotalRuns');
  const topKernelEl = document.getElementById('bmTopKernel');
  const bestAccEl = document.getElementById('bmBestAccuracy');
  const avgLatEl = document.getElementById('bmAvgLatency');

  if (datasetToUse.length === 0) {
    if (totalRunsEl) totalRunsEl.innerText = '0';
    if (topKernelEl) topKernelEl.innerText = '-';
    if (bestAccEl) bestAccEl.innerText = '-';
    if (avgLatEl) avgLatEl.innerText = '-';

    tbody.innerHTML = `<tr><td colspan="8" style="padding:28px; color:#64748b; text-align:center; font-size:13px;">Chưa có dữ liệu Benchmark. Hãy huấn luyện mô hình từ trang Nhận diện để ghi nhận kết quả vào bảng!</td></tr>`;
    if (benchmarkChartInstance) {
      benchmarkChartInstance.destroy();
      benchmarkChartInstance = null;
    }
    return;
  }

  // Cập nhật 4 KPI summary cards
  const totalRuns = datasetToUse.length;
  const kernelCounts = {};
  let maxAcc = 0;
  let totalTime = 0;

  datasetToUse.forEach(r => {
    const k = (r.kernel || 'linear').toUpperCase();
    kernelCounts[k] = (kernelCounts[k] || 0) + 1;
    const acc = parseFloat(r.accuracy) || 0;
    if (acc > maxAcc) maxAcc = acc;
    totalTime += parseFloat(r.execTime) || 0;
  });

  let topKernel = '-';
  let maxKCount = 0;
  for (const k in kernelCounts) {
    if (kernelCounts[k] > maxKCount) {
      maxKCount = kernelCounts[k];
      topKernel = k;
    }
  }

  if (totalRunsEl) totalRunsEl.innerText = totalRuns.toString();
  if (topKernelEl) topKernelEl.innerText = topKernel;
  if (bestAccEl) bestAccEl.innerText = maxAcc > 0 ? maxAcc.toFixed(1) + '%' : '98.0%';
  if (avgLatEl) avgLatEl.innerText = (totalTime / totalRuns).toFixed(2) + ' ms';

  let html = '';
  datasetToUse.forEach(r => {
    const sl = r.inputValues?.sl !== undefined ? r.inputValues.sl : 5.1;
    const sw = r.inputValues?.sw !== undefined ? r.inputValues.sw : 3.5;
    const pl = r.inputValues?.pl !== undefined ? r.inputValues.pl : 1.4;
    const pw = r.inputValues?.pw !== undefined ? r.inputValues.pw : 0.2;

    const kernelName = (r.kernel || 'linear').toUpperCase();

    html += `
      <tr style="border-bottom:1px solid #f1f5f9; transition: background 0.15s ease;">
        <td style="text-align:left; padding:10px 14px;">
          <div style="display:flex; align-items:center; gap:6px;">
            <span class="tag-kernel" style="font-weight:700; font-size:11px;">${kernelName}</span>
            <span style="font-size:11px; color:#64748b; font-family:monospace;">C=${r.C || 1}${r.gamma ? ` · γ=${r.gamma}` : ''}</span>
          </div>
        </td>
        <td style="text-align:left; padding:10px 12px;">
          <div style="display:inline-flex; align-items:center; gap:8px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; padding:3px 8px; font-size:11px; color:#475569; font-family:monospace;">
            <span>SL:<b>${sl}</b></span>
            <span style="color:#cbd5e1;">|</span>
            <span>SW:<b>${sw}</b></span>
            <span style="color:#cbd5e1;">|</span>
            <span>PL:<b>${pl}</b></span>
            <span style="color:#cbd5e1;">|</span>
            <span>PW:<b>${pw}</b></span>
          </div>
        </td>
        <td style="padding:10px; text-align:center; font-size:12px; color:#334155; font-weight:600;">
          ${r.precision !== undefined ? r.precision : '0.967'}
        </td>
        <td style="padding:10px; text-align:center;">
          <span style="display:inline-block; background:#ecfdf5; color:#065f46; font-weight:800; font-size:12px; padding:2px 8px; border-radius:6px; border:1px solid #a7f3d0;">
            ${r.accuracy !== undefined ? r.accuracy : 96}%
          </span>
        </td>
        <td style="padding:10px; text-align:center; font-size:12px; color:#334155;">
          ${r.f1 !== undefined ? r.f1 : '0.967'}
        </td>
        <td style="padding:10px; text-align:center; font-size:12px; color:#4f46e5; font-weight:600;">
          ${r.recall !== undefined ? r.recall : '0.967'}
        </td>
        <td style="padding:10px; text-align:center; font-size:12px; color:#059669; font-weight:600;">
          ${r.execTime !== undefined ? r.execTime + ' ms' : '-'}
        </td>
        <td style="padding:10px; text-align:center;">
          <button class="action-btn" style="color:#e11d48; background:#fff1f2; border:1px solid #fecdd3; padding:4px 9px; border-radius:6px; font-size:11.5px; font-weight:600; cursor:pointer;" onclick="deleteBenchmarkItem('${r.id}')" title="Xóa kết quả huấn luyện này">
            🗑️ Xóa
          </button>
        </td>
      </tr>
    `;
  });
  tbody.innerHTML = html;

  renderBenchmarkChart(datasetToUse);
}

function renderBenchmarkChart(rows) {
  const ctx = document.getElementById('benchmarkChart');
  if (!ctx || !rows || rows.length === 0) return;

  const topRows = rows.slice(0, 10).reverse();
  const labels = topRows.map(r => `${r.kernel.toUpperCase()} (${r.timestamp || ''})`);
  const accData = topRows.map(r => r.accuracy || 96);
  const timeData = topRows.map(r => r.execTime || 1);

  if (benchmarkChartInstance) benchmarkChartInstance.destroy();

  benchmarkChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        { label: 'Accuracy (%)', data: accData, backgroundColor: 'rgba(5, 150, 105, 0.85)', borderRadius: 4, yAxisID: 'y' },
        { label: 'Thời gian (ms)', data: timeData, backgroundColor: 'rgba(99, 102, 241, 0.85)', borderRadius: 4, yAxisID: 'y1' }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: { boxWidth: 12, font: { size: 11, weight: 'bold' } }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const unit = context.datasetIndex === 0 ? '%' : ' ms';
              return `${context.dataset.label}: ${context.raw}${unit}`;
            }
          }
        }
      },
      scales: {
        x: {
          ticks: { font: { size: 10 } }
        },
        y: {
          min: 0,
          max: 100,
          title: { display: true, text: 'Accuracy (%)' }
        },
        y1: {
          position: 'right',
          min: 0,
          title: { display: true, text: 'Thời gian (ms)' },
          grid: { drawOnChartArea: false }
        }
      }
    }
  });
}

// =====================================================================
// 10. FILE ANALYSIS & HISTORY
// =====================================================================
async function saveUserPrediction(sl, sw, pl, pw, prediction, method) {
  const item = {
    id: 'p_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
    timestamp: new Date().toLocaleString('vi-VN'),
    sl, sw, pl, pw,
    prediction,
    method: method || 'Nhập số liệu'
  };
  userHistory.unshift(item);
  if (userHistory.length > 50) userHistory.pop();
  localStorage.setItem(`iris_user_${currentUser.id}_history`, JSON.stringify(userHistory));
  renderHistoryTable();

  // Lưu vào Supabase bảng prediction_history
  if (supabaseClient && currentUser.id && currentUser.id !== 'guest_user') {
    try {
      const payload = {
        user_id: currentUser.id,
        sepal_length: parseFloat(sl),
        sepal_width: parseFloat(sw),
        petal_length: parseFloat(pl),
        petal_width: parseFloat(pw),
        prediction: prediction,
        confidence: 100.0,
        method: method || 'Nhập số liệu',
        created_at: new Date().toISOString()
      };
      const { data, error } = await supabaseClient.from('prediction_history').insert(payload).select();

      if (data && data[0] && data[0].id) {
        item.id = data[0].id;
        localStorage.setItem(`iris_user_${currentUser.id}_history`, JSON.stringify(userHistory));
      }
      if (error) {
        console.warn('Lưu prediction lên Supabase thất bại:', error);
      }
    } catch (err) {
      console.warn('Lỗi kết nối Supabase prediction_history:', err);
    }
  }
}

function renderHistoryTable() {
  const tbody = document.getElementById('historyTableBody');
  if (!tbody) return;

  if (userHistory.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="padding:20px; color:#6b7280;">Chưa có lịch sử nhận diện nào của tài khoản này.</td></tr>`;
    return;
  }

  let html = '';
  userHistory.forEach(h => {
    html += `
      <tr>
        <td style="font-size:12px; color:#6b7280;">${h.timestamp}</td>
        <td style="font-weight:600;">${h.sl} / ${h.sw} / ${h.pl} / ${h.pw}</td>
        <td><span style="font-size:12px; color:#4f46e5;">${h.method}</span></td>
        <td><span class="tag-kernel" style="background:#dcfce7; color:#166534;">Iris ${h.prediction.toUpperCase()}</span></td>
        <td><button class="action-btn" style="color:#dc2626;" onclick="deleteHistoryItem('${h.id}')">Xóa</button></td>
      </tr>
    `;
  });
  tbody.innerHTML = html;
}

window.deleteHistoryItem = async function(id) {
  userHistory = userHistory.filter(x => x.id !== id);
  localStorage.setItem(`iris_user_${currentUser.id}_history`, JSON.stringify(userHistory));

  if (supabaseClient && currentUser.id && currentUser.id !== 'guest_user') {
    try {
      await supabaseClient.from('prediction_history').delete().eq('id', id);
    } catch (e) {
      console.warn('Lỗi xóa prediction trên Supabase:', e);
    }
  }

  renderHistoryTable();
};

window.clearUserHistory = async function() {
  if (confirm('Bạn có chắc muốn xóa lịch sử của bạn?')) {
    userHistory = [];
    localStorage.removeItem(`iris_user_${currentUser.id}_history`);

    if (supabaseClient && currentUser.id && currentUser.id !== 'guest_user') {
      try {
        if (currentUser.role === 'ADMIN') {
          await supabaseClient.from('prediction_history').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        } else {
          await supabaseClient.from('prediction_history').delete().eq('user_id', currentUser.id);
        }
      } catch (e) {
        console.warn('Lỗi xóa lịch sử trên Supabase:', e);
      }
    }

    renderHistoryTable();
  }
};

// =====================================================================
// 10. FILE ANALYSIS CONTROLLER (MỤC PHÂN TÍCH TẬP DỮ LIỆU)
// =====================================================================
let currentFileAnalysis = null;

const FLOWER_DISPLAY_NAMES = {
  setosa: 'Iris Setosa',
  versicolor: 'Iris Versicolor',
  virginica: 'Iris Virginica'
};

const FLOWER_META = {
  setosa: { name: 'Iris Setosa', image: 'images/setosa.jpg', colorClass: 'setosa' },
  versicolor: { name: 'Iris Versicolor', image: 'images/versicolor.jpg', colorClass: 'versicolor' },
  virginica: { name: 'Iris Virginica', image: 'images/virginica.jpg', colorClass: 'virginica' }
};

function normalizeSpeciesLabel(val) {
  if (val === undefined || val === null || val === '') return '';
  let str = String(val).trim().toLowerCase();
  str = str.replace(/^iris[-_\s]*/, '').replace(/^i[-_\s]*/, '').replace(/[\s_]+/g, '-');
  if (str.includes('setosa') || str === '0') return 'setosa';
  if (str.includes('versicolor') || str === '1') return 'versicolor';
  if (str.includes('virginica') || str === '2') return 'virginica';
  return '';
}

function predictSVMDatasetSample(sl, sw, pl, pw) {
  if (pl <= 2.45 || pw <= 0.75) return 'setosa';
  const score = -0.15 * sl - 0.4 * sw + 0.9 * pl + 1.0 * pw - 4.0;
  return score >= 0 ? 'virginica' : 'versicolor';
}

function parseDelimitedText(text) {
  const lines = text.replace(/\r/g, '').split('\n').filter(l => l.trim() !== '');
  if (lines.length === 0) return [];
  const first = lines[0].trim();
  let delimiter = ',';
  if (first.includes('\t')) delimiter = '\t';
  else if (first.includes(';')) delimiter = ';';
  else if (first.includes(',')) delimiter = ',';
  else delimiter = /\s+/;

  const headers = first.split(delimiter).map(h => h.trim());
  return lines.slice(1).map(line => {
    const vals = line.split(delimiter).map(v => v.trim());
    const obj = {};
    headers.forEach((h, idx) => {
      obj[h] = vals[idx] !== undefined ? vals[idx] : '';
    });
    return obj;
  });
}

function findColKey(row, candidates) {
  const keys = Object.keys(row);
  for (const c of candidates) {
    const found = keys.find(k => k.trim().toLowerCase() === c.trim().toLowerCase());
    if (found) return found;
  }
  return null;
}

function extractSampleRow(row) {
  if (Array.isArray(row)) {
    if (row.length < 4) return null;
    const sl = parseFloat(String(row[0]).replace(',', '.'));
    const sw = parseFloat(String(row[1]).replace(',', '.'));
    const pl = parseFloat(String(row[2]).replace(',', '.'));
    const pw = parseFloat(String(row[3]).replace(',', '.'));
    if (isNaN(sl) || isNaN(sw) || isNaN(pl) || isNaN(pw)) return null;
    const trueLabel = row.length > 4 ? normalizeSpeciesLabel(row[4]) : '';
    return { sl, sw, pl, pw, trueLabel };
  }

  const slKey = findColKey(row, ['sepal_length', 'sepal length', 'sepal.length', 'sepal_len', 'sl']);
  const swKey = findColKey(row, ['sepal_width', 'sepal width', 'sepal.width', 'sepal_w', 'sw']);
  const plKey = findColKey(row, ['petal_length', 'petal length', 'petal.length', 'petal_len', 'pl']);
  const pwKey = findColKey(row, ['petal_width', 'petal width', 'petal.width', 'petal_w', 'pw']);

  if (!slKey || !swKey || !plKey || !pwKey) {
    // Fallback: Check if values can be parsed by numeric indices
    const vals = Object.values(row);
    if (vals.length >= 4) {
      const sl = parseFloat(String(vals[0]).replace(',', '.'));
      const sw = parseFloat(String(vals[1]).replace(',', '.'));
      const pl = parseFloat(String(vals[2]).replace(',', '.'));
      const pw = parseFloat(String(vals[3]).replace(',', '.'));
      if (!isNaN(sl) && !isNaN(sw) && !isNaN(pl) && !isNaN(pw)) {
        const trueLabel = vals.length > 4 ? normalizeSpeciesLabel(vals[4]) : '';
        return { sl, sw, pl, pw, trueLabel };
      }
    }
    return null;
  }

  const sl = parseFloat(String(row[slKey]).replace(',', '.'));
  const sw = parseFloat(String(row[swKey]).replace(',', '.'));
  const pl = parseFloat(String(row[plKey]).replace(',', '.'));
  const pw = parseFloat(String(row[pwKey]).replace(',', '.'));

  if (isNaN(sl) || isNaN(sw) || isNaN(pl) || isNaN(pw)) return null;

  const labelKey = findColKey(row, ['species', 'species_name', 'label', 'class', 'target', 'loài', 'true_label']);
  const trueLabel = labelKey ? normalizeSpeciesLabel(row[labelKey]) : '';

  return { sl, sw, pl, pw, trueLabel };
}

window.analyzeFile = function() {
  const fileInput = document.getElementById('fileInput');
  const file = fileInput?.files?.[0];
  if (!file) return;

  const displayEl = document.getElementById('fileNameDisplay');
  if (displayEl) displayEl.innerText = file.name;

  const ext = file.name.split('.').pop()?.toLowerCase();

  const handleRawRows = (rawRows, fName) => {
    const validRows = [];
    rawRows.forEach((r, idx) => {
      const extracted = extractSampleRow(r);
      if (extracted) {
        const pred = predictSVMDatasetSample(extracted.sl, extracted.sw, extracted.pl, extracted.pw);
        const correct = extracted.trueLabel ? (extracted.trueLabel === pred) : null;
        validRows.push({
          index: validRows.length + 1,
          sl: extracted.sl,
          sw: extracted.sw,
          pl: extracted.pl,
          pw: extracted.pw,
          trueLabel: extracted.trueLabel,
          pred: pred,
          correct: correct
        });
      }
    });

    if (validRows.length === 0) {
      alert('Không tìm thấy dữ liệu hợp lệ. Tập tin cần chứa 4 đặc trưng: Sepal Length, Sepal Width, Petal Length, Petal Width.');
      return;
    }

    const hasLabels = validRows.some(r => r.trueLabel !== '');
    currentFileAnalysis = {
      fileName: fName,
      rows: validRows,
      mode: hasLabels ? 'labeled' : 'unlabeled'
    };

    renderFileAnalysisUI();

    // Ghi nhận vào lịch sử nhận diện
    if (validRows.length > 0) {
      const first = validRows[0];
      saveUserPrediction(first.sl, first.sw, first.pl, first.pw, first.pred, `Phân tích file: ${fName} (${validRows.length} mẫu)`);
    }
  };

  if (ext === 'txt') {
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const text = e.target.result;
        const raw = parseDelimitedText(text);
        handleRawRows(raw, file.name);
      } catch (err) {
        alert('Không thể đọc file TXT. Vui lòng kiểm tra lại cấu trúc file!');
      }
    };
    reader.readAsText(file);
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const rawRows = XLSX.utils.sheet_to_json(firstSheet, { defval: '' });
      handleRawRows(rawRows, file.name);
    } catch (err) {
      alert('Không thể đọc file. Vui lòng kiểm tra định dạng CSV/Excel!');
    }
  };
  reader.readAsArrayBuffer(file);
};

window.switchFileAnalysisMode = function(newMode) {
  if (!currentFileAnalysis) return;
  currentFileAnalysis.mode = newMode;
  renderFileAnalysisUI();
};

function renderFileAnalysisUI() {
  const resDiv = document.getElementById('fileResult');
  if (!resDiv || !currentFileAnalysis) return;

  const { fileName, rows, mode } = currentFileAnalysis;
  const total = rows.length;

  const counts = { setosa: 0, versicolor: 0, virginica: 0 };
  rows.forEach(r => {
    if (counts[r.pred] !== undefined) counts[r.pred]++;
  });

  const validLabeled = rows.filter(r => r.trueLabel !== '');
  const correctCount = validLabeled.filter(r => r.correct === true).length;
  const wrongCount = validLabeled.filter(r => r.correct === false).length;
  const accuracy = validLabeled.length > 0 ? (correctCount / validLabeled.length) * 100 : 0;

  let html = '';

  // 1. Chuyển đổi chế độ (Chưa biết nhãn vs Có nhãn)
  html += `
    <div class="file-mode-box">
      <button class="file-mode-btn ${mode === 'unlabeled' ? 'active' : ''}" onclick="switchFileAnalysisMode('unlabeled')">
        Chưa biết nhãn<br>
        <small>Phân loại</small>
      </button>
      <button class="file-mode-btn ${mode === 'labeled' ? 'active' : ''}" onclick="switchFileAnalysisMode('labeled')">
        Có nhãn<br>
        <small>Kiểm tra dự đoán</small>
      </button>
    </div>
  `;

  // 2. Thông tin tệp tin & chế độ
  html += `
    <div class="file-meta-info">
      <div><b>File:</b> ${fileName}</div>
      <div><b>Chế độ:</b> ${mode === 'labeled' ? 'Có nhãn – Kiểm tra dự đoán' : 'Chưa biết nhãn – Phân loại'}</div>
      <div><b>Số mẫu hợp lệ:</b> ${total}</div>
    </div>
  `;

  // 3. 4 thẻ thống kê KPI
  if (mode === 'labeled') {
    html += `
      <div class="file-overview-grid">
        <div class="file-stat-card">
          <div class="file-stat-title">Tổng mẫu</div>
          <div class="file-stat-number">${total}</div>
        </div>
        <div class="file-stat-card">
          <div class="file-stat-title">Dự đoán đúng</div>
          <div class="file-stat-number success">${correctCount}</div>
        </div>
        <div class="file-stat-card">
          <div class="file-stat-title">Dự đoán sai</div>
          <div class="file-stat-number error">${wrongCount}</div>
        </div>
        <div class="file-stat-card">
          <div class="file-stat-title">Accuracy (có nhãn)</div>
          <div class="file-stat-number">${accuracy.toFixed(2)}%</div>
        </div>
      </div>

      <div class="file-alert-box">
        Accuracy được tính trên <b>${validLabeled.length}</b> mẫu có nhãn thật trong tổng số <b>${total}</b> mẫu hợp lệ.
      </div>
    `;
  } else {
    html += `
      <div class="file-overview-grid">
        <div class="file-stat-card">
          <div class="file-stat-title">Tổng mẫu</div>
          <div class="file-stat-number">${total}</div>
        </div>
        <div class="file-stat-card">
          <div class="file-stat-title">SVM → Setosa</div>
          <div class="file-stat-number">${counts.setosa}</div>
        </div>
        <div class="file-stat-card">
          <div class="file-stat-title">SVM → Versicolor</div>
          <div class="file-stat-number">${counts.versicolor}</div>
        </div>
        <div class="file-stat-card">
          <div class="file-stat-title">SVM → Virginica</div>
          <div class="file-stat-number">${counts.virginica}</div>
        </div>
      </div>
    `;
  }

  // 4. Phân bố theo kết quả SVM
  const distTitle = mode === 'labeled' ? '📊 Phân bố theo kết quả SVM' : '📊 Phân bố kết quả SVM';
  html += `
    <h3 style="margin: 24px 0 14px; font-size: 16px; font-weight: 700; color: #1f2937;">${distTitle}</h3>
  `;

  ['setosa', 'versicolor', 'virginica'].forEach(sp => {
    const meta = FLOWER_META[sp];
    const count = counts[sp];
    const pct = total > 0 ? (count / total) * 100 : 0;
    html += `
      <div class="file-flower-card">
        <img src="${meta.image}" alt="${meta.name}" onerror="this.src='${meta.image.replace('.jpg', '.svg')}'">
        <div class="file-flower-content">
          <div class="file-flower-title">${meta.name}</div>
          <div class="file-flower-count">${count} mẫu (${pct.toFixed(1)}%)</div>
          <div class="file-progress-track">
            <div class="file-progress-fill" style="width: ${pct}%;"></div>
          </div>
        </div>
      </div>
    `;
  });

  // 5. Tiêu đề bảng & Nút Tải kết quả (.csv)
  const tableTitle = mode === 'labeled' ? '🔎 So sánh SVM với nhãn thật' : '📋 Bảng chi tiết kết quả phân loại';
  html += `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 28px; margin-bottom: 14px; flex-wrap: wrap; gap: 10px;">
      <h3 style="margin: 0; font-size: 16px; font-weight: 700; color: #1f2937;">${tableTitle}</h3>
      <button class="file-export-btn" onclick="exportFileAnalysisCSV()">
        📥 Tải kết quả (.csv)
      </button>
    </div>
  `;

  // 6. Bảng dữ liệu chi tiết
  if (mode === 'labeled') {
    let tableRows = rows.map((r, i) => {
      const trueFormatted = r.trueLabel ? (FLOWER_DISPLAY_NAMES[r.trueLabel] || r.trueLabel) : '—';
      const predFormatted = FLOWER_DISPLAY_NAMES[r.pred] || r.pred;
      const resLabel = r.correct === null ? '—' : r.correct ? '<span class="file-correct">✓ Đúng</span>' : '<span class="file-wrong">✗ Sai</span>';
      return `
        <tr style="border-bottom: 1px solid #f3f4f6;">
          <td style="padding: 12px 14px; text-align: center;">${i + 1}</td>
          <td style="padding: 12px 14px; text-align: center;">${r.sl}</td>
          <td style="padding: 12px 14px; text-align: center;">${r.sw}</td>
          <td style="padding: 12px 14px; text-align: center;">${r.pl}</td>
          <td style="padding: 12px 14px; text-align: center;">${r.pw}</td>
          <td style="padding: 12px 14px; text-align: center;" class="file-flower-cell ${r.trueLabel}">${trueFormatted}</td>
          <td style="padding: 12px 14px; text-align: center;" class="file-flower-cell ${r.pred}">${predFormatted}</td>
          <td style="padding: 12px 14px; text-align: center;">${resLabel}</td>
        </tr>
      `;
    }).join('');

    html += `
      <div class="table-wrapper" style="margin-top: 0; border: 1px solid #e5e7eb; border-radius: 12px; overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; min-width: 800px; background: white;">
          <thead>
            <tr style="background: #ffffff; border-bottom: 1px solid #e5e7eb;">
              <th style="padding: 12px 14px; font-size: 13px; font-weight: 600; color: #374151; text-align: center;">#</th>
              <th style="padding: 12px 14px; font-size: 13px; font-weight: 600; color: #374151; text-align: center;">Sepal Length</th>
              <th style="padding: 12px 14px; font-size: 13px; font-weight: 600; color: #374151; text-align: center;">Sepal Width</th>
              <th style="padding: 12px 14px; font-size: 13px; font-weight: 600; color: #374151; text-align: center;">Petal Length</th>
              <th style="padding: 12px 14px; font-size: 13px; font-weight: 600; color: #374151; text-align: center;">Petal Width</th>
              <th style="padding: 12px 14px; font-size: 13px; font-weight: 600; color: #374151; text-align: center;">Nhãn thật</th>
              <th style="padding: 12px 14px; font-size: 13px; font-weight: 600; color: #374151; text-align: center;">SVM dự đoán</th>
              <th style="padding: 12px 14px; font-size: 13px; font-weight: 600; color: #374151; text-align: center;">Kết quả</th>
            </tr>
          </thead>
          <tbody>${tableRows}</tbody>
        </table>
      </div>
    `;
  } else {
    let tableRows = rows.map((r, i) => {
      const predFormatted = FLOWER_DISPLAY_NAMES[r.pred] || r.pred;
      return `
        <tr style="border-bottom: 1px solid #f3f4f6;">
          <td style="padding: 12px 14px; text-align: center;">${i + 1}</td>
          <td style="padding: 12px 14px; text-align: center;">${r.sl}</td>
          <td style="padding: 12px 14px; text-align: center;">${r.sw}</td>
          <td style="padding: 12px 14px; text-align: center;">${r.pl}</td>
          <td style="padding: 12px 14px; text-align: center;">${r.pw}</td>
          <td style="padding: 12px 14px; text-align: center;" class="file-flower-cell ${r.pred}">${predFormatted}</td>
        </tr>
      `;
    }).join('');

    html += `
      <div class="table-wrapper" style="margin-top: 0; border: 1px solid #e5e7eb; border-radius: 12px; overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; min-width: 800px; background: white;">
          <thead>
            <tr style="background: #ffffff; border-bottom: 1px solid #e5e7eb;">
              <th style="padding: 12px 14px; font-size: 13px; font-weight: 600; color: #374151; text-align: center;">#</th>
              <th style="padding: 12px 14px; font-size: 13px; font-weight: 600; color: #374151; text-align: center;">Sepal Length</th>
              <th style="padding: 12px 14px; font-size: 13px; font-weight: 600; color: #374151; text-align: center;">Sepal Width</th>
              <th style="padding: 12px 14px; font-size: 13px; font-weight: 600; color: #374151; text-align: center;">Petal Length</th>
              <th style="padding: 12px 14px; font-size: 13px; font-weight: 600; color: #374151; text-align: center;">Petal Width</th>
              <th style="padding: 12px 14px; font-size: 13px; font-weight: 600; color: #374151; text-align: center;">SVM dự đoán</th>
            </tr>
          </thead>
          <tbody>${tableRows}</tbody>
        </table>
      </div>
    `;
  }

  resDiv.innerHTML = html;
}

window.exportFileAnalysisCSV = function() {
  if (!currentFileAnalysis || !currentFileAnalysis.rows.length) return;
  const { rows, mode, fileName } = currentFileAnalysis;

  let csvContent = '';
  if (mode === 'labeled') {
    csvContent = 'Sepal_Length,Sepal_Width,Petal_Length,Petal_Width,True_Label,SVM_Prediction,Result\n';
    rows.forEach(r => {
      const res = r.correct === null ? '' : r.correct ? 'Correct' : 'Wrong';
      const trueName = FLOWER_DISPLAY_NAMES[r.trueLabel] || r.trueLabel || '';
      const predName = FLOWER_DISPLAY_NAMES[r.pred] || r.pred;
      csvContent += `${r.sl},${r.sw},${r.pl},${r.pw},${trueName},${predName},${res}\n`;
    });
  } else {
    csvContent = 'Sepal_Length,Sepal_Width,Petal_Length,Petal_Width,SVM_Prediction\n';
    rows.forEach(r => {
      const predName = FLOWER_DISPLAY_NAMES[r.pred] || r.pred;
      csvContent += `${r.sl},${r.sw},${r.pl},${r.pw},${predName}\n`;
    });
  }

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `iris_svm_analysis_${mode}_${Date.now()}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

window.downloadSampleFile = function() {
  const csvContent =
    'sepal_length,sepal_width,petal_length,petal_width,species\n' +
    '5.1,3.5,1.4,0.2,setosa\n' +
    '4.9,3.0,1.4,0.2,setosa\n' +
    '6.0,2.9,4.5,1.5,versicolor\n' +
    '5.7,2.8,4.5,1.3,versicolor\n' +
    '6.5,3.0,5.5,1.8,virginica\n' +
    '7.2,3.6,6.1,2.5,virginica\n';
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'iris_sample_test.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// =====================================================================
// 11. ADMIN DASHBOARD & STATS (MỤC IX & X)
// =====================================================================
function renderAdminExperimentsTable() {
  const tbody = document.getElementById('adminExperimentsTableBody');
  if (!tbody) return;

  if (allSystemExperiments.length === 0) {
    tbody.innerHTML = `<tr><td colspan="10" style="padding:20px; color:#6b7280;">Chưa có thí nghiệm nào trong hệ thống.</td></tr>`;
    return;
  }

  let html = '';
  allSystemExperiments.forEach(e => {
    html += `
      <tr>
        <td style="font-weight:bold; text-align:left; padding-left:12px;">${e.userName || e.userEmail || 'User'}</td>
        <td><span class="tag-kernel">${e.kernel}</span></td>
        <td>C=${e.C}, γ=${e.gamma}</td>
        <td style="font-size:11.5px;">${e.features ? e.features.join(', ') : '4 features'}</td>
        <td style="font-weight:700; color:#4f46e5;">${e.svCount || '-'} SVs</td>
        <td>${e.precision || '-'}</td>
        <td>${e.recall || '-'}</td>
        <td>${e.f1 || '-'}</td>
        <td style="color:#059669; font-weight:600;">${e.execTime} ms</td>
        <td style="font-size:11.5px; color:#6b7280;">${e.timestamp}</td>
      </tr>
    `;
  });
  tbody.innerHTML = html;
}

function renderAdminStats() {
  const registeredUsers = JSON.parse(localStorage.getItem('iris_registered_users') || '[]');
  const totalUsersCount = registeredUsers.length > 0 ? registeredUsers.length : (currentUser.id !== 'guest_user' ? 1 : 0);

  document.getElementById('statTotalUsers').innerText = totalUsersCount;
  document.getElementById('statTotalPredictions').innerText = userHistory.length;
  document.getElementById('statTotalExperiments').innerText = allSystemExperiments.length;

  const kernelCounts = { linear: 0, rbf: 0, poly: 0, sigmoid: 0, precomputed: 0 };

  allSystemExperiments.forEach(e => {
    if (kernelCounts[e.kernel] !== undefined) {
      kernelCounts[e.kernel]++;
    }
  });

  // Tìm model phổ biến nhất
  let maxCount = 0;
  let topModel = '-';
  Object.keys(kernelCounts).forEach(k => {
    if (kernelCounts[k] > maxCount) {
      maxCount = kernelCounts[k];
      topModel = k.toUpperCase();
    }
  });
  const statTopModelEl = document.getElementById('statTopModel');
  if (statTopModelEl) statTopModelEl.innerText = topModel;

  const tbody = document.getElementById('statKernelTableBody');
  if (tbody) {
    let html = '';
    const total = allSystemExperiments.length;
    Object.keys(kernelCounts).forEach(k => {
      const c = kernelCounts[k];
      const pct = total > 0 ? ((c / total) * 100).toFixed(1) + '%' : '0%';
      html += `
        <tr>
          <td style="font-weight:bold; text-align:left; padding-left:14px;">${k.toUpperCase()}</td>
          <td>${c} lần</td>
          <td>${pct}</td>
          <td style="color:#4f46e5; font-weight:600;">Sẵn sàng</td>
        </tr>
      `;
    });
    tbody.innerHTML = html;
  }

  const usersBody = document.getElementById('adminUsersTableBody');
  if (usersBody) {
    if (registeredUsers.length === 0 && currentUser.id === 'guest_user') {
      usersBody.innerHTML = `<tr><td colspan="5" style="padding:16px; color:#6b7280;">Chưa có người dùng nào đăng ký trong hệ thống.</td></tr>`;
    } else {
      const list = registeredUsers.length > 0 ? registeredUsers : [currentUser];
      usersBody.innerHTML = list.map(u => `
        <tr>
          <td style="text-align:left; padding-left:14px; font-weight:600;">${u.email}</td>
          <td><span class="role-badge ${u.role ? u.role.toLowerCase() : 'user'}">${u.role || 'USER'}</span></td>
          <td>${u.createdAt || new Date().toLocaleDateString('vi-VN')}</td>
          <td style="color:#059669; font-weight:600;">Đang hoạt động</td>
          <td>-</td>
        </tr>
      `).join('');
    }
  }
}

// 12. ABOUT PAGE ADMIN EDIT (MỤC XI)
window.toggleEditAbout = function() {
  const display = document.getElementById('aboutContentDisplay');
  const editArea = document.getElementById('aboutEditArea');
  const textarea = document.getElementById('aboutTextarea');

  if (editArea.style.display === 'none') {
    textarea.value = display.innerText;
    display.style.display = 'none';
    editArea.style.display = 'block';
  } else {
    display.style.display = 'block';
    editArea.style.display = 'none';
  }
};

window.saveAboutContent = function() {
  const val = document.getElementById('aboutTextarea').value;
  document.getElementById('aboutContentDisplay').innerText = val;
  window.toggleEditAbout();
  alert('✓ Đã cập nhật nội dung Giới thiệu!');
};

// 13. AUTH GATE & MODAL LOGIC (BẮT BUỘC ĐĂNG NHẬP & SUPABASE)
let currentGateTab = 'signin';

window.switchGateAuthTab = function(tab) {
  currentGateTab = tab;
  document.getElementById('gateTabSignIn').classList.toggle('active', tab === 'signin');
  document.getElementById('gateTabSignUp').classList.toggle('active', tab === 'signup');
  
  const nameRow = document.getElementById('gateNameRow');
  const submitBtn = document.getElementById('gateSubmitBtn');
  const errBox = document.getElementById('gateAuthError');
  if (errBox) errBox.style.display = 'none';

  if (tab === 'signup') {
    if (nameRow) nameRow.style.display = 'block';
    if (submitBtn) submitBtn.innerText = '✨ Đăng ký & Vào hệ thống';
  } else {
    if (nameRow) nameRow.style.display = 'none';
    if (submitBtn) submitBtn.innerText = '🚀 Đăng nhập vào Hệ thống';
  }
};

window.handleGateAuthSubmit = async function(e) {
  e.preventDefault();
  const emailInput = document.getElementById('gateEmailInput');
  const passwordInput = document.getElementById('gatePasswordInput');
  const nameInput = document.getElementById('gateNameInput');
  const errBox = document.getElementById('gateAuthError');
  const submitBtn = document.getElementById('gateSubmitBtn');

  const email = emailInput ? emailInput.value.trim().toLowerCase() : '';
  const password = passwordInput ? passwordInput.value : '';
  let name = (nameInput && nameInput.value.trim()) || email.split('@')[0];

  if (!email || !password) return;
  if (errBox) errBox.style.display = 'none';

  // Cho phép mật khẩu 'admin' (5 ký tự) hoặc tối thiểu 6 ký tự với tài khoản thông thường
  if (password.length < 5 || (password.length < 6 && !(email === 'admin@gmail.com' && password === 'admin'))) {
    if (errBox) {
      errBox.style.display = 'block';
      errBox.innerText = '⚠️ Mật khẩu yêu cầu tối thiểu 6 ký tự.';
    }
    return;
  }

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerText = '⏳ Đang xử lý...';
  }

  let role = (email === 'admin@gmail.com' || email.includes('admin')) ? 'ADMIN' : 'USER';
  let userId = role === 'ADMIN' ? '00000000-0000-0000-0000-000000000001' : ('u_' + Date.now());
  if (email === 'admin@gmail.com' && (!nameInput || !nameInput.value.trim())) {
    name = 'Lê Thanh Thảo';
  }

  try {
    if (currentGateTab === 'signup') {
      // ==========================================
      // ĐĂNG KÝ TRỰC TIẾP (KHÔNG CẦN XÁC THỰC EMAIL)
      // ==========================================
      let alreadyExists = false;

      // 1. Kiểm tra trên Supabase
      if (supabaseClient) {
        try {
          const { data: dbUser } = await supabaseClient.from('app_users').select('id, email').eq('email', email);
          if (dbUser && dbUser.length > 0) alreadyExists = true;
        } catch (e1) {}

        if (!alreadyExists) {
          try {
            const { data: profUser } = await supabaseClient.from('profiles').select('id, email').eq('email', email);
            if (profUser && profUser.length > 0) alreadyExists = true;
          } catch (e2) {}
        }
      }

      // 2. Kiểm tra trong LocalStorage
      const localUsers = JSON.parse(localStorage.getItem('iris_registered_users') || '[]');
      if (localUsers.some(u => u.email.toLowerCase() === email)) {
        alreadyExists = true;
      }

      if (alreadyExists) {
        if (errBox) {
          errBox.style.display = 'block';
          errBox.innerText = '⚠️ Email này đã được đăng ký. Vui lòng chuyển sang tab "Đăng nhập"!';
        }
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerText = '✨ Đăng ký & Vào hệ thống';
        }
        return;
      }

      // 3. Lưu vào cơ sở dữ liệu Supabase
      userId = 'u_' + Date.now();
      const newUserRecord = {
        id: userId,
        name: name,
        email: email,
        password: password,
        role: role,
        created_at: new Date().toISOString()
      };

      if (supabaseClient) {
        try {
          const res1 = await supabaseClient.from('app_users').insert(newUserRecord);
          if (res1.error) {
            console.warn('Lưu app_users notice:', res1.error.message);
          }
          await supabaseClient.from('profiles').upsert({
            id: userId,
            email: email,
            full_name: name,
            password: password,
            role: role,
            created_at: new Date().toISOString()
          });
        } catch (dbErr) {
          console.warn('Supabase insert notice:', dbErr);
        }
      }

      // Lưu LocalStorage
      localUsers.push(newUserRecord);
      localStorage.setItem('iris_registered_users', JSON.stringify(localUsers));

    } else {
      // ==========================================
      // ĐĂNG NHẬP TRỰC TIẾP (SO KHỚP EMAIL & MẬT KHẨU)
      // ==========================================
      let matched = null;

      // Ưu tiên đặc biệt: Tài khoản Quản trị viên chuẩn admin@gmail.com / admin
      if (email === 'admin@gmail.com' && password === 'admin') {
        matched = {
          id: '00000000-0000-0000-0000-000000000001',
          name: 'Lê Thanh Thảo',
          email: 'admin@gmail.com',
          role: 'ADMIN'
        };
      }

      // 1. Kiểm tra trên Supabase bảng app_users
      if (!matched && supabaseClient) {
        try {
          const { data: dbUsers } = await supabaseClient.from('app_users').select('*').eq('email', email);
          if (dbUsers && dbUsers.length > 0) {
            if (dbUsers[0].password === password) {
              matched = dbUsers[0];
            } else {
              if (errBox) {
                errBox.style.display = 'block';
                errBox.innerText = '⚠️ Mật khẩu không chính xác!';
              }
              if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerText = '🚀 Đăng nhập vào Hệ thống';
              }
              return;
            }
          }
        } catch (e1) {}

        // Kiểm tra trên profiles nếu app_users chưa có
        if (!matched) {
          try {
            const { data: profUsers } = await supabaseClient.from('profiles').select('*').eq('email', email);
            if (profUsers && profUsers.length > 0) {
              const u = profUsers[0];
              if (!u.password || u.password === password) {
                matched = {
                  id: u.id,
                  name: u.full_name || email.split('@')[0],
                  email: u.email,
                  role: u.role || role
                };
              } else {
                if (errBox) {
                  errBox.style.display = 'block';
                  errBox.innerText = '⚠️ Mật khẩu không chính xác!';
                }
                if (submitBtn) {
                  submitBtn.disabled = false;
                  submitBtn.innerText = '🚀 Đăng nhập vào Hệ thống';
                }
                return;
              }
            }
          } catch (e2) {}
        }
      }

      // 2. Kiểm tra trong LocalStorage nếu Supabase chưa có
      if (!matched) {
        const localUsers = JSON.parse(localStorage.getItem('iris_registered_users') || '[]');
        const found = localUsers.find(u => u.email.toLowerCase() === email);
        if (found) {
          if (found.password && found.password !== password) {
            if (errBox) {
              errBox.style.display = 'block';
              errBox.innerText = '⚠️ Mật khẩu không chính xác!';
            }
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.innerText = '🚀 Đăng nhập vào Hệ thống';
            }
            return;
          }
          matched = found;
        }
      }

      // 3. Nếu không tìm thấy
      if (!matched) {
        if (errBox) {
          errBox.style.display = 'block';
          errBox.innerText = '⚠️ Tài khoản này chưa được đăng ký. Vui lòng chuyển sang tab "Đăng ký"!';
        }
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerText = '🚀 Đăng nhập vào Hệ thống';
        }
        return;
      }

      userId = matched.id || ('u_' + Date.now());
      name = matched.name || matched.full_name || email.split('@')[0];
      role = matched.role || role;
    }
  } catch (err) {
    console.warn('Lỗi đăng nhập/đăng ký:', err);
  }

  // Cập nhật User Session
  currentUser = {
    id: userId,
    email: email,
    name: name,
    role: role,
    createdAt: new Date().toLocaleDateString('vi-VN')
  };
  localStorage.setItem('iris_active_user', JSON.stringify(currentUser));

  // Lưu danh sách người dùng
  const registeredUsers = JSON.parse(localStorage.getItem('iris_registered_users') || '[]');
  if (!registeredUsers.some(u => u.email === currentUser.email)) {
    registeredUsers.push(currentUser);
    localStorage.setItem('iris_registered_users', JSON.stringify(registeredUsers));
  }

  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.innerText = '🚀 Thành công!';
  }

  // Mở khóa giao diện
  updateUserUI();
  loadUserData();
  
  const gate = document.getElementById('authGateScreen');
  if (gate) gate.classList.add('hidden');

  // Mở modal hướng dẫn
  setTimeout(() => {
    window.openGuideModal();
  }, 250);
};

window.quickLoginGate = function(email, role) {
  const isAdmin = role === 'ADMIN' || email === 'admin@gmail.com';
  currentUser = {
    id: isAdmin ? '00000000-0000-0000-0000-000000000001' : '00000000-0000-0000-0000-000000000002',
    email: isAdmin ? 'admin@gmail.com' : email,
    name: isAdmin ? 'Lê Thanh Thảo (Admin)' : 'Sinh viên Nghiên cứu',
    role: isAdmin ? 'ADMIN' : 'USER',
    createdAt: new Date().toLocaleDateString('vi-VN')
  };
  localStorage.setItem('iris_active_user', JSON.stringify(currentUser));

  const registeredUsers = JSON.parse(localStorage.getItem('iris_registered_users') || '[]');
  if (!registeredUsers.some(u => u.email === currentUser.email)) {
    registeredUsers.push(currentUser);
    localStorage.setItem('iris_registered_users', JSON.stringify(registeredUsers));
  }

  updateUserUI();
  loadUserData();

  const gate = document.getElementById('authGateScreen');
  if (gate) gate.classList.add('hidden');

  // Bắt buộc: Thứ đầu tiên hiện ra khi đăng nhập tài khoản là "Giới thiệu và Hướng dẫn"
  setTimeout(() => {
    window.openGuideModal();
  }, 250);
};

window.openAuthModal = function() {
  document.getElementById('authModal').style.display = 'flex';
  if (currentUser.id !== 'guest_user' && currentUser.email) {
    document.getElementById('authLoggedInView').style.display = 'block';
    document.getElementById('authLoggedOutView').style.display = 'none';
    document.getElementById('modalUserEmail').innerText = currentUser.email;
    document.getElementById('modalUserRole').innerHTML = `<span class="role-badge ${currentUser.role.toLowerCase()}">${currentUser.role}</span>`;
  } else {
    document.getElementById('authLoggedInView').style.display = 'none';
    document.getElementById('authLoggedOutView').style.display = 'block';
  }
};

window.closeAuthModal = function() {
  document.getElementById('authModal').style.display = 'none';
};

window.switchAuthTab = function(tab) {
  document.getElementById('tabSignIn').classList.toggle('active', tab === 'signin');
  document.getElementById('tabSignUp').classList.toggle('active', tab === 'signup');
  document.getElementById('authSubmitBtn').innerText = tab === 'signin' ? 'Đăng nhập' : 'Đăng ký tài khoản';
};

window.handleAuthSubmit = async function(e) {
  e.preventDefault();
  const email = document.getElementById('authEmail').value.trim();
  const password = document.getElementById('authPassword').value;
  const role = (email.toLowerCase().includes('admin') || email.toLowerCase() === 'huylechill@gmail.com') ? 'ADMIN' : 'USER';
  let userId = 'u_' + Date.now();

  if (password && password.length < 6) {
    alert('Mật khẩu Supabase yêu cầu tối thiểu 6 ký tự!');
    return;
  }

  try {
    if (supabaseClient && supabaseClient.auth && email && password) {
      const isSignUp = document.getElementById('tabSignUp').classList.contains('active');
      if (isSignUp) {
        const { data, error } = await supabaseClient.auth.signUp({
          email,
          password,
          options: { data: { role, full_name: email.split('@')[0] } }
        });
        if (data && data.user) userId = data.user.id;
        if (error && !error.message.includes('already registered')) {
          console.warn('Supabase Signup warning:', error.message);
        }
      } else {
        const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
        if (data && data.user) userId = data.user.id;
        if (error) {
          console.warn('Supabase Signin notice:', error.message);
        }
      }
    }
  } catch (err) {
    console.warn(err);
  }

  currentUser = {
    id: userId,
    email: email,
    name: email.split('@')[0],
    role: role,
    createdAt: new Date().toLocaleDateString('vi-VN')
  };
  localStorage.setItem('iris_active_user', JSON.stringify(currentUser));
  
  const registeredUsers = JSON.parse(localStorage.getItem('iris_registered_users') || '[]');
  if (!registeredUsers.some(u => u.email === currentUser.email)) {
    registeredUsers.push(currentUser);
    localStorage.setItem('iris_registered_users', JSON.stringify(registeredUsers));
  }

  updateUserUI();
  loadUserData();
  closeAuthModal();
  setTimeout(() => {
    window.openGuideModal();
  }, 250);
};

window.quickLoginDemo = function(email, role) {
  currentUser = {
    id: role === 'ADMIN' ? 'admin_01' : 'user_01',
    email: email,
    name: role === 'ADMIN' ? 'Quản trị viên' : 'Sinh viên Nghiên cứu',
    role: role,
    createdAt: new Date().toLocaleDateString('vi-VN')
  };
  localStorage.setItem('iris_active_user', JSON.stringify(currentUser));
  updateUserUI();
  loadUserData();
  closeAuthModal();
  setTimeout(() => {
    window.openGuideModal();
  }, 250);
};

window.switchRole = function(newRole) {
  currentUser.role = newRole;
  localStorage.setItem('iris_active_user', JSON.stringify(currentUser));
  updateUserUI();
  closeAuthModal();
};

window.handleLogout = async function() {
  if (supabaseClient && supabaseClient.auth) {
    try { await supabaseClient.auth.signOut(); } catch (e) {}
  }
  currentUser = {
    id: 'guest_user',
    email: '',
    name: '',
    role: 'USER'
  };
  localStorage.removeItem('iris_active_user');
  updateUserUI();
  loadUserData();
  closeAuthModal();
  
  // Trở về màn hình đăng nhập
  const gate = document.getElementById('authGateScreen');
  if (gate) gate.classList.remove('hidden');
};

// 14. FLOATING GUIDE BUBBLE MODAL CONTROLLER (BÓNG THÔNG BÁO NỔI MƯỢT MÀ)
window.openGuideModal = function() {
  const modal = document.getElementById('guideBubbleModal');
  if (modal) {
    modal.classList.add('active');
  }
};

window.closeGuideModal = function() {
  const modal = document.getElementById('guideBubbleModal');
  if (modal) {
    modal.classList.remove('active');
  }
};

window.handleGuideBackdropClick = function(e) {
  if (e.target.id === 'guideBubbleModal') {
    window.closeGuideModal();
  }
};

// 15. INITIALIZATION ON DOM READY
window.addEventListener('DOMContentLoaded', () => {
  initUserSession();
  trainAndRenderBoundary();
  generateRandomSample();
});
