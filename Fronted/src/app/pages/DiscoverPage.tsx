import { Link, useParams } from 'react-router-dom';

const PAGES: Record<
  string,
  { title: string; subtitle: string; body: string }
> = {
  'about-us': {
    title: 'About Us',
    subtitle: 'Know the story behind TBS Veda.',
    body: 'TBS Veda — The Best Solution — is focused on wellness-first products and experiences. This page can be expanded with your real company story, values, and brand mission.',
  },
  'our-doctors': {
    title: 'Our Doctors',
    subtitle: 'Meet the experts who guide our wellness.',
    body: 'Add your doctors list, qualifications, and profiles here. You can also include consultation timings and verification details.',
  },
  'our-whitepapers': {
    title: 'Our Whitepapers',
    subtitle: 'Science-backed insights and research.',
    body: 'Publish your PDFs / research notes here. You can later connect this to a backend CMS or a simple static list.',
  },
  'our-blogs': {
    title: 'Our Blogs',
    subtitle: 'Tips, guides, and wellness education.',
    body: 'This can be connected to a blog system later. For now it is a dedicated page for your blog content.',
  },
  'our-media-center': {
    title: 'Our Media Center',
    subtitle: 'Press, announcements, and updates.',
    body: 'Add press releases, media mentions, images, and brand assets here.',
  },
  careers: {
    title: 'Careers',
    subtitle: 'Join our team and grow with us.',
    body: 'List open positions, culture, and an email/apply form here.',
  },
};

export function DiscoverPage() {
  const { slug } = useParams<{ slug: string }>();
  const page = slug ? PAGES[slug] : undefined;

  if (!page) {
    return (
      <main className="container mx-auto px-4 pt-36 pb-12 min-h-screen">
        <h1 className="text-3xl font-bold text-foreground">Page not found</h1>
        <p className="text-muted-foreground mt-2">
          This discover page doesn’t exist.
        </p>
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

        <h1 className="mt-6 text-4xl font-bold text-foreground">{page.title}</h1>
        <p className="mt-2 text-lg text-muted-foreground">{page.subtitle}</p>

        <div className="mt-8 bg-white rounded-3xl border border-border shadow-sm p-6 sm:p-10">
          <p className="text-foreground leading-relaxed">{page.body}</p>
        </div>
      </div>
    </main>
  );
}

