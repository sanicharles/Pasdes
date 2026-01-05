
import React from 'react';

export const Logo = ({ className, size = 40, textColor = 'text-brand-white' }: { className?: string; size?: number; textColor?: string }) => (
    <div className={`flex items-center select-none ${className}`}>
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            className="mr-3"
            xmlns="http://www.w3.org/2000/svg"
        >
            <circle cx="50" cy="50" r="48" fill="#f8e3e3" stroke="#c09a3e" strokeWidth="4" />
            <g transform="translate(0, 5)">
                <path d="M 15 50 L 50 25 L 85 50 L 75 52 C 75 52, 60 45, 50 35 C 40 45, 25 52, 25 52 Z" fill="#c09a3e" />
                <path d="M 38 50 C 38 62, 62 62, 62 50 C 62 45, 38 45, 38 50 Z" fill="#3a5a40" />
                <circle cx="50" cy="62" r="15" fill="#3a5a40" />
                <path d="M 45 75 C 40 85, 60 85, 55 75 L 50 65 Z" fill="#a3b18a" />
                <path d="M 35 77 H 65 A 5 5 0 0 1 60 87 H 40 A 5 5 0 0 1 35 77 Z" fill="#588157" />
            </g>
        </svg>
        <span className={`text-2xl font-bold font-serif ${textColor}`}>
            WANITA TANGGUH
        </span>
    </div>
);
