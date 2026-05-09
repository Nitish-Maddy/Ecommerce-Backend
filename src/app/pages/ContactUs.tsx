import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';

export function ContactUs() {
  return (
    <main className="container mx-auto px-4 pt-36 pb-12 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-border shadow-sm p-6 sm:p-10">
        <h1 className="text-3xl font-bold text-foreground">Contact Us</h1>
        <p className="text-muted-foreground mt-2">
          We’re here to help. Reach out anytime and we’ll get back to you soon.
        </p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-3">
              <Phone size={18} />
            </div>
            <p className="text-sm font-bold text-gray-800">Phone</p>
            <p className="text-sm text-muted-foreground mt-1">+91 00000 00000</p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-3">
              <Mail size={18} />
            </div>
            <p className="text-sm font-bold text-gray-800">Email</p>
            <p className="text-sm text-muted-foreground mt-1">support@tbsveda.com</p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-3">
              <MapPin size={18} />
            </div>
            <p className="text-sm font-bold text-gray-800">Address</p>
            <p className="text-sm text-muted-foreground mt-1">India</p>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            to="/"
            className="px-5 py-3 rounded-xl bg-gray-100 text-gray-800 font-semibold hover:bg-gray-200 transition-colors"
          >
            Back to Home
          </Link>
          <Link
            to="/login"
            className="px-5 py-3 rounded-xl bg-primary text-primary-foreground font-extrabold hover:bg-primary/90 transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    </main>
  );
}

