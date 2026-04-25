import { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import { Toaster, toast } from 'react-hot-toast';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'; // أيقونات العين

function Admin() {
  const [messages, setMessages] = useState([]);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // جديد
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const CORRECT_PASSWORD = 'demo';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      setAuthenticated(true);
      toast.success('ادخلو برجلكو اليمين 😂', {
        style: { background: '#FA8072', color: 'white', fontWeight: 'bold' },
        duration: 4000,
      });
    } else {
      toast.error('كلمة السر غلط يا قمر!', { duration: 3000 });
    }
  };

  useEffect(() => {
    if (!authenticated) return;

    const unsub = onSnapshot(
      collection(db, 'guests'),
      (snap) => {
        const data = snap.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter(msg => 
            msg.name && 
            msg.message && 
            msg.name.trim() !== '' && 
            msg.message.trim() !== ''
        )
        .sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));
        setMessages(data);
        setLoading(false);
      },
      (err) => {
        console.error(err);
        toast.error('فيه مشكلة في جلب الرسايل');
        setLoading(false);
      }
    );

    return () => unsub();
  }, [authenticated]);

  if (!authenticated) {
    return (
      <>
        <Toaster position="bottom-center" />

        {/* زخارف الورد في الخلفية */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="decor-flower" style={{ top: '10%', left: '8%' }}>🌹</div>
          <div className="decor-flower" style={{ top: '15%', right: '12%' }}>🌹</div>
          <div className="decor-flower" style={{ bottom: '20%', left: '15%' }}>🌸</div>
          <div className="decor-flower" style={{ bottom: '10%', right: '10%' }}>🌼</div>
        </div>

        <div className="min-h-screen bg-gradient-to-b from-rose-100 to-amber-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-3xl shadow-2xl p-10 border-4 border-salmon-light max-w-md w-full">
            <h2 className="text-4xl font-bold text-salmon-dark text-center mb-8">
              صفحة العروسين السرية
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* الـ input مع أيقونة العين */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="اكتب كلمة (demo) عشان تجرب الدخول"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-6 py-4 pr-16 pl-12 rounded-2xl border-2 border-salmon focus:border-salmon-dark focus:outline-none text-lg text-right placeholder:text-right placeholder:text-gray-500"
                  dir="rtl"
                  required
                />
                {/* زرار العين */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-salmon-dark hover:text-salmon transition"
                >
                  {showPassword ? (
                    <EyeIcon className="w-7 h-7" />
                  ) : (
                    <EyeSlashIcon className="w-7 h-7" />
                  )}
                </button>
              </div>

              <button className="w-full bg-salmon hover:bg-salmon-dark text-white font-bold py-5 rounded-2xl text-xl transition transform hover:scale-105">
                دخول
              </button>
            </form>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Toaster position="bottom-center" />

      {/* زخارف الورد في الخلفية */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="decor-flower" style={{ top: '10%', left: '8%' }}>🌹</div>
        <div className="decor-flower" style={{ top: '15%', right: '12%' }}>🌹</div>
        <div className="decor-flower" style={{ bottom: '20%', left: '15%' }}>🌸</div>
        <div className="decor-flower" style={{ bottom: '10%', right: '10%' }}>🌼</div>
      </div>

      <div className="min-h-screen bg-gradient-to-b from-rose-100 to-amber-50 flex flex-col items-center px-4 py-12">
        {/* العنوان */}
        <header className="text-center mb-12 z-10">
          <h1 className="text-5xl md:text-7xl font-bold text-salmon-dark mb-4">
             محمد & سلمى
          </h1>
          <p className="text-2xl md:text-3xl text-salmon font-bold">
            تهاني الضيوف • 10 ديسمبر 2025
          </p>
          <p className="text-lg text-salmon mt-4 font-semibold">
            الرسايل بتتحدث لوحدها
          </p>
        </header>

        {/* الرسايل */}
        <div className="w-full max-w-5xl z-10">
          {loading ? (
            <div className="text-center py-20">
              <p className="text-3xl text-salmon-dark font-bold text-right">جاري تحميل التهاني...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-4xl text-salmon-dark font-bold text-right">لسه مفيش رسايل يا أحلى عروسين</p>
              <p className="text-2xl text-salmon mt-6 text-right">الضيوف لسه بيكتبوا... انتظروا السحر</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className="bg-white rounded-3xl p-8 shadow-2xl border-4 border-salmon-light hover:border-salmon transition transform hover:scale-105"
                >
                  <div className="flex items-center mb-4">
                    <span className="text-4xl mr-3">✨</span>
                    <p className="font-bold text-2xl text-salmon-dark">{msg.name}</p>
                  </div>
                  <p className="text-gray-800 text-lg leading-relaxed">{msg.message}</p>
                  <p className="text-sm text-salmon font-bold mt-6 text-right">
                    {msg.timestamp?.seconds
                      ? new Date(msg.timestamp.seconds * 1000).toLocaleString('ar-EG', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: 'numeric',
                        })
                      : "الآن"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Admin;