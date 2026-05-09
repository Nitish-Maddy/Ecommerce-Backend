import { useState } from 'react';
import { Heart, Mail, Phone, X, Instagram, Facebook } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { newsletterApi } from '../services/api';

export function Footer() {
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<
    null | { type: 'success' | 'error'; message: string }
  >(null);
  const [newsletterPreviewUrl, setNewsletterPreviewUrl] = useState<string | null>(null);
  const footerLinks = {
    shopAll: [
      { label: 'Daily Essentials', href: '/collection/daily-essentials' },
      { label: "Men's Wellness", href: '/collection/mens-wellness' },
      { label: 'Weight Management', href: '/collection/weight-management' },
      { label: 'Daily Nutrition', href: '/collection/daily-nutrition' },
      { label: 'Fitness', href: '/collection/fitness' },
      { label: 'Skincare', href: '/category/skin' },
      { label: 'Haircare', href: '/category/hair' },
    ],
    discover: [
      { label: 'About Us', href: '/discover/about-us' },
      { label: 'Our Doctors', href: '/discover/our-doctors' },
      { label: 'Our Whitepapers', href: '/discover/our-whitepapers' },
      { label: 'Our Blogs', href: '/discover/our-blogs' },
      { label: 'Our Media Center', href: '/discover/our-media-center' },
      { label: 'Careers', href: '/discover/careers' },
    ],
    offers: [
      { label: 'Mega Offers', href: '/offers/mega-offers' },
      { label: 'Combos & Gifts', href: '/offers/combos-gifts' },
      { label: 'Bestsellers', href: '/offers/bestsellers' },
      { label: 'Newly Launched', href: '/offers/newly-launched' },
    ],
    bottom: [
      { label: 'Terms of Use', href: '/policy/terms-of-use' },
      { label: 'Privacy', href: '/policy/privacy' },
      { label: 'Shipping', href: '/policy/shipping' },
      { label: 'Refund & Cancellation', href: '/policy/refund-cancellation' },
    ],
  };

  return (
    <footer className="bg-white border-t border-border">
      <div className="container mx-auto px-4 pt-10 sm:pt-12">
        {/* Top grid (like screenshot) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <h4 className="text-sm font-bold text-foreground mb-4">Shop All</h4>
            <ul className="space-y-2.5">
              {footerLinks.shopAll.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-foreground mb-4">Discover</h4>
            <ul className="space-y-2.5">
              {footerLinks.discover.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-foreground mb-4">Offers</h4>
            <ul className="space-y-2.5">
              {footerLinks.offers.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter + contact + social */}
          <div className="lg:pl-6">
            <h4 className="text-sm font-bold text-foreground mb-3">No Spam, Only Happiness</h4>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const email = newsletterEmail.trim();
                if (!email || !email.includes('@')) {
                  setNewsletterStatus({
                    type: 'error',
                    message: 'Please enter a valid email address.',
                  });
                  return;
                }
                try {
                  const res = await newsletterApi.subscribe(email);
                  setNewsletterPreviewUrl(res?.previewUrl || null);
                  setNewsletterStatus({
                    type: 'success',
                    message:
                      res?.message ||
                      'Confirmation email sent. Please check your inbox to confirm you want to receive email marketing.',
                  });
                  setNewsletterEmail('');
                } catch (err: any) {
                  setNewsletterPreviewUrl(null);
                  setNewsletterStatus({
                    type: 'error',
                    message: err?.message || 'Failed to subscribe. Please try again.',
                  });
                }
              }}
              className="flex flex-col gap-3"
            >
              <input
                type="email"
                placeholder="Email Address"
                value={newsletterEmail}
                onChange={(e) => {
                  setNewsletterEmail(e.target.value);
                  if (newsletterStatus) setNewsletterStatus(null);
                  if (newsletterPreviewUrl) setNewsletterPreviewUrl(null);
                }}
                className="w-full h-11 px-4 rounded-lg border border-gray-200 bg-white outline-none focus:border-primary transition-colors text-sm"
              />
              <button
                type="submit"
                className="h-11 rounded-lg bg-primary text-primary-foreground font-semibold tracking-[0.18em] text-xs hover:bg-primary/90 transition-colors"
              >
                SUBSCRIBE
              </button>
            </form>
            {newsletterStatus && (
              <p
                className={`mt-3 text-sm font-medium ${
                  newsletterStatus.type === 'success'
                    ? 'text-emerald-600'
                    : 'text-red-600'
                }`}
              >
                {newsletterStatus.message}
              </p>
            )}
            {newsletterPreviewUrl && (
              <a
                href={newsletterPreviewUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block text-sm font-semibold text-primary hover:underline"
              >
                Open confirmation email (preview)
              </a>
            )}

            <div className="mt-5 space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-foreground/70" />
                <a
                  href="mailto:support@tbsveda.com"
                  className="break-all hover:text-primary transition-colors"
                >
                  support@tbsveda.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-foreground/70" />
                <a
                  href="tel:+911244811144"
                  className="hover:text-primary transition-colors"
                >
                  0124 481 1144
                </a>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-bold text-foreground mb-3">Show Us Some Love</h4>
              <div className="flex items-center gap-4 text-muted-foreground">
                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-primary transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram size={22} />
                </a>
                <a
                  href="https://www.facebook.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-primary transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook size={22} />
                </a>
                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium tracking-[0.12em] uppercase hover:text-primary transition-colors"
                >
                  @tbsveda
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-10 border-t border-gray-200" />

        {/* Bottom links row */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-sm text-muted-foreground">
          {footerLinks.bottom.map((l, idx) => (
            <div key={l.label} className="flex items-center gap-3">
              <a href={l.href} className="hover:text-primary transition-colors">
                {l.label}
              </a>
              {idx !== footerLinks.bottom.length - 1 && (
                <span className="hidden sm:inline text-gray-300">•</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Logo Modal */}
      <AnimatePresence>
        {isLogoModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setIsLogoModalOpen(false)}
          >
            <button 
              onClick={() => setIsLogoModalOpen(false)}
              className="absolute top-4 right-4 text-white hover:text-primary transition-colors p-2 bg-black/50 rounded-full"
            >
              <X size={32} />
            </button>
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              src="/logo-tbs-veda.png"
              alt="TBS Veda — The Best Solution" 
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
}
