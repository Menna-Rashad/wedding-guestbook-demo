import { useState, useEffect } from "react";
import { db } from "./firebase";
import Confetti from "react-confetti";
import { collection, addDoc, onSnapshot, serverTimestamp } from "firebase/firestore";
import { Toaster, toast } from "react-hot-toast";

function App() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  "</>"; const [guests, setGuests] = useState([]);
  const [confetti, setConfetti] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "guests"), (snap) => {
      const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setGuests(data.sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0)));
    });
    return unsub;
  }, []);

const send = async (e) => {
  e.preventDefault();
  if (!name.trim() || !message.trim()) {
    toast.error("اكتب اسمك ورسالتك الأول 🌸");
    return;
  }

  setIsLoading(true); // ⬅️ بدأنا التحميل وقفلنا الزرار

  try {
    await addDoc(collection(db, "guests"), {
      name: name.trim(),
      message: message.trim(),
      timestamp: serverTimestamp(),
    });
    setName("");
    setMessage("");
    setConfetti(true);
    toast.success("تم إرسال تهنئتك بنجاح! 🎉💕", {
      style: { background: '#FA8072', color: 'white', fontWeight: 'bold' },
      duration: 5000,
    });
    setTimeout(() => setConfetti(false), 6000);
  } catch (err) {
    toast.error("فيه مشكلة، جربي تاني!");
  } finally {
    setIsLoading(false); // ⬅️ قفلنا التحميل ورجعنا الزرار يشتغل تاني سواء نجح أو فشل
  }
};

  return (
    <>
      <Toaster position="bottom-center" />
      {confetti && <Confetti recycle={false} numberOfPieces={400} gravity={0.08} />}
      
      {/* زخارف ورد في الخلفية */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="decor-flower" style={{ top: '10%', left: '10%' }}>🌸</div>
        <div className="decor-flower" style={{ top: '20%', right: '15%' }}>🌹</div>
        <div className="decor-flower" style={{ bottom: '15%', left: '20%' }}>🌺</div>
        <div className="decor-flower" style={{ bottom: '25%', right: '10%' }}>🌼</div>
      </div>

      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
        {/* العنوان */}
        <header className="text-center mb-12 z-10">
          <h1 className="text-5xl md:text-7xl font-bold text-salmon-dark mb-4 text-center">
            محمد & سلمى💍✨
          </h1>
          <p className="text-2xl md:text-3xl text-salmon font-bold">10 ديسمبر 2025</p>
        </header>

        {/* الفورم */}
        <div className="w-full max-w-2xl z-10">
          <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-salmon-light">
            <h2 className="text-3xl font-bold text-salmon-dark text-center mb-8">
              اكتب تهنئتك
            </h2>
            <form onSubmit={send} className="space-y-6">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="اسمك"
                required
                className="w-full px-6 py-4 rounded-2xl border-2 border-salmon focus:border-salmon-dark focus:outline-none text-lg"
              />
              <textarea
                value={message}
                maxLength={500}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="اكتب تهنئتك الحلوة... 🌸"
                rows="5"
                required
                className="w-full px-6 py-4 rounded-2xl border-2 border-salmon focus:border-salmon-dark focus:outline-none text-lg resize-none"
              />
              <button 
              disabled={isLoading}
              className={`w-full text-white font-bold py-5 rounded-2xl text-xl transition transform 
                ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-salmon hover:bg-salmon-dark hover:scale-105'}`}
            >
              {isLoading ? "جاري الإرسال... ⏳" : "إرسال التهنئة 💝"}
            </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;