"use client";

import React, { useEffect, useRef, useState } from "react";

interface RevealProps {
    children: React.ReactNode;
    width?: "fit-content" | "100%";
    className?: string;
    delay?: number;
}

export const Reveal = ({ children, width = "100%", className = "", delay = 0 }: RevealProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    // Once visible, we can stop observing
                    if (ref.current) observer.unobserve(ref.current);
                }
            },
            {
                threshold: 0.15, // Trigger when 15% of the element is visible
                rootMargin: "0px 0px -50px 0px" // Trigger slightly before it enters
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) observer.unobserve(ref.current);
        };
    }, []);

    const delayClass = delay ? `reveal-delay-${delay}` : "";

    return (
        <div
            ref={ref}
            className={`reveal ${isVisible ? "reveal-active" : ""} ${delayClass} ${className}`}
            style={{ width }}
        >
            {children}
        </div>
    );
};
