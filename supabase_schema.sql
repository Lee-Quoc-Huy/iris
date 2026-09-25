-- =====================================================================
-- IRIS SVM - HỆ THỐNG CƠ SỞ DỮ LIỆU ĐƠN GIẢN HÓA (100% KHÔNG CẦN XÁC MINH EMAIL)
-- Đăng ký: Lưu tên, email, mật khẩu vào CSDL.
-- Đăng nhập: Kiểm tra email và mật khẩu khớp là vào thẳng hệ thống.
-- Hướng dẫn: Mở Supabase Dashboard -> SQL Editor -> Dán toàn bộ script này -> Nhấn "RUN"
-- =====================================================================

-- 1. BẬT TIỆN ÍCH MỞ RỘNG (EXTENSIONS)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================================
-- 2. DỌN DẸP CÁC TRIGGER CŨ TRÊN auth.users ĐỂ TRÁNH LỖI PHỤ THUỘC
-- =====================================================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
DROP TRIGGER IF EXISTS tr_auth_user_created ON auth.users CASCADE;
DROP TRIGGER IF EXISTS handle_new_user ON auth.users CASCADE;
DROP TRIGGER IF EXISTS on_user_created ON auth.users CASCADE;
DROP TRIGGER IF EXISTS user_created_trigger ON auth.users CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- =====================================================================
-- 3. BẢNG APP_USERS (BẢNG TÀI KHOẢN NGƯỜI DÙNG ĐƠN GIẢN HÓA)
-- Lưu trực tiếp: Họ tên, Email, Mật khẩu, Vai trò
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.app_users (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'USER' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- =====================================================================
-- 4. BẢNG PROFILES (TƯƠNG THÍCH DỮ LIỆU CŨ)
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    password TEXT,
    role TEXT DEFAULT 'USER' NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Bổ sung cột password vào profiles nếu bảng đã có từ trước
DO $$ BEGIN
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS password TEXT;
    ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- =====================================================================
-- 5. BẢNG USER_PREFERENCES (CẤU HÌNH THAM SỐ SVM)
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT,
    selected_kernel TEXT DEFAULT 'linear' NOT NULL,
    selected_c NUMERIC DEFAULT 1.0 NOT NULL,
    selected_gamma NUMERIC DEFAULT 0.1 NOT NULL,
    selected_degree INT DEFAULT 3 NOT NULL,
    selected_features JSONB DEFAULT '["Petal Length", "Petal Width"]'::jsonb NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- =====================================================================
-- 6. BẢNG PREDICTION_HISTORY (LỊCH SỬ DỰ ĐOÁN HOA)
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.prediction_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT,
    sepal_length NUMERIC NOT NULL,
    sepal_width NUMERIC NOT NULL,
    petal_length NUMERIC NOT NULL,
    petal_width NUMERIC NOT NULL,
    prediction TEXT NOT NULL,
    confidence NUMERIC DEFAULT 100.0,
    method TEXT DEFAULT 'Nhập số liệu' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

DO $$ BEGIN
    ALTER TABLE public.prediction_history DROP CONSTRAINT IF EXISTS prediction_history_user_id_fkey;
    ALTER TABLE public.prediction_history ALTER COLUMN user_id TYPE TEXT USING user_id::text;
    ALTER TABLE public.prediction_history ALTER COLUMN user_id DROP NOT NULL;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- =====================================================================
-- 7. BẢNG EXPERIMENT_HISTORY (LỊCH SỬ HUẤN LUYỆN & BENCHMARK)
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.experiment_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT,
    name TEXT DEFAULT 'Huấn luyện SVM' NOT NULL,
    kernel TEXT NOT NULL,
    c_param NUMERIC NOT NULL,
    gamma_param NUMERIC NOT NULL,
    degree INT DEFAULT 3,
    features JSONB NOT NULL DEFAULT '["Petal Length", "Petal Width"]'::jsonb,
    feature_indices JSONB NOT NULL DEFAULT '{"sl": 5.1, "sw": 3.5, "pl": 1.4, "pw": 0.2}'::jsonb,
    accuracy NUMERIC NOT NULL,
    train_accuracy NUMERIC,
    precision NUMERIC DEFAULT 0.967,
    recall NUMERIC DEFAULT 0.967,
    f1_score NUMERIC DEFAULT 0.967,
    support_vector_count INT DEFAULT 0,
    execution_time_ms NUMERIC NOT NULL DEFAULT 1.0,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

DO $$ BEGIN
    ALTER TABLE public.experiment_history DROP CONSTRAINT IF EXISTS experiment_history_user_id_fkey;
    ALTER TABLE public.experiment_history ALTER COLUMN user_id TYPE TEXT USING user_id::text;
    ALTER TABLE public.experiment_history ALTER COLUMN user_id DROP NOT NULL;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- =====================================================================
-- 8. BẢNG APP_CONTENT (QUẢN LÝ NỘI DUNG VÀ HƯỚNG DẪN)
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.app_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    updated_by TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- =====================================================================
-- 9. TẠO INDEXES TỐI ƯU HIỆU SUẤT TRUY VẤN
-- =====================================================================
CREATE INDEX IF NOT EXISTS idx_app_users_email ON public.app_users(email);
CREATE INDEX IF NOT EXISTS idx_pred_user_id ON public.prediction_history(user_id);
CREATE INDEX IF NOT EXISTS idx_pred_created_at ON public.prediction_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_exp_user_id ON public.experiment_history(user_id);
CREATE INDEX IF NOT EXISTS idx_exp_kernel ON public.experiment_history(kernel);
CREATE INDEX IF NOT EXISTS idx_exp_created_at ON public.experiment_history(created_at DESC);

-- =====================================================================
-- 10. TẮT HOÀN TOÀN ROW LEVEL SECURITY (RLS) ĐỂ KHÔNG BỊ CHẶN QUYỀN
-- =====================================================================
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (
        SELECT policyname, tablename 
        FROM pg_policies 
        WHERE schemaname = 'public'
    ) LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', r.policyname, r.tablename);
    END LOOP;
END $$;

ALTER TABLE public.app_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.prediction_history DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiment_history DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_content DISABLE ROW LEVEL SECURITY;

-- Cấp toàn quyền thực thi cho ứng dụng Web
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

-- =====================================================================
-- 11. BẬT SUPABASE REALTIME (TỰ ĐỘNG ĐỒNG BỘ DỮ LIỆU)
-- =====================================================================
DO $$ BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.app_users;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.prediction_history;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.experiment_history;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
EXCEPTION WHEN others THEN null;
END $$;

-- =====================================================================
-- 12. TẠO SẴN TÀI KHOẢN ADMIN MẪU
-- Email: huylechill@gmail.com | Mật khẩu: 123456
-- =====================================================================
INSERT INTO public.app_users (id, name, email, password, role)
VALUES ('admin_01', 'Huy Lê', 'huylechill@gmail.com', '123456', 'ADMIN')
ON CONFLICT (email) DO UPDATE SET 
    name = EXCLUDED.name,
    password = EXCLUDED.password,
    role = EXCLUDED.role;

INSERT INTO public.profiles (id, email, full_name, password, role)
VALUES ('admin_01', 'huylechill@gmail.com', 'Huy Lê', '123456', 'ADMIN')
ON CONFLICT (id) DO UPDATE SET 
    full_name = EXCLUDED.full_name,
    password = EXCLUDED.password,
    role = EXCLUDED.role;

-- Dữ liệu nội dung hướng dẫn
INSERT INTO public.app_content (key, title, content)
VALUES 
(
    'about_app',
    'Giới thiệu hệ thống Iris SVM',
    'Website phân loại hoa Iris bằng mô hình SVM (Support Vector Machine) chuyên sâu. Hệ thống cung cấp khả năng tự động nhận diện 4 đặc trưng, trực quan hóa ranh giới quyết định (Decision Boundary), huấn luyện đa Kernel (Linear, RBF, Poly, Sigmoid, Precomputed), lưu trữ thí nghiệm và so sánh Benchmark hiệu năng thuật toán.'
)
ON CONFLICT (key) DO NOTHING;
