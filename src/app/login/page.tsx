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
    <div className="min-h-screen flex" style={{ background: '#EFF3F8' }}>
      {/* Left panel — dark navy branding */}
      <div
        className="hidden lg:flex flex-col justify-between w-[420px] shrink-0 p-10"
        style={{ background: '#111E35' }}
      >
        <Image src="/logo.png" alt="FWLOG" width={120} height={40} className="object-contain" priority />
        <div>
          <p
            className="uppercase mb-3"
            style={{
              fontFamily: 'var(--font-barlow-condensed)',
              fontSize: '13px',
              fontWeight: 600,
              letterSpacing: '0.18em',
              color: '#D4932E',
            }}
          >
            Sistema de Gestão
          </p>
          <h1
            className="leading-tight"
            style={{
              fontFamily: 'var(--font-barlow-condensed)',
              fontSize: '38px',
              fontWeight: 700,
              letterSpacing: '0.04em',
              color: '#C4D4E8',
            }}
          >
            Gestão<br />Operacional<br />FWLOG
          </h1>
        </div>
        <p
          className="text-xs"
          style={{ color: '#2D4060', fontFamily: 'var(--font-jetbrains)' }}
        >
          © {new Date().getFullYear()} FWLOG
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-[360px]">
          {/* Logo on mobile */}
          <div className="mb-8 flex lg:hidden">
            <Image src="/logo.png" alt="FWLOG" width={110} height={36} className="object-contain" />
          </div>

          <h2
            className="mb-1 uppercase"
            style={{
              fontFamily: 'var(--font-barlow-condensed)',
              fontSize: '24px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              color: '#1E2D3D',
            }}
          >
            Acesso ao Sistema
          </h2>
          <p className="mb-8 text-sm" style={{ color: '#7A95B0' }}>
            Informe suas credenciais para entrar
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className="block mb-1.5"
                style={{
                  fontFamily: 'var(--font-barlow-condensed)',
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#5A7A96',
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
              />
            </div>

            <div>
              <label
                className="block mb-1.5"
                style={{
                  fontFamily: 'var(--font-barlow-condensed)',
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#5A7A96',
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
              />
            </div>

            {error && (
              <p
                className="text-sm rounded-lg px-3 py-2.5"
                style={{
                  color: '#B91C1C',
                  background: '#FEF2F2',
                  border: '1px solid #FECACA',
                }}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg py-3 mt-2 font-semibold uppercase tracking-wider transition-all"
              style={{
                background: loading ? '#B87820' : '#D4932E',
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
      </div>
    </div>
  );
}
