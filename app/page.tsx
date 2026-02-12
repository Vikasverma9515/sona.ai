'use client';

import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";

const Grainient = dynamic(() => import('@/components/Grainient'), { ssr: false });

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col bg-[#4F46E5] text-white overflow-hidden" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>

      {/* ===== BACKGROUND ===== */}
      <div className="fixed top-0 left-0 w-full h-[100vh] z-0 pointer-events-none">
        <Grainient
          color1="#4361EE" // Bright Blue
          color2="#4CC9F0" // Cyan/Light Blue
          // color3="#FFFFFF" // White
          timeSpeed={0.2}
          colorBalance={0.5}
          warpStrength={1.5}
          noiseScale={1.5}
          grainAmount={0.2}
          contrast={1.2}
          gamma={0.6} // Brighter
          saturation={1.2}
        />
      </div>

      {/* ===== NAVIGATION ===== */}
      <nav className="relative z-50 flex items-center justify-between px-8 py-6 md:px-16">
        <div className="text-4xl font-black tracking-normal" style={{ fontFamily: 'var(--font-kanit), system-ui, sans-serif' }}>
          SONA<span className="text-[#CCFA00]">.</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-base font-bold text-white/90">
          <Link href="#features" className="hover:text-[#CCFA00] transition-colors duration-300">FEATURES</Link>
          <Link href="#how-it-works" className="hover:text-[#CCFA00] transition-colors duration-300">HOW IT WORKS</Link>
          <a
            href="https://github.com/Vikasverma9515/sona.ai"
            target="_blank"
            className="hover:text-[#CCFA00] transition-colors duration-300"
          >
            GITHUB
          </a>
        </div>
        <a
          href="#"
          className="rounded-full bg-white hover:bg-[#CCFA00] text-blue-900 px-8 py-3 text-sm font-black transition-all hover:scale-105 active:scale-95 shadow-lg uppercase tracking-wide"
        >
          Get Early Access
        </a>
      </nav>

      {/* ===== HERO ===== */}
      {/* ===== HERO ===== */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-20 pb-20 md:pt-32 md:pb-32">
        {/* Floating elements - Enhanced Examples */}
        <div className="absolute top-20 left-[2%] md:left-[5%] animate-float-delayed opacity-90 pointer-events-none hidden md:block">
          <div className="bg-[#25D366] text-white p-4 rounded-2xl rounded-bl-sm shadow-xl font-bold text-lg transform -rotate-6 max-w-xs text-left">
            <div className="text-xs opacity-80 mb-1">Group: "Project Gamma"</div>
            Summarize 450 messages? �
          </div>
        </div>
        <div className="absolute top-40 right-[2%] md:right-[5%] animate-float-slow opacity-90 pointer-events-none hidden md:block">
          <div className="bg-white text-black p-4 rounded-2xl rounded-br-sm shadow-xl font-bold text-lg transform rotate-6 max-w-xs text-left">
            <div className="text-xs text-blue-600 mb-1">@Sona</div>
            Done. 📝 Action items sent to Notion.
          </div>
        </div>
        <div className="absolute bottom-10 left-[10%] animate-float opacity-80 pointer-events-none hidden md:block">
          <div className="bg-[#34B7F1] text-white p-3 rounded-2xl rounded-tr-sm shadow-xl font-bold text-base transform rotate-3">
            Meeting booked for 4 PM! 📅
          </div>
        </div>

        <div className="mb-6 rounded-full border border-white/40 bg-white/10 px-6 py-2 text-sm font-bold text-white backdrop-blur-md uppercase tracking-widest shadow-lg">
          🚀 The AI Agent You Deserve
        </div>

        <h1
          className="text-7xl sm:text-8xl md:text-[10rem] lg:text-[12rem] font-black tracking-normal leading-[0.8] mb-6 drop-shadow-sm text-center"
          style={{ fontFamily: 'var(--font-kanit), system-ui, sans-serif' }}
        >
          <span className="block text-white">SLICE</span>
          <span className="block text-[#CCFA00]">THE CHAOS</span>
        </h1>

        <p className="text-xl md:text-3xl text-white font-medium max-w-4xl mb-12 leading-relaxed drop-shadow-md">
          Sona lives in your WhatsApp. It <span className="bg-white/20 px-2 rounded">extracts tasks</span>, <span className="bg-white/20 px-2 rounded">schedules meetings</span>, and <span className="bg-white/20 px-2 rounded">summarizes noise</span>.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 z-20">
          <a
            href="#"
            className="group rounded-full bg-white text-blue-900 px-12 py-5 text-xl font-black hover:scale-105 active:scale-95 transition-all shadow-[0_10px_40px_rgba(0,0,0,0.2)]"
          >
            ADD TO WHATSAPP
          </a>
        </div>
      </section>

      {/* ===== USE CASES ===== */}
      <section className="relative z-10 w-full px-6 py-12 md:py-24">
        <div className="max-w-7xl mx-auto">
          <h2
            className="text-4xl md:text-7xl font-black mb-16 text-center tracking-normal uppercase text-white"
            style={{ fontFamily: 'var(--font-kanit), system-ui, sans-serif' }}
          >
            Built for <span className="text-[#CCFA00]">Everyone</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Student Persona */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-[2.5rem] hover:bg-white/15 transition-all group">
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">🎓</div>
              <h3 className="text-3xl font-black mb-2 text-white" style={{ fontFamily: 'var(--font-kanit), system-ui, sans-serif' }}>STUDENTS</h3>
              <p className="text-white/80 text-lg font-medium leading-relaxed">
                "Sona, catch me up on the group project."
                <br /><br />
                Missed 300 messages while sleeping? Sona gives you the TL;DR and tells you what you need to do by Monday.
              </p>
            </div>

            {/* Doctor/Professional Persona */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-[2.5rem] hover:bg-white/15 transition-all group">
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">🩺</div>
              <h3 className="text-3xl font-black mb-2 text-white" style={{ fontFamily: 'var(--font-kanit), system-ui, sans-serif' }}>DOCTORS</h3>
              <p className="text-white/80 text-lg font-medium leading-relaxed">
                "Schedule my shifts with the team."
                <br /><br />
                Coordinate on-call schedules without the back-and-forth chaos. Sona finds the slots that work for everyone.
              </p>
            </div>

            {/* Startup/Everyone Persona */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-[2.5rem] hover:bg-white/15 transition-all group">
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">🚀</div>
              <h3 className="text-3xl font-black mb-2 text-white" style={{ fontFamily: 'var(--font-kanit), system-ui, sans-serif' }}>STARTUPS</h3>
              <p className="text-white/80 text-lg font-medium leading-relaxed">
                "Capture these bugs."
                <br /><br />
                Mention @Sona when a bug is reported in chat. It goes straight to Jira or Notion. No copying, no pasting.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="features" className="relative z-10 w-full px-6 py-24">
        <div className="max-w-7xl mx-auto">
          <h2
            className="text-5xl md:text-8xl font-black mb-20 text-center tracking-normal"
            style={{ fontFamily: 'var(--font-kanit), system-ui, sans-serif' }}
          >
            WHATSAPP<br />
            <span className="text-[#CCFA00]">SUPERCHARGED</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="glass-card rounded-[2.5rem] p-10 relative overflow-hidden group">
              <div className="bg-[#CCFA00] w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-6 text-black font-bold">🧠</div>
              <h3 className="text-3xl font-black mb-4 uppercase">Smart<br />Summaries</h3>
              <p className="text-white text-lg font-medium leading-relaxed opacity-90">
                Wake up to a clean summary. Sona reads the noise so you don&apos;t have to.
              </p>
            </div>

            {/* Card 2 */}
            <div className="glass-card rounded-[2.5rem] p-10 relative overflow-hidden group">
              <div className="bg-[#4CC9F0] w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-6 text-black font-bold">⚡</div>
              <h3 className="text-3xl font-black mb-4 uppercase">Instant<br />Tasks</h3>
              <p className="text-white text-lg font-medium leading-relaxed opacity-90">
                Mentions turn into tasks. &quot;@Vikas upload the file&quot; becomes a tracked item instantly.
              </p>
            </div>

            {/* Card 3 */}
            <div className="glass-card rounded-[2.5rem] p-10 relative overflow-hidden group">
              <div className="bg-[#F72585] w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-6 text-white font-bold">📅</div>
              <h3 className="text-3xl font-black mb-4 uppercase">Auto<br />Scheduling</h3>
              <p className="text-white text-lg font-medium leading-relaxed opacity-90">
                Forget Doodle. Sona negotiates times with everyone and drops a calendar invite.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CHAT MOCKUP ===== */}
      <section className="relative z-10 w-full px-6 py-24 flex flex-col items-center">
        <h2
          className="text-4xl md:text-7xl font-black mb-16 text-center tracking-normal uppercase"
          style={{ fontFamily: 'var(--font-kanit), system-ui, sans-serif' }}
        >
          See It <span className="text-[#CCFA00]">Live</span>
        </h2>

        {/* Floating Phone Effect */}
        <div className="relative max-w-sm w-full mx-auto bg-black rounded-[3rem] border-8 border-black shadow-2xl overflow-hidden transform rotate-[-2deg] hover:rotate-0 transition-all duration-500">
          <div className="bg-[#0b141a] h-[600px] w-full p-4 flex flex-col font-sans">
            <div className="flex items-center gap-3 p-3 bg-[#202c33] rounded-xl mb-4 text-white">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-400 to-blue-500 flex items-center justify-center font-bold">P</div>
              <div>
                <div className="font-bold">Project Alpha 🚀</div>
                <div className="text-xs text-gray-400">You, Sarah, Sona, Ravi</div>
              </div>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto">
              <div className="bg-[#202c33] self-start rounded-tr-lg rounded-br-lg rounded-bl-lg p-3 max-w-[85%] text-white text-sm">
                <div className="text-[10px] text-orange-400 mb-1 font-bold">Sarah</div>
                We need to finalize the deck by EOD. Who is on it?
              </div>

              <div className="bg-[#005c4b] self-end rounded-tl-lg rounded-bl-lg rounded-br-lg p-3 max-w-[85%] text-white text-sm ml-auto">
                I&apos;ll handle slides 1-5.
              </div>

              <div className="bg-[#202c33] self-start rounded-tr-lg rounded-br-lg rounded-bl-lg p-3 max-w-[85%] text-white text-sm">
                <div className="text-[10px] text-blue-400 mb-1 font-bold">Ravi</div>
                I&apos;m stuck on the research. Can we meet?
              </div>

              {/* Sona Intervention */}
              <div className="bg-[#202c33] p-3 rounded-lg border border-[#CCFA00]/50 shadow-[0_0_15px_rgba(204,250,0,0.2)]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-[#CCFA00] uppercase">⚡ Sona Logic Active</span>
                </div>
                <div className="text-xs text-white/90 space-y-2">
                  <p><b>Observation:</b> Ravi is blocked.</p>
                  <p><b>Action:</b> Scheduling sync.</p>
                  <div className="bg-white/10 p-2 rounded text-center font-mono">
                    Checking calendars... ⏳
                  </div>
                </div>
              </div>

              <div className="bg-[#202c33] self-start rounded-tr-lg rounded-br-lg rounded-bl-lg p-3 max-w-[85%] text-white text-sm">
                <div className="text-[10px] text-[#CCFA00] mb-1 font-bold">Sona 🤖</div>
                I&apos;ve noticed a blocker. I found a slot at 4:30 PM for everyone. Sending invites now. 📅
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ===== CTA ===== */}
      <section className="relative z-10 w-full px-6 py-32 text-center bg-black text-white">
        <h2
          className="text-5xl md:text-9xl font-black mb-10 tracking-normal"
          style={{ fontFamily: 'var(--font-kanit), system-ui, sans-serif' }}
        >
          READY?
        </h2>
        <a
          href="#"
          className="inline-block rounded-full bg-[#CCFA00] text-black px-12 py-6 text-2xl font-black hover:scale-105 transition-all uppercase"
        >
          Get Sona Now
        </a>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="relative z-50 w-full py-12 bg-black border-t border-white/20">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-2xl font-black" style={{ fontFamily: 'var(--font-kanit), system-ui, sans-serif' }}>
            SONA<span className="text-[#CCFA00]">.</span>
          </div>
          <p className="text-white/50 text-sm">© 2026 Sona AI.</p>
        </div>
      </footer>
    </div>
  );
}
