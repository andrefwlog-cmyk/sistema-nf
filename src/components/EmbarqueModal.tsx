'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { EmbarqueInsert } from '@/lib/types';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

const empty: EmbarqueInsert = {
  navio_viagem: '',
  pol: '',
  pod: '',
  volume: '',
  booking: '',
  etb: null,
  pedido: false,
  lista: false,
  manifesto: false,
  status_adr: 'em_andamento',
  status_embarque: 'em_andamento',
};

const labelStyle = {
  display: 'block',
  marginBottom: '6px',
  fontSize: '11px',
  fontFamily: 'var(--font-barlow-condensed)',
  fontWeight: 600,
  letterSpacing: '0.1em',
  textTransform: 'uppercase' as const,
  color: '#3D5878',
};

export default function EmbarqueModal({ onClose, onSuccess }: Props) {
  const [form, setForm] = useState<EmbarqueInsert>(empty);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function set<K extends keyof EmbarqueInsert>(field: K, value: EmbarqueInsert[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from('embarques').insert({
      ...form,
      etb: form.etb || null,
      user_id: user!.id,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    onSuccess();
    onClose();
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div
        className="w-full max-w-lg rounded-2xl"
        style={{
          background: '#0B1020',
          border: '1px solid rgba(100,140,200,0.14)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: '1px solid rgba(100,140,200,0.1)' }}
        >
          <h2
            className="uppercase tracking-wider"
            style={{
              fontFamily: 'var(--font-barlow-condensed)',
              fontSize: '17px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              color: '#C4D4E8',
            }}
          >
            Novo Embarque
          </h2>
          <button onClick={onClose} style={{ color: '#3D5878' }} className="hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label style={labelStyle}>Navio + Viagem *</label>
            <input
              required
              value={form.navio_viagem}
              onChange={(e) => set('navio_viagem', e.target.value)}
              className="inp"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>POL *</label>
              <input required value={form.pol} onChange={(e) => set('pol', e.target.value)} className="inp" />
            </div>
            <div>
              <label style={labelStyle}>POD *</label>
              <input required value={form.pod} onChange={(e) => set('pod', e.target.value)} className="inp" />
            </div>
            <div>
              <label style={labelStyle}>Volume *</label>
              <input required value={form.volume} onChange={(e) => set('volume', e.target.value)} className="inp" />
            </div>
            <div>
              <label style={labelStyle}>Booking *</label>
              <input required value={form.booking} onChange={(e) => set('booking', e.target.value)} className="inp" />
            </div>
          </div>

          <div>
            <label style={labelStyle}>ETB</label>
            <input
              type="date"
              value={form.etb ?? ''}
              onChange={(e) => set('etb', e.target.value)}
              className="inp"
            />
          </div>

          {error && (
            <p
              className="text-sm rounded-lg px-3 py-2"
              style={{ color: '#F87171', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
            >
              {error}
            </p>
          )}

          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button" onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm transition-all"
              style={{ color: '#4E6A88', border: '1px solid rgba(100,140,200,0.15)', background: 'transparent' }}
            >
              Cancelar
            </button>
            <button
              type="submit" disabled={loading}
              className="px-5 py-2 rounded-lg text-sm font-semibold uppercase tracking-wider transition-all"
              style={{
                background: loading ? '#7A5010' : '#D4932E',
                color: '#07091A',
                fontFamily: 'var(--font-barlow-condensed)',
                letterSpacing: '0.06em',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
