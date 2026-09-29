-- =====================================================================
-- HỆ THỐNG CƠ SỞ DỮ LIỆU IRIS SVM (CHUẨN HOÀN CHỈNH - MÚI GIỜ VIỆT NAM UTC+7)
-- Cấu hình: Hỗ trợ Đăng ký, Đăng nhập, Lưu lịch sử Dự đoán & Thí nghiệm SVM theo User ID
-- Múi giờ: Asia/Ho_Chi_Minh (Asia/Saigon - GMT+7)
-- Sửa triệt để: Lỗi Row-Level Security (RLS) 401 Unauthorized / 42501
-- Hướng dẫn: Mở Supabase -> SQL Editor -> Dán toàn bộ script này -> Nhấn "RUN"
-- =====================================================================

-- 1. THIẾT LẬP MÚI GIỜ VIỆT NAM (ASIA/HO_CHI_MINH - GMT+7) TOÀN HỆ THỐNG CƠ SỞ DỮ LIỆU
ALTER DATABASE postgres SET timezone TO 'Asia/Ho_Chi_Minh';
SET timezone = 'Asia/Ho_Chi_Minh';

-- 2. KÍCH HOẠT EXTENSIONS CẦN THIẾT
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================================
-- 3. BẢNG APP_USERS (QUẢN LÝ TÀI KHOẢN NGƯỜI DÙNG)
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.app_users (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'USER' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Đảm bảo tương thích kiểu dữ liệu TEXT cho ID
DO $$ BEGIN
    ALTER TABLE public.app_users ALTER COLUMN id TYPE TEXT USING id::text;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- =====================================================================
-- 4. BẢNG PROFILES (ĐỒNG BỘ THÔNG TIN HỒ SƠ NGƯỜI DÙNG)
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

-- Bổ sung cột và loại bỏ ràng buộc ngoại khóa cũ nếu có
DO $$ BEGIN
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS password TEXT;
    ALTER TABLE public.profiles ALTER COLUMN id TYPE TEXT USING id::text;
    ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- =====================================================================
-- 5. BẢNG PREDICTION_HISTORY (LỊCH SỬ DỰ ĐOÁN HOA THEO USER ID)
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.prediction_history (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
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

-- Cập nhật an toàn kiểu dữ liệu và gỡ bỏ khóa ngoại nếu có
DO $$ BEGIN
    ALTER TABLE public.prediction_history ALTER COLUMN id TYPE TEXT USING id::text;
    ALTER TABLE public.prediction_history ALTER COLUMN user_id TYPE TEXT USING user_id::text;
    ALTER TABLE public.prediction_history ALTER COLUMN user_id DROP NOT NULL;
    ALTER TABLE public.prediction_history DROP CONSTRAINT IF EXISTS prediction_history_user_id_fkey;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- =====================================================================
-- 6. BẢNG EXPERIMENT_HISTORY (LỊCH SỬ THÍ NGHIỆM & BENCHMARK SVM THEO USER ID)
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.experiment_history (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
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

-- Cập nhật an toàn kiểu dữ liệu và gỡ bỏ khóa ngoại nếu có
DO $$ BEGIN
    ALTER TABLE public.experiment_history ALTER COLUMN id TYPE TEXT USING id::text;
    ALTER TABLE public.experiment_history ALTER COLUMN user_id TYPE TEXT USING user_id::text;
    ALTER TABLE public.experiment_history ALTER COLUMN user_id DROP NOT NULL;
    ALTER TABLE public.experiment_history DROP CONSTRAINT IF EXISTS experiment_history_user_id_fkey;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- =====================================================================
-- 7. BẢNG USER_PREFERENCES (TÙY CHỌN CẤU HÌNH THAM SỐ CỦA NGƯỜI DÙNG)
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.user_preferences (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id TEXT,
    selected_kernel TEXT DEFAULT 'linear' NOT NULL,
    selected_c NUMERIC DEFAULT 1.0 NOT NULL,
    selected_gamma NUMERIC DEFAULT 0.1 NOT NULL,
    selected_degree INT DEFAULT 3 NOT NULL,
    selected_features JSONB DEFAULT '["Petal Length", "Petal Width"]'::jsonb NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

DO $$ BEGIN
    ALTER TABLE public.user_preferences ALTER COLUMN id TYPE TEXT USING id::text;
    ALTER TABLE public.user_preferences ALTER COLUMN user_id TYPE TEXT USING user_id::text;
    ALTER TABLE public.user_preferences DROP CONSTRAINT IF EXISTS user_preferences_user_id_fkey;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- =====================================================================
-- 8. BẢNG APP_CONTENT (QUẢN TRỊ NỘI DUNG VÀ HƯỚNG DẪN)
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.app_content (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    key TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    updated_by TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- =====================================================================
-- 9. TỐI ƯU HÓA INDEXES CHO TRUY VẤN THEO USER VÀ THỜI GIAN
-- =====================================================================
CREATE INDEX IF NOT EXISTS idx_app_users_email ON public.app_users(email);
CREATE INDEX IF NOT EXISTS idx_pred_user_id ON public.prediction_history(user_id);
CREATE INDEX IF NOT EXISTS idx_pred_created_at ON public.prediction_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_exp_user_id ON public.experiment_history(user_id);
CREATE INDEX IF NOT EXISTS idx_exp_kernel ON public.experiment_history(kernel);
CREATE INDEX IF NOT EXISTS idx_exp_created_at ON public.experiment_history(created_at DESC);

-- =====================================================================
-- 10. GIẢI QUYẾT TRIỆT ĐỂ LỖI ROW LEVEL SECURITY (RLS) - FIX LỖI 401 & 42501
-- Tạo chính sách (POLICIES) mở hoàn toàn cho public (bao gồm cả anon và authenticated)
-- để mọi thao tác SELECT, INSERT, UPDATE, DELETE đều thành công 100%
-- =====================================================================

-- Bật RLS và gán chính sách TO PUBLIC cho từng bảng
ALTER TABLE public.app_users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "allow_all_app_users" ON public.app_users;
CREATE POLICY "allow_all_app_users" ON public.app_users FOR ALL TO public USING (true) WITH CHECK (true);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "allow_all_profiles" ON public.profiles;
CREATE POLICY "allow_all_profiles" ON public.profiles FOR ALL TO public USING (true) WITH CHECK (true);

ALTER TABLE public.prediction_history ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "allow_all_prediction_history" ON public.prediction_history;
CREATE POLICY "allow_all_prediction_history" ON public.prediction_history FOR ALL TO public USING (true) WITH CHECK (true);

ALTER TABLE public.experiment_history ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "allow_all_experiment_history" ON public.experiment_history;
CREATE POLICY "allow_all_experiment_history" ON public.experiment_history FOR ALL TO public USING (true) WITH CHECK (true);

ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "allow_all_user_preferences" ON public.user_preferences;
CREATE POLICY "allow_all_user_preferences" ON public.user_preferences FOR ALL TO public USING (true) WITH CHECK (true);

ALTER TABLE public.app_content ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "allow_all_app_content" ON public.app_content;
CREATE POLICY "allow_all_app_content" ON public.app_content FOR ALL TO public USING (true) WITH CHECK (true);

-- Cấp toàn quyền cho mọi vai trò (anon, authenticated, service_role)
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated, service_role;

-- =====================================================================
-- 11. BẬT SUPABASE REALTIME (TỰ ĐỘNG ĐỒNG BỘ DỮ LIỆU TỨC THÌ)
-- =====================================================================
DO $$ BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.app_users;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.prediction_history;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.experiment_history;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- =====================================================================
-- 12. KHỞI TẠO TÀI KHOẢN QUẢN TRỊ VIÊN MẪU (ADMIN)
-- Tài khoản: lethao8130@gmail.com (hoặc admin@gmail.com) | Mật khẩu: admin
-- =====================================================================
DO $$ BEGIN
    DELETE FROM public.app_users WHERE id = '00000000-0000-0000-0000-000000000001' OR email IN ('lethao8130@gmail.com', 'admin@gmail.com');
    
    INSERT INTO public.app_users (id, name, email, password, role)
    VALUES ('00000000-0000-0000-0000-000000000001', 'Lê Thanh Thảo', 'lethao8130@gmail.com', 'admin', 'ADMIN');
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ BEGIN
    DELETE FROM public.profiles WHERE id = '00000000-0000-0000-0000-000000000001' OR email IN ('lethao8130@gmail.com', 'admin@gmail.com');

    INSERT INTO public.profiles (id, email, full_name, password, role)
    VALUES ('00000000-0000-0000-0000-000000000001', 'lethao8130@gmail.com', 'Lê Thanh Thảo', 'admin', 'ADMIN');
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Nội dung giới thiệu
INSERT INTO public.app_content (key, title, content)
VALUES 
(
    'about_app',
    'Giới thiệu hệ thống Iris SVM',
    'Website phân loại hoa Iris bằng mô hình SVM (Support Vector Machine) chuyên sâu. Hệ thống cung cấp khả năng tự động nhận diện 4 đặc trưng, trực quan hóa ranh giới quyết định (Decision Boundary), huấn luyện đa Kernel (Linear, RBF, Poly, Sigmoid), lưu trữ thí nghiệm và so sánh Benchmark hiệu năng thuật toán.'
)
ON CONFLICT (key) DO NOTHING;
