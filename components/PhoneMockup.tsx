import React, { useState, useEffect } from 'react';

type Message = {
    id: string;
    text: string;
    sender: 'user' | 'sona';
    delay: number; // Delay before showing this message in ms
};

interface PhoneMockupProps {
    title: string;
    subtitle: string;
    accentColor: string;
    messages: Message[];
    className?: string;
}

const PhoneMockup: React.FC<PhoneMockupProps> = ({
    title,
    subtitle,
    accentColor,
    messages,
    className = '',
}) => {
    const [visibleMessages, setVisibleMessages] = useState<string[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        let timeouts: NodeJS.Timeout[] = [];

        const runAnimation = () => {
            setVisibleMessages([]);
            setIsTyping(false);

            let cumulativeDelay = 0;

            messages.forEach((msg, index) => {
                // Typing indicator logic
                if (msg.sender === 'sona') {
                    const typingStart = cumulativeDelay + (msg.delay - 800 > 0 ? msg.delay - 800 : 0);
                    timeouts.push(setTimeout(() => setIsTyping(true), typingStart));
                    timeouts.push(setTimeout(() => setIsTyping(false), cumulativeDelay + msg.delay));
                }

                cumulativeDelay += msg.delay;

                timeouts.push(
                    setTimeout(() => {
                        setVisibleMessages((prev) => {
                            const newMessages = [...prev, msg.id];
                            // Scroll to bottom after state update
                            setTimeout(() => {
                                if (scrollRef.current) {
                                    scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
                                }
                            }, 50);
                            return newMessages;
                        });
                    }, cumulativeDelay)
                );
            });

            // Loop animation
            const totalDuration = cumulativeDelay + 4000;
            timeouts.push(setTimeout(runAnimation, totalDuration));
        };

        runAnimation();

        return () => {
            timeouts.forEach((t) => clearTimeout(t));
        };
    }, [messages]);

    return (
        <div className={`relative w-[300px] h-[600px] bg-black rounded-[3rem] border-8 border-gray-900 shadow-2xl overflow-hidden ${className}`}>
            {/* Dynamic Island / Notch */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-7 bg-black rounded-b-2xl z-20"></div>

            {/* Header */}
            <div className="bg-[#202c33] p-4 pt-10 flex items-center gap-3 border-b border-white/5 relative z-10 shadow-sm">
                <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm"
                    style={{ backgroundColor: accentColor }}
                >
                    {title.charAt(0)}
                </div>
                <div>
                    <div className="text-white font-bold text-sm leading-tight">{title}</div>
                    <div className="text-gray-400 text-xs">{subtitle}</div>
                </div>
            </div>

            {/* Chat Area */}
            <div
                ref={scrollRef}
                className="bg-[#0b141a] h-full p-4 flex flex-col gap-3 overflow-y-auto pb-24 relative scrollbar-hide"
            >
                {/* Background Pattern */}
                <div className="fixed inset-0 opacity-5 pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '15px 15px' }}>
                </div>

                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`max-w-[85%] p-3 rounded-2xl text-sm transition-all duration-300 ease-out transform ${visibleMessages.includes(msg.id)
                                ? 'opacity-100 translate-y-0 scale-100'
                                : 'opacity-0 translate-y-4 scale-95 hidden'
                            } ${msg.sender === 'user'
                                ? 'self-end bg-[#005c4b] text-white rounded-tr-none shadow-md'
                                : 'self-start bg-[#202c33] text-white rounded-tl-none shadow-md'
                            }`}
                    >
                        {msg.sender === 'sona' && (
                            <div className="text-[10px] mb-1 font-bold tracking-wide" style={{ color: accentColor }}>Sona 🤖</div>
                        )}
                        {msg.text}
                        <div className="text-[9px] text-white/50 text-right mt-1 font-mono">
                            2:21 PM
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="self-start bg-[#202c33] p-3 rounded-2xl rounded-tl-none text-white w-16 flex items-center justify-center gap-1 animate-pulse shadow-md transition-opacity duration-300">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                )}
            </div>

            {/* Footer / Input Area - Fixed at bottom */}
            <div className='absolute bottom-0 left-0 w-full bg-[#1f2c34] p-3 flex items-center gap-2 z-20 border-t border-white/5'>
                <div className='w-6 h-6 rounded-full border-2 border-gray-500/50'></div>
                <div className='flex-1 h-9 bg-[#2a3942] rounded-full px-4 flex items-center'>
                    <div className='text-gray-500 text-xs'>Message...</div>
                </div>
                <div className='w-8 h-8 rounded-full bg-[#005c4b] flex items-center justify-center'>
                    <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-white border-b-[5px] border-b-transparent ml-1"></div>
                </div>
            </div>
        </div>
    );
};

export default PhoneMockup;
