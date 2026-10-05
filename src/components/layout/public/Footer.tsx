import Link from "next/link";

const footerGroups = [
  {
    title: "Platform",
    links: [
      { label: "About", href: "/about" },
      { label: "Features", href: "/features" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Help Center", href: "/help" },
      { label: "Support", href: "/support" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];

export const Footer = () => {
  return (
    <footer className="border-t bg-slate-950 text-slate-200 ">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="lg:pr-8">
            <Link
              href="/"
              className="text-2xl font-bold tracking-tight text-white"
            >
              CivicFlow
            </Link>
            <p className="mt-4 max-w-md text-sm leading-6 text-slate-300">
              CivicFlow helps citizens, city staff, and service teams work
              together more clearly and efficiently through smarter civic
              engagement.
            </p>
          </div>

          {footerGroups.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-400">
                {group.title}
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-300">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="transition hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-slate-800 pt-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} CivicFlow. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="transition hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="transition hover:text-white">
              Terms
            </Link>
            <Link href="/contact" className="transition hover:text-white">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
