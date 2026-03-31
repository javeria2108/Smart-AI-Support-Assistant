import Link from "next/link";
import { LucideIcon } from "lucide-react";

type HeaderNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

type PageHeaderProps = {
  title: string;
  TitleIcon: LucideIcon;
  navItems: HeaderNavItem[];
};

export default function PageHeader({ title, TitleIcon, navItems }: PageHeaderProps) {
  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-green-400 sm:text-2xl">{title}</h1>
        <TitleIcon className="h-6 w-6 text-green-400/60" />
      </div>

      <nav className="mb-6 flex flex-wrap gap-2" aria-label="Page navigation">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="inline-flex items-center gap-2 rounded-md border border-zinc-700 px-3 py-2 text-sm transition-colors hover:border-green-500 hover:bg-zinc-900 hover:text-green-400"
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>
    </>
  );
}