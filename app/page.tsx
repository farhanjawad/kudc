import Link from 'next/link';
import { 
   Clock, ShieldCheck, ArrowRight, 
  LayoutDashboard, BookText, Lock, ChevronRight,
  UserCircle, FileQuestion, Quote, Library, CheckCircle2
} from 'lucide-react';

export default function LandingPage() {
  // A subtle geometric Islamic-style pattern embedded as an SVG data URI
  const geometricPattern = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23047857' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`;

  return (
    <div 
      className="min-h-screen bg-[#fdfbf7] flex flex-col font-sans"
      style={{ backgroundImage: geometricPattern, backgroundAttachment: 'fixed' }}
    >
      {/* 1. LMS Navigation Bar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-emerald-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3 text-emerald-800">
            <span className="text-xl font-bold font-serif tracking-tight">KUDC</span>
          </div>
          <Link href="/login">
            <button className="flex items-center px-5 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-emerald-800 transition-colors shadow-sm">
              <UserCircle className="w-4 h-4 mr-2" />
             Login
            </button>
          </Link>
        </div>
      </nav>

      {/* 2. Portal Hero Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        
        {/* Left: LMS Intro Text */}
        <div className="flex-1 text-center lg:text-left">
          <h4 className="text-emerald-700 font-bold tracking-[0.2em] uppercase text-xs mb-4 flex items-center justify-center lg:justify-start">
            <span className="w-8 h-px bg-emerald-300 mr-3"></span>
            Certification Program
            <span className="w-8 h-px bg-emerald-300 ml-3 lg:hidden"></span>
          </h4>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 font-serif tracking-tight leading-[1.1]">
            Mastery of <br className="hidden lg:block" />
            <span className="text-emerald-700">Al-Aqeedah Al-Tahawiyyah</span>
          </h1>

          <p className="text-slate-600 mb-8 text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
            Welcome to the official assessment portal for the foundational text of Islamic Creed. Complete your study, review the chapters, and take the final proctored examination to earn your certification.
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm font-medium text-slate-700">
            <div className="flex items-center bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-600 mr-2" /> Secure Exam
            </div>
            <div className="flex items-center bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
              <Clock className="w-4 h-4 text-amber-600 mr-2" /> 60-Min Assessment
            </div>
          </div>
        </div>

        {/* Right: The Arch "Portal Entry" Card */}
        <div className="w-full max-w-md">
          <div className="bg-white relative rounded-t-[10rem] rounded-b-3xl shadow-2xl overflow-hidden border border-emerald-100/50 flex flex-col">
            
            {/* Arch Header */}
            <div className="h-48 bg-emerald-900 relative flex items-center justify-center rounded-t-[10rem] mt-2 mx-2 shadow-inner overflow-hidden">
              <div className="absolute inset-3 border-2 border-amber-400/40 rounded-t-[10rem] border-b-0"></div>
              <div className="absolute inset-5 border border-amber-400/20 rounded-t-[10rem] border-b-0"></div>
              <LayoutDashboard className="w-14 h-14 text-amber-400 relative z-10" strokeWidth={1.5} />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-amber-500/20 blur-3xl rounded-full"></div>
            </div>

            {/* Entry Form Area */}
            <div className="p-8 text-center flex-1 flex flex-col">
              <h2 className="text-2xl font-bold text-slate-900 font-serif mb-2">Student Access</h2>
              <p className="text-slate-500 text-sm mb-8">Enter the portal to view your dashboard and pending assessments.</p>
              
              <Link href="/login" className="mt-auto">
                <button className="group relative w-full flex items-center justify-center px-6 py-4 bg-linear-to-r from-emerald-800 to-emerald-600 text-white font-bold rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-size-[250%_250%,100%_100%] bg-position-[-100%_0,0_0] bg-no-repeat transition-all duration-700 group-hover:bg-position-[200%_0,0_0]"></div>
                  <span className="relative tracking-wide">Enter Dashboard</span>
                  <ArrowRight className="relative ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* 3. Book Overview Section */}
      <section className="w-full py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-xl border border-emerald-100 overflow-hidden flex flex-col md:flex-row">
            
            {/* Left Image/Iconography side */}
            <div className="md:w-2/5 bg-emerald-900 p-10 flex flex-col justify-center items-center text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: geometricPattern }}></div>
              <Library className="w-20 h-20 text-amber-400 mb-6 relative z-10" />
              <h3 className="text-2xl font-serif font-bold text-white relative z-10">Matn Al-Tahawiyyah</h3>
              <p className="text-emerald-200 mt-2 font-medium relative z-10">By Imam Abu Ja'far al-Tahawi (d. 321 AH)</p>
            </div>

            {/* Right Text side */}
            <div className="md:w-3/5 p-8 md:p-12">
              <h2 className="text-3xl font-serif font-bold text-slate-900 mb-6">About the Text</h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                Al-Aqeedah Al-Tahawiyyah is universally recognized as one of the most foundational and agreed-upon texts in Islamic Theology (Aqeedah). It summarizes the core beliefs of the early generations of scholars (the Salaf) and provides a clear framework for understanding the divine attributes, predestination, and prophethood.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mr-3 mt-0.5 shrink-0" />
                  <p className="text-sm text-slate-700"><strong>Comprehensive Coverage:</strong> 105 core points of consensus among classical scholars.</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mr-3 mt-0.5 shrink-0" />
                  <p className="text-sm text-slate-700"><strong>LMS Requirement:</strong> A minimum passing score of 80% is required to earn the certification.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Book Chapters / Syllabus Grid */}
      <section className="w-full bg-white border-y border-emerald-100/50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-3xl font-serif font-bold text-slate-900 mb-3">Assessment Chapters</h2>
              <p className="text-slate-500">The final examination will draw questions from the following sections of the book.</p>
            </div>
            <Link href="/login" className="hidden md:flex items-center text-emerald-700 font-semibold hover:text-emerald-800 transition-colors">
              Access Study Materials <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { id: "CH-01", title: "Tawheed & Divine Attributes", desc: "The oneness of Allah, His eternal names, and attributes without distortion or denial." },
              { id: "CH-02", title: "Prophethood & Revelation", desc: "The finality of Prophet Muhammad (PBUH) and the authenticity of the Quran." },
              { id: "CH-03", title: "Predestination (Qadar)", desc: "Understanding divine decree, human will, and the written destiny." },
              { id: "CH-04", title: "The Unseen & Afterlife", desc: "Belief in angels, the Throne, the Pen, and the events of the Day of Judgment." },
              { id: "CH-05", title: "Faith (Iman) & Actions", desc: "The definition of faith, its relationship with actions, and the status of major sinners." },
              { id: "CH-06", title: "The Companions & Leadership", desc: "The virtues of the Sahabah, the caliphate, and obligations toward leadership." },
            ].map((course, idx) => (
              <div key={idx} className="bg-[#fdfbf7] rounded-2xl border border-emerald-100 p-6 flex flex-col group hover:shadow-md hover:border-emerald-200 transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-emerald-700 group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                    <BookText className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-mono font-semibold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                    {course.id}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 font-serif">{course.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6 flex-1">
                  {course.desc}
                </p>
                <div className="pt-4 border-t border-emerald-900/10 flex items-center justify-between text-sm">
                  <span className="flex items-center text-slate-500 font-medium">
                    <Lock className="w-4 h-4 mr-1.5 text-amber-500" /> Locked
                  </span>
                  <span className="text-emerald-700 font-semibold flex items-center group-hover:translate-x-1 transition-transform">
                    Requires Login <ChevronRight className="w-4 h-4 ml-0.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
          
        </div>
      </section>

      {/* 5. Sample Questions Preview */}
      <section className="w-full py-16 sm:py-24 bg-slate-900 relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-800/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-800/20 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold text-white mb-4">Assessment Preview</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Familiarize yourself with the LMS testing environment. Questions will evaluate both memorization of principles and conceptual understanding.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Sample Question 1 */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-xl">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-slate-700 p-2 rounded-lg text-emerald-400">
                  <FileQuestion className="w-5 h-5" />
                </div>
                <span className="text-sm font-semibold text-slate-300 tracking-wider uppercase">Sample Concept</span>
              </div>
              <p className="text-lg text-white font-medium mb-6">
                According to the text, how does Imam At-Tahawi describe the speech of Allah (Kalamullah)?
              </p>
              <div className="space-y-3">
                <div className="w-full p-4 rounded-xl border border-slate-600 bg-slate-700/50 text-slate-300 text-sm text-left opacity-70 cursor-not-allowed">A. It is created like human speech.</div>
                <div className="w-full p-4 rounded-xl border border-emerald-500/50 bg-emerald-500/10 text-white text-sm text-left flex justify-between items-center">
                  B. It is uncreated and originated from Him without a modality. <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="w-full p-4 rounded-xl border border-slate-600 bg-slate-700/50 text-slate-300 text-sm text-left opacity-70 cursor-not-allowed">C. It was originated by the Angel Gabriel.</div>
              </div>
            </div>

            {/* Sample Question 2 */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-xl">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-slate-700 p-2 rounded-lg text-amber-400">
                  <Quote className="w-5 h-5" />
                </div>
                <span className="text-sm font-semibold text-slate-300 tracking-wider uppercase">Sample Textual Recall</span>
              </div>
              <p className="text-lg text-white font-medium mb-6">
                "No human intellect can comprehend Him, nor can any human delusion encompass Him..." Which principle does this statement establish?
              </p>
              <div className="space-y-3">
                <div className="w-full p-4 rounded-xl border border-emerald-500/50 bg-emerald-500/10 text-white text-sm text-left flex justify-between items-center">
                  A. The transcendence and incomparability of Allah. <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="w-full p-4 rounded-xl border border-slate-600 bg-slate-700/50 text-slate-300 text-sm text-left opacity-70 cursor-not-allowed">B. The hidden nature of predestination.</div>
                <div className="w-full p-4 rounded-xl border border-slate-600 bg-slate-700/50 text-slate-300 text-sm text-left opacity-70 cursor-not-allowed">C. The limits of the Prophet's knowledge.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full text-center py-8 text-slate-500 text-sm">
        <p>© {new Date().getFullYear()} KUDC Exam Management System. Dedicated to Preserving Knowledge.</p>
      </footer>
    </div>
  );
}