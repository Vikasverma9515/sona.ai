'use client';

import React from 'react';

export default function CloudOverlay() {
    return (
        <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden">
            {/* Top Left Cloud */}
            <div className="absolute -top-20 -left-20 w-[600px] h-[600px] bg-white rounded-full mix-blend-overlay filter blur-[100px] opacity-30 animate-float-slow"></div>

            {/* Top Right Cloud */}
            <div className="absolute top-0 -right-20 w-[500px] h-[500px] bg-white rounded-full mix-blend-overlay filter blur-[120px] opacity-20 animate-float-delayed"></div>

            {/* Middle Center Cloud (behind text) */}
            <div className="absolute top-[40%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white rounded-full mix-blend-overlay filter blur-[150px] opacity-10 animate-pulse-glow"></div>

            {/* Bottom Left */}
            <div className="absolute bottom-0 -left-40 w-[700px] h-[700px] bg-[#CCFA00] rounded-full mix-blend-overlay filter blur-[130px] opacity-10 animate-float"></div>

            {/* Bottom Right */}
            <div className="absolute -bottom-20 -right-20 w-[600px] h-[600px] bg-[#4CC9F0] rounded-full mix-blend-overlay filter blur-[120px] opacity-20 animate-float-delayed"></div>
        </div>
    );
}
