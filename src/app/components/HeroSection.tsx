import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function HeroSection() {
  return (
    <section className="relative mt-24 sm:mt-28 lg:mt-32 bg-gradient-to-br from-accent via-white to-secondary overflow-hidden">
      <div className="container mx-auto px-4 py-10 sm:py-12 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full mb-6"
            >
              Limited Time Offer
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl sm:text-5xl lg:text-6xl mb-5 text-foreground leading-tight"
            >
              Your Journey to
              <span className="block text-primary">Wellness Starts Here</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-base sm:text-lg text-muted-foreground mb-7"
            >
              Premium quality supplements for a healthier, happier you. Get 50% OFF + extra 10% on your first order!
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link 
                to="/shop"
                className="bg-primary text-primary-foreground px-8 py-4 rounded-xl hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:scale-105 flex items-center justify-center gap-2"
              >
                Shop Now
                <ArrowRight size={20} />
              </Link>
              <Link 
                to="/shop"
                className="border-2 border-primary text-primary px-8 py-4 rounded-xl hover:bg-primary hover:text-white transition-all duration-300 hover:shadow-lg text-center"
              >
                Explore Products
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative max-w-xl w-full mx-auto lg:ml-auto"
          >
            <div className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1768403305881-a7a82fd63512?w=800"
                alt="Wellness Products"
                className="w-full h-64 sm:h-80 md:h-96 lg:h-[430px] object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
            
            {/* Floating badges */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white rounded-xl sm:rounded-2xl shadow-lg p-2.5 sm:p-3"
            >
              <div className="text-primary text-xl sm:text-2xl">50%</div>
              <div className="text-xs sm:text-sm text-muted-foreground">OFF</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 bg-primary text-primary-foreground rounded-xl sm:rounded-2xl shadow-lg p-2.5 sm:p-3"
            >
              <div className="text-lg sm:text-xl">100%</div>
              <div className="text-xs sm:text-sm">Authentic</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
