'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FileText, Ship, LogOut, User } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const NAV_ITEMS = [
  { href: '/dashboard/notas-fiscais', label: 'Notas Fiscais',        icon: FileText },
  { href: '/dashboard/embarques',     label: 'Controle de Embarque', icon: Ship },
];

export default function TopNav({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  return (
    <header
      style={{
        background: '#FFFFFF',
        borderBottom: '1px solid rgba(0,0,0,0.09)',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        position: 'sticky',
        top: 0,
        zIndex: 40,
      }}
    >
      <div className="flex items-center h-14 px-6 gap-8">
        {/* Logo */}
        <Link href="/dashboard" className="shrink-0 flex items-center">
          <Image
            src="/fwlog-logo.png"
            alt="FWLOG"
            width={110}
            height={36}
            className="object-contain"
            priority
          />
        </Link>

        {/* Nav items */}
        <nav className="flex items-center gap-1 flex-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-2 px-4 h-14 relative transition-colors duration-150"
                style={{
                  fontFamily: 'var(--font-barlow-condensed)',
                  fontSize: '13.5px',
                  fontWeight: active ? 600 : 500,
                  letterSpacing: '0.02em',
                  color: active ? 'var(--navy)' : 'var(--tx-2)',
                }}
                onMouseEnter={(e) => {
                  if (!active) (e.currentTarget as HTMLAnchorElement).style.color = 'var(--tx)';
                }}
                onMouseLeave={(e) => {
                  if (!active) (e.currentTarget as HTMLAnchorElement).style.color = 'var(--tx-2)';
                }}
              >
                <Icon size={14} strokeWidth={active ? 2 : 1.7} />
                {label}
                {active && (
                  <span
                    className="absolute bottom-0 left-4 right-4 rounded-t-full"
                    style={{ height: '2px', background: 'var(--navy)' }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User + logout */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <span
              className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
              style={{ background: 'var(--navy-dim)', border: '1px solid var(--navy-mid)' }}
            >
              <User size={13} style={{ color: 'var(--navy)' }} />
            </span>
            <span
              className="text-xs hidden sm:block truncate max-w-[200px]"
              style={{ color: 'var(--tx-2)', fontFamily: 'var(--font-jetbrains)' }}
            >
              {userEmail}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all duration-150"
            style={{
              color: 'var(--tx-2)',
              border: '1px solid var(--border-2)',
              fontFamily: 'var(--font-barlow-condensed)',
              fontSize: '12px',
              fontWeight: 500,
              letterSpacing: '0.03em',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--red)';
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(220,38,38,0.3)';
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(220,38,38,0.05)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--tx-2)';
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-2)';
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
            }}
          >
            <LogOut size={13} />
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}
