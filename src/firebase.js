import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // السطر ده مهم عشان قاعدة البيانات

// ده الكود الجديد بتاع مشروع الـ Demo
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: "guestbook-demo-beef8",
  storageBucket: "guestbook-demo-beef8.firebasestorage.app",
  messagingSenderId: "1056856284736",
  appId: "1:1056856284736:web:4511a5b954df1cff8b49a5"
};

// بنشغل فايربيس هنا
const app = initializeApp(firebaseConfig);

// وبنعمل Export لـ db عشان باقي الصفحات تعرف تستخدم Firestore الجديد
export const db = getFirestore(app);