import Link from 'next/link';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategoryCardProps {
  href: string;
  icon: LucideIcon;
  label: string;
  color: string;
}

export function CategoryCard({ href, icon: Icon, label, color }: CategoryCardProps) {
  return (
    <Link
      href={href}
      className="group card-hover p-6 text-center transition-all hover:-translate-y-1"
    >
      <div
        className={cn(
          'mx-auto w-14 h-14 rounded-full flex items-center justify-center text-white mb-4 transition-transform group-hover:scale-110',
          color
        )}
      >
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
        {label}
      </h3>
    </Link>
  );
}
