<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Extreme React Animation</title>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>

  <style>
    html, body {
      margin: 0;
      padding: 0;
      overflow: hidden;
      background: black;
      font-family: sans-serif;
    }

    .container {
      position: relative;
      width: 100vw;
      height: 100vh;
      perspective: 1000px;
      overflow: hidden;
    }

    .core {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 150px;
      height: 150px;
      margin: -75px;
      border-radius: 50%;
      background: radial-gradient(circle, #fff, #ff00ff, #00ffff);
      box-shadow: 0 0 60px #ff00ff, 0 0 120px #00ffff;
      transform-style: preserve-3d;
    }

    .particle {
      position: absolute;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: white;
      pointer-events: none;
    }

    .bg-flash {
      position: absolute;
      width: 100%;
      height: 100%;
      animation: bgShift 10s infinite linear;
    }

    @keyframes bgShift {
      0% { background: radial-gradient(circle at 20% 20%, #ff0080, #000); }
      25% { background: radial-gradient(circle at 80% 30%, #00ffff, #000); }
      50% { background: radial-gradient(circle at 50% 80%, #ffff00, #000); }
      75% { background: radial-gradient(circle at 10% 60%, #ff0000, #000); }
      100% { background: radial-gradient(circle at 20% 20%, #ff0080, #000); }
    }
  </style>
</head>

<body>
  <div id="root"></div>

  <script type="text/babel">

    const { useEffect, useRef, useState } = React;

    function App() {
      const coreRef = useRef(null);
      const containerRef = useRef(null);
      const [particles, setParticles] = useState([]);

      useEffect(() => {
        let angle = 0;
        let scale = 1;
        let growing = true;

        function animate() {
          angle += 0.03;

          if (growing) {
            scale += 0.01;
            if (scale > 1.5) growing = false;
          } else {
            scale -= 0.01;
            if (scale < 0.8) growing = true;
          }

          if (coreRef.current) {
            coreRef.current.style.transform = `
              rotateX(${angle * 40}deg)
              rotateY(${angle * 60}deg)
              rotateZ(${angle * 20}deg)
              scale(${scale})
            `;
          }

          requestAnimationFrame(animate);
        }

        animate();
      }, []);

      useEffect(() => {
        const interval = setInterval(() => {
          const id = Math.random();
          const x = window.innerWidth / 2;
          const y = window.innerHeight / 2;
          const angle = Math.random() * Math.PI * 2;
          const speed = 2 + Math.random() * 4;

          setParticles(prev => [
            ...prev,
            { id, x, y, angle, speed, life: 100 }
          ]);
        }, 30);

        return () => clearInterval(interval);
      }, []);

      useEffect(() => {
        const interval = setInterval(() => {
          setParticles(prev =>
            prev
              .map(p => ({
                ...p,
                x: p.x + Math.cos(p.angle) * p.speed,
                y: p.y + Math.sin(p.angle) * p.speed,
                life: p.life - 2
              }))
              .filter(p => p.life > 0)
          );
        }, 16);

        return () => clearInterval(interval);
      }, []);

      return (
        <div ref={containerRef} className="container">
          <div className="bg-flash"></div>

          <div ref={coreRef} className="core"></div>

          {particles.map(p => (
            <div
              key={p.id}
              className="particle"
              style={{
                left: p.x,
                top: p.y,
                opacity: p.life / 100,
                background: `hsl(${p.life * 3}, 100%, 50%)`,
                transform: `scale(${p.life / 50})`
              }}
            />
          ))}
        </div>
      );
    }

    ReactDOM.createRoot(document.getElementById('root')).render(<App />);

  </script>
</body>
</html>
