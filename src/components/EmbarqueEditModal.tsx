'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { Embarque } from '@/lib/types';

interface Props {
  embarque: Embarque;
  onClose: () => void;
  onSuccess: () => void;
}

const labelStyle = {
  display: 'block',
  marginBottom: '6px',
  fontSize: '10.5px',
  fontFamily: 'var(--font-barlow-condensed)',
  fontWeight: 700,
  letterSpacing: '0.15em',
  textTransform: 'uppercase' as const,
  color: 'var(--tx-2)',
};

export default function EmbarqueEditModal({ embarque, onClose, onSuccess }: Props) {
  const [form, setForm] = useState({
    navio_viagem: embarque.navio_viagem,
    pol:          embarque.pol,
    pod:          embarque.pod,
    volume:       embarque.volume,
    booking:      embarque.booking,
    etb:          embarque.etb ?? '',
    comentarios:  embarque.comentarios ?? '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function set<K extends keyof typeof form>(field: K, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase
      .from('embarques')
      .update({
        navio_viagem: form.navio_viagem,
        pol:          form.pol,
        pod:          form.pod,
        volume:       form.volume,
        booking:      form.booking,
        etb:          form.etb || null,
        comentarios:  form.comentarios || null,
      })
      .eq('id', embarque.id);

    if (error) { setError(error.message); setLoading(false); return; }

    onSuccess();
    onClose();
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4 animate-fade-in"
      style={{ background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(8px)' }}
    >
      <div
        className="w-full max-w-lg rounded-2xl animate-fade-up"
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border-2)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-syne)',
              fontSize: '16px',
              fontWeight: 700,
              color: 'var(--tx)',
            }}
          >
            Editar Embarque
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg transition-all duration-100"
            style={{ color: 'var(--tx-3)' }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--tx)';
              (e.currentTarget as HTMLButtonElement).style.background = 'var(--surface-2)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--tx-3)';
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
            }}
          >
            <X size={16} />
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
            <input type="date" value={form.etb} onChange={(e) => set('etb', e.target.value)} className="inp" />
          </div>

          <div>
            <label style={labelStyle}>Comentários</label>
            <textarea
              value={form.comentarios}
              onChange={(e) => set('comentarios', e.target.value)}
              rows={3}
              placeholder="Observações internas sobre este embarque..."
              className="inp"
              style={{ resize: 'vertical', minHeight: '76px' }}
            />
          </div>

          {error && (
            <p
              className="text-sm rounded-lg px-3 py-2"
              style={{ color: 'var(--red)', background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.18)' }}
            >
              {error}
            </p>
          )}

          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button" onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm transition-all duration-150"
              style={{ color: 'var(--tx-2)', border: '1px solid var(--border-2)', background: 'transparent' }}
            >
              Cancelar
            </button>
            <button
              type="submit" disabled={loading}
              className="px-5 py-2 rounded-lg font-bold uppercase transition-all duration-150"
              style={{
                background: loading ? 'rgba(29,111,196,0.55)' : 'var(--blue)',
                color: '#FFFFFF',
                fontFamily: 'var(--font-barlow-condensed)',
                fontSize: '12.5px',
                letterSpacing: '0.08em',
                cursor: loading ? 'not-allowed' : 'pointer',
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
