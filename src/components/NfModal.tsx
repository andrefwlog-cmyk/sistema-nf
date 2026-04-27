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
  fontSize: '11px',
  fontFamily: 'var(--font-barlow-condensed)',
  fontWeight: 600,
  letterSpacing: '0.1em',
  textTransform: 'uppercase' as const,
  color: '#3D5878',
};

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

  const radioStatuses: { value: NotaFiscalInsert['status']; label: string; color: string }[] = [
    { value: 'aprovada', label: 'Aprovada', color: '#22C55E' },
    { value: 'pendente', label: 'Pendente', color: '#F59E0B' },
    { value: 'cancelada', label: 'Cancelada', color: '#EF4444' },
  ];

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
            {nf ? 'Editar Nota Fiscal' : 'Nova Nota Fiscal'}
          </h2>
          <button onClick={onClose} style={{ color: '#3D5878' }} className="hover:text-white transition-colors">
            <X size={18} />
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
              <input
                required type="number" step="0.01" min="0"
                value={form.valor}
                onChange={(e) => set('valor', e.target.value)}
                className="inp"
              />
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

          <div>
            <label style={labelStyle}>Status *</label>
            <div className="flex gap-4 mt-1">
              {radioStatuses.map(({ value, label, color }) => (
                <label key={value} className="flex items-center gap-2 cursor-pointer">
                  <span
                    className="w-4 h-4 rounded-full flex items-center justify-center transition-all"
                    style={{
                      border: `2px solid ${form.status === value ? color : 'rgba(100,140,200,0.25)'}`,
                      background: form.status === value ? color : 'transparent',
                    }}
                    onClick={() => set('status', value)}
                  >
                    {form.status === value && (
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#07091A' }} />
                    )}
                  </span>
                  <span className="text-sm cursor-pointer" style={{ color: form.status === value ? color : '#4E6A88' }} onClick={() => set('status', value)}>
                    {label}
                  </span>
                </label>
              ))}
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
