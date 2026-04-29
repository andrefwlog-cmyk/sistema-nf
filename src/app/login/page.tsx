'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError('E-mail ou senha inválidos.');
      setLoading(false);
      return;
    }

    router.push('/dashboard');
    router.refresh();
  }

  return (
    <div
      className="min-h-screen flex"
      style={{
        background: 'var(--bg)',
        backgroundImage: `
          radial-gradient(ellipse 60% 50% at 15% 60%, rgba(232,160,48,0.07) 0%, transparent 70%),
          radial-gradient(ellipse 40% 40% at 85% 30%, rgba(56,189,248,0.04) 0%, transparent 60%),
          linear-gradient(rgba(255,255,255,0.016) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.016) 1px, transparent 1px)
        `,
        backgroundSize: 'auto, auto, 52px 52px, 52px 52px',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* ── Left brand panel ── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[440px] shrink-0 p-10 relative overflow-hidden"
        style={{
          background: 'linear-gradient(155deg, #070E1E 0%, #050A14 100%)',
          borderRight: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        {/* Decorative SVG grid */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none"
          viewBox="0 0 440 800"
          preserveAspectRatio="xMidYMid slice"
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="800" stroke="#38BDF8" strokeWidth="0.5" />
          ))}
          {Array.from({ length: 22 }).map((_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 40} x2="440" y2={i * 40} stroke="#38BDF8" strokeWidth="0.5" />
          ))}
          <circle cx="220" cy="400" r="120" stroke="#E8A030" strokeWidth="0.5" fill="none" />
          <circle cx="220" cy="400" r="80" stroke="#E8A030" strokeWidth="0.5" fill="none" />
          <circle cx="220" cy="400" r="40" stroke="#E8A030" strokeWidth="0.5" fill="none" />
          <line x1="100" y1="400" x2="340" y2="400" stroke="#E8A030" strokeWidth="0.5" />
          <line x1="220" y1="280" x2="220" y2="520" stroke="#E8A030" strokeWidth="0.5" />
        </svg>

        {/* Ambient glow */}
        <div
          className="absolute bottom-0 left-0 w-80 h-80 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(232,160,48,0.12) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />

        <Image src="/logo.png" alt="FWLOG" width={115} height={38} className="object-contain relative z-10" priority />

        <div className="relative z-10">
          <p
            className="mb-4 uppercase"
            style={{
              fontFamily: 'var(--font-barlow-condensed)',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.25em',
              color: 'var(--gold)',
            }}
          >
            Sistema de Gestão
          </p>
          <h1
            className="leading-none mb-6"
            style={{
              fontFamily: 'var(--font-syne)',
              fontSize: '42px',
              fontWeight: 800,
              color: 'var(--tx)',
              lineHeight: 1.05,
            }}
          >
            Gestão<br />
            <span style={{ color: 'rgba(200,220,240,0.45)' }}>Operacional</span><br />
            FWLOG
          </h1>
          <p
            className="text-sm leading-relaxed"
            style={{ color: 'var(--tx-2)', maxWidth: '280px' }}
          >
            Controle integrado de notas fiscais e embarques de contêineres vazios.
          </p>
        </div>

        <p style={{ color: 'var(--tx-3)', fontFamily: 'var(--font-jetbrains)', fontSize: '11px' }} className="relative z-10">
          © {new Date().getFullYear()} FWLOG
        </p>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-[360px] animate-fade-up">

          {/* Mobile logo */}
          <div className="mb-8 flex lg:hidden">
            <Image src="/logo.png" alt="FWLOG" width={110} height={36} className="object-contain" />
          </div>

          {/* Card */}
          <div
            className="rounded-2xl p-8"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border-2)',
              boxShadow: '0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)',
            }}
          >
            <h2
              className="mb-1"
              style={{
                fontFamily: 'var(--font-syne)',
                fontSize: '22px',
                fontWeight: 700,
                color: 'var(--tx)',
              }}
            >
              Acesso ao Sistema
            </h2>
            <p className="mb-7 text-sm" style={{ color: 'var(--tx-2)' }}>
              Informe suas credenciais para continuar
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  className="block mb-1.5"
                  style={{
                    fontFamily: 'var(--font-barlow-condensed)',
                    fontSize: '10.5px',
                    fontWeight: 700,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: 'var(--tx-2)',
                  }}
                >
                  E-mail
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="inp"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label
                  className="block mb-1.5"
                  style={{
                    fontFamily: 'var(--font-barlow-condensed)',
                    fontSize: '10.5px',
                    fontWeight: 700,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: 'var(--tx-2)',
                  }}
                >
                  Senha
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="inp"
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <p
                  className="text-sm rounded-lg px-3 py-2.5"
                  style={{
                    color: '#FCA5A5',
                    background: 'rgba(239,68,68,0.08)',
                    border: '1px solid rgba(239,68,68,0.2)',
                  }}
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg py-3 mt-1 font-bold uppercase tracking-wider transition-all duration-150"
                style={{
                  background: loading ? 'rgba(232,160,48,0.6)' : 'var(--gold)',
                  color: '#060D1A',
                  fontFamily: 'var(--font-barlow-condensed)',
                  fontSize: '13px',
                  letterSpacing: '0.1em',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: loading ? 'none' : '0 4px 20px rgba(232,160,48,0.25)',
                }}
                onMouseEnter={(e) => {
                  if (!loading) (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 28px rgba(232,160,48,0.4)';
                }}
                onMouseLeave={(e) => {
                  if (!loading) (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 20px rgba(232,160,48,0.25)';
                }}
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
