import React from 'react';
import PhoneMockup from './PhoneMockup';

const LiveDemo = () => {
    // Scenario 1: Student
    const studentMessages = [
        { id: 's1', text: "guys I missed the lecture, what's due?", sender: 'user' as const, delay: 500 },
        { id: 's2', text: "Prof said essay due Monday & check canvas", sender: 'user' as const, delay: 1500 }, // From "friend" (simulated as user for simplicity or add 'other' type later if needed, but 'user' works for green bubbles)
        // Actually, to simulate group chat, user=green (me), sona=response. 
        // Let's assume 'user' is "Me" asking.
        // Wait, for "Summary", usually the user asks Sona.
        // Let's model it as: User asks Sona to summarize.
        { id: 's3', text: "@Sona summarize the last 50 messages", sender: 'user' as const, delay: 3000 },
        { id: 's4', text: "Summary: \n1. Essay due Mon (Topic: AI Ethics)\n2. read ch 4-5\n3. Midterm moved to Friday.", sender: 'sona' as const, delay: 2000 },
    ];

    // Scenario 2: Doctor/Shift
    const doctorMessages = [
        { id: 'd1', text: "Can anyone cover my Sat shift?", sender: 'user' as const, delay: 500 },
        { id: 'd2', text: "@Sona schedule a swap with Sarah", sender: 'user' as const, delay: 2000 },
        { id: 'd3', text: "Checking Sarah's calendar... ✅ She is free. Swap proposed for Saturday 8PM.", sender: 'sona' as const, delay: 2000 },
    ];

    // Scenario 3: Startup/Tasks
    const startupMessages = [
        { id: 'st1', text: "Bug found in login flow: 500 error on submit", sender: 'user' as const, delay: 500 },
        { id: 'st2', text: "@Sona log this to Jira", sender: 'user' as const, delay: 1500 },
        { id: 'st3', text: "Ticket created: [PROJ-123] Login 500 Error. Assigned to Backend Team.", sender: 'sona' as const, delay: 2500 },
    ];


    return (
        <section className="relative z-10 w-full px-6 py-24 flex flex-col items-center overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#CCFA00] opacity-5 blur-[120px] rounded-full pointer-events-none"></div>

            <h2
                className="text-4xl md:text-7xl font-black mb-16 text-center tracking-normal uppercase"
                style={{ fontFamily: 'var(--font-kanit), system-ui, sans-serif' }}
            >
                See It <span className="text-[#CCFA00]">Live</span>
            </h2>

            <div className="flex flex-col xl:flex-row gap-10 items-center justify-center w-full">
                <div className="transform hover:scale-105 transition-transform duration-500 hover:z-10 flex flex-col items-center">
                    <PhoneMockup
                        title="Coding 101 Group"
                        subtitle="You, Sarah, Mike, +4 others"
                        accentColor="#4CC9F0"
                        messages={studentMessages}
                    />
                    <div className="mt-8 bg-black/40 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 shadow-lg">
                        <div className="text-center font-extrabold text-xl text-[#4CC9F0] tracking-widest">STUDENT</div>
                        <p className="text-center text-white/80 text-sm font-medium">Instant Summaries</p>
                    </div>
                </div>

                <div className="transform scale-110 z-10 hover:scale-115 transition-transform duration-500  flex flex-col items-center">
                    <PhoneMockup
                        title="ER Shift Team"
                        subtitle="You, Dr. Smith, Nurse Joy..."
                        accentColor="#F72585"
                        messages={doctorMessages}

                    />
                    <div className="mt-8 bg-black/40 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 shadow-lg">
                        <div className="text-center font-bold text-xl text-[#F72585] tracking-widest">PROFESSIONAL</div>
                        <p className="text-center text-white/80 text-sm font-medium">Smart Scheduling</p>
                    </div>
                </div>

                <div className="transform hover:scale-105 transition-transform duration-500 hover:z-10 flex flex-col items-center">
                    <PhoneMockup
                        title="Product Launch 🚀"
                        subtitle="You, Dev Team, PM"
                        accentColor="#CCFA00"
                        messages={startupMessages}
                    />
                    <div className="mt-8 bg-black/40 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 shadow-lg">
                        <div className="text-center font-bold text-xl text-[#CCFA00] tracking-widest">STARTUP</div>
                        <p className="text-center text-white/80 text-sm font-medium">Task Automation</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LiveDemo;
