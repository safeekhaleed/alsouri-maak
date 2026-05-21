# 🌙 السوري معك — Al-Souri Ma'ak

منصة ذكية عربية متكاملة بتصميم Cyberpunk/Neon — متجر، دروس، خدمات، أدوات تفاعلية، نظام VIP، ولوحة أدمن.

---

## 📱 Stack التقنية

| | |
|---|---|
| **Framework** | Expo SDK 54 + React Native |
| **Routing** | Expo Router v6 (file-based) |
| **Storage** | AsyncStorage (offline-first) |
| **UI** | expo-linear-gradient, expo-blur, @expo/vector-icons |
| **Haptics** | expo-haptics |
| **Media** | expo-image-picker |
| **WebView** | react-native-webview |
| **Clipboard** | expo-clipboard |
| **Language** | TypeScript 5.9 |

---

## 🚀 تشغيل المشروع محلياً

### المتطلبات
- Node.js 18+
- pnpm 9+
- Expo Go (iOS / Android)

### خطوات التشغيل

```bash
# 1. استنسخ المشروع
git clone https://github.com/YOUR_USERNAME/alsouri-maak.git
cd alsouri-maak

# 2. ثبّت الحزم
pnpm install

# 3. شغّل خادم Expo
cd artifacts/alsouri-maak
pnpm exec expo start
```

افتح **Expo Go** على هاتفك وامسح رمز QR.

---

## 👤 حسابات الأدمن الافتراضية

| البريد | كلمة المرور | الصلاحيات |
|---|---|---|
| `admin@alsouri.com` | `admin2024` | Full Admin |
| `safee12221222@gmail.com` | `blak1998877` | Full Admin |

> ⚠️ كلمات المرور مُشفَّرة بـ hash داخل AsyncStorage

---

## 💳 طرق الدفع المدعومة

| الطريقة | المعرّف/العنوان |
|---|---|
| شام كاش | `9685a0de3bba93e04c63396255d86de0` |
| Binance Pay | `63078113` |
| USDT TRC20 | `TLqiL3ZtuCUYA78UM9HEPJZV1fAch69KKa` |

---

## 🎯 ميزات التطبيق

- **الرئيسية** — Banner Slider تلقائي + إحصائيات المنصة
- **المتجر** — منتجات مع خصم VIP تلقائي
- **الدروس** — كورسات متعددة
- **الأدوات** — أدوات تفاعلية تفتح WebView داخلي
- **الخدمات** — قائمة الخدمات
- **نظام VIP** — 6 مستويات، كل $50 = مستوى، خصم 5% لكل مستوى
- **نظام الشحن** — 3 طرق دفع مع QR، نسخ، رفع إثبات
- **لوحة الأدمن** — إدارة كاملة لكل شيء

---

## 📦 النشر على Expo EAS (توليد APK)

### 1. تثبيت EAS CLI
```bash
npm install -g eas-cli
eas login
```

### 2. تهيئة المشروع
```bash
cd artifacts/alsouri-maak
eas build:configure
```

### 3. بناء APK للاختبار (Preview)
```bash
eas build --platform android --profile preview
```

### 4. بناء للنشر على Store
```bash
eas build --platform android --profile production
```

---

## 🐙 النشر على GitHub

```bash
# 1. أنشئ مستودعاً جديداً على GitHub

# 2. أضف remote
git remote add origin https://github.com/YOUR_USERNAME/alsouri-maak.git

# 3. ارفع الكود
git add .
git commit -m "Initial commit — السوري معك"
git push -u origin main
```

---

## ☁️ النشر على Render (Backend API)

إذا أردت نشر API Server على Render:

### إعدادات Render
| | |
|---|---|
| **Build Command** | `pnpm install && pnpm --filter @workspace/api-server run build` |
| **Start Command** | `pnpm --filter @workspace/api-server run start` |
| **Environment** | Node |
| **Region** | Frankfurt (EU) |

### متغيرات البيئة على Render
```
NODE_ENV=production
PORT=10000
SESSION_SECRET=your-very-secret-key-here
DATABASE_URL=postgresql://user:pass@host/dbname
```

---

## 📁 هيكل المشروع

```
artifacts/alsouri-maak/
├── app/
│   ├── (tabs)/          # الشاشات الرئيسية (5 tabs)
│   │   ├── index.tsx    # الرئيسية
│   │   ├── store.tsx    # المتجر
│   │   ├── courses.tsx  # الدروس
│   │   ├── tools.tsx    # الأدوات
│   │   └── services.tsx # الخدمات
│   ├── admin/           # لوحة الأدمن
│   ├── login.tsx
│   ├── register.tsx
│   ├── profile.tsx
│   ├── recharge.tsx     # شحن الرصيد
│   ├── purchases.tsx
│   ├── notifications.tsx
│   └── webview.tsx
├── components/          # مكونات مشتركة
├── constants/           # الألوان، البيانات
├── context/             # AppContext (state management)
├── assets/              # الصور
├── app.json             # إعدادات Expo
├── eas.json             # إعدادات EAS Build
└── package.json
```

---

## 🔐 الأمان

- كلمات المرور مُشفَّرة بـ hash قبل التخزين
- التحقق من صلاحيات الأدمن في كل شاشة إدارة
- منع الوصول للوحة الأدمن للمستخدمين العاديين
- حماية الشاشات المطلوبة بالتحقق من تسجيل الدخول

---

## 📞 التواصل

- **المطوّر**: Al-Souri Ma'ak Team
- **البريد**: safee12221222@gmail.com
