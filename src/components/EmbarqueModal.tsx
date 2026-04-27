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
  color: '#5A7A96',
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

    if (error) { setError(error.message); setLoading(false); return; }

    onSuccess();
    onClose();
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: 'rgba(17,30,53,0.5)', backdropFilter: 'blur(2px)' }}>
      <div
        className="w-full max-w-lg rounded-2xl"
        style={{ background: '#FFFFFF', border: '1px solid #E2EAF2', boxShadow: '0 24px 60px rgba(0,0,0,0.15)' }}
      >
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: '1px solid #EEF3F8' }}
        >
          <h2
            className="uppercase"
            style={{
              fontFamily: 'var(--font-barlow-condensed)',
              fontSize: '17px',
              fontWeight: 700,
              letterSpacing: '0.07em',
              color: '#1E2D3D',
            }}
          >
            Novo Embarque
          </h2>
          <button onClick={onClose} className="transition-colors" style={{ color: '#A0B4C8' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label style={labelStyle}>Navio + Viagem *</label>
            <input required value={form.navio_viagem} onChange={(e) => set('navio_viagem', e.target.value)} className="inp" />
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
            <input type="date" value={form.etb ?? ''} onChange={(e) => set('etb', e.target.value)} className="inp" />
          </div>

          {error && (
            <p className="text-sm rounded-lg px-3 py-2" style={{ color: '#B91C1C', background: '#FEF2F2', border: '1px solid #FECACA' }}>
              {error}
            </p>
          )}

          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button" onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm transition-all"
              style={{ color: '#7A95B0', border: '1px solid #D0DAE8', background: '#fff' }}
            >
              Cancelar
            </button>
            <button
              type="submit" disabled={loading}
              className="px-5 py-2 rounded-lg font-semibold uppercase transition-all"
              style={{
                background: loading ? '#B87820' : '#D4932E',
                color: '#fff',
                fontFamily: 'var(--font-barlow-condensed)',
                fontSize: '12.5px',
                letterSpacing: '0.07em',
                opacity: loading ? 0.75 : 1,
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
