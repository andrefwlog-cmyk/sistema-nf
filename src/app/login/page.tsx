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
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'var(--bg)' }}
    >
      <div className="w-full max-w-[400px] animate-fade-up">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image src="/fwlog-logo.png" alt="FWLOG" width={160} height={52} className="object-contain" priority />
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border-2)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          }}
        >
          <h2
            className="mb-1"
            style={{
              fontFamily: 'var(--font-syne)',
              fontSize: '20px',
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
                  color: '#DC2626',
                  background: 'rgba(220,38,38,0.06)',
                  border: '1px solid rgba(220,38,38,0.18)',
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
                background: loading ? 'rgba(10,22,40,0.6)' : 'var(--navy)',
                color: '#FFFFFF',
                fontFamily: 'var(--font-barlow-condensed)',
                fontSize: '13px',
                letterSpacing: '0.1em',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>

        <p
          className="text-center mt-6 text-xs"
          style={{ color: 'var(--tx-3)', fontFamily: 'var(--font-jetbrains)' }}
        >
          © {new Date().getFullYear()} FWLOG Soluções Logísticas
        </p>
      </div>
    </div>
  );
}
