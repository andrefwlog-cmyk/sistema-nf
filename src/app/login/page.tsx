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
    <div className="min-h-screen flex" style={{ background: 'var(--bg)' }}>
      {/* Left panel — dark brand */}
      <div
        className="hidden lg:flex flex-col justify-between p-10"
        style={{
          width: '420px',
          minWidth: '420px',
          background: 'var(--sidebar)',
          borderRight: '1px solid var(--sidebar-border)',
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Image src="/compass-logo.png" alt="Logo" width={44} height={44} className="object-contain" priority />
          <div>
            <div
              style={{
                fontFamily: 'var(--font-barlow-condensed)',
                fontWeight: 700,
                fontSize: '18px',
                letterSpacing: '0.04em',
                color: '#FFFFFF',
                lineHeight: 1.1,
              }}
            >
              FWLOG
            </div>
            <div
              style={{
                fontFamily: 'var(--font-barlow-condensed)',
                fontSize: '10px',
                letterSpacing: '0.14em',
                color: 'var(--sidebar-tx)',
                textTransform: 'uppercase',
                opacity: 0.7,
              }}
            >
              Soluções Logísticas
            </div>
          </div>
        </div>

        {/* Tagline */}
        <div>
          <h1
            style={{
              fontFamily: 'var(--font-syne)',
              fontSize: '26px',
              fontWeight: 700,
              color: '#FFFFFF',
              lineHeight: 1.3,
              marginBottom: '14px',
            }}
          >
            Controle total da sua operação logística
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-barlow)',
              fontSize: '14px',
              color: 'var(--sidebar-tx)',
              lineHeight: 1.7,
              opacity: 0.8,
            }}
          >
            Gerencie notas fiscais e embarques em um único sistema integrado.
          </p>
        </div>

        {/* Footer */}
        <p
          style={{
            fontFamily: 'var(--font-jetbrains)',
            fontSize: '10.5px',
            color: 'var(--sidebar-tx)',
            opacity: 0.45,
          }}
        >
          © {new Date().getFullYear()} FWLOG Soluções Logísticas
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-[380px] animate-fade-up">

          {/* Mobile logo */}
          <div className="flex lg:hidden justify-center mb-8">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Image src="/compass-logo.png" alt="Logo" width={40} height={40} className="object-contain" priority />
              <span
                style={{
                  fontFamily: 'var(--font-barlow-condensed)',
                  fontWeight: 700,
                  fontSize: '20px',
                  color: 'var(--tx)',
                }}
              >
                FWLOG
              </span>
            </div>
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-syne)',
              fontSize: '22px',
              fontWeight: 700,
              color: 'var(--tx)',
              marginBottom: '4px',
            }}
          >
            Bem-vindo de volta
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--tx-2)', marginBottom: '28px' }}>
            Informe suas credenciais para acessar o sistema
          </p>

          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border-2)',
              borderRadius: '14px',
              padding: '28px',
              boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
            }}
          >
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '6px',
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
                  style={{
                    display: 'block',
                    marginBottom: '6px',
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
                  style={{
                    fontSize: '13px',
                    color: '#DC2626',
                    background: 'rgba(220,38,38,0.06)',
                    border: '1px solid rgba(220,38,38,0.18)',
                    borderRadius: '8px',
                    padding: '10px 12px',
                  }}
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '11px',
                  borderRadius: '8px',
                  background: loading ? 'rgba(29,111,196,0.55)' : 'var(--blue)',
                  color: '#FFFFFF',
                  fontFamily: 'var(--font-barlow-condensed)',
                  fontSize: '13px',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'background 0.15s',
                  marginTop: '4px',
                }}
                onMouseEnter={(e) => {
                  if (!loading) (e.currentTarget as HTMLButtonElement).style.background = 'var(--blue-dark)';
                }}
                onMouseLeave={(e) => {
                  if (!loading) (e.currentTarget as HTMLButtonElement).style.background = 'var(--blue)';
                }}
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>
          </div>

          <p
            className="lg:hidden text-center mt-6"
            style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '10.5px', color: 'var(--tx-3)' }}
          >
            © {new Date().getFullYear()} FWLOG Soluções Logísticas
          </p>
        </div>
      </div>
    </div>
  );
}
