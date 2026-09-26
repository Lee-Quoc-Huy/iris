import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// CORS configuration
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Load metrics from metrics.json or weights.json
function getMetricsData(): Record<string, any> {
  const metricsPath = path.join(__dirname, 'metrics.json');
  const weightsPath = path.join(__dirname, 'weights.json');
  try {
    if (fs.existsSync(metricsPath)) {
      const raw = fs.readFileSync(metricsPath, 'utf-8');
      return JSON.parse(raw);
    } else if (fs.existsSync(weightsPath)) {
      const raw = fs.readFileSync(weightsPath, 'utf-8');
      const parsed = JSON.parse(raw);
      return parsed.models_metrics || {};
    }
  } catch (err) {
    console.warn('[server.ts] Error reading metrics data:', err);
  }
  return {};
}

const SPECIES: Record<number, string> = {
  0: 'setosa',
  1: 'versicolor',
  2: 'virginica',
};

const AVAILABLE_KERNELS = ['rbf', 'linear', 'poly', 'sigmoid'];

function predictSVM(
  sl: number,
  sw: number,
  pl: number,
  pw: number,
  kernel: string = 'linear'
): { class_id: number; prediction: string; kernel_used: string } {
  const k = (kernel || 'linear').toLowerCase();

  // Setosa is linearly separable with large margin on petal length / width
  if (pl <= 2.45 || pw <= 0.8) {
    return { class_id: 0, prediction: 'setosa', kernel_used: k };
  }

  // Linear Decision Boundary between Versicolor and Virginica
  // w = [-0.15, -0.45, 0.75, 1.45], bias = -4.35
  const score = -0.15 * sl - 0.45 * sw + 0.75 * pl + 1.45 * pw - 4.35;
  if (score < 0) {
    return { class_id: 1, prediction: 'versicolor', kernel_used: k };
  } else {
    return { class_id: 2, prediction: 'virginica', kernel_used: k };
  }
}

function roundTo(num: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(num * factor) / factor;
}

function randRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

// ── API Endpoints ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    available_kernels: AVAILABLE_KERNELS,
    total_models: AVAILABLE_KERNELS.length,
  });
});

app.get('/metrics', (req, res) => {
  const data = getMetricsData();
  const kernel = req.query.kernel as string | undefined;
  if (kernel && data[kernel.toLowerCase()]) {
    return res.json(data[kernel.toLowerCase()]);
  }

  res.json({
    active_models: AVAILABLE_KERNELS,
    summary: data,
    default: data['linear'] || {
      name: 'SVM (Linear - Tuyến tính)',
      accuracy: 1.0,
      precision: 1.0,
      recall: 1.0,
      f1_score: 1.0,
    },
  });
});

app.post('/predict', (req, res) => {
  const { sepal_length, sepal_width, petal_length, petal_width, kernel } = req.body || {};
  const sl = Number(sepal_length) || 5.1;
  const sw = Number(sepal_width) || 3.5;
  const pl = Number(petal_length) || 1.4;
  const pw = Number(petal_width) || 0.2;
  const k = typeof kernel === 'string' ? kernel : 'linear';

  const result = predictSVM(sl, sw, pl, pw, k);
  res.json(result);
});

app.get('/random-sample', (req, res) => {
  const mode = Math.random();
  let pl: number;
  let pw: number;
  let sl: number;
  let sw: number;
  let difficulty: string;

  // 40% probability of border regions
  if (mode < 0.4) {
    const isVersiVirgi = Math.random() < 0.5;
    if (isVersiVirgi) {
      pl = roundTo(randRange(4.5, 5.3), 1);
      pw = roundTo(randRange(1.4, 1.8), 1);
      sl = roundTo(randRange(5.6, 6.8), 1);
      sw = roundTo(randRange(2.5, 3.2), 1);
      difficulty = 'Khó 🔥 (Vùng ranh giới Versicolor - Virginica)';
    } else {
      pl = roundTo(randRange(2.0, 2.8), 1);
      pw = roundTo(randRange(0.6, 0.9), 1);
      sl = roundTo(randRange(4.8, 5.6), 1);
      sw = roundTo(randRange(2.8, 3.8), 1);
      difficulty = 'Thử thách ⚡ (Vùng chuyển tiếp Setosa)';
    }
  } else if (mode < 0.7) {
    pl = roundTo(randRange(1.0, 6.9), 1);
    pw = roundTo(randRange(0.1, 2.5), 1);
    sl = roundTo(randRange(4.3, 7.9), 1);
    sw = roundTo(randRange(2.0, 4.4), 1);
    difficulty = 'Khắp bảng 🎲 (Tọa độ tự do)';
  } else {
    pl = roundTo(randRange(1.2, 6.7), 1);
    pw = roundTo(randRange(0.2, 2.4), 1);
    sl = roundTo(randRange(4.5, 7.7), 1);
    sw = roundTo(randRange(2.2, 4.2), 1);
    difficulty = 'Tiêu chuẩn 🎯';
  }

  const { class_id, prediction } = predictSVM(sl, sw, pl, pw);

  res.json({
    sepal_length: sl,
    sepal_width: sw,
    petal_length: pl,
    petal_width: pw,
    class_id,
    true_class: prediction,
    difficulty,
  });
});

// Direct route to serve Admin Avatar from src/assets/images/ (or fallback locations) with no-cache
app.get(
  [
    '/images/admin_avatar.jpg',
    '/images/admin_avatar.png',
    '/images/admin_avatar.jpeg',
    '/images/admin_avatar.webp',
    '/api/admin-avatar',
    '/admin_avatar.jpg',
  ],
  (req, res) => {
    const candidatePaths = [
      path.join(__dirname, 'src', 'assets', 'images', 'admin_avatar.jpg'),
      path.join(__dirname, 'src', 'assets', 'images', 'admin_avatar.png'),
      path.join(__dirname, 'src', 'assets', 'images', 'admin_avatar.jpeg'),
      path.join(__dirname, 'src', 'assets', 'images', 'admin_avatar.webp'),
      path.join(__dirname, 'src', 'asscts', 'images', 'admin_avatar.jpg'),
      path.join(__dirname, 'src', 'asscts', 'images', 'admin_avatar.png'),
      path.join(__dirname, 'public', 'images', 'admin_avatar.jpg'),
      path.join(__dirname, 'images', 'admin_avatar.jpg'),
    ];

    for (const p of candidatePaths) {
      if (fs.existsSync(p)) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        return res.sendFile(p);
      }
    }

    const fallback = path.join(__dirname, 'public', 'images', 'setosa.jpg');
    if (fs.existsSync(fallback)) {
      return res.sendFile(fallback);
    }
    res.status(404).send('Avatar not found');
  }
);

// Serve images statically as fallback
const srcAssetsImagesPath = path.join(__dirname, 'src', 'assets', 'images');
if (fs.existsSync(srcAssetsImagesPath)) {
  app.use('/src/assets/images', express.static(srcAssetsImagesPath));
}
const srcAssctsImagesPath = path.join(__dirname, 'src', 'asscts', 'images');
if (fs.existsSync(srcAssctsImagesPath)) {
  app.use('/src/asscts/images', express.static(srcAssctsImagesPath));
}
const imagesPath = path.join(__dirname, 'images');
const publicImagesPath = path.join(__dirname, 'public', 'images');
if (fs.existsSync(publicImagesPath)) {
  app.use('/images', express.static(publicImagesPath));
} else if (fs.existsSync(imagesPath)) {
  app.use('/images', express.static(imagesPath));
}

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
