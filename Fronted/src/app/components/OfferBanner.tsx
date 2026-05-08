import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function OfferBanner() {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState({
    hours: 24,
    minutes: 30,
    seconds: 45
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary"></div>
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1642425777032-0b2249756797?w=1200)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      ></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-white"
        >
          <h2 className="text-3xl lg:text-5xl mb-4">Mega Flash Sale!</h2>
          <p className="text-xl mb-8 opacity-90">
            Get up to 60% OFF on selected wellness products
          </p>

          {/* Countdown Timer */}
          <div className="flex justify-center gap-4 mb-8">
            {[
              { label: 'Hours', value: timeLeft.hours },
              { label: 'Minutes', value: timeLeft.minutes },
              { label: 'Seconds', value: timeLeft.seconds }
            ].map((item) => (
              <div
                key={item.label}
                className="bg-white/20 backdrop-blur-md rounded-xl p-4 min-w-[80px]"
              >
                <div className="text-3xl lg:text-4xl">
                  {item.value.toString().padStart(2, '0')}
                </div>
                <div className="text-sm opacity-80">{item.label}</div>
              </div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/shop')}
            className="bg-white text-primary px-8 py-4 rounded-xl hover:shadow-2xl transition-all duration-300 inline-flex items-center gap-2"
          >
            Shop Now
            <ArrowRight size={20} />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
