'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, Ship } from 'lucide-react';
import LogoutButton from './LogoutButton';

const NAV_ITEMS = [
  { href: '/dashboard/notas-fiscais', label: 'Notas Fiscais', icon: FileText },
  { href: '/dashboard/embarques', label: 'Controle de Embarque', icon: Ship },
];

export default function Sidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 bg-white border-r border-gray-200 flex flex-col min-h-screen sticky top-0">
      <div className="px-5 py-5 border-b border-gray-100">
        <Image src="/logo.png" alt="Logo" width={110} height={36} className="object-contain" priority />
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              <Icon size={17} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-gray-100">
        <p className="text-xs text-gray-400 mb-3 truncate">{userEmail}</p>
        <LogoutButton />
      </div>
    </aside>
  );
}
