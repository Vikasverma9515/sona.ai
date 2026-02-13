import React from 'react';

const WhatsAppGuide = () => {
    return (
        <section id="how-it-works" className="relative z-10 w-full px-6 py-24">
            <div className="max-w-7xl mx-auto">
                <h2
                    className="text-5xl md:text-8xl font-black mb-20 text-center tracking-normal"
                    style={{ fontFamily: 'var(--font-kanit), system-ui, sans-serif' }}
                >
                    HOW IT <span className="text-[#CCFA00]">WORKS</span>
                </h2>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Step 1 */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#4361EE] to-[#4CC9F0] rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                        <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 h-full flex flex-col items-center text-center hover:bg-white/10 transition-all duration-300">
                            <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center text-4xl mb-8 group-hover:scale-110 transition-transform duration-300">
                                👋
                            </div>
                            <h3 className="text-3xl font-black mb-4 text-white uppercase" style={{ fontFamily: 'var(--font-kanit), system-ui, sans-serif' }}>
                                1. Say Hi
                            </h3>
                            <p className="text-white/80 text-lg leading-relaxed mb-6">
                                Add Sona to your contacts and send a message.
                            </p>
                            <div className="mt-auto bg-black/40 rounded-xl p-4 w-full">
                                <code className="text-[#CCFA00] font-mono text-sm">+1 (555) 012-3456</code>
                            </div>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#F72585] to-[#7209B7] rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                        <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 h-full flex flex-col items-center text-center hover:bg-white/10 transition-all duration-300">
                            <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center text-4xl mb-8 group-hover:scale-110 transition-transform duration-300">
                                💬
                            </div>
                            <h3 className="text-3xl font-black mb-4 text-white uppercase" style={{ fontFamily: 'var(--font-kanit), system-ui, sans-serif' }}>
                                2. Chat & Command
                            </h3>
                            <p className="text-white/80 text-lg leading-relaxed mb-6">
                                Use natural language or commands to get things done.
                            </p>
                            <div className="mt-auto bg-black/40 rounded-xl p-4 w-full text-left space-y-2">
                                <div className="text-xs text-gray-400">Examples:</div>
                                <div className="text-[#CCFA00] font-mono text-sm">"Summarize this group"</div>
                                <div className="text-[#CCFA00] font-mono text-sm">"Remind me to buy milk"</div>
                            </div>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#CCFA00] to-[#E2E2E2] rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                        <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 h-full flex flex-col items-center text-center hover:bg-white/10 transition-all duration-300">
                            <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center text-4xl mb-8 group-hover:scale-110 transition-transform duration-300">
                                👥
                            </div>
                            <h3 className="text-3xl font-black mb-4 text-white uppercase" style={{ fontFamily: 'var(--font-kanit), system-ui, sans-serif' }}>
                                3. Add to Groups
                            </h3>
                            <p className="text-white/80 text-lg leading-relaxed mb-6">
                                Add Sona to any WhatsApp group to track tasks and summaries.
                            </p>
                            <div className="mt-auto bg-black/40 rounded-xl p-4 w-full">
                                <div className="text-white/90 font-mono text-sm">
                                    Simply add the number to your group, and Sona starts listening for mentions.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* QR Code / Direct Link Section */}
                <div className="mt-20 text-center">
                    <div className="inline-block relative group cursor-pointer">
                        <div className="absolute inset-0 bg-[#CCFA00] blur-xl opacity-20 group-hover:opacity-50 transition-opacity duration-500 rounded-full"></div>
                        <a
                            href="https://wa.me/15550123456"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative z-10 flex items-center gap-4 bg-[#25D366] hover:bg-[#1ebc59] text-white px-10 py-5 rounded-full font-black text-xl transition-all transform hover:scale-105 shadow-xl"
                        >
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.592 2.654-.698c1.005.572 1.903.882 3.037.882 3.175.001 5.762-2.585 5.765-5.764a5.772 5.772 0 00-5.996-6.065zm5.184 8.797c-.22.618-1.077 1.132-1.492 1.207-.406.073-.915.11-2.924-.693-2.071-1.285-3.376-3.864-3.546-4.093-.169-.23-1-1.332-1-2.541 0-1.209.625-1.802.846-2.046.202-.222.535-.278.711-.278.175 0 .351.009.505.044.172.039.405-.067.635.495.239.585.811 1.996.88 2.141.07.145.117.316.027.495-.089.179-.133.29-.265.426-.131.136-.275.303-.393.407-.131.115-.268.24-.115.5.153.261.678 1.116 1.455 1.808 1.002.892 1.851 1.171 2.113 1.298.261.128.416.108.571-.068.155-.177.669-.774.846-1.039.177-.265.351-.221.585-.134.234.088 1.488.702 1.743.83.255.128.425.191.485.297.06.105.06.608-.16 1.226z" />
                            </svg>
                            Start Chatting Now
                        </a>
                    </div>
                    <p className="mt-6 text-white/50 text-sm">
                        Or scan the QR code to begin
                    </p>
                </div>
            </div>
        </section>
    );
};

export default WhatsAppGuide;
