import Link from 'next/link';
import { generateBreadcrumbs } from '@/lib/breadcrumbs';

interface BreadcrumbProps {
  pathname: string;
}

export function Breadcrumb({ pathname }: BreadcrumbProps) {
  const breadcrumbs = generateBreadcrumbs(pathname);

  return (
    <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-2 text-sm">
      {breadcrumbs.map((item, index) => (
        <div key={item.href} className="flex items-center gap-2">
          {item.isActive ? (
            <span className="font-semibold text-foreground">{item.label}</span>
          ) : (
            <>
              <Link
                href={item.href}
                className="font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
              <span className="text-muted-foreground">/</span>
            </>
          )}
        </div>
      ))}
    </nav>
  );
}
