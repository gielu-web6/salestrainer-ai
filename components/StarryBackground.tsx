"use client";

import { useRef, useEffect } from "react";

export default function StarryBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    const stars: Array<{
      x: number;
      y: number;
      radius: number;
      alpha: number;
      decrease: boolean;
      speed: number;
      driftX: number;
      color: string;
    }> = [];
    for (let i = 0; i < 1500; i++) {
      const isMilkyWay = Math.random() > 0.3;
      let x = Math.random() * canvas.width;
      let y = isMilkyWay
        ? (x / canvas.width) * canvas.height + (Math.random() - 0.5) * canvas.height * 0.6
        : Math.random() * canvas.height;
      const colors = ["#ffffff", "#ffffff", "#e2e8f0", "#c7d2fe", "#fbcfe8", "#818cf8"];
      stars.push({
        x,
        y,
        radius: Math.random() * 1.5,
        alpha: Math.random(),
        decrease: Math.random() > 0.5,
        speed: Math.random() * 0.015 + 0.005,
        driftX: (Math.random() - 0.5) * 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, "rgba(99, 102, 241, 0.028)");
      gradient.addColorStop(0.5, "rgba(139, 92, 246, 0.022)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        if (star.decrease) {
          star.alpha -= star.speed;
          if (star.alpha <= 0.1) star.decrease = false;
        } else {
          star.alpha += star.speed;
          if (star.alpha >= 1) star.decrease = true;
        }
        star.x += star.driftX;
        if (star.x > canvas.width) star.x = 0;
        if (star.x < 0) star.x = canvas.width;
        const hex = star.color.startsWith("#")
          ? star.color + Math.floor(star.alpha * 255).toString(16).padStart(2, "0")
          : star.color;
        ctx.fillStyle = hex;
        ctx.fill();
      });
      animationFrameId = requestAnimationFrame(render);
    };
    render();
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 h-full w-full min-h-screen min-w-full pointer-events-none bg-black"
      aria-hidden
    />
  );
}
