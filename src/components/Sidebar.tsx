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
    <aside
      className="w-56 shrink-0 flex flex-col min-h-screen sticky top-0"
      style={{
        background: '#06081A',
        borderRight: '1px solid rgba(100,140,200,0.1)',
      }}
    >
      {/* Logo */}
      <div
        className="px-5 py-5"
        style={{ borderBottom: '1px solid rgba(100,140,200,0.08)' }}
      >
        <Image
          src="/logo.png"
          alt="FWLOG"
          width={105}
          height={34}
          className="object-contain"
          priority
        />
      </div>

      {/* Section label */}
      <div className="px-5 pt-6 pb-2">
        <span
          className="text-[10px] tracking-[0.18em] uppercase font-semibold"
          style={{ color: '#243448', fontFamily: 'var(--font-barlow-condensed)' }}
        >
          Módulos
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-0.5">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg relative transition-all"
              style={{
                color: active ? '#D4932E' : '#4E6A88',
                background: active ? 'rgba(212,147,46,0.07)' : 'transparent',
                fontFamily: 'var(--font-barlow-condensed)',
                fontSize: '13.5px',
                fontWeight: active ? 600 : 500,
                letterSpacing: '0.02em',
              }}
            >
              {active && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 rounded-r-full"
                  style={{ width: '3px', height: '18px', background: '#D4932E' }}
                />
              )}
              <Icon size={14} strokeWidth={active ? 2.2 : 1.8} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div
        className="px-4 py-4"
        style={{ borderTop: '1px solid rgba(100,140,200,0.08)' }}
      >
        <p
          className="text-[11px] mb-3 truncate"
          style={{ color: '#243448' }}
        >
          {userEmail}
        </p>
        <LogoutButton />
      </div>
    </aside>
  );
}
