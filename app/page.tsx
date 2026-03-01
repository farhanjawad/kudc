import Link from 'next/link';
import { 
  BookOpen, Clock, Target, ArrowRight, Scroll, 
  BookText, FileQuestion, GraduationCap, CheckCircle2,
  Calendar, Award, LayoutList
} from 'lucide-react';

export default function LandingPage() {
  // A subtle geometric Islamic-style pattern embedded as an SVG data URI
  const geometricPattern = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23047857' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`;

  return (
    <div 
      className="min-h-screen bg-[#fdfbf7] py-12 px-4 sm:px-8 flex flex-col items-center gap-20"
      style={{ backgroundImage: geometricPattern, backgroundAttachment: 'fixed' }}
    >
      {/* 1. Main Hero Arch Container */}
      <div className="max-w-4xl w-full bg-white relative rounded-t-[12rem] rounded-b-3xl shadow-2xl overflow-hidden border border-emerald-100/50">
        
        {/* Top Arch Decoration */}
        <div className="h-64 bg-emerald-900 relative flex items-center justify-center rounded-t-[12rem] mt-3 mx-3 shadow-inner overflow-hidden">
          {/* Decorative Gold Inner Arch */}
          <div className="absolute inset-4 border-2 border-amber-400/40 rounded-t-[12rem] border-b-0"></div>
          <div className="absolute inset-7 border border-amber-400/20 rounded-t-[12rem] border-b-0"></div>
          
          <Scroll className="w-20 h-20 text-amber-400 relative z-10" strokeWidth={1.5} />
          
          {/* Subtle glowing orb behind the scroll */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-amber-500/20 blur-3xl rounded-full"></div>
        </div>

        {/* Content Box */}
        <div className="px-6 pt-12 pb-16 text-center sm:px-16">
          <h4 className="text-emerald-700 font-bold tracking-[0.3em] uppercase text-sm mb-4">
            Bismillah
          </h4>
          
          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 mb-6 font-serif tracking-tight leading-tight">
            Journey of <span className="text-emerald-700">Knowledge</span>
          </h1>

          <p className="text-slate-600 mb-12 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto font-medium">
            "Seek knowledge from the cradle to the grave." Welcome to the official assessment portal. Prepare your heart and mind before you begin your evaluation.
          </p>

          <Link href="/login" className="inline-block w-full sm:w-auto">
            <button className="group relative w-full sm:w-auto flex items-center justify-center px-12 py-5 bg-linear-to-r from-emerald-800 to-emerald-600 text-white text-xl font-bold rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(4,120,87,0.4)] hover:-translate-y-1 active:translate-y-0">
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-size-[250%_250%,100%_100%] bg-position-[-100%_0,0_0] bg-no-repeat transition-all duration-700 group-hover:bg-position-[200%_0,0_0]"></div>
              <span className="relative text-amber-50 tracking-wide font-serif">Start the Journey</span>
              <ArrowRight className="relative ml-3 w-6 h-6 text-amber-400 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link> 
          <Link href="#program" className="m-2 inline-block w-full sm:w-auto">
            <button className="group relative w-full sm:w-auto flex items-center justify-center px-12 py-5 bg-linear-to-r from-blue-800 to-emerald-600 text-white text-xl font-bold rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(4,120,87,0.4)] hover:-translate-y-1 active:translate-y-0">
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-size-[250%_250%,100%_100%] bg-position-[-100%_0,0_0] bg-no-repeat transition-all duration-700 group-hover:bg-position-[200%_0,0_0]"></div>
              <span className="relative text-amber-50 tracking-wide font-serif">program details</span>
            </button>
          </Link>
        </div>
      </div>

      {/* 2. Total Program Details */}
      <section className="max-w-5xl w-full" id='program'>
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900">Program Details</h2>
          <div className="w-20 h-1.5 bg-amber-400 mx-auto mt-6 rounded-full opacity-80"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="bg-white rounded-3xl p-8 border border-emerald-100 shadow-xl shadow-emerald-900/5 flex flex-col items-center text-center relative overflow-hidden group">
            <div className="absolute top-0 w-full h-1 bg-linear-to-r from-emerald-400 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 text-emerald-600 rotate-3 group-hover:-rotate-3 transition-transform">
              <Calendar className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Duration</h3>
            <p className="text-slate-600 leading-relaxed">A structured 12-week comprehensive study period culminating in a final secure assessment.</p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-amber-100 shadow-xl shadow-amber-900/5 flex flex-col items-center text-center relative overflow-hidden group">
            <div className="absolute top-0 w-full h-1 bg-linear-to-r from-amber-400 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 text-amber-600 -rotate-3 group-hover:rotate-3 transition-transform">
              <Award className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Certification</h3>
            <p className="text-slate-600 leading-relaxed">Successful candidates receive an accredited certificate recognized by scholarly boards.</p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-emerald-100 shadow-xl shadow-emerald-900/5 flex flex-col items-center text-center relative overflow-hidden group">
            <div className="absolute top-0 w-full h-1 bg-linear-to-r from-emerald-400 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 text-emerald-600 rotate-3 group-hover:-rotate-3 transition-transform">
              <GraduationCap className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Methodology</h3>
            <p className="text-slate-600 leading-relaxed">Rooted in traditional pedagogical methods combined with modern assessment technology.</p>
          </div>
        </div>
      </section>

      {/* 3. Syllabus Section */}
      <section className="max-w-5xl w-full bg-white rounded-[2.5rem] shadow-2xl p-8 sm:p-14 border border-emerald-100/50 relative overflow-hidden">
        {/* Decorative corner element */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-emerald-50 rounded-full blur-2xl opacity-70"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-12 text-center sm:text-left">
            <div className="p-4 bg-emerald-100/50 rounded-2xl text-emerald-700">
              <BookText className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 mb-3">Core Syllabus</h2>
              <p className="text-slate-500 text-lg">Topics covered in the final examination phase.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            {[
              { title: "Aqeedah (Theology)", desc: "Core tenets of faith, divine attributes, and foundational beliefs." },
              { title: "Fiqh (Jurisprudence)", desc: "Rules of purification, prayer, fasting, and daily transactions." },
              { title: "Seerah (Prophetic Biography)", desc: "Life of the Prophet (PBUH), major events, and lessons." },
              { title: "Tafsir (Quranic Exegesis)", desc: "Interpretation of selected surahs and sciences of the Quran." },
              { title: "Hadith Studies", desc: "Understanding narrations, chains of transmission, and context." },
              { title: "Tazkiyah (Purification)", desc: "Diseases of the heart, ethics, and spiritual excellence." },
            ].map((item, idx) => (
              <div key={idx} className="flex items-start">
                <CheckCircle2 className="w-6 h-6 text-amber-500 mr-4 shrink-0 mt-1" />
                <div>
                  <h4 className="text-lg font-bold text-slate-900 mb-1">{item.title}</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Question Types Section */}
      <section className="max-w-5xl w-full mb-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900">Assessment Format</h2>
          <div className="w-20 h-1.5 bg-amber-400 mx-auto mt-6 rounded-full opacity-80"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-lg shadow-slate-200/40 border border-slate-100 flex flex-col items-center text-center">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl mb-4"><LayoutList className="w-6 h-6" /></div>
            <h4 className="font-bold text-slate-900 mb-2">Multiple Choice</h4>
            <p className="text-sm text-slate-500">Test factual recall and conceptual understanding.</p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-lg shadow-slate-200/40 border border-slate-100 flex flex-col items-center text-center">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl mb-4"><Target className="w-6 h-6" /></div>
            <h4 className="font-bold text-slate-900 mb-2">Scenario-Based</h4>
            <p className="text-sm text-slate-500">Apply Fiqh rulings to real-world modern situations.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg shadow-slate-200/40 border border-slate-100 flex flex-col items-center text-center">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl mb-4"><FileQuestion className="w-6 h-6" /></div>
            <h4 className="font-bold text-slate-900 mb-2">Scriptural Analysis</h4>
            <p className="text-sm text-slate-500">Interpret verses or Hadith based on classical Tafsir.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg shadow-slate-200/40 border border-slate-100 flex flex-col items-center text-center">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl mb-4"><Clock className="w-6 h-6" /></div>
            <h4 className="font-bold text-slate-900 mb-2">Time Restricted</h4>
            <p className="text-sm text-slate-500">Assessments are monitored and strictly timed.</p>
          </div>
        </div>
      </section>

      {/* Footer minimal */}
      <footer className="w-full text-center py-8 text-slate-500 text-sm border-t border-emerald-900/10">
        <p>© {new Date().getFullYear()} Institute Learning Management System. Seeking Excellence in Education.</p>
      </footer>
    </div>
  );
}