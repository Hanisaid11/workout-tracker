# Workout Tracker (Offline-first PWA)

## تشغيل محلي
```
npm install
npm run dev
```

## بناء المشروع
```
npm run build
```
هيطلع الملفات الجاهزة للنشر في مجلد `dist/`.

## النشر على Cloudflare Pages

### الطريقة 1: عن طريق لوحة تحكم Cloudflare
1. ادخل Cloudflare Dashboard → Workers & Pages → Create → Pages → Upload assets
2. اعمل build محلي الأول (`npm install && npm run build`)
3. ارفع محتوى مجلد `dist/` بالكامل

### الطريقة 2: ربط مباشر بـ Git (أفضل، بيبني تلقائي)
1. ارفع المشروع على GitHub/GitLab
2. Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git
3. اختر الريبو، وحط الإعدادات دي:
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Framework preset: Vite

### الطريقة 3: Wrangler CLI
```
npm install -g wrangler
npm run build
wrangler pages deploy dist
```

## ملاحظات
- التطبيق PWA كامل (manifest + service worker عبر vite-plugin-pwa) — هيشتغل أوفلاين بعد أول زيارة.
- البيانات (مكتبة التمارين، الجدول، السجل) متخزنة في `localStorage` على جهاز المستخدم — مفيش سيرفر أو قاعدة بيانات مطلوبة.
- لو حبيت تبدل التخزين لـ IndexedDB (سعة أكبر)، عدّل `src/storage.js` بس وسيب باقي الكود زي ما هو.
