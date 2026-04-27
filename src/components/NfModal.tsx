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
  color: '#5A7A96',
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
    { value: 'aprovada', label: 'Aprovada', color: '#16A34A' },
    { value: 'pendente', label: 'Pendente', color: '#D97706' },
    { value: 'cancelada', label: 'Cancelada', color: '#DC2626' },
  ];

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
            {nf ? 'Editar Nota Fiscal' : 'Nova Nota Fiscal'}
          </h2>
          <button onClick={onClose} className="transition-colors" style={{ color: '#A0B4C8' }}>
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

          <div>
            <label style={labelStyle}>Status *</label>
            <div className="flex gap-5 mt-1">
              {radioStatuses.map(({ value, label, color }) => (
                <label key={value} className="flex items-center gap-2 cursor-pointer" onClick={() => set('status', value)}>
                  <span
                    className="w-4 h-4 rounded-full flex items-center justify-center transition-all"
                    style={{
                      border: `2px solid ${form.status === value ? color : '#CBD5E1'}`,
                      background: form.status === value ? color : '#fff',
                    }}
                  >
                    {form.status === value && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </span>
                  <span className="text-sm" style={{ color: form.status === value ? color : '#7A95B0' }}>{label}</span>
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
