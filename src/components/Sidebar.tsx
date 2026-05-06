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

export default function Sidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  return (
    <aside
      style={{
        width: '220px',
        minWidth: '220px',
        minHeight: '100vh',
        background: 'var(--sidebar)',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid var(--sidebar-border)',
        position: 'sticky',
        top: 0,
        height: '100vh',
        zIndex: 30,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: '20px 18px 16px',
          borderBottom: '1px solid var(--sidebar-border)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <Image
          src="/compass-logo.png"
          alt="Logo"
          width={38}
          height={38}
          className="object-contain shrink-0"
          priority
        />
        <div>
          <div
            style={{
              fontFamily: 'var(--font-barlow-condensed)',
              fontWeight: 700,
              fontSize: '13px',
              letterSpacing: '0.06em',
              color: '#FFFFFF',
              lineHeight: 1.1,
            }}
          >
            CONTROL SYSTEM
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '14px 10px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <div
          style={{
            fontFamily: 'var(--font-barlow-condensed)',
            fontSize: '9.5px',
            fontWeight: 700,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--sidebar-tx)',
            padding: '4px 10px 8px',
            opacity: 0.5,
          }}
        >
          Menu
        </div>

        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '9px 10px',
                borderRadius: '8px',
                background: active ? 'var(--sidebar-active)' : 'transparent',
                color: active ? 'var(--sidebar-tx-act)' : 'var(--sidebar-tx)',
                fontFamily: 'var(--font-barlow-condensed)',
                fontSize: '13.5px',
                fontWeight: active ? 600 : 500,
                letterSpacing: '0.02em',
                textDecoration: 'none',
                transition: 'background 0.15s, color 0.15s',
                borderLeft: active ? '2px solid var(--blue)' : '2px solid transparent',
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLAnchorElement).style.background = 'var(--sidebar-hover)';
                  (e.currentTarget as HTMLAnchorElement).style.color = '#FFFFFF';
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
                  (e.currentTarget as HTMLAnchorElement).style.color = 'var(--sidebar-tx)';
                }
              }}
            >
              <Icon size={15} strokeWidth={active ? 2 : 1.7} style={{ flexShrink: 0 }} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User + logout */}
      <div
        style={{
          borderTop: '1px solid var(--sidebar-border)',
          padding: '14px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <span
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              background: 'rgba(29,111,196,0.22)',
              border: '1px solid rgba(29,111,196,0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <User size={13} style={{ color: 'var(--blue)' }} />
          </span>
          <span
            style={{
              fontFamily: 'var(--font-jetbrains)',
              fontSize: '10.5px',
              color: 'var(--sidebar-tx)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              flex: 1,
            }}
          >
            {userEmail}
          </span>
        </div>

        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '7px 12px',
            borderRadius: '7px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid var(--sidebar-border)',
            color: 'var(--sidebar-tx)',
            fontFamily: 'var(--font-barlow-condensed)',
            fontSize: '12px',
            fontWeight: 500,
            letterSpacing: '0.05em',
            cursor: 'pointer',
            transition: 'background 0.15s, color 0.15s, border-color 0.15s',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(220,38,38,0.12)';
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(220,38,38,0.3)';
            (e.currentTarget as HTMLButtonElement).style.color = '#FC8181';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)';
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--sidebar-border)';
            (e.currentTarget as HTMLButtonElement).style.color = 'var(--sidebar-tx)';
          }}
        >
          <LogOut size={13} />
          Sair do sistema
        </button>
      </div>
    </aside>
  );
}
