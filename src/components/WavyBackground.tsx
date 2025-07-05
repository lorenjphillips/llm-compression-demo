import { useEffect, useRef } from "react";

export function WavyBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let animationFrameId: number;

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    }
    resize();
    window.addEventListener("resize", resize);

    const waves = [
      { amplitude: 32, wavelength: 400, speed: 0.5, color: "rgba(188,193,202,0.18)", offset: 0 },
      { amplitude: 24, wavelength: 300, speed: 0.7, color: "rgba(190,103,49,0.13)", offset: 100 },
      { amplitude: 16, wavelength: 200, speed: 1.1, color: "rgba(255,255,255,0.08)", offset: 200 },
    ];

    function drawWaves(time: number) {
      ctx.clearRect(0, 0, width, height);
      waves.forEach((wave, i) => {
        ctx.beginPath();
        for (let x = 0; x <= width; x += 2) {
          const y =
            height * 0.25 +
            i * height * 0.18 +
            Math.sin((x + wave.offset + time * wave.speed * 60) / wave.wavelength * Math.PI * 2) * wave.amplitude;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = wave.color;
        ctx.lineWidth = 2 + i;
        ctx.shadowColor = wave.color;
        ctx.shadowBlur = 8 - i * 2;
        ctx.stroke();
        ctx.shadowBlur = 0;
      });
    }

    function animate(time: number) {
      drawWaves(time / 1000);
      animationFrameId = requestAnimationFrame(animate);
    }
    animate(0);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full z-0 pointer-events-none select-none"
      aria-hidden="true"
      tabIndex={-1}
    />
  );
} 