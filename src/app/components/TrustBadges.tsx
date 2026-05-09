import { motion } from 'motion/react';
import { ShieldCheck, Award, CheckCircle, Sparkles } from 'lucide-react';

const badges = [
  {
    icon: ShieldCheck,
    title: 'FDA Approved',
    description: 'All products meet FDA safety standards'
  },
  {
    icon: Award,
    title: 'HACCP Certified',
    description: 'Quality management system certified'
  },
  {
    icon: CheckCircle,
    title: 'Authentic Products',
    description: '100% genuine wellness supplements'
  },
  {
    icon: Sparkles,
    title: 'Premium Quality',
    description: 'Sourced from trusted manufacturers'
  }
];

export function TrustBadges() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl mb-4 text-foreground">Only Good Choices!</h2>
          <p className="text-muted-foreground">Why choose us for your wellness journey</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {badges.map((badge, index) => {
            const Icon = badge.icon;
            return (
              <motion.div
                key={badge.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-accent rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <Icon className="text-primary" size={32} />
                </div>
                <h3 className="mb-2 text-foreground">{badge.title}</h3>
                <p className="text-sm text-muted-foreground">{badge.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
