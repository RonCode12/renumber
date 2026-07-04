# מערכת תוכניות עבודה לקמפיינים

מערכת פנימית לסוכנות פרסום להזנת תוכניות עבודה חודשיות / תוכניות ליום מכירות
עבור לקוחות, בעברית ו-RTL. הזרימה בנויה כאשף בן 6 שלבים: פרטים כלליים ←
פייסבוק/מטא ← גוגל ← טיקטוק ← פלאשי ← סיום, עם שמירה מתמשכת ב-DB כך שכל
תוכנית ניתנת לעריכה בהמשך.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Prisma ORM + PostgreSQL
- dnd-kit לגרירת מודעות בין אדסטים, zod לוולידציה

## פיתוח מקומי

```bash
npm install
cp .env.example .env   # ומלאו DATABASE_URL לפי הוראות למטה
npx prisma migrate dev
npm run dev
```

האפליקציה תעלה בכתובת http://localhost:3000

### מסד נתונים מקומי

אין צורך בהתקנת Postgres מקומי — ניתן ליצור מסד נתונים חינמי ומיידי עם:

```bash
npx create-db@latest
```

הפקודה תדפיס `DATABASE_URL` שיש להדביק לקובץ `.env`.

## פריסה ל-Render

הפרויקט כולל `render.yaml` (Blueprint) שמגדיר web service + מסד PostgreSQL
מנוהל, ומחבר ביניהם אוטומטית. ב-Render: New → Blueprint → לבחור את הריפו הזה
בענף `main`.
