'use client';

import Link from "next/link";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

const Grainient = dynamic(() => import('@/components/Grainient'), { ssr: false });

export default function FeaturesPage() {
    return (
        <div className="relative min-h-screen bg-black text-white font-sans overflow-x-hidden" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>

            {/* ===== BACKGROUND ===== */}
            <div className="fixed top-0 left-0 w-full h-[100vh] z-0 pointer-events-none opacity-40">
                <Grainient
                    color1="#7209B7" // Purple
                    color2="#F72585" // Pink
                    timeSpeed={0.15}
                    colorBalance={0.6}
                    warpStrength={1.2}
                    noiseScale={1.5}
                    grainAmount={0.3}
                    contrast={1.1}
                    gamma={0.8}
                    saturation={1.0}
                />
            </div>

            {/* ===== NAVIGATION ===== */}
            <nav className="relative z-50 flex items-center justify-between px-8 py-6 md:px-16 border-b border-white/10 backdrop-blur-sm">
                <Link href="/" className="text-4xl font-black tracking-normal" style={{ fontFamily: 'var(--font-kanit), system-ui, sans-serif' }}>
                    SONA<span className="text-[#CCFA00]">.</span>
                </Link>
                <div className="hidden md:flex items-center gap-8 text-base font-bold text-white/90">
                    <Link href="/" className="hover:text-[#CCFA00] transition-colors duration-300">HOME</Link>
                    <span className="text-[#CCFA00]">FEATURES</span>
                    <a href="https://github.com/Vikasverma9515/sona.ai" target="_blank" className="hover:text-[#CCFA00] transition-colors duration-300">GITHUB</a>
                </div>
                <a href="#" className="rounded-full bg-white hover:bg-[#CCFA00] text-black px-6 py-2 text-sm font-black transition-all hover:scale-105 uppercase">
                    Get Sona
                </a>
            </nav>

            {/* ===== HERO SECTION ===== */}
            <section className="relative z-10 pt-20 pb-32 px-6 flex flex-col items-center text-center">
                <div className="inline-block mb-6 px-4 py-1 rounded-full border border-[#CCFA00]/50 bg-[#CCFA00]/10 text-[#CCFA00] text-sm font-bold uppercase tracking-widest backdrop-blur-md">
                    Advanced Capabilities
                </div>
                <h1 className="text-5xl md:text-8xl font-black mb-8 leading-tight max-w-5xl" style={{ fontFamily: 'var(--font-kanit), system-ui, sans-serif' }}>
                    MORE THAN JUST A <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#CCFA00] to-[#F72585]">CHATBOT</span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 max-w-3xl leading-relaxed mb-12">
                    Sona isn't just reading text. It has memory, autonomy, and the power to control your digital life.
                </p>
            </section>

            {/* ===== FEATURE 1: MEMORY ===== */}
            <section className="relative z-10 py-24 px-6 border-t border-white/10 bg-black/20 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                    <div className="order-2 md:order-1">
                        <div className="relative w-full aspect-square max-w-[500px] bg-gradient-to-br from-gray-900 to-black rounded-[3rem] border border-white/10 p-8 shadow-2xl flex flex-col gap-4 overflow-hidden">
                            {/* Simulated Chat Memory */}
                            <div className="bg-[#202c33] p-4 rounded-xl rounded-tl-none self-start max-w-[80%] text-sm text-white/80">
                                Hey Sona, remember I always take calls after 2 PM.
                            </div>
                            <div className="bg-[#005c4b] p-4 rounded-xl rounded-tr-none self-end max-w-[80%] text-sm text-white">
                                Got it. I've updated your preferences. 🧠
                            </div>
                            <div className="my-4 text-center text-xs text-gray-500">2 WEEKS LATER</div>
                            <div className="bg-[#202c33] p-4 rounded-xl rounded-tl-none self-start max-w-[80%] text-sm text-white/80">
                                Schedule a call with Mike.
                            </div>
                            <div className="bg-[#005c4b] p-4 rounded-xl rounded-tr-none self-end max-w-[80%] text-sm text-white">
                                Scheduling for 2:30 PM, since you prefer after 2 PM. ✅
                            </div>
                        </div>
                    </div>
                    <div className="order-1 md:order-2">
                        <div className="text-[#F72585] font-bold text-xl mb-4 uppercase tracking-wider">Long-Term Memory</div>
                        <h2 className="text-4xl md:text-6xl font-black mb-6" style={{ fontFamily: 'var(--font-kanit), system-ui, sans-serif' }}>
                            IT DOESN'T <br /> FORGET.
                        </h2>
                        <p className="text-lg text-gray-400 leading-relaxed mb-8">
                            Most bots wipe their memory after a session. Sona builds a knowledge graph of your life. It knows your team, your preferences, and your deadlines.
                        </p>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2 text-sm font-bold bg-white/5 py-2 px-4 rounded-lg border border-white/10">
                                <span>🧠</span> Learns Preferences
                            </div>
                            <div className="flex items-center gap-2 text-sm font-bold bg-white/5 py-2 px-4 rounded-lg border border-white/10">
                                <span>📊</span> Context Aware
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== FEATURE 2: INTEGRATIONS ===== */}
            <section className="relative z-10 py-24 px-6 border-t border-white/10">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <div className="text-[#4CC9F0] font-bold text-xl mb-4 uppercase tracking-wider">Deep Integrations</div>
                        <h2 className="text-4xl md:text-6xl font-black mb-6" style={{ fontFamily: 'var(--font-kanit), system-ui, sans-serif' }}>
                            CONNNECTED TO <br /> EVERYTHING.
                        </h2>
                        <p className="text-lg text-gray-400 leading-relaxed mb-8">
                            Sona lives in WhatsApp but works everywhere else. It has direct API access to your calendar, project management tools, and notes.
                        </p>
                        <ul className="space-y-4">
                            {['Google Calendar', 'Jira / Linear', 'Notion', 'Slack'].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-xl font-bold">
                                    <div className="w-8 h-8 rounded-full bg-[#4CC9F0] text-black flex items-center justify-center text-sm">✓</div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="relative">
                        {/* Abstract representation of integrations */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-[#1a1a1a] p-8 rounded-3xl border border-white/10 hover:border-[#4CC9F0] transition-colors hover:scale-105 duration-300">
                                <div className="text-4xl mb-4">📅</div>
                                <div className="font-bold text-xl">Calendar</div>
                                <div className="text-sm text-gray-500 mt-2">Auto-scheduling & conflict detection</div>
                            </div>
                            <div className="bg-[#1a1a1a] p-8 rounded-3xl border border-white/10 hover:border-[#4CC9F0] transition-colors hover:scale-105 duration-300 mt-8">
                                <div className="text-4xl mb-4">🐞</div>
                                <div className="font-bold text-xl">Jira</div>
                                <div className="text-sm text-gray-500 mt-2">Bug logging & status updates</div>
                            </div>
                            <div className="bg-[#1a1a1a] p-8 rounded-3xl border border-white/10 hover:border-[#4CC9F0] transition-colors hover:scale-105 duration-300 -mt-8">
                                <div className="text-4xl mb-4">📝</div>
                                <div className="font-bold text-xl">Notion</div>
                                <div className="text-sm text-gray-500 mt-2">Meeting notes & task lists</div>
                            </div>
                            <div className="bg-[#1a1a1a] p-8 rounded-3xl border border-white/10 hover:border-[#4CC9F0] transition-colors hover:scale-105 duration-300">
                                <div className="text-4xl mb-4">💬</div>
                                <div className="font-bold text-xl">Slack</div>
                                <div className="text-sm text-gray-500 mt-2">Cross-platform sync</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== FEATURE 3: AUTONOMY ===== */}
            <section className="relative z-10 py-24 px-6 border-t border-white/10 bg-black/20">
                <div className="max-w-5xl mx-auto text-center">
                    <div className="text-[#CCFA00] font-bold text-xl mb-4 uppercase tracking-wider">True Autonomy</div>
                    <h2 className="text-4xl md:text-7xl font-black mb-8" style={{ fontFamily: 'var(--font-kanit), system-ui, sans-serif' }}>
                        IT WORKS WHILE <br /> YOU SLEEP.
                    </h2>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-12">
                        Sona doesn't just reply. It proactively reaches out to people to get things done. It follows up on tasks, pesters people for updates, and ensures projects move forward.
                    </p>
                    <div className="bg-[#111] border border-white/10 rounded-3xl p-8 md:p-12 text-left relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#CCFA00] opacity-5 blur-[80px] rounded-full pointer-events-none"></div>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="bg-[#CCFA00] text-black text-xs font-bold px-2 py-1 rounded">SONA ACTIVITY LOG</div>
                            </div>
                            <div className="space-y-4 font-mono text-sm md:text-base text-gray-300">
                                <div className="flex gap-4">
                                    <span className="text-gray-600">09:00 AM</span>
                                    <span>Detected deadline risk for "Q3 Report".</span>
                                </div>
                                <div className="flex gap-4">
                                    <span className="text-gray-600">09:05 AM</span>
                                    <span><span className="text-[#CCFA00]">Action:</span> Messaged Sarah for update.</span>
                                </div>
                                <div className="flex gap-4">
                                    <span className="text-gray-600">11:30 AM</span>
                                    <span>Sarah replied with draft.</span>
                                </div>
                                <div className="flex gap-4">
                                    <span className="text-gray-600">11:32 AM</span>
                                    <span><span className="text-[#CCFA00]">Action:</span> Forwarded draft to You for review.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== BOTTOM CTA ===== */}
            <section className="relative z-10 py-32 px-6 text-center">
                <h2 className="text-5xl md:text-8xl font-black mb-12" style={{ fontFamily: 'var(--font-kanit), system-ui, sans-serif' }}>
                    READY TO <span className="text-[#CCFA00]">UPGRADE?</span>
                </h2>
                <a href="#" className="inline-block rounded-full bg-white hover:bg-[#CCFA00] text-black px-12 py-6 text-xl font-black transition-all hover:scale-105 shadow-[0_0_40px_rgba(255,255,255,0.3)] uppercase">
                    Get Sona Now
                </a>
            </section>

        </div>
    );
}
