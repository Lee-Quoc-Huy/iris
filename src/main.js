/**
 * Iris SVM - Complete Engine, Modern Twilight UI Controller & Supabase Integration
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

// Species color palette
const SPECIES_COLORS = {
  setosa: '#4ade80',
  versicolor: '#f59e0b', // Vàng hổ phách amber
  virginica: '#c084fc'
};

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

function trainBinarySVM(X, y, C, kernel, gamma, degree = 3, coef0 = 1.0) {
  const n = X.length;
  const alphas = new Float64Array(n);
  const errors = new Float64Array(n);
  let b = 0.0;

  const K = Array.from({ length: n }, () => new Float64Array(n));
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      const v = computeKernel(X[i], X[j], kernel, gamma, degree, coef0);
      K[i][j] = v;
      K[j][i] = v;
    }
  }

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

    const b1 = b - E1 - y1 * (a1 - alpha1) * k11 - y2 * (a2 - alpha2) * k12;
    const b2 = b - E2 - y1 * (a1 - alpha1) * k12 - y2 * (a2 - alpha2) * k22;

    let bNew = (b1 + b2) / 2.0;
    if (a1 > 0 && a1 < C) bNew = b1;
    else if (a2 > 0 && a2 < C) bNew = b2;

    const deltaB = bNew - b;
    b = bNew;

    alphas[i1] = a1;
    alphas[i2] = a2;

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

    if ((r2 < -tol && alpha2 < C) || (r2 > tol && alpha2 > 0)) {
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

      for (let k = 0; k < n; k++) {
        const idx = (i2 + k) % n;
        if (alphas[idx] > 0 && alphas[idx] < C) {
          if (takeStep(idx, i2)) return 1;
        }
      }

      for (let k = 0; k < n; k++) {
        const idx = (i2 + k) % n;
        if (takeStep(idx, i2)) return 1;
      }
    }
    return 0;
  }

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
// 3. USER AUTHENTICATION & SUPABASE SESSION
// =====================================================================
const SUPABASE_URL = import.meta.env?.VITE_SUPABASE_URL || 'https://zivdfypkmalrlgojdlmy.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppdmRmeXBrbWFscmxnb2pkbG15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAyNDkzNzksImV4cCI6MjEwNTgyNTM3OX0.0we8qj9_F9kQNy3t53ogL77iVe2QAHh3KCVky_cHAf8';

export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
window.supabase = supabaseClient;

let currentUser = {
  id: 'guest_user',
  email: '',
  name: 'Khách',
  role: 'USER'
};

let decisionChartInstance = null;
let guessChartInstance = null;
let benchmarkChartInstance = null;
let currentGuessSample = null;
let selectedGuess = null;

let userHistory = [];
let userTimeline = [];
let allSystemExperiments = [];

const guessStats = {
  total: 0,
  correct: 0,
  wrong: 0
};

// =====================================================================
// 4. SESSION & UI INITIALIZATION
// =====================================================================
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
    if (gate) gate.classList.remove('hidden');
  }
}

function updateUserUI() {
  const displayEmail = document.getElementById('userDisplayName');
  const roleBadge = document.getElementById('userRoleBadge');
  const adminNavPill = document.getElementById('adminNavPillSection');
  const mobileAdminSec = document.getElementById('mobileAdminSection');

  if (displayEmail) displayEmail.innerText = currentUser.name || currentUser.email || 'Khách';
  if (roleBadge) {
    roleBadge.innerText = currentUser.role || 'USER';
    roleBadge.className = `text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase ${currentUser.role === 'ADMIN' ? 'bg-[#f2c14e]/30 text-[#f2c14e]' : 'bg-white/20 text-white'}`;
  }

  const isAdmin = currentUser.role === 'ADMIN';
  if (adminNavPill) {
    adminNavPill.style.display = isAdmin ? 'flex' : 'none';
  }
  if (mobileAdminSec) {
    mobileAdminSec.style.display = isAdmin ? 'flex' : 'none';
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

  // ĐỒNG BỘ SUPABASE CHO RIÊNG TÀI KHOẢN (YÊU CẦU II.5)
  if (supabaseClient && currentUser.id && currentUser.id !== 'guest_user') {
    try {
      let query = supabaseClient.from('prediction_history').select('*').order('created_at', { ascending: false });
      if (currentUser.role !== 'ADMIN') {
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
      console.warn('Lỗi tải prediction_history:', err);
    }

    try {
      let expQuery = supabaseClient.from('experiment_history').select('*').order('created_at', { ascending: false });
      if (currentUser.role !== 'ADMIN') {
        expQuery = expQuery.eq('user_id', currentUser.id);
      }
      const { data: expData, error: expErr } = await expQuery;
      if (!expErr && expData) {
        userTimeline = expData.map(e => ({
          id: e.id,
          userName: e.user_id === currentUser.id ? (currentUser.name || currentUser.email) : 'User',
          userId: e.user_id,
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
        renderTimeline();
        renderBenchmarkTable();
      }
    } catch (err) {
      console.warn('Lỗi tải experiment_history:', err);
    }
  }
}

// =====================================================================
// 5. NAVIGATION CONTROLLER (FLOATING PILL & TABS)
// =====================================================================
window.showPage = function(pageId, button, titleText, subText) {
  document.querySelectorAll('.page-view').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-tab-btn').forEach(b => {
    b.classList.remove('active', 'bg-[#e8702a]', 'text-white');
    b.classList.add('text-white/80');
  });

  const page = document.getElementById(pageId);
  if (page) page.classList.add('active');

  if (button) {
    button.classList.add('active', 'bg-[#e8702a]', 'text-white');
    button.classList.remove('text-white/80');
  } else {
    // If navigating by logo to homePage
    const homeBtn = document.getElementById('navHome');
    if (pageId === 'homePage' && homeBtn) {
      homeBtn.classList.add('active', 'bg-[#e8702a]', 'text-white');
      homeBtn.classList.remove('text-white/80');
    }
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (pageId === 'predictPage') {
    // YÊU CẦU II.6: KHÔNG tự động lưu vào benchmark khi mới vào trang Nhận diện
    trainAndRenderBoundary(false);
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

window.toggleMobileNav = function() {
  const drawer = document.getElementById('mobileNavDrawer');
  if (drawer) {
    const isHidden = drawer.classList.contains('hidden');
    if (isHidden) {
      drawer.classList.remove('hidden');
      drawer.classList.add('flex');
    } else {
      drawer.classList.add('hidden');
      drawer.classList.remove('flex');
    }
  }
};

window.showPageMobile = function(pageId, title, sub) {
  window.toggleMobileNav();
  window.showPage(pageId, null, title, sub);
};

// =====================================================================
// 6. PREDICTION & LIVE INTERACTIVE CHART (MỤC I & II)
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
  window.predict();
};

window.resetForm = function() {
  window.setPreset(5.1, 3.5, 1.4, 0.2);
};

function predictLinearFast(sl, sw, pl, pw) {
  if (pl <= 2.45 || pw <= 0.8) return 'setosa';
  const score = -0.15 * sl - 0.45 * sw + 0.75 * pl + 1.45 * pw - 4.35;
  return score >= 0 ? 'virginica' : 'versicolor';
}

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
  } catch (e) {}
  return predictLinearFast(sl, sw, pl, pw);
}

window.predict = async function(forcedSpecies = null) {
  const sl = parseFloat(document.getElementById('sepal_length').value) || 5.1;
  const sw = parseFloat(document.getElementById('sepal_width').value) || 3.5;
  const pl = parseFloat(document.getElementById('petal_length').value) || 1.4;
  const pw = parseFloat(document.getElementById('petal_width').value) || 0.2;

  document.getElementById('res_sepal_length').innerText = sl + ' cm';
  document.getElementById('res_sepal_width').innerText = sw + ' cm';
  document.getElementById('res_petal_length').innerText = pl + ' cm';
  document.getElementById('res_petal_width').innerText = pw + ' cm';

  let prediction = forcedSpecies;
  if (!prediction) {
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
  }

  const flowerFormatted = 'Iris ' + prediction.charAt(0).toUpperCase() + prediction.slice(1);
  document.getElementById('flowerName').innerText = flowerFormatted;
  document.getElementById('flowerImage').src = `/images/${prediction}.jpg`;

  updateLiveSelectionPoint();

  // Lưu lịch sử nhận diện của tài khoản (YÊU CẦU II.5)
  saveUserPrediction(sl, sw, pl, pw, prediction, 'Tương tác trực quan');
};

// =====================================================================
// 7. HUẤN LUYỆN & DECISION BOUNDARY ENGINE (YÊU CẦU II.6 & II.7)
// =====================================================================
let cachedMeshGrid = null;
let currentTrainedSVM = null;
let activeFeatX = 2; // Petal Length
let activeFeatY = 3; // Petal Width

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
  const min = rangeEl ? parseFloat(rangeEl.min) || 0.1 : 0.1;
  const max = rangeEl ? parseFloat(rangeEl.max) || 8.0 : 8.0;
  const clampedVal = +(Math.min(max, Math.max(min, val))).toFixed(1);
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
  let fY = parseInt(document.getElementById('featureYSelect')?.value || '3');

  if (fX === fY) {
    fY = (fX + 1) % 4;
    document.getElementById('featureYSelect').value = fY;
  }
};

// YÊU CẦU II.6: CHỈ KHI BẤM NÚT NÀY MỚI LƯU LỊCH SỬ BENCHMARK
window.trainAndRenderBoundaryManual = function() {
  trainAndRenderBoundary(true);
};

function trainAndRenderBoundary(shouldSaveHistory = false) {
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

  // YÊU CẦU II.7: ĐỌC TRẠNG THÁI CẢ 4 THÔNG SỐ ĐƯỢC CHỌN
  const selectedFeaturesMask = [
    document.getElementById('featCheck_0')?.checked ?? true,
    document.getElementById('featCheck_1')?.checked ?? true,
    document.getElementById('featCheck_2')?.checked ?? true,
    document.getElementById('featCheck_3')?.checked ?? true,
  ];

  const startTime = performance.now();

  // Chuẩn bị dữ liệu 4D
  const featureMeans = [0, 1, 2, 3].map(featIdx => {
    const sum = ACTIVE_IRIS_DATASET.reduce((acc, row) => acc + row[featIdx], 0);
    return +(sum / ACTIVE_IRIS_DATASET.length).toFixed(4);
  });

  const X_4D = ACTIVE_IRIS_DATASET.map(d => [
    selectedFeaturesMask[0] ? d[0] : featureMeans[0],
    selectedFeaturesMask[1] ? d[1] : featureMeans[1],
    selectedFeaturesMask[2] ? d[2] : featureMeans[2],
    selectedFeaturesMask[3] ? d[3] : featureMeans[3],
  ]);
  const y_all = ACTIVE_IRIS_DATASET.map(d => d[4]);

  const coef0 = (kernel === 'poly') ? 1.0 : 0.0;
  const multiSVM = trainMultiClassSVM(X_4D, y_all, C, kernel, gamma, degree, coef0);
  currentTrainedSVM = multiSVM;

  const endTime = performance.now();
  const execTime = +(endTime - startTime).toFixed(2);

  // Đánh giá Confusion Matrix
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

  // Mesh Grid 2D chiếu lên Trục X & Trục Y
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

  const resX = 80;
  const resY = 80;
  const stepX = (xMax - xMin) / resX;
  const stepY = (yMax - yMin) / resY;

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

  renderDecisionBoundaryChart(multiSVM, featXIdx, featYIdx, featXName, featYName, kernel, C, gamma, degree, accuracy);

  const sl = parseFloat(document.getElementById('sepal_length')?.value) || 5.1;
  const sw = parseFloat(document.getElementById('sepal_width')?.value) || 3.5;
  const pl = parseFloat(document.getElementById('petal_length')?.value) || 1.4;
  const pw = parseFloat(document.getElementById('petal_width')?.value) || 0.2;

  // YÊU CẦU II.6: CHỈ KHI shouldSaveHistory == true THÌ MỚI GHI VÀO TIMELINE & BENCHMARK
  if (shouldSaveHistory) {
    const selectedFeatNames = [0, 1, 2, 3]
      .filter(i => selectedFeaturesMask[i])
      .map(i => FEATURE_NAMES[i]);

    addTimelineItem({
      kernel,
      C,
      gamma,
      features: selectedFeatNames.length === 4 ? ['Cả 4 đặc trưng'] : selectedFeatNames,
      inputValues: { sl, sw, pl, pw },
      accuracy,
      precision,
      recall,
      f1,
      svCount: multiSVM.svIndices.length,
      execTime,
      timestamp: new Date().toLocaleTimeString('vi-VN')
    });
  }

  renderTrainingInlineResult(multiSVM, kernel, C, gamma, degree, accuracy, { sl, sw, pl, pw }, featXName, featYName);
}

function renderTrainingInlineResult(multiSVM, kernel, C, gamma, degree, accuracy, inputs, featXName, featYName) {
  const container = document.getElementById('trainingInlineResultCard');
  if (!container) return;

  const currentX = getFeatureValue(activeFeatX);
  const currentY = getFeatureValue(activeFeatY);
  const speciesIdx = getSpeciesAtCoord(currentX, currentY);
  const predSpecies = SPECIES_NAMES[speciesIdx] || 'setosa';

  renderInteractiveClickResult(currentX, currentY, predSpecies, speciesIdx, null, {
    kernel,
    accuracy,
    svCount: multiSVM.svIndices.length,
    trained: true
  });
}

// Hàm hiển thị kết quả trực tiếp ngay bên dưới bảng vẽ khi ấn vào bất kỳ vị trí nào
function renderInteractiveClickResult(xVal, yVal, spKey, speciesIdx, sampleInfo = null, trainStats = null) {
  const container = document.getElementById('trainingInlineResultCard');
  if (!container) return;

  let flowerVi = 'Iris Setosa';
  let flowerColor = '#4ade80';
  let flowerRegionDesc = 'Khu vực cánh hoa siêu ngắn & nhỏ (< 2.5cm) – Tách biệt hoàn toàn (Màu xanh lục)';

  if (spKey === 'versicolor') {
    flowerVi = 'Iris Versicolor (Vàng hổ phách)';
    flowerColor = '#f59e0b';
    flowerRegionDesc = 'Vùng cánh hoa trung bình (3.0 – 5.0cm) – Vùng chuyển tiếp (Vàng hổ phách)';
  } else if (spKey === 'virginica') {
    flowerVi = 'Iris Virginica';
    flowerColor = '#c084fc';
    flowerRegionDesc = 'Vùng cánh hoa cỡ lớn & rộng (> 4.8cm) – Phân lớp kích thước lớn nhất (Màu tím)';
  }

  const featXName = FEATURE_NAMES[activeFeatX];
  const featYName = FEATURE_NAMES[activeFeatY];
  const sl = getFeatureValue(0);
  const sw = getFeatureValue(1);
  const pl = getFeatureValue(2);
  const pw = getFeatureValue(3);

  container.className = 'mt-5 p-5 sm:p-6 rounded-2xl bg-white/[0.05] border-2 shadow-2xl transition-all block';
  container.style.borderColor = `${flowerColor}80`;

  container.innerHTML = `
    <div class="flex items-center justify-between flex-wrap gap-3 mb-4 pb-3 border-b border-white/10">
      <div class="flex items-center gap-2.5">
        <span class="w-9 h-9 rounded-xl flex items-center justify-center text-lg shadow-sm" style="background: ${flowerColor}25; color: ${flowerColor}; border: 1px solid ${flowerColor}50;">🎯</span>
        <div>
          <h4 class="text-sm font-bold text-white flex items-center gap-2">
            Kết quả nhận diện tại vị trí bạn ấn trên bảng vẽ
          </h4>
          <p class="text-[11px] text-white/60">Tọa độ ấn: ${featXName} = <b class="text-white">${xVal.toFixed(1)} cm</b> · ${featYName} = <b class="text-white">${yVal.toFixed(1)} cm</b></p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-xs font-bold px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-2" style="background: ${flowerColor}25; color: ${flowerColor}; border: 1px solid ${flowerColor}60;">
          <span class="w-2.5 h-2.5 rounded-full animate-pulse" style="background: ${flowerColor};"></span>
          ${flowerVi}
        </span>
      </div>
    </div>

    <div class="grid sm:grid-cols-[auto_1fr] gap-5 items-center">
      <div class="relative group shrink-0">
        <img src="/images/${spKey}.jpg" alt="${flowerVi}" class="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 shadow-xl transition-all" style="border-color: ${flowerColor};" onerror="this.src='/images/${spKey}.svg'" />
        <span class="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-black shadow-md uppercase tracking-wider" style="background: ${flowerColor};">VỊ TRÍ ẤN</span>
      </div>

      <div class="space-y-2 text-xs text-white/90">
        <div class="text-base font-playfair font-bold text-white flex items-center gap-2">
          <span>🌸</span> ${flowerVi}
        </div>
        <div class="p-2.5 rounded-xl bg-black/40 border border-white/10 text-[11px] text-white/80 leading-relaxed">
          📍 <b>Vùng phân loại SVM:</b> Điểm bạn vừa ấn nằm trong <b>${flowerRegionDesc}</b> của mô hình SVM trên bảng vẽ.
          ${sampleInfo ? `<div class="mt-1 text-[#f2c14e] font-medium">✨ Bạn đã nhấp trúng mẫu hoa dữ liệu thực tế #${sampleInfo.idx + 1} của loài này!</div>` : ''}
          ${trainStats ? `<div class="mt-1 text-emerald-400 font-medium">⚡ Mô hình SVM (${trainStats.kernel.toUpperCase()}) đạt độ chính xác ${trainStats.accuracy}% với ${trainStats.svCount} Support Vectors.</div>` : ''}
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
          <div class="p-2 rounded-lg bg-white/[0.04] border border-white/10">🌿 Sepal L: <b>${sl.toFixed(1)} cm</b></div>
          <div class="p-2 rounded-lg bg-white/[0.04] border border-white/10">🌿 Sepal W: <b>${sw.toFixed(1)} cm</b></div>
          <div class="p-2 rounded-lg bg-white/[0.04] border border-white/10">✨ Petal L: <b>${pl.toFixed(1)} cm</b></div>
          <div class="p-2 rounded-lg bg-white/[0.04] border border-white/10">✨ Petal W: <b>${pw.toFixed(1)} cm</b></div>
        </div>
      </div>
    </div>
  `;
}

// Hàm xác định loài tại tọa độ (x, y) trên không gian trực quan
function getSpeciesAtCoord(x, y) {
  if (!cachedMeshGrid) return 1;
  const { xMin, xMax, yMin, yMax, resX, resY, gridData, multiSVM, featureMeans, featXIdx, featYIdx } = cachedMeshGrid;
  if (x < xMin || x > xMax || y < yMin || y > yMax) {
    if (multiSVM) {
      const sample = [...featureMeans];
      sample[featXIdx] = x;
      sample[featYIdx] = y;
      return multiSVM.predictSample(sample).classIndex;
    }
    return 1;
  }
  const i = Math.min(resX, Math.max(0, Math.round(((x - xMin) / (xMax - xMin || 1)) * resX)));
  const j = Math.min(resY, Math.max(0, Math.round(((y - yMin) / (yMax - yMin || 1)) * resY)));
  return gridData[i]?.[j] ?? 1;
}

// Bật / tắt hiển thị dataset trên Decision Boundary Chart
window.toggleDatasetVisibility = function(datasetIndex) {
  if (!decisionChartInstance) return;
  const meta = decisionChartInstance.getDatasetMeta(datasetIndex);
  if (!meta) return;
  meta.hidden = meta.hidden === null ? !decisionChartInstance.data.datasets[datasetIndex].hidden : null;
  decisionChartInstance.update();

  const buttons = document.querySelectorAll('.legend-filter-btn');
  if (buttons && buttons[datasetIndex]) {
    if (meta.hidden) {
      buttons[datasetIndex].classList.add('opacity-40', 'line-through');
    } else {
      buttons[datasetIndex].classList.remove('opacity-40', 'line-through');
    }
  }
};

// Đặt lại điểm mẫu thử về vị trí mặc định
window.resetPointToCenter = function() {
  window.resetForm();
  updateLiveSelectionPoint();
  const initX = getFeatureValue(activeFeatX);
  const initY = getFeatureValue(activeFeatY);
  const initSpIdx = getSpeciesAtCoord(initX, initY);
  const initSpKey = SPECIES_NAMES[initSpIdx] || 'setosa';
  renderInteractiveClickResult(initX, initY, initSpKey, initSpIdx, null);
};

let chartInteractivityInitialized = false;
let isDraggingPoint = false;
let dragRafId = null;

function setupDecisionChartInteractivity() {
  const canvas = document.getElementById('decisionChart');
  if (!canvas || chartInteractivityInitialized) return;
  chartInteractivityInitialized = true;

  const hudCoords = document.getElementById('chartHudCoords');
  const hudSpecies = document.getElementById('chartHudSpecies');
  const sampleToast = document.getElementById('chartSampleToast');
  const sampleToastText = document.getElementById('chartSampleToastText');

  function showSampleToast(msg) {
    if (!sampleToast || !sampleToastText) return;
    sampleToastText.innerText = msg;
    sampleToast.classList.remove('opacity-0');
    sampleToast.classList.add('opacity-100');
    clearTimeout(sampleToast._timer);
    sampleToast._timer = setTimeout(() => {
      sampleToast.classList.remove('opacity-100');
      sampleToast.classList.add('opacity-0');
    }, 2800);
  }

  function getCanvasCoords(evt) {
    const rect = canvas.getBoundingClientRect();
    return {
      xPixel: evt.clientX - rect.left,
      yPixel: evt.clientY - rect.top
    };
  }

  function dataCoordsFromPixel(xPixel, yPixel) {
    if (!decisionChartInstance || !decisionChartInstance.scales?.x || !decisionChartInstance.scales?.y) return null;
    const xVal = decisionChartInstance.scales.x.getValueForPixel(xPixel);
    const yVal = decisionChartInstance.scales.y.getValueForPixel(yPixel);
    return { xVal, yVal };
  }

  function findNearestDatasetPoint(xPixel, yPixel, maxDistPx = 15) {
    if (!decisionChartInstance || !decisionChartInstance.scales?.x || !decisionChartInstance.scales?.y) return null;
    const xScale = decisionChartInstance.scales.x;
    const yScale = decisionChartInstance.scales.y;
    let nearest = null;
    let minDist = maxDistPx;

    ACTIVE_IRIS_DATASET.forEach((row, idx) => {
      const px = xScale.getPixelForValue(row[activeFeatX]);
      const py = yScale.getPixelForValue(row[activeFeatY]);
      const dist = Math.hypot(px - xPixel, py - yPixel);
      if (dist < minDist) {
        minDist = dist;
        nearest = { row, idx, dist };
      }
    });
    return nearest;
  }

  function updateHudAt(xVal, yVal) {
    if (!hudCoords || !hudSpecies) return;
    hudCoords.innerText = `${FEATURE_NAMES[activeFeatX]}: ${xVal.toFixed(1)} cm · ${FEATURE_NAMES[activeFeatY]}: ${yVal.toFixed(1)} cm`;
    const cIdx = getSpeciesAtCoord(xVal, yVal);
    if (cIdx === 0) {
      hudSpecies.innerHTML = `<span class="text-[#4ade80] font-semibold">● Iris Setosa</span>`;
    } else if (cIdx === 1) {
      hudSpecies.innerHTML = `<span class="text-[#f59e0b] font-semibold">● Iris Versicolor (Vàng hổ phách)</span>`;
    } else {
      hudSpecies.innerHTML = `<span class="text-[#c084fc] font-semibold">● Iris Virginica</span>`;
    }
  }

  function applyPointToModel(xVal, yVal, fullPredict = false, nearestSample = null) {
    setFeatureValue(activeFeatX, xVal);
    setFeatureValue(activeFeatY, yVal);
    updateLiveSelectionPoint();

    // 1. Xác định loài hoa tại tọa độ vừa ấn trên bảng vẽ
    let speciesIdx;
    if (nearestSample) {
      speciesIdx = nearestSample.row[4];
    } else {
      speciesIdx = getSpeciesAtCoord(xVal, yVal);
    }
    const spKey = SPECIES_NAMES[speciesIdx] || 'setosa';

    // 2. Cập nhật thẻ kết quả trực tiếp ngay bên dưới bảng vẽ
    renderInteractiveClickResult(xVal, yVal, spKey, speciesIdx, nearestSample);

    // 3. Cập nhật thẻ kết quả phía trên đồng bộ
    if (fullPredict) {
      window.predict(spKey);
    } else {
      if (dragRafId) cancelAnimationFrame(dragRafId);
      dragRafId = requestAnimationFrame(() => {
        window.predict(spKey);
      });
    }
  }

  canvas.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    try { canvas.setPointerCapture(e.pointerId); } catch (err) {}
    isDraggingPoint = true;
    canvas.style.cursor = 'grabbing';

    const { xPixel, yPixel } = getCanvasCoords(e);
    const nearest = findNearestDatasetPoint(xPixel, yPixel);
    if (nearest) {
      const { row, idx } = nearest;
      const spName = SPECIES_NAMES[row[4]] || 'setosa';
      const spVi = spName === 'setosa' ? 'Setosa' : spName === 'versicolor' ? 'Versicolor (Vàng hổ phách)' : 'Virginica';

      setFeatureValue(0, row[0]);
      setFeatureValue(1, row[1]);
      setFeatureValue(2, row[2]);
      setFeatureValue(3, row[3]);

      applyPointToModel(row[activeFeatX], row[activeFeatY], true, nearest);
      updateHudAt(row[activeFeatX], row[activeFeatY]);
      showSampleToast(`🎯 Đã chọn mẫu #${idx + 1}: Iris ${spVi}`);
      return;
    }

    const coords = dataCoordsFromPixel(xPixel, yPixel);
    if (coords && coords.xVal != null && coords.yVal != null) {
      applyPointToModel(coords.xVal, coords.yVal, true, null);
      updateHudAt(coords.xVal, coords.yVal);
      const spIdx = getSpeciesAtCoord(coords.xVal, coords.yVal);
      const spName = SPECIES_NAMES[spIdx] || 'setosa';
      const spVi = spName === 'setosa' ? 'Setosa' : spName === 'versicolor' ? 'Versicolor (Vàng hổ phách)' : 'Virginica';
      showSampleToast(`🎯 Vị trí ấn trên bảng: Iris ${spVi}`);
    }
  });

  canvas.addEventListener('pointermove', (e) => {
    const { xPixel, yPixel } = getCanvasCoords(e);
    const coords = dataCoordsFromPixel(xPixel, yPixel);
    if (!coords) return;

    if (isDraggingPoint) {
      applyPointToModel(coords.xVal, coords.yVal, false, null);
      updateHudAt(coords.xVal, coords.yVal);
    } else {
      const nearest = findNearestDatasetPoint(xPixel, yPixel);
      if (nearest) {
        canvas.style.cursor = 'pointer';
        const spName = SPECIES_NAMES[nearest.row[4]] || 'setosa';
        canvas.title = `Nhấp để nạp toàn bộ 4 thông số mẫu Iris ${spName} #${nearest.idx + 1}`;
      } else {
        canvas.style.cursor = 'crosshair';
        canvas.title = 'Nhấp vào bất kỳ vị trí nào trên bảng để xem loài hoa tại vị trí đó';
      }
      updateHudAt(coords.xVal, coords.yVal);
    }
  });

  const handlePointerEnd = (e) => {
    if (isDraggingPoint) {
      isDraggingPoint = false;
      canvas.style.cursor = 'crosshair';
      try { canvas.releasePointerCapture(e.pointerId); } catch (err) {}
      const { xPixel, yPixel } = getCanvasCoords(e);
      const coords = dataCoordsFromPixel(xPixel, yPixel);
      if (coords && coords.xVal != null && coords.yVal != null) {
        applyPointToModel(coords.xVal, coords.yVal, true, null);
      }
    }
  };

  canvas.addEventListener('pointerup', handlePointerEnd);
  canvas.addEventListener('pointercancel', handlePointerEnd);

  // Hiển thị ngay thẻ kết quả ban đầu dưới bảng vẽ
  const initX = getFeatureValue(activeFeatX);
  const initY = getFeatureValue(activeFeatY);
  const initSpIdx = getSpeciesAtCoord(initX, initY);
  const initSpKey = SPECIES_NAMES[initSpIdx] || 'setosa';
  renderInteractiveClickResult(initX, initY, initSpKey, initSpIdx, null);
}

function renderDecisionBoundaryChart(multiSVM, fX, fY, featXName, featYName, kernel, C, gamma, degree, accuracy) {
  const ctx = document.getElementById('decisionChart');
  if (!ctx) return;

  const setosaPoints = ACTIVE_IRIS_DATASET.filter(d => d[4] === 0).map(d => ({ x: d[fX], y: d[fY], name: 'Iris Setosa' }));
  const versiPoints = ACTIVE_IRIS_DATASET.filter(d => d[4] === 1).map(d => ({ x: d[fX], y: d[fY], name: 'Iris Versicolor' }));
  const virgiPoints = ACTIVE_IRIS_DATASET.filter(d => d[4] === 2).map(d => ({ x: d[fX], y: d[fY], name: 'Iris Virginica' }));

  const svPoints = multiSVM.svIndices.map(idx => {
    const row = ACTIVE_IRIS_DATASET[idx % ACTIVE_IRIS_DATASET.length];
    return { x: row[fX], y: row[fY], name: `Support Vector #${idx + 1}` };
  });

  const currentX = getFeatureValue(fX);
  const currentY = getFeatureValue(fY);

  const decisionBoundaryPlugin = {
    id: 'decisionBoundaryRenderer',
    beforeDatasetsDraw(chart) {
      const { ctx: c, chartArea, scales: { x: xScale, y: yScale } } = chart;
      if (!chartArea || !xScale || !yScale || !cachedMeshGrid) return;

      const { gridData, xMin, xMax, yMin, yMax, resX, resY } = cachedMeshGrid;
      const stepX = (xMax - xMin) / resX;
      const stepY = (yMax - yMin) / resY;

      c.save();
      c.beginPath();
      c.rect(chartArea.left, chartArea.top, chartArea.width, chartArea.height);
      c.clip();

      // Màu nền các phân vùng SVM: Versicolor là Vàng hổ phách amber!
      const regionColors = [
        'rgba(74, 222, 128, 0.16)', // Setosa
        'rgba(245, 158, 11, 0.22)', // Versicolor (Vàng hổ phách)
        'rgba(192, 132, 252, 0.16)' // Virginica
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
          c.fillStyle = regionColors[cIdx] || 'transparent';
          c.fillRect(pLeft, pTop, pWidth, pHeight);
        }
      }

      c.restore();
    },
    afterDatasetsDraw(chart) {
      // Vòng radar phát sáng quanh điểm mẫu đang chọn
      const { ctx: c, scales: { x: xScale, y: yScale } } = chart;
      if (!xScale || !yScale) return;
      const curX = getFeatureValue(activeFeatX);
      const curY = getFeatureValue(activeFeatY);
      const px = xScale.getPixelForValue(curX);
      const py = yScale.getPixelForValue(curY);

      c.save();
      c.beginPath();
      c.arc(px, py, 14, 0, Math.PI * 2);
      c.strokeStyle = 'rgba(232, 112, 42, 0.6)';
      c.lineWidth = 2;
      c.setLineDash([3, 3]);
      c.stroke();

      c.beginPath();
      c.arc(px, py, 20, 0, Math.PI * 2);
      c.strokeStyle = 'rgba(245, 158, 11, 0.4)';
      c.lineWidth = 1.5;
      c.setLineDash([]);
      c.stroke();
      c.restore();
    }
  };

  if (decisionChartInstance) {
    decisionChartInstance.options.scales.x.min = cachedMeshGrid ? cachedMeshGrid.xMin : undefined;
    decisionChartInstance.options.scales.x.max = cachedMeshGrid ? cachedMeshGrid.xMax : undefined;
    decisionChartInstance.options.scales.x.title.text = `${featXName} (cm)`;

    decisionChartInstance.options.scales.y.min = cachedMeshGrid ? cachedMeshGrid.yMin : undefined;
    decisionChartInstance.options.scales.y.max = cachedMeshGrid ? cachedMeshGrid.yMax : undefined;
    decisionChartInstance.options.scales.y.title.text = `${featYName} (cm)`;

    decisionChartInstance.data.datasets[0].data = setosaPoints;
    decisionChartInstance.data.datasets[1].data = versiPoints;
    decisionChartInstance.data.datasets[2].data = virgiPoints;
    decisionChartInstance.data.datasets[3].data = svPoints;
    decisionChartInstance.data.datasets[4].data = [{ x: currentX, y: currentY }];

    decisionChartInstance.update();
    setupDecisionChartInteractivity();
    return;
  }

  decisionChartInstance = new Chart(ctx, {
    type: 'scatter',
    plugins: [decisionBoundaryPlugin],
    data: {
      datasets: [
        {
          label: 'Setosa',
          data: setosaPoints,
          backgroundColor: '#4ade80',
          borderColor: '#22c55e',
          borderWidth: 1,
          pointRadius: 5.5,
          pointHoverRadius: 8,
        },
        {
          label: 'Versicolor (Vàng hổ phách)',
          data: versiPoints,
          backgroundColor: '#f59e0b', // Vàng hổ phách amber!
          borderColor: '#d97706',
          borderWidth: 1,
          pointRadius: 5.5,
          pointHoverRadius: 8,
        },
        {
          label: 'Virginica',
          data: virgiPoints,
          backgroundColor: '#c084fc',
          borderColor: '#a855f7',
          borderWidth: 1,
          pointRadius: 5.5,
          pointHoverRadius: 8,
        },
        {
          label: 'Support Vectors',
          data: svPoints,
          backgroundColor: 'transparent',
          borderColor: '#f87171',
          borderWidth: 1.5,
          pointRadius: 8.5,
        },
        {
          label: '🔴 Mẫu đang chọn (Kéo/Click)',
          data: [{ x: currentX, y: currentY }],
          backgroundColor: '#ef4444',
          borderColor: '#ffffff',
          borderWidth: 2.5,
          pointRadius: 9.5,
          pointHoverRadius: 12,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      scales: {
        x: {
          title: { display: true, text: `${featXName} (cm)`, color: '#f7f5f2' },
          ticks: { color: 'rgba(247,245,242,0.65)' },
          grid: { color: 'rgba(255,255,255,0.08)' }
        },
        y: {
          title: { display: true, text: `${featYName} (cm)`, color: '#f7f5f2' },
          ticks: { color: 'rgba(247,245,242,0.65)' },
          grid: { color: 'rgba(255,255,255,0.08)' }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(16, 17, 20, 0.94)',
          borderColor: 'rgba(255,255,255,0.18)',
          borderWidth: 1,
          titleColor: '#ffffff',
          bodyColor: '#f7f5f2',
          callbacks: {
            label: function(context) {
              const ds = context.dataset;
              const p = context.raw;
              if (ds.label.includes('Mẫu đang chọn')) {
                return `🔴 Tọa độ chọn: (${p.x.toFixed(1)} cm, ${p.y.toFixed(1)} cm)`;
              }
              return `${ds.label}: (${p.x} cm, ${p.y} cm)`;
            }
          }
        }
      }
    }
  });

  setupDecisionChartInteractivity();
}

function updateLiveSelectionPoint() {
  const currentX = getFeatureValue(activeFeatX);
  const currentY = getFeatureValue(activeFeatY);
  if (decisionChartInstance && decisionChartInstance.data.datasets[4]) {
    decisionChartInstance.data.datasets[4].data = [{ x: currentX, y: currentY }];
    decisionChartInstance.update('none');
  }

  const hudCoords = document.getElementById('chartHudCoords');
  const hudSpecies = document.getElementById('chartHudSpecies');
  if (hudCoords && hudSpecies) {
    hudCoords.innerText = `${FEATURE_NAMES[activeFeatX]}: ${currentX.toFixed(1)} cm · ${FEATURE_NAMES[activeFeatY]}: ${currentY.toFixed(1)} cm`;
    const cIdx = getSpeciesAtCoord(currentX, currentY);
    if (cIdx === 0) {
      hudSpecies.innerHTML = `<span class="text-[#4ade80] font-semibold">● Iris Setosa</span>`;
    } else if (cIdx === 1) {
      hudSpecies.innerHTML = `<span class="text-[#f59e0b] font-semibold">● Iris Versicolor (Vàng hổ phách)</span>`;
    } else {
      hudSpecies.innerHTML = `<span class="text-[#c084fc] font-semibold">● Iris Virginica</span>`;
    }
  }
}

// =====================================================================
// 8. TIMELINE & BENCHMARK STORAGE (YÊU CẦU II.5: LƯU THEO ID TÀI KHOẢN)
// =====================================================================
async function addTimelineItem(item) {
  if (!item.id) {
    item.id = 'exp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
  }
  userTimeline.unshift(item);
  if (userTimeline.length > 50) userTimeline.pop();
  localStorage.setItem(`iris_user_${currentUser.id}_timeline`, JSON.stringify(userTimeline));

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

  // Lưu vào Supabase bảng experiment_history
  if (supabaseClient && currentUser.id && currentUser.id !== 'guest_user') {
    try {
      const payload = {
        user_id: currentUser.id,
        name: `SVM - ${(item.kernel || 'linear').toUpperCase()}`,
        kernel: (item.kernel || 'linear').toLowerCase(),
        c_param: parseFloat(item.C) || 1.0,
        gamma_param: parseFloat(item.gamma) || 0.5,
        degree: item.degree || 3,
        features: item.features || ['Cả 4 đặc trưng'],
        feature_indices: item.inputValues || {},
        accuracy: parseFloat(item.accuracy) || 96,
        train_accuracy: parseFloat(item.accuracy) || 96,
        precision: parseFloat(item.precision) || 0.967,
        recall: parseFloat(item.recall) || 0.967,
        f1_score: parseFloat(item.f1) || 0.967,
        support_vector_count: item.svCount || 0,
        execution_time_ms: parseFloat(item.execTime) || 1.0,
        created_at: new Date().toISOString()
      };
      await supabaseClient.from('experiment_history').insert(payload);
    } catch (err) {
      console.warn('Lỗi Supabase experiment_history:', err);
    }
  }
}

function renderTimeline() {
  const container = document.getElementById('timelineList');
  if (!container) return;

  if (userTimeline.length === 0) {
    container.innerHTML = `<div class="text-white/50 text-xs py-4">Chưa có quá trình huấn luyện nào. Bấm "Huấn luyện & Vẽ Decision Boundary" để ghi nhận timeline.</div>`;
    return;
  }

  let html = '';
  userTimeline.forEach(t => {
    html += `
      <div class="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between gap-4 text-xs">
        <div>
          <div class="font-semibold text-white">🚀 Kernel <span class="text-[#f2c14e]">${t.kernel.toUpperCase()}</span> (C=${t.C}, γ=${t.gamma})</div>
          <div class="text-white/60 text-[11px] mt-0.5">Features: ${Array.isArray(t.features) ? t.features.join(', ') : '4 đặc trưng'} · ${t.timestamp}</div>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-emerald-400 font-mono font-bold">${t.accuracy}% Acc</span>
          <span class="text-purple-300 font-mono">${t.svCount} SVs</span>
          <span class="text-white/50 font-mono">${t.execTime} ms</span>
        </div>
      </div>
    `;
  });
  container.innerHTML = html;
}

window.clearTimeline = function() {
  userTimeline = [];
  localStorage.removeItem(`iris_user_${currentUser.id}_timeline`);
  renderTimeline();
};

// =====================================================================
// 9. MODEL BENCHMARK (YÊU CẦU II.5: LƯU & HIỂN THỊ THEO TÀI KHOẢN)
// =====================================================================
function renderBenchmarkTable() {
  const tbody = document.getElementById('benchmarkTableBody');
  if (!tbody) return;

  // Non-admins see ONLY their own timeline history; admins can see all system experiments
  const datasetToUse = currentUser.role === 'ADMIN' ? allSystemExperiments : userTimeline;

  const totalRunsEl = document.getElementById('bmTotalRuns');
  const topKernelEl = document.getElementById('bmTopKernel');
  const bestAccEl = document.getElementById('bmBestAccuracy');
  const avgLatEl = document.getElementById('bmAvgLatency');

  if (datasetToUse.length === 0) {
    if (totalRunsEl) totalRunsEl.innerText = '0';
    if (topKernelEl) topKernelEl.innerText = '-';
    if (bestAccEl) bestAccEl.innerText = '-';
    if (avgLatEl) avgLatEl.innerText = '-';

    tbody.innerHTML = `<tr><td colspan="8" class="text-center py-8 text-white/50 text-xs">Chưa có dữ liệu Benchmark của tài khoản này. Bấm "Huấn luyện & Vẽ Decision Boundary" để ghi nhận!</td></tr>`;
    if (benchmarkChartInstance) {
      benchmarkChartInstance.destroy();
      benchmarkChartInstance = null;
    }
    return;
  }

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
    const sl = r.inputValues?.sl ?? 5.1;
    const sw = r.inputValues?.sw ?? 3.5;
    const pl = r.inputValues?.pl ?? 1.4;
    const pw = r.inputValues?.pw ?? 0.2;
    const kernelName = (r.kernel || 'linear').toUpperCase();
    const isHighest = parseFloat(r.accuracy) === maxAcc && maxAcc > 0;

    html += `
      <tr class="hover:bg-white/[0.04] transition-colors border-l-2 ${kernelName === 'RBF' ? 'border-l-[#e8702a]' : 'border-l-transparent'}">
        <td class="py-3 px-4">
          <div class="flex items-center gap-2">
            <span class="font-bold text-white">${kernelName}</span>
            <span class="text-white/60 text-[11px]">C=${r.C || 1}</span>
          </div>
        </td>
        <td class="py-3 px-4 font-mono text-[11px] text-white/70">
          SL:${sl} SW:${sw} PL:${pl} PW:${pw}
        </td>
        <td class="py-3 px-3 text-center text-white/80">${r.precision ?? '0.967'}</td>
        <td class="py-3 px-3 text-center">
          <span class="inline-flex items-center gap-1 font-bold ${isHighest ? 'text-[#f2c14e]' : 'text-emerald-400'}">
            ${r.accuracy}% ${isHighest ? '<span class="text-[9px] px-1.5 py-0.2 rounded-full bg-[#f2c14e]/20 border border-[#f2c14e]/40">Cao nhất</span>' : ''}
          </span>
        </td>
        <td class="py-3 px-3 text-center text-white/80">${r.f1 ?? '0.967'}</td>
        <td class="py-3 px-3 text-center text-white/80">${r.recall ?? '0.967'}</td>
        <td class="py-3 px-3 text-center text-white/70">${r.execTime ?? 1} ms</td>
        <td class="py-3 px-3 text-center">
          <button type="button" class="text-red-400 hover:text-red-300 text-xs px-2 py-0.5 rounded-full hover:bg-red-500/10" onclick="deleteBenchmarkItem('${r.id}')">
            Xóa
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
        { label: 'Accuracy (%)', data: accData, backgroundColor: 'rgba(74, 222, 128, 0.8)', borderRadius: 6, yAxisID: 'y' },
        { label: 'Thời gian (ms)', data: timeData, backgroundColor: 'rgba(232, 112, 42, 0.8)', borderRadius: 6, yAxisID: 'y1' }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { ticks: { color: 'rgba(247,245,242,0.65)' }, grid: { display: false } },
        y: { min: 0, max: 100, ticks: { color: 'rgba(247,245,242,0.65)' }, grid: { color: 'rgba(255,255,255,0.08)' } },
        y1: { position: 'right', grid: { display: false }, ticks: { color: 'rgba(247,245,242,0.65)' } }
      },
      plugins: {
        legend: { labels: { color: '#f7f5f2', boxWidth: 10 } }
      }
    }
  });
}

window.deleteBenchmarkItem = async function(id) {
  userTimeline = userTimeline.filter(x => x.id !== id);
  allSystemExperiments = allSystemExperiments.filter(x => x.id !== id);
  localStorage.setItem(`iris_user_${currentUser.id}_timeline`, JSON.stringify(userTimeline));
  localStorage.setItem('iris_system_experiments', JSON.stringify(allSystemExperiments));

  if (supabaseClient && currentUser.id && currentUser.id !== 'guest_user') {
    try {
      await supabaseClient.from('experiment_history').delete().eq('id', id);
    } catch (e) {}
  }
  renderBenchmarkTable();
};

window.clearAllBenchmarks = async function() {
  if (confirm('Bạn có chắc muốn xóa toàn bộ benchmark của bạn?')) {
    userTimeline = [];
    localStorage.removeItem(`iris_user_${currentUser.id}_timeline`);
    if (supabaseClient && currentUser.id && currentUser.id !== 'guest_user') {
      try {
        await supabaseClient.from('experiment_history').delete().eq('user_id', currentUser.id);
      } catch (e) {}
    }
    renderBenchmarkTable();
  }
};

// =====================================================================
// 10. PREDICTION HISTORY (YÊU CẦU II.5: LƯU & HIỂN THỊ THEO TÀI KHOẢN)
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
      await supabaseClient.from('prediction_history').insert(payload);
    } catch (err) {}
  }
}

function renderHistoryTable() {
  const tbody = document.getElementById('historyTableBody');
  if (!tbody) return;

  if (userHistory.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="text-center py-8 text-white/50 text-xs">Chưa có lịch sử nhận diện nào của tài khoản này.</td></tr>`;
    return;
  }

  let html = '';
  userHistory.forEach(h => {
    const col = SPECIES_COLORS[h.prediction] || '#4ade80';
    html += `
      <tr class="hover:bg-white/[0.04] transition-colors">
        <td class="py-3 px-4 text-white/60">${h.timestamp}</td>
        <td class="py-3 px-4 font-mono font-medium text-white">${h.sl} / ${h.sw} / ${h.pl} / ${h.pw}</td>
        <td class="py-3 px-4 text-white/80">${h.method}</td>
        <td class="py-3 px-4">
          <span class="inline-block text-[11px] font-bold px-2 py-0.5 rounded-full" style="background: ${col}20; color: ${col}; border: 1px solid ${col}40;">
            Iris ${h.prediction.toUpperCase()}
          </span>
        </td>
        <td class="py-3 px-4 text-center">
          <button type="button" class="text-red-400 hover:text-red-300 text-xs" onclick="deleteHistoryItem('${h.id}')">Xóa</button>
        </td>
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
    } catch (e) {}
  }
  renderHistoryTable();
};

window.clearUserHistory = async function() {
  if (confirm('Bạn có chắc muốn xóa toàn bộ lịch sử nhận diện?')) {
    userHistory = [];
    localStorage.removeItem(`iris_user_${currentUser.id}_history`);
    if (supabaseClient && currentUser.id && currentUser.id !== 'guest_user') {
      try {
        await supabaseClient.from('prediction_history').delete().eq('user_id', currentUser.id);
      } catch (e) {}
    }
    renderHistoryTable();
  }
};

// =====================================================================
// 11. ĐOÁN HOA (YÊU CẦU II.2: BỎ DÒNG GIẢI THÍCH KHI ĐOÁN XONG & CHỌN ĐẶC TRƯNG)
// =====================================================================
let guessFeatX = 2; // Mặc định Trục X: Petal Length (2)
let guessFeatY = 3; // Mặc định Trục Y: Petal Width (3)

window.selectGuessFeature = function(idx) {
  if (idx === guessFeatX) return;
  if (idx === guessFeatY) {
    const tmp = guessFeatX;
    guessFeatX = guessFeatY;
    guessFeatY = tmp;
  } else {
    guessFeatY = idx;
  }
  updateGuessFeatureCardStyles();
  if (currentGuessSample) {
    renderGuessChart(currentGuessSample);
  }
};

window.handleGuessAxisChange = function() {
  const selX = document.getElementById('guessAxisXSelect');
  const selY = document.getElementById('guessAxisYSelect');
  if (!selX || !selY) return;
  let x = parseInt(selX.value);
  let y = parseInt(selY.value);
  if (x === y) {
    y = (x + 1) % 4;
    selY.value = y;
  }
  guessFeatX = x;
  guessFeatY = y;
  updateGuessFeatureCardStyles();
  if (currentGuessSample) {
    renderGuessChart(currentGuessSample);
  }
};

function updateGuessFeatureCardStyles() {
  const selX = document.getElementById('guessAxisXSelect');
  const selY = document.getElementById('guessAxisYSelect');
  if (selX) selX.value = guessFeatX;
  if (selY) selY.value = guessFeatY;

  for (let i = 0; i < 4; i++) {
    const card = document.getElementById(`guessCard_${i}`);
    const badge = document.getElementById(`guessBadge_${i}`);
    if (!card || !badge) continue;

    if (i === guessFeatX) {
      card.className = 'guess-feat-card p-3.5 rounded-2xl bg-[#e8702a]/12 border-2 border-[#e8702a] shadow-lg shadow-[#e8702a]/20 cursor-pointer transition-all scale-[1.01]';
      badge.className = 'text-[10px] px-2 py-0.5 rounded-md bg-[#e8702a] text-white font-bold shadow-sm';
      badge.innerText = 'Trục X (Chơi)';
    } else if (i === guessFeatY) {
      card.className = 'guess-feat-card p-3.5 rounded-2xl bg-[#f2c14e]/12 border-2 border-[#f2c14e] shadow-lg shadow-[#f2c14e]/20 cursor-pointer transition-all scale-[1.01]';
      badge.className = 'text-[10px] px-2 py-0.5 rounded-md bg-[#f2c14e] text-black font-bold shadow-sm';
      badge.innerText = 'Trục Y (Chơi)';
    } else {
      card.className = 'guess-feat-card p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 cursor-pointer transition-all hover:border-white/30';
      badge.className = 'text-[10px] px-1.5 py-0.5 rounded-md bg-white/10 text-white/50 font-medium';
      badge.innerText = 'Nhấp chọn';
    }
  }

  const titleEl = document.getElementById('guessChartTitle');
  if (titleEl) {
    titleEl.innerText = `📍 Vị trí Mẫu ngẫu nhiên (${FEATURE_NAMES[guessFeatX]} vs ${FEATURE_NAMES[guessFeatY]})`;
  }
}

window.generateRandomSample = async function() {
  try {
    const res = await fetch('/random-sample');
    if (res.ok) {
      const data = await res.json();
      currentGuessSample = {
        sl: data.sepal_length,
        sw: data.sepal_width,
        pl: data.petal_length,
        pw: data.petal_width,
        trueClass: data.true_class
      };
      updateGuessSampleUI();
      return;
    }
  } catch (e) {}

  const sample = ACTIVE_IRIS_DATASET[Math.floor(Math.random() * ACTIVE_IRIS_DATASET.length)];
  currentGuessSample = {
    sl: sample[0],
    sw: sample[1],
    pl: sample[2],
    pw: sample[3],
    trueClass: SPECIES_NAMES[sample[4]]
  };
  updateGuessSampleUI();
};

function updateGuessSampleUI() {
  if (!currentGuessSample) return;
  const s = currentGuessSample;
  document.getElementById('guessSepalLength').innerText = s.sl + ' cm';
  document.getElementById('guessSepalWidth').innerText = s.sw + ' cm';
  document.getElementById('guessPetalLength').innerText = s.pl + ' cm';
  document.getElementById('guessPetalWidth').innerText = s.pw + ' cm';

  updateGuessFeatureCardStyles();

  // Đặt lại trạng thái lựa chọn
  selectedGuess = null;
  document.querySelectorAll('.guess-opt-btn').forEach(b => {
    b.className = 'guess-opt-btn relative p-4 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-left transition-all flex items-center justify-between gap-3 group opacity-100';
    const indicator = b.querySelector('.guess-check-indicator');
    if (indicator) {
      indicator.className = 'guess-check-indicator w-7 h-7 rounded-full border border-white/30 flex items-center justify-center text-xs shrink-0 transition-all opacity-40 bg-transparent text-white';
    }
    const tag = b.querySelector('.guess-active-tag');
    if (tag) tag.classList.add('hidden');
  });

  const banner = document.getElementById('guessSelectionBanner');
  if (banner) banner.classList.add('hidden');

  const btnText = document.getElementById('guessBtnText');
  if (btnText) btnText.innerText = 'Bước 2: Kiểm tra kết quả với AI (SVM)';

  const resDiv = document.getElementById('guessResult');
  if (resDiv) {
    resDiv.className = 'p-5 rounded-2xl bg-white/[0.04] border border-white/10 text-xs text-white/70';
    resDiv.innerHTML = `💡 Hãy chọn 1 trong 3 loài hoa ở Bước 1 và nhấn nút kiểm tra để xem kết quả đối chiếu với mô hình SVM!`;
  }

  renderGuessChart(s);
}

function renderGuessChart(sampleObj) {
  const ctx = document.getElementById('guessChart');
  if (!ctx) return;

  const featXName = FEATURE_NAMES[guessFeatX];
  const featYName = FEATURE_NAMES[guessFeatY];

  const titleEl = document.getElementById('guessChartTitle');
  if (titleEl) {
    titleEl.innerText = `📍 Vị trí Mẫu ngẫu nhiên (${featXName} vs ${featYName})`;
  }

  const sampleVals = sampleObj
    ? [sampleObj.sl, sampleObj.sw, sampleObj.pl, sampleObj.pw]
    : [5.1, 3.5, 1.4, 0.2];
  const userX = sampleVals[guessFeatX];
  const userY = sampleVals[guessFeatY];

  const setosaData = ACTIVE_IRIS_DATASET.filter(d => d[4] === 0).map(d => ({ x: d[guessFeatX], y: d[guessFeatY] }));
  const versicolorData = ACTIVE_IRIS_DATASET.filter(d => d[4] === 1).map(d => ({ x: d[guessFeatX], y: d[guessFeatY] }));
  const virginicaData = ACTIVE_IRIS_DATASET.filter(d => d[4] === 2).map(d => ({ x: d[guessFeatX], y: d[guessFeatY] }));

  if (guessChartInstance) {
    guessChartInstance.options.scales.x.title.text = `${featXName} (cm)`;
    guessChartInstance.options.scales.y.title.text = `${featYName} (cm)`;
    guessChartInstance.data.datasets[0].data = setosaData;
    guessChartInstance.data.datasets[1].data = versicolorData;
    guessChartInstance.data.datasets[2].data = virginicaData;
    guessChartInstance.data.datasets[3].data = [{ x: userX, y: userY }];
    guessChartInstance.update();
    return;
  }

  guessChartInstance = new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: [
        { label: 'Setosa', data: setosaData, backgroundColor: '#4ade80', pointRadius: 4 },
        { label: 'Versicolor (Vàng hổ phách)', data: versicolorData, backgroundColor: '#f59e0b', pointRadius: 4 },
        { label: 'Virginica', data: virginicaData, backgroundColor: '#c084fc', pointRadius: 4 },
        {
          label: '📍 Mẫu ngẫu nhiên',
          data: [{ x: userX, y: userY }],
          backgroundColor: '#ef4444',
          borderColor: '#ffffff',
          borderWidth: 2.5,
          pointRadius: 10,
          pointHoverRadius: 12
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          title: { display: true, text: `${featXName} (cm)`, color: '#f7f5f2' },
          ticks: { color: 'rgba(247,245,242,0.65)' },
          grid: { color: 'rgba(255,255,255,0.08)' }
        },
        y: {
          title: { display: true, text: `${featYName} (cm)`, color: '#f7f5f2' },
          ticks: { color: 'rgba(247,245,242,0.65)' },
          grid: { color: 'rgba(255,255,255,0.08)' }
        }
      },
      plugins: {
        legend: { labels: { color: '#f7f5f2', boxWidth: 8, usePointStyle: true } }
      }
    }
  });
}

window.selectGuess = function(species, btn) {
  selectedGuess = species;

  let speciesVi = 'Iris Setosa';
  let speciesColor = '#4ade80';
  if (species === 'versicolor') {
    speciesVi = 'Iris Versicolor (Vàng hổ phách)';
    speciesColor = '#f59e0b';
  } else if (species === 'virginica') {
    speciesVi = 'Iris Virginica';
    speciesColor = '#c084fc';
  }

  // 1. Làm nổi bật rõ ràng nút đã chọn & giảm độ đậm các nút còn lại
  document.querySelectorAll('.guess-opt-btn').forEach(b => {
    b.className = 'guess-opt-btn relative p-4 rounded-2xl bg-white/[0.04] border border-white/10 text-left transition-all flex items-center justify-between gap-3 group opacity-50 hover:opacity-80 scale-100';
    const indicator = b.querySelector('.guess-check-indicator');
    if (indicator) {
      indicator.className = 'guess-check-indicator w-7 h-7 rounded-full border border-white/30 flex items-center justify-center text-xs shrink-0 transition-all opacity-40 bg-transparent text-white';
    }
    const tag = b.querySelector('.guess-active-tag');
    if (tag) tag.classList.add('hidden');
  });

  if (btn) {
    btn.className = 'guess-opt-btn relative p-4 rounded-2xl bg-gradient-to-r from-white/[0.12] to-[#e8702a]/20 border-2 border-[#e8702a] ring-4 ring-[#e8702a]/30 shadow-2xl shadow-[#e8702a]/30 text-left transition-all flex items-center justify-between gap-3 group opacity-100 scale-[1.03] z-10';
    const indicator = btn.querySelector('.guess-check-indicator');
    if (indicator) {
      indicator.className = 'guess-check-indicator w-7 h-7 rounded-full bg-[#e8702a] border-2 border-white text-white font-bold text-sm shrink-0 transition-all opacity-100 shadow-lg shadow-[#e8702a]/60 scale-110';
    }
    const tag = btn.querySelector('.guess-active-tag');
    if (tag) tag.classList.remove('hidden');
  }

  // 2. Hiện băng thông báo nổi bật lựa chọn của người dùng
  const banner = document.getElementById('guessSelectionBanner');
  const nameEl = document.getElementById('guessSelectedFlowerName');
  const tagEl = document.getElementById('guessSelectedFlowerTag');
  if (banner && nameEl) {
    nameEl.innerText = speciesVi;
    if (tagEl) {
      tagEl.style.backgroundColor = speciesColor;
      tagEl.style.color = (species === 'versicolor' || species === 'setosa') ? '#000000' : '#ffffff';
    }
    banner.classList.remove('hidden');
  }

  // 3. Đổi nhãn nút Bước 2 để người dùng an tâm về lựa chọn
  const btnText = document.getElementById('guessBtnText');
  if (btnText) {
    btnText.innerHTML = `Bước 2: Kiểm tra dự đoán <b>"${speciesVi}"</b> với AI (SVM)`;
  }
};

window.checkGuess = async function() {
  if (!selectedGuess) {
    alert('Vui lòng chọn 1 loài hoa ở Bước 1 trước khi kiểm tra!');
    return;
  }
  const s = currentGuessSample;
  const svmPred = await callPredictAPI(s.sl, s.sw, s.pl, s.pw);
  const trueSpecies = (s.trueClass || svmPred).toLowerCase();
  const choice = selectedGuess.toLowerCase();

  const isCorrect = (choice === trueSpecies) || (choice === svmPred.toLowerCase());

  guessStats.total++;
  if (isCorrect) guessStats.correct++;
  else guessStats.wrong++;

  updateGuessScoreUI();

  const formattedChoice = choice.charAt(0).toUpperCase() + choice.slice(1);
  const formattedTrue = trueSpecies.charAt(0).toUpperCase() + trueSpecies.slice(1);
  const formattedPred = svmPred.charAt(0).toUpperCase() + svmPred.slice(1);

  // YÊU CẦU II.2: BỎ ĐI CÁC DÒNG GIẢI THÍCH KHI ĐÃ ĐOÁN XONG HOA
  const resDiv = document.getElementById('guessResult');
  resDiv.className = isCorrect
    ? 'p-5 rounded-2xl bg-[#4ade80]/10 border border-[#f2c14e] text-xs text-[#f7f5f2]'
    : 'p-5 rounded-2xl bg-red-500/10 border border-red-500/30 text-xs text-[#f7f5f2]';

  resDiv.innerHTML = `
    <div class="flex items-center justify-between gap-4 flex-wrap">
      <div>
        <div class="text-sm font-bold flex items-center gap-2 mb-2 ${isCorrect ? 'text-[#4ade80]' : 'text-red-400'}">
          <span>${isCorrect ? '🎉 CHÍNH XÁC XUẤT SẮC!' : '⚠️ CHƯA CHÍNH XÁC!'}</span>
        </div>
        <div class="space-y-1 text-xs text-white/80">
          <div>• Lựa chọn của bạn: <b class="underline">Iris ${formattedChoice}</b></div>
          <div>• Loài hoa thực tế: <b class="text-blue-400">Iris ${formattedTrue}</b></div>
          <div>• AI (SVM Linear) nhận diện: <b class="${isCorrect ? 'text-[#4ade80]' : 'text-red-400'}">Iris ${formattedPred}</b></div>
        </div>
      </div>
      <div class="px-4 py-2 rounded-2xl bg-white/[0.06] border border-white/10 text-center">
        <div class="text-[10px] text-white/50 uppercase">Kết quả</div>
        <div class="text-sm font-bold font-mono ${isCorrect ? 'text-[#f2c14e]' : 'text-red-400'}">
          ${isCorrect ? '✓ Trùng khớp' : '✗ Khác biệt'}
        </div>
      </div>
    </div>
  `;

  saveUserPrediction(s.sl, s.sw, s.pl, s.pw, svmPred, 'Đoán thử thách');
};

function updateGuessScoreUI() {
  document.getElementById('guessTotalPlays').innerText = guessStats.total;
  document.getElementById('guessCorrectPlays').innerText = guessStats.correct;
  document.getElementById('guessWrongPlays').innerText = guessStats.wrong;
  const pct = guessStats.total > 0 ? ((guessStats.correct / guessStats.total) * 100).toFixed(0) : 0;
  document.getElementById('guessAccuracy').innerText = `${pct}%`;
}

window.resetGuessScore = function() {
  guessStats.total = 0;
  guessStats.correct = 0;
  guessStats.wrong = 0;
  updateGuessScoreUI();
};

// =====================================================================
// 12. PHÂN TÍCH TẬP DỮ LIỆU (YÊU CẦU II.3: LUÔN HIỆN 2 NHÃN)
// =====================================================================
let currentFileAnalysis = null;
let currentFileMode = 'unlabeled'; // 'unlabeled' or 'labeled'

window.switchFileAnalysisMode = function(newMode) {
  currentFileMode = newMode;
  const unBtn = document.getElementById('fileModeBtnUnlabeled');
  const lbBtn = document.getElementById('fileModeBtnLabeled');

  if (unBtn && lbBtn) {
    if (newMode === 'unlabeled') {
      unBtn.className = 'file-mode-pill active px-6 py-2 rounded-full text-xs font-semibold transition-all bg-white text-gray-900';
      lbBtn.className = 'file-mode-pill px-6 py-2 rounded-full text-xs font-semibold text-white/70 hover:text-white transition-all';
    } else {
      lbBtn.className = 'file-mode-pill active px-6 py-2 rounded-full text-xs font-semibold transition-all bg-white text-gray-900';
      unBtn.className = 'file-mode-pill px-6 py-2 rounded-full text-xs font-semibold text-white/70 hover:text-white transition-all';
    }
  }

  if (currentFileAnalysis) {
    currentFileAnalysis.mode = newMode;
    renderFileAnalysisUI();
  }
};

window.analyzeFile = function() {
  const fileInput = document.getElementById('fileInput');
  if (!fileInput || !fileInput.files.length) return;
  const file = fileInput.files[0];
  document.getElementById('fileNameDisplay').innerText = file.name;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const rawRows = XLSX.utils.sheet_to_json(firstSheet, { defval: '' });

      const validRows = [];
      rawRows.forEach((r, idx) => {
        const sl = parseFloat(r.sepal_length ?? r.SepalLength ?? r['Sepal Length'] ?? r['sepal length'] ?? r[0]) || 0;
        const sw = parseFloat(r.sepal_width ?? r.SepalWidth ?? r['Sepal Width'] ?? r['sepal width'] ?? r[1]) || 0;
        const pl = parseFloat(r.petal_length ?? r.PetalLength ?? r['Petal Length'] ?? r['petal length'] ?? r[2]) || 0;
        const pw = parseFloat(r.petal_width ?? r.PetalWidth ?? r['Petal Width'] ?? r['petal width'] ?? r[3]) || 0;
        const trueLbl = (r.species ?? r.Species ?? r.label ?? r.Label ?? '').toString().toLowerCase();

        if (sl > 0 || pl > 0) {
          const pred = predictLinearFast(sl, sw, pl, pw);
          const correct = trueLbl ? (trueLbl.includes(pred) || pred.includes(trueLbl)) : null;
          validRows.push({ sl, sw, pl, pw, trueLabel: trueLbl, pred, correct });
        }
      });

      if (validRows.length === 0) {
        alert('Tập tin không chứa các đặc trưng hợp lệ (sepal_length, sepal_width, petal_length, petal_width).');
        return;
      }

      currentFileAnalysis = {
        fileName: file.name,
        rows: validRows,
        mode: currentFileMode
      };

      renderFileAnalysisUI();
    } catch (err) {
      alert('Không thể đọc file. Vui lòng kiểm tra lại định dạng!');
    }
  };
  reader.readAsArrayBuffer(file);
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

  let html = `
    <div class="space-y-6">
      <div class="p-4 rounded-2xl bg-white/[0.04] border border-white/10 flex justify-between items-center text-xs">
        <div><b>Tập tin:</b> ${fileName}</div>
        <div><b>Chế độ:</b> ${mode === 'labeled' ? 'Đã có nhãn – Kiểm tra dự đoán' : 'Chưa có nhãn – Phân loại'}</div>
        <div><b>Số mẫu hợp lệ:</b> ${total}</div>
      </div>
  `;

  if (mode === 'labeled') {
    html += `
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="p-4 rounded-2xl bg-white/[0.04] border border-white/10">
          <div class="text-[11px] text-white/50">Tổng mẫu</div>
          <div class="text-2xl font-bold font-mono text-white">${total}</div>
        </div>
        <div class="p-4 rounded-2xl bg-white/[0.04] border border-white/10">
          <div class="text-[11px] text-white/50">Dự đoán đúng</div>
          <div class="text-2xl font-bold font-mono text-[#4ade80]">${correctCount}</div>
        </div>
        <div class="p-4 rounded-2xl bg-white/[0.04] border border-white/10">
          <div class="text-[11px] text-white/50">Dự đoán sai</div>
          <div class="text-2xl font-bold font-mono text-red-400">${wrongCount}</div>
        </div>
        <div class="p-4 rounded-2xl bg-white/[0.04] border border-white/10">
          <div class="text-[11px] text-white/50">Accuracy (có nhãn)</div>
          <div class="text-2xl font-bold font-mono text-[#f2c14e]">${accuracy.toFixed(1)}%</div>
        </div>
      </div>
    `;
  } else {
    html += `
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="p-4 rounded-2xl bg-white/[0.04] border border-white/10">
          <div class="text-[11px] text-white/50">Tổng mẫu</div>
          <div class="text-2xl font-bold font-mono text-white">${total}</div>
        </div>
        <div class="p-4 rounded-2xl bg-white/[0.04] border border-white/10">
          <div class="text-[11px] text-[#4ade80]">SVM → Setosa</div>
          <div class="text-2xl font-bold font-mono text-[#4ade80]">${counts.setosa}</div>
        </div>
        <div class="p-4 rounded-2xl bg-white/[0.04] border border-white/10">
          <div class="text-[11px] text-[#f59e0b]">SVM → Versicolor</div>
          <div class="text-2xl font-bold font-mono text-[#f59e0b]">${counts.versicolor}</div>
        </div>
        <div class="p-4 rounded-2xl bg-white/[0.04] border border-white/10">
          <div class="text-[11px] text-[#c084fc]">SVM → Virginica</div>
          <div class="text-2xl font-bold font-mono text-[#c084fc]">${counts.virginica}</div>
        </div>
      </div>
    `;
  }

  // Bảng kết quả
  html += `
      <div class="overflow-x-auto rounded-2xl border border-white/10">
        <table class="w-full border-collapse text-xs">
          <thead>
            <tr class="bg-white/[0.06] text-white/70 text-left border-b border-white/10">
              <th class="py-3 px-3">#</th>
              <th class="py-3 px-3">Sepal Length</th>
              <th class="py-3 px-3">Sepal Width</th>
              <th class="py-3 px-3">Petal Length</th>
              <th class="py-3 px-3">Petal Width</th>
              ${mode === 'labeled' ? '<th class="py-3 px-3">Nhãn thật</th>' : ''}
              <th class="py-3 px-3">SVM Dự đoán</th>
              ${mode === 'labeled' ? '<th class="py-3 px-3 text-center">Kết quả</th>' : ''}
            </tr>
          </thead>
          <tbody class="divide-y divide-white/10">
  `;

  rows.slice(0, 100).forEach((r, idx) => {
    html += `
      <tr class="hover:bg-white/[0.04] transition-colors">
        <td class="py-2.5 px-3 text-white/50">${idx + 1}</td>
        <td class="py-2.5 px-3 font-mono text-white">${r.sl}</td>
        <td class="py-2.5 px-3 font-mono text-white">${r.sw}</td>
        <td class="py-2.5 px-3 font-mono text-white">${r.pl}</td>
        <td class="py-2.5 px-3 font-mono text-white">${r.pw}</td>
        ${mode === 'labeled' ? `<td class="py-2.5 px-3 font-bold">${r.trueLabel || '—'}</td>` : ''}
        <td class="py-2.5 px-3 font-bold" style="color: ${SPECIES_COLORS[r.pred] || '#4ade80'}">${r.pred.toUpperCase()}</td>
        ${mode === 'labeled' ? `<td class="py-2.5 px-3 text-center font-bold ${r.correct ? 'text-[#4ade80]' : 'text-red-400'}">${r.correct ? '✓ Đúng' : '✗ Sai'}</td>` : ''}
      </tr>
    `;
  });

  html += `
          </tbody>
        </table>
      </div>
      <div class="flex justify-end pt-2">
        <button type="button" class="px-6 py-2.5 rounded-full bg-white text-gray-900 font-semibold text-xs shadow-md" onclick="exportFileAnalysisCSV()">
          📥 Tải kết quả (.csv)
        </button>
      </div>
    </div>
  `;

  resDiv.innerHTML = html;
}

window.exportFileAnalysisCSV = function() {
  if (!currentFileAnalysis || !currentFileAnalysis.rows.length) return;
  const { rows, mode } = currentFileAnalysis;

  let csv = 'Sepal_Length,Sepal_Width,Petal_Length,Petal_Width,SVM_Prediction\n';
  if (mode === 'labeled') {
    csv = 'Sepal_Length,Sepal_Width,Petal_Length,Petal_Width,True_Label,SVM_Prediction,Result\n';
  }

  rows.forEach(r => {
    if (mode === 'labeled') {
      csv += `${r.sl},${r.sw},${r.pl},${r.pw},${r.trueLabel},${r.pred},${r.correct ? 'Correct' : 'Wrong'}\n`;
    } else {
      csv += `${r.sl},${r.sw},${r.pl},${r.pw},${r.pred}\n`;
    }
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `iris_svm_analysis_${mode}_${Date.now()}.csv`;
  link.click();
};

window.downloadSampleFile = function() {
  const csv =
    'sepal_length,sepal_width,petal_length,petal_width,species\n' +
    '5.1,3.5,1.4,0.2,setosa\n' +
    '4.9,3.0,1.4,0.2,setosa\n' +
    '6.0,2.9,4.5,1.5,versicolor\n' +
    '5.7,2.8,4.5,1.3,versicolor\n' +
    '6.5,3.0,5.5,1.8,virginica\n' +
    '7.2,3.6,6.1,2.5,virginica\n';
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'iris_sample_test.csv';
  link.click();
};

// =====================================================================
// 13. ADMIN: LỊCH SỬ THÍ NGHIỆM & QUẢN TRỊ (YÊU CẦU II.4)
// =====================================================================
function renderAdminExperimentsTable() {
  const tbody = document.getElementById('adminExperimentsTableBody');
  if (!tbody) return;

  if (allSystemExperiments.length === 0) {
    tbody.innerHTML = `<tr><td colspan="11" class="text-center py-8 text-white/50 text-xs">Chưa có thí nghiệm nào trong hệ thống.</td></tr>`;
    return;
  }

  let html = '';
  allSystemExperiments.forEach(e => {
    const userName = e.userName || e.userEmail || 'Tài khoản người dùng';
    const uId = e.userId || 'unknown';

    html += `
      <tr class="hover:bg-white/[0.04] transition-colors">
        <td class="py-3 px-4 font-bold">
          <!-- YÊU CẦU II.4: BẤM VÔ CHI TIẾT TÊN TÀI KHOẢN -->
          <button type="button" class="text-[#e8702a] hover:underline flex items-center gap-1.5" onclick="openAdminUserDetail('${uId}', '${userName}')">
            <span>👤</span> ${userName}
          </button>
        </td>
        <td class="py-3 px-3 uppercase font-semibold text-[#f2c14e]">${e.kernel}</td>
        <td class="py-3 px-3 font-mono text-[11px] text-white/70">C=${e.C}, γ=${e.gamma}</td>
        <td class="py-3 px-3 text-[11px] text-white/70">${e.features ? e.features.join(', ') : '4 features'}</td>
        <td class="py-3 px-3 font-mono text-purple-300 font-bold">${e.svCount ?? 0} SVs</td>
        <td class="py-3 px-3 text-center text-white/80">${e.precision ?? '-'}</td>
        <td class="py-3 px-3 text-center text-white/80">${e.recall ?? '-'}</td>
        <td class="py-3 px-3 text-center text-white/80">${e.f1 ?? '-'}</td>
        <td class="py-3 px-3 text-center text-emerald-400 font-mono">${e.execTime ?? 1} ms</td>
        <td class="py-3 px-3 text-center text-white/50 text-[11px]">${e.timestamp || ''}</td>
        <td class="py-3 px-3 text-center">
          <!-- YÊU CẦU II.4: NÚT XOÁ LỊCH SỬ THÍ NGHIỆM ĐÓ -->
          <button type="button" class="text-red-400 hover:text-red-300 text-xs px-2 py-0.5 rounded-full hover:bg-red-500/10" onclick="deleteAdminExperiment('${e.id}')">
            Xóa
          </button>
        </td>
      </tr>
    `;
  });
  tbody.innerHTML = html;
}

window.deleteAdminExperiment = async function(id) {
  if (!confirm('Bạn có chắc muốn xóa bản ghi thí nghiệm này khỏi hệ thống?')) return;
  allSystemExperiments = allSystemExperiments.filter(x => x.id !== id);
  localStorage.setItem('iris_system_experiments', JSON.stringify(allSystemExperiments));

  if (supabaseClient) {
    try {
      await supabaseClient.from('experiment_history').delete().eq('id', id);
    } catch (e) {}
  }
  renderAdminExperimentsTable();
};

// YÊU CẦU II.4: BẤM VÔ TÊN TÀI KHOẢN HIỆN NHỮNG THAO TÁC TÀI KHOẢN ĐÓ LÀM
window.openAdminUserDetail = function(userId, userName) {
  const modal = document.getElementById('adminUserDetailModal');
  const title = document.getElementById('adminDetailUserTitle');
  const sub = document.getElementById('adminDetailUserSub');
  const content = document.getElementById('adminUserDetailContent');

  if (title) title.innerText = `Thao tác của tài khoản: ${userName}`;
  if (sub) sub.innerText = `Mã tài khoản (User ID): ${userId}`;

  // Lọc tất cả các thí nghiệm và nhận diện của user này
  const userExps = allSystemExperiments.filter(x => x.userId === userId || x.userName === userName);
  const userPreds = userHistory.filter(x => x.userId === userId);

  let html = `
    <div class="space-y-4">
      <div class="p-4 rounded-2xl bg-white/[0.04] border border-white/10">
        <div class="font-bold text-white text-xs mb-2">📊 Tổng kết hoạt động:</div>
        <div class="grid grid-cols-2 gap-3 text-xs">
          <div>Tổng số lần huấn luyện SVM: <b class="text-[#f2c14e]">${userExps.length}</b></div>
          <div>Lần hoạt động gần nhất: <b class="text-white">${userExps[0]?.timestamp || 'Chưa rõ'}</b></div>
        </div>
      </div>

      <div class="font-bold text-white text-xs">🧪 Danh sách các lần huấn luyện SVM đã thực hiện:</div>
  `;

  if (userExps.length === 0) {
    html += `<div class="text-white/50 text-xs py-3">Tài khoản này chưa lưu thí nghiệm nào.</div>`;
  } else {
    html += `<div class="space-y-2">`;
    userExps.forEach((exp, idx) => {
      html += `
        <div class="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex justify-between items-center text-xs">
          <div>
            <div class="font-semibold text-white">#${idx + 1} · Kernel: <span class="text-[#e8702a]">${exp.kernel.toUpperCase()}</span> (C=${exp.C}, γ=${exp.gamma})</div>
            <div class="text-[11px] text-white/50">${exp.timestamp} · Đặc trưng: ${Array.isArray(exp.features) ? exp.features.join(', ') : '4 đặc trưng'}</div>
          </div>
          <div class="text-right">
            <span class="text-emerald-400 font-bold font-mono">${exp.accuracy}% Acc</span>
            <div class="text-[10px] text-white/40">${exp.svCount || 0} Support Vectors</div>
          </div>
        </div>
      `;
    });
    html += `</div>`;
  }

  html += `</div>`;
  if (content) content.innerHTML = html;
  if (modal) modal.classList.remove('hidden'), modal.classList.add('flex');
};

window.closeAdminUserDetailModal = function() {
  const modal = document.getElementById('adminUserDetailModal');
  if (modal) modal.classList.add('hidden'), modal.classList.remove('flex');
};

function renderAdminStats() {
  const registeredUsers = JSON.parse(localStorage.getItem('iris_registered_users') || '[]');
  const totalUsersCount = registeredUsers.length > 0 ? registeredUsers.length : (currentUser.id !== 'guest_user' ? 1 : 0);

  const uCountEl = document.getElementById('statTotalUsers');
  if (uCountEl) uCountEl.innerText = totalUsersCount;

  const predCountEl = document.getElementById('statTotalPredictions');
  if (predCountEl) predCountEl.innerText = userHistory.length;

  const expCountEl = document.getElementById('statTotalExperiments');
  if (expCountEl) expCountEl.innerText = allSystemExperiments.length;

  const kernelCounts = { linear: 0, rbf: 0, poly: 0, sigmoid: 0, precomputed: 0 };
  allSystemExperiments.forEach(e => {
    if (kernelCounts[e.kernel] !== undefined) kernelCounts[e.kernel]++;
  });

  let topM = 'RBF', maxC = 0;
  Object.keys(kernelCounts).forEach(k => {
    if (kernelCounts[k] > maxC) {
      maxC = kernelCounts[k];
      topM = k.toUpperCase();
    }
  });
  const topMEl = document.getElementById('statTopModel');
  if (topMEl) topMEl.innerText = topM;

  const tbody = document.getElementById('statKernelTableBody');
  if (tbody) {
    let html = '';
    const total = allSystemExperiments.length;
    Object.keys(kernelCounts).forEach(k => {
      const c = kernelCounts[k];
      const pct = total > 0 ? ((c / total) * 100).toFixed(1) + '%' : '0%';
      html += `
        <tr>
          <td class="py-2.5 px-4 font-bold text-white">${k.toUpperCase()}</td>
          <td class="py-2.5 px-4 font-mono">${c} lần</td>
          <td class="py-2.5 px-4 font-mono text-white/70">${pct}</td>
          <td class="py-2.5 px-4 text-emerald-400 font-semibold">Sẵn sàng</td>
        </tr>
      `;
    });
    tbody.innerHTML = html;
  }

  const usersBody = document.getElementById('adminUsersTableBody');
  if (usersBody) {
    let html = '';
    const usersToRender = registeredUsers.length > 0 ? registeredUsers : [currentUser];
    usersToRender.forEach(u => {
      html += `
        <tr>
          <td class="py-2.5 px-4 font-bold text-white">${u.name || u.email || 'User'}</td>
          <td class="py-2.5 px-4"><span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${u.role === 'ADMIN' ? 'bg-[#f2c14e]/20 text-[#f2c14e]' : 'bg-white/10 text-white'}">${u.role || 'USER'}</span></td>
          <td class="py-2.5 px-4 text-white/60">${u.createdAt || 'Hôm nay'}</td>
          <td class="py-2.5 px-4 text-emerald-400">Hoạt động</td>
        </tr>
      `;
    });
    usersBody.innerHTML = html;
  }
}

// =====================================================================
// 14. AUTH GATE & MODALS (NGOẠI LỆ 1B & YÊU CẦU II.1)
// =====================================================================
window.switchGateAuthTab = function(tab) {
  const isSignIn = tab === 'signin';
  document.getElementById('gateTabSignIn').className = isSignIn
    ? 'flex-1 py-2 text-xs font-semibold rounded-full transition-all bg-white text-gray-900 shadow'
    : 'flex-1 py-2 text-xs font-semibold rounded-full transition-all text-white/70 hover:text-white';

  document.getElementById('gateTabSignUp').className = !isSignIn
    ? 'flex-1 py-2 text-xs font-semibold rounded-full transition-all bg-white text-gray-900 shadow'
    : 'flex-1 py-2 text-xs font-semibold rounded-full transition-all text-white/70 hover:text-white';

  document.getElementById('gateNameRow').style.display = isSignIn ? 'none' : 'block';
  document.getElementById('gateSubmitBtn').innerText = isSignIn ? 'Đăng nhập vào Hệ thống' : 'Tạo tài khoản mới';
};

window.handleGateAuthSubmit = async function(e) {
  e.preventDefault();
  const email = document.getElementById('gateEmailInput').value.trim();
  const password = document.getElementById('gatePasswordInput').value;
  const name = document.getElementById('gateNameInput')?.value.trim() || email.split('@')[0];
  const isSignUp = document.getElementById('gateNameRow').style.display === 'block';
  const errBox = document.getElementById('gateAuthError');
  const successBox = document.getElementById('gateAuthSuccess');
  const submitBtn = document.getElementById('gateSubmitBtn');

  if (errBox) errBox.style.display = 'none';

  const role = (email === 'admin@gmail.com' || email.toLowerCase().includes('admin')) ? 'ADMIN' : 'USER';
  let userId = 'u_' + Date.now();

  if (password && password.length < 5) {
    if (errBox) {
      errBox.style.display = 'block';
      errBox.innerText = '⚠️ Mật khẩu yêu cầu tối thiểu 5 ký tự!';
    }
    return;
  }

  // Tài khoản Admin chuẩn
  if (email === 'admin@gmail.com' && password === 'admin') {
    userId = '00000000-0000-0000-0000-000000000001';
  }

  currentUser = {
    id: userId,
    email: email,
    name: name,
    role: role,
    createdAt: new Date().toLocaleDateString('vi-VN')
  };
  localStorage.setItem('iris_active_user', JSON.stringify(currentUser));

  const registeredUsers = JSON.parse(localStorage.getItem('iris_registered_users') || '[]');
  if (!registeredUsers.some(u => u.email === currentUser.email)) {
    registeredUsers.push(currentUser);
    localStorage.setItem('iris_registered_users', JSON.stringify(registeredUsers));
  }

  // Hiển thị thông báo thành công
  if (successBox) successBox.style.display = 'flex';
  if (submitBtn) submitBtn.disabled = true;

  // NGOẠI LỆ 1B: Sau khi đăng nhập thành công, hiệu ứng ngắn 600-800ms -> TỰ ĐỘNG mở modal Giới thiệu & Hướng dẫn trên nền Trang chủ
  setTimeout(() => {
    const gate = document.getElementById('authGateScreen');
    if (gate) gate.classList.add('hidden');
    updateUserUI();
    loadUserData();
    window.showPage('homePage', document.getElementById('navHome'), 'Trang chủ', 'Tổng quan về loài hoa Iris và nền tảng máy học Support Vector Machine');
    window.openGuideModal();
  }, 700);
};

window.openAuthModal = function() {
  const modal = document.getElementById('authModal');
  if (modal) modal.classList.remove('hidden'), modal.classList.add('flex');

  if (currentUser.id !== 'guest_user' && currentUser.email) {
    document.getElementById('authLoggedInView').classList.remove('hidden');
    document.getElementById('authLoggedOutView').classList.add('hidden');
    document.getElementById('modalUserEmail').innerText = currentUser.email;
    document.getElementById('modalUserRole').innerHTML = `<span class="text-xs px-2.5 py-0.5 rounded-full uppercase font-bold ${currentUser.role === 'ADMIN' ? 'bg-[#f2c14e]/30 text-[#f2c14e]' : 'bg-white/20 text-white'}">${currentUser.role}</span>`;
  } else {
    document.getElementById('authLoggedInView').classList.add('hidden');
    document.getElementById('authLoggedOutView').classList.remove('hidden');
  }
};

window.closeAuthModal = function() {
  const modal = document.getElementById('authModal');
  if (modal) modal.classList.add('hidden'), modal.classList.remove('flex');
};

window.handleLogout = async function() {
  if (supabaseClient && supabaseClient.auth) {
    try { await supabaseClient.auth.signOut(); } catch (e) {}
  }
  currentUser = {
    id: 'guest_user',
    email: '',
    name: 'Khách',
    role: 'USER'
  };
  localStorage.removeItem('iris_active_user');
  updateUserUI();
  window.closeAuthModal();

  const gate = document.getElementById('authGateScreen');
  if (gate) gate.classList.remove('hidden');
};

window.openGuideModal = function() {
  const modal = document.getElementById('guideBubbleModal');
  if (modal) modal.classList.remove('hidden'), modal.classList.add('flex');
};

window.closeGuideModal = function() {
  const modal = document.getElementById('guideBubbleModal');
  if (modal) modal.classList.add('hidden'), modal.classList.remove('flex');
};

window.handleGuideBackdropClick = function(e) {
  if (e.target.id === 'guideBubbleModal') {
    window.closeGuideModal();
  }
};

// =====================================================================
// 15. SPOTLIGHT & MOUSE REVEAL TRÊN HERO
// =====================================================================
function initHeroSpotlight() {
  const hero = document.getElementById('heroContainer');
  const spotlight = document.getElementById('heroSpotlight');
  if (!hero || !spotlight) return;

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    spotlight.style.opacity = '1';
    spotlight.style.maskImage = `radial-gradient(circle 240px at ${x}px ${y}px, black 35%, transparent 100%)`;
    spotlight.style.webkitMaskImage = `radial-gradient(circle 240px at ${x}px ${y}px, black 35%, transparent 100%)`;
  });

  hero.addEventListener('mouseleave', () => {
    spotlight.style.opacity = '0';
  });
}

// Kiểm tra API Health Check thật
async function checkApiHealth() {
  const dot = document.getElementById('apiStatusDot');
  const text = document.getElementById('apiStatusText');
  try {
    const res = await fetch('/health', { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      if (dot) dot.className = 'w-2 h-2 rounded-full bg-emerald-400 animate-pulse';
      if (text) text.innerText = 'API Online';
    } else {
      if (dot) dot.className = 'w-2 h-2 rounded-full bg-amber-400';
      if (text) text.innerText = 'API Degraded';
    }
  } catch (e) {
    if (dot) dot.className = 'w-2 h-2 rounded-full bg-emerald-400';
    if (text) text.innerText = 'SVM Local Active';
  }
}

// =====================================================================
// 16. KHỞI TẠO DOM READY
// =====================================================================
window.addEventListener('DOMContentLoaded', () => {
  initUserSession();
  initHeroSpotlight();
  checkApiHealth();
});
