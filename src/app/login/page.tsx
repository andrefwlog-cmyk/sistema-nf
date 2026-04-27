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
      className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden"
      style={{ background: '#07091A' }}
    >
      {/* Grid texture */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(80,120,200,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(80,120,200,0.04) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      {/* Top glow */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(15, 35, 90, 0.6) 0%, transparent 70%)',
        }}
      />

      <div className="relative w-full max-w-[360px]">
        {/* Logo */}
        <div className="mb-10 flex justify-center">
          <Image src="/logo.png" alt="FWLOG" width={130} height={42} className="object-contain" priority />
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: '#0B1020',
            border: '1px solid rgba(100,140,200,0.14)',
            boxShadow: '0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(100,140,200,0.06)',
          }}
        >
          <h1
            className="mb-1 uppercase"
            style={{
              fontFamily: 'var(--font-barlow-condensed)',
              fontSize: '22px',
              fontWeight: 700,
              letterSpacing: '0.1em',
              color: '#C4D4E8',
            }}
          >
            Acesso ao Sistema
          </h1>
          <p className="mb-7 text-sm" style={{ color: '#344A68' }}>
            Gestão Operacional · FWLOG
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className="block mb-1.5 uppercase text-[11px] tracking-widest font-semibold"
                style={{ color: '#3D5878', fontFamily: 'var(--font-barlow-condensed)' }}
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
                className="block mb-1.5 uppercase text-[11px] tracking-widest font-semibold"
                style={{ color: '#3D5878', fontFamily: 'var(--font-barlow-condensed)' }}
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
                  color: '#F87171',
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
              className="w-full rounded-lg py-3 text-sm font-bold uppercase tracking-widest transition-all mt-2"
              style={{
                background: loading ? '#7A5010' : '#D4932E',
                color: '#07091A',
                fontFamily: 'var(--font-barlow-condensed)',
                fontSize: '13px',
                letterSpacing: '0.12em',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>

        <p className="text-center mt-6 text-xs" style={{ color: '#1E2E44' }}>
          FWLOG · Sistema de Gestão
        </p>
      </div>
    </div>
  );
}
