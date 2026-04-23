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
      const { error } = await supabase
        .from('notas_fiscais')
        .update(payload)
        .eq('id', nf.id);
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
    } else {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase
        .from('notas_fiscais')
        .insert({ ...payload, user_id: user!.id });
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
    }

    onSuccess();
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">
            {nf ? 'Editar Nota Fiscal' : 'Nova Nota Fiscal'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Número *</label>
              <input
                required
                value={form.numero}
                onChange={(e) => set('numero', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$) *</label>
              <input
                required
                type="number"
                step="0.01"
                min="0"
                value={form.valor}
                onChange={(e) => set('valor', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Emissor *</label>
            <input
              required
              value={form.emissor}
              onChange={(e) => set('emissor', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <input
              value={form.descricao ?? ''}
              onChange={(e) => set('descricao', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data de Emissão *</label>
              <input
                required
                type="date"
                value={form.data_emissao}
                onChange={(e) => set('data_emissao', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data de Entrega</label>
              <input
                type="date"
                value={form.data_impressao ?? ''}
                onChange={(e) => set('data_impressao', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Responsável *</label>
            <input
              required
              value={form.responsavel}
              onChange={(e) => set('responsavel', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="aprovada"
                  checked={form.status === 'aprovada'}
                  onChange={() => set('status', 'aprovada')}
                  className="accent-green-600"
                />
                <span className="text-sm text-gray-700">Aprovada</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="pendente"
                  checked={form.status === 'pendente'}
                  onChange={() => set('status', 'pendente')}
                  className="accent-amber-500"
                />
                <span className="text-sm text-gray-700">Pendente</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="cancelada"
                  checked={form.status === 'cancelada'}
                  onChange={() => set('status', 'cancelada')}
                  className="accent-red-500"
                />
                <span className="text-sm text-gray-700">Cancelada</span>
              </label>
            </div>
          </div>

          {(form.status === 'pendente' || form.status === 'cancelada') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Comentário *</label>
              <textarea
                required
                rows={3}
                value={form.comentario ?? ''}
                onChange={(e) => set('comentario', e.target.value)}
                placeholder="Informe o motivo da pendência..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
              />
            </div>
          )}

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">{error}</p>
          )}

          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors"
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
