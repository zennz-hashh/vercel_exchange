import { useEffect, useRef } from 'react';

const INVESTOR_LOGOS = [
  '/investors/logo1.svg',
  '/investors/logo2.jpg',
  '/investors/logo3.jpg',
  '/investors/logo4.jpg',
  '/investors/logo5.jpg',
  '/investors/logo6.jpg',
  '/investors/logo7.jpg',
  '/investors/logo8.jpg'
];

export function InvestorMarquee() {
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleReducedMotion = () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        marqueeRef.current?.classList.add('no-animation');
      }
    };
    handleReducedMotion();
  }, []);

  return (
    <div
      className="w-full bg-white rounded-xl shadow-md py-6 overflow-hidden"
      aria-label="Investor logos"
    >
      <div
        ref={marqueeRef}
        className="flex gap-8 marquee-container"
        onMouseEnter={(e) => e.currentTarget.classList.add('paused')}
        onMouseLeave={(e) => e.currentTarget.classList.remove('paused')}
      >
        <div className="flex gap-8 marquee-content">
          {INVESTOR_LOGOS.map((logo, index) => (
            <div
              key={`original-${index}`}
              className="flex-shrink-0 w-40 h-16 flex items-center justify-center transition-all duration-300 hover:scale-105"
            >
              <img
                src={logo}
                alt={`Investor ${index + 1}`}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          ))}
        </div>
        <div className="flex gap-8 marquee-content" aria-hidden="true">
          {INVESTOR_LOGOS.map((logo, index) => (
            <div
              key={`duplicate-${index}`}
              className="flex-shrink-0 w-40 h-16 flex items-center justify-center transition-all duration-300 hover:scale-105"
            >
              <img
                src={logo}
                alt=""
                className="max-w-full max-h-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .marquee-container {
          animation: marquee 30s linear infinite;
        }

        .marquee-container.paused {
          animation-play-state: paused;
        }

        .marquee-container.no-animation {
          animation: none;
        }

        @media (prefers-reduced-motion: reduce) {
          .marquee-container {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
