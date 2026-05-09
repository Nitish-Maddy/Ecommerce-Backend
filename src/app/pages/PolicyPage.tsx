import { Link, useParams } from 'react-router-dom';

const POLICIES: Record<
  string,
  { title: string; intro: string; points: string[] }
> = {
  'terms-of-use': {
    title: 'Terms of Use',
    intro: 'These terms govern the use of the TBS Veda website and services.',
    points: [
      'By using this website, you agree to comply with these terms.',
      'Product information may change without prior notice.',
      'Misuse of the website or content may lead to restricted access.',
    ],
  },
  privacy: {
    title: 'Privacy',
    intro: 'Your privacy matters. This policy explains how we handle your data.',
    points: [
      'We collect limited information to provide and improve our services.',
      'We do not sell your personal information to third parties.',
      'You can request updates or deletion of your data where applicable.',
    ],
  },
  shipping: {
    title: 'Shipping',
    intro: 'Shipping information and delivery timelines for orders.',
    points: [
      'Delivery timelines vary based on your location and order size.',
      'Once shipped, tracking information may be provided in your account.',
      'Delays can happen due to weather, holidays, or courier constraints.',
    ],
  },
  'refund-cancellation': {
    title: 'Refund & Cancellation',
    intro: 'Guidelines for cancellations, returns, and refunds.',
    points: [
      'Orders can be cancelled before shipping (subject to status).',
      'Refunds are processed after inspection/verification where applicable.',
      'For help, contact support with your order ID.',
    ],
  },
};

export function PolicyPage() {
  const { slug } = useParams<{ slug: string }>();
  const policy = slug ? POLICIES[slug] : undefined;

  if (!policy) {
    return (
      <main className="container mx-auto px-4 pt-36 pb-12 min-h-screen">
        <h1 className="text-3xl font-bold text-foreground">Page not found</h1>
        <p className="text-muted-foreground mt-2">This policy page doesn’t exist.</p>
        <div className="mt-6">
          <Link to="/" className="text-primary font-semibold hover:underline">
            Back to Home →
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 pt-36 pb-12 min-h-screen">
      <div className="max-w-4xl">
        <Link
          to="/"
          className="text-muted-foreground hover:text-primary transition-colors"
        >
          ← Back
        </Link>

        <h1 className="mt-6 text-4xl font-bold text-foreground">{policy.title}</h1>
        <p className="mt-2 text-lg text-muted-foreground">{policy.intro}</p>

        <div className="mt-8 bg-white rounded-3xl border border-border shadow-sm p-6 sm:p-10">
          <ul className="space-y-3 list-disc pl-5 text-foreground">
            {policy.points.map((p) => (
              <li key={p} className="leading-relaxed">
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}

