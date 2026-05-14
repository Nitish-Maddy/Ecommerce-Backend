import { CreditCard, Shield } from 'lucide-react';

export function PaymentMethods() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 mb-6">
        <CreditCard className="text-primary" size={24} /> Payment Methods
      </h1>

      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        {/* Saved Cards Section */}
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-bold text-foreground mb-4">Saved Cards</h2>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-5 text-white max-w-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div className="w-10 h-7 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-sm" />
                <span className="text-xs text-gray-400 font-medium">VISA</span>
              </div>
              <p className="font-mono text-lg tracking-widest mb-4">•••• •••• •••• 4242</p>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">Card Holder</p>
                  <p className="text-sm font-medium">Sample Card</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">Expires</p>
                  <p className="text-sm font-medium">12/28</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Other Methods */}
        <div className="p-5">
          <h2 className="font-bold text-foreground mb-4">Other Payment Options</h2>
          <div className="space-y-3">
            {[
              { name: 'Cash on Delivery (COD)', desc: 'Pay when you receive your order', active: true },
              { name: 'UPI Payment', desc: 'Pay using UPI apps like GPay, PhonePe', active: true },
              { name: 'Net Banking', desc: 'Pay using your bank account', active: true },
              { name: 'Razorpay', desc: 'Secure payment gateway', active: false },
            ].map((method) => (
              <div key={method.name} className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200 shadow-sm">
                    <CreditCard size={18} className="text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">{method.name}</p>
                    <p className="text-xs text-muted-foreground">{method.desc}</p>
                  </div>
                </div>
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                  method.active ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-200 text-gray-500'
                }`}>
                  {method.active ? 'Available' : 'Coming Soon'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Security Note */}
        <div className="px-5 pb-5">
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-start gap-3">
            <Shield size={20} className="text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">Your payments are secure</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                All transactions are encrypted and processed through secure payment gateways.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
