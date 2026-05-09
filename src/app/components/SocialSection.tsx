import { motion } from 'motion/react';
import { Instagram, Facebook, Youtube, Twitter } from 'lucide-react';

const socialLinks = [
  {
    icon: Instagram,
    name: 'Instagram',
    color: 'hover:text-pink-600',
    bgColor: 'hover:bg-pink-50',
    href: 'https://www.instagram.com/'
  },
  {
    icon: Facebook,
    name: 'Facebook',
    color: 'hover:text-blue-600',
    bgColor: 'hover:bg-blue-50',
    href: 'https://www.facebook.com/'
  },
  {
    icon: Youtube,
    name: 'YouTube',
    color: 'hover:text-red-600',
    bgColor: 'hover:bg-red-50',
    href: 'https://www.youtube.com'
  },
  {
    icon: Twitter,
    name: 'Twitter',
    color: 'hover:text-sky-600',
    bgColor: 'hover:bg-sky-50',
    href: 'https://x.com'
  }
];

export function SocialSection() {
  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl mb-4 text-foreground">Snap it, Tag it, Share it!</h2>
          <p className="text-muted-foreground">Follow us on social media for wellness tips and exclusive offers</p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-6">
          {socialLinks.map((social, index) => {
            const Icon = social.icon;
            return (
              <motion.a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.1, y: -8 }}
                whileTap={{ scale: 0.95 }}
                className={`flex flex-col items-center justify-center w-32 h-32 bg-white rounded-2xl shadow-md transition-all duration-300 ${social.bgColor}`}
              >
                <Icon className={`mb-2 text-foreground transition-colors duration-300 ${social.color}`} size={40} />
                <span className="text-sm text-muted-foreground">{social.name}</span>
              </motion.a>
            );
          })}
        </div>

        {/* Instagram Grid Preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            'https://images.unsplash.com/photo-1642425777032-0b2249756797?w=400',
            'https://images.unsplash.com/photo-1771086559194-91fffc427573?w=400',
            'https://images.unsplash.com/photo-1758534272283-bbbeacf06b2d?w=400',
            'https://images.unsplash.com/photo-1768403305881-a7a82fd63512?w=400'
          ].map((img, index) => (
            <motion.a
              key={index}
              href="https://www.instagram.com/"
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="aspect-square rounded-2xl overflow-hidden shadow-md cursor-pointer"
            >
              <img
                src={img}
                alt={`Social post ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
