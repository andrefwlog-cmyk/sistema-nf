'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { NotaFiscal, NotaFiscalInsert } from '@/lib/types';

interface Props {
  nf: NotaFiscal | null;
  onClose: () => void;
  onSuccess: () => void;
}

const empty: NotaFiscalInsert = {
  numero: '',
  emissor: '',
  valor: 0,
  descricao: '',
  data_emissao: '',
  data_impressao: null,
  responsavel: '',
  status: 'aprovada',
  comentario: null,
};

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

const radioStatuses: { value: NotaFiscalInsert['status']; label: string; color: string; glow: string }[] = [
  { value: 'aprovada',  label: 'Aprovada',  color: '#22C55E', glow: 'rgba(34,197,94,0.25)' },
  { value: 'pendente',  label: 'Pendente',  color: '#F59E0B', glow: 'rgba(245,158,11,0.25)' },
  { value: 'cancelada', label: 'Cancelada', color: '#EF4444', glow: 'rgba(239,68,68,0.25)' },
];

export default function NfModal({ nf, onClose, onSuccess }: Props) {
  const [form, setForm] = useState<NotaFiscalInsert>(
    nf
      ? {
          numero: nf.numero,
          emissor: nf.emissor,
          valor: nf.valor,
          descricao: nf.descricao ?? '',
          data_emissao: nf.data_emissao,
          data_impressao: nf.data_impressao ?? '',
          responsavel: nf.responsavel,
          status: nf.status,
          comentario: nf.comentario ?? '',
        }
      : empty
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function set(field: keyof NotaFiscalInsert, value: string | number | null) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const supabase = createClient();
    const payload = {
      ...form,
      valor: Number(form.valor),
      descricao: form.descricao || null,
      data_impressao: form.data_impressao || null,
      comentario: (form.status === 'pendente' || form.status === 'cancelada') ? (form.comentario || null) : null,
    };

    if (nf) {
      const { error } = await supabase.from('notas_fiscais').update(payload).eq('id', nf.id);
      if (error) { setError(error.message); setLoading(false); return; }
    } else {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from('notas_fiscais').insert({ ...payload, user_id: user!.id });
      if (error) { setError(error.message); setLoading(false); return; }
    }

    onSuccess();
    onClose();
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4 animate-fade-in"
      style={{ background: 'rgba(3,7,18,0.82)', backdropFilter: 'blur(12px)' }}
    >
      <div
        className="w-full max-w-lg rounded-2xl animate-fade-up"
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border-2)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
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
            {nf ? 'Editar Nota Fiscal' : 'Nova Nota Fiscal'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg transition-all duration-100"
            style={{ color: 'var(--tx-2)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--tx)'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--tx-2)'; (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>Número *</label>
              <input required value={form.numero} onChange={(e) => set('numero', e.target.value)} className="inp" />
            </div>
            <div>
              <label style={labelStyle}>Valor (R$) *</label>
              <input required type="number" step="0.01" min="0" value={form.valor} onChange={(e) => set('valor', e.target.value)} className="inp" />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Emissor *</label>
            <input required value={form.emissor} onChange={(e) => set('emissor', e.target.value)} className="inp" />
          </div>

          <div>
            <label style={labelStyle}>Descrição</label>
            <input value={form.descricao ?? ''} onChange={(e) => set('descricao', e.target.value)} className="inp" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>Data de Emissão *</label>
              <input required type="date" value={form.data_emissao} onChange={(e) => set('data_emissao', e.target.value)} className="inp" />
            </div>
            <div>
              <label style={labelStyle}>Data de Entrega</label>
              <input type="date" value={form.data_impressao ?? ''} onChange={(e) => set('data_impressao', e.target.value)} className="inp" />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Responsável *</label>
            <input required value={form.responsavel} onChange={(e) => set('responsavel', e.target.value)} className="inp" />
          </div>

          {/* Status */}
          <div>
            <label style={labelStyle}>Status *</label>
            <div className="flex gap-4 mt-2">
              {radioStatuses.map(({ value, label, color, glow }) => {
                const active = form.status === value;
                return (
                  <label
                    key={value}
                    className="flex items-center gap-2 cursor-pointer select-none"
                    onClick={() => set('status', value)}
                  >
                    <span
                      className="w-4 h-4 rounded-full flex items-center justify-center transition-all duration-150 shrink-0"
                      style={{
                        border: `2px solid ${active ? color : 'rgba(255,255,255,0.15)'}`,
                        background: active ? color : 'transparent',
                        boxShadow: active ? `0 0 8px ${glow}` : 'none',
                      }}
                    >
                      {active && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </span>
                    <span
                      className="text-sm transition-colors duration-150"
                      style={{ color: active ? color : 'var(--tx-2)', fontFamily: 'var(--font-barlow-condensed)', fontSize: '13px' }}
                    >
                      {label}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {(form.status === 'pendente' || form.status === 'cancelada') && (
            <div>
              <label style={labelStyle}>Comentário *</label>
              <textarea
                required
                rows={3}
                value={form.comentario ?? ''}
                onChange={(e) => set('comentario', e.target.value)}
                placeholder="Informe o motivo..."
                className="inp"
                style={{ resize: 'none' }}
              />
            </div>
          )}

          {error && (
            <p
              className="text-sm rounded-lg px-3 py-2"
              style={{ color: '#FCA5A5', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
            >
              {error}
            </p>
          )}

          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button" onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm transition-all duration-150"
              style={{ color: 'var(--tx-2)', border: '1px solid var(--border-2)', background: 'rgba(255,255,255,0.04)' }}
            >
              Cancelar
            </button>
            <button
              type="submit" disabled={loading}
              className="px-5 py-2 rounded-lg font-bold uppercase transition-all duration-150"
              style={{
                background: loading ? 'rgba(232,160,48,0.6)' : 'var(--gold)',
                color: '#060D1A',
                fontFamily: 'var(--font-barlow-condensed)',
                fontSize: '12.5px',
                letterSpacing: '0.08em',
                boxShadow: loading ? 'none' : '0 2px 12px rgba(232,160,48,0.25)',
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
