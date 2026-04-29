'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, Ship } from 'lucide-react';
import LogoutButton from './LogoutButton';

const NAV_ITEMS = [
  { href: '/dashboard/notas-fiscais', label: 'Notas Fiscais', icon: FileText },
  { href: '/dashboard/embarques',     label: 'Controle de Embarque', icon: Ship },
];

export default function Sidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();
  const initials = userEmail.slice(0, 2).toUpperCase();

  return (
    <aside
      className="w-56 shrink-0 flex flex-col min-h-screen sticky top-0"
      style={{
        background: 'linear-gradient(180deg, #070E1E 0%, #060C19 100%)',
        borderRight: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      {/* Logo */}
      <div className="px-5 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <Image src="/logo.png" alt="FWLOG" width={105} height={34} className="object-contain" priority />
      </div>

      {/* Section label */}
      <div className="px-5 pt-6 pb-2">
        <span
          style={{
            fontFamily: 'var(--font-barlow-condensed)',
            fontSize: '9.5px',
            fontWeight: 700,
            letterSpacing: '0.22em',
            color: 'var(--tx-3)',
            textTransform: 'uppercase',
          }}
        >
          Módulos
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg relative transition-all duration-150"
              style={{
                color: active ? 'var(--gold)' : 'var(--tx-2)',
                background: active ? 'var(--gold-dim)' : 'transparent',
                fontFamily: 'var(--font-barlow-condensed)',
                fontSize: '13px',
                fontWeight: active ? 600 : 500,
                letterSpacing: '0.02em',
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.03)';
                  (e.currentTarget as HTMLAnchorElement).style.color = '#8FACC8';
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
                  (e.currentTarget as HTMLAnchorElement).style.color = 'var(--tx-2)';
                }
              }}
            >
              {active && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 rounded-r-full"
                  style={{
                    width: '3px',
                    height: '20px',
                    background: 'var(--gold)',
                    boxShadow: '0 0 8px var(--gold-glow)',
                  }}
                />
              )}
              <Icon size={14} strokeWidth={active ? 2 : 1.7} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User / logout */}
      <div className="px-4 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex items-center gap-2.5 mb-3">
          <span
            className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
            style={{
              background: 'var(--gold-dim)',
              border: '1px solid rgba(232,160,48,0.2)',
              color: 'var(--gold)',
              fontFamily: 'var(--font-barlow-condensed)',
              letterSpacing: '0.05em',
            }}
          >
            {initials}
          </span>
          <p
            className="text-[11px] truncate leading-tight"
            style={{ color: 'var(--tx-3)', fontFamily: 'var(--font-jetbrains)' }}
          >
            {userEmail}
          </p>
        </div>
        <LogoutButton />
      </div>
    </aside>
  );
}
