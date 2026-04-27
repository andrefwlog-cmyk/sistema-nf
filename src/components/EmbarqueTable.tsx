'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Check, Search, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { Embarque } from '@/lib/types';
import EmbarqueModal from './EmbarqueModal';

interface Props {
  embarques: Embarque[];
}

const ADR_OPTIONS: { value: Embarque['status_adr']; label: string }[] = [
  { value: 'em_andamento', label: 'Em andamento' },
  { value: 'finalizado', label: 'Finalizado' },
];

const EMBARQUE_OPTIONS: { value: Embarque['status_embarque']; label: string }[] = [
  { value: 'em_andamento', label: 'Em andamento' },
  { value: 'finalizado', label: 'Finalizado' },
  { value: 'cancelado', label: 'Cancelado' },
];

function formatDate(dateStr: string | null) {
  if (!dateStr) return '—';
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

const thStyle = {
  fontFamily: 'var(--font-barlow-condensed)',
  fontSize: '11px',
  fontWeight: 600,
  letterSpacing: '0.1em',
  color: '#7A95B0',
  textTransform: 'uppercase' as const,
  whiteSpace: 'nowrap' as const,
};

export default function EmbarqueTable({ embarques }: Props) {
  const router = useRouter();
  const [showNew, setShowNew] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [polFilter, setPolFilter] = useState('');
  const [search, setSearch] = useState('');
  const [loadingKey, setLoadingKey] = useState<string | null>(null);

  function refresh() { router.refresh(); }

  const polOptions = Array.from(new Set(embarques.map((e) => e.pol))).sort();

  const filtered = embarques.filter((e) => {
    if (polFilter && e.pol !== polFilter) return false;
    if (search) {
      const term = search.toLowerCase();
      if (
        !e.navio_viagem.toLowerCase().includes(term) &&
        !e.booking.toLowerCase().includes(term) &&
        !e.pol.toLowerCase().includes(term) &&
        !e.pod.toLowerCase().includes(term)
      ) return false;
    }
    return true;
  });

  async function toggleCheck(id: string, field: 'pedido' | 'lista' | 'manifesto', current: boolean) {
    const key = id + field;
    setLoadingKey(key);
    const supabase = createClient();
    await supabase.from('embarques').update({ [field]: !current }).eq('id', id);
    setLoadingKey(null);
    refresh();
  }

  async function updateStatus(id: string, field: 'status_adr' | 'status_embarque', value: string) {
    const key = id + field;
    setLoadingKey(key);
    const supabase = createClient();
    await supabase.from('embarques').update({ [field]: value }).eq('id', id);
    setLoadingKey(null);
    refresh();
  }

  async function handleDelete(id: string) {
    const supabase = createClient();
    await supabase.from('embarques').delete().eq('id', id);
    setDeleteId(null);
    refresh();
  }

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <h2
          className="uppercase"
          style={{
            fontFamily: 'var(--font-barlow-condensed)',
            fontSize: '22px',
            fontWeight: 700,
            letterSpacing: '0.06em',
            color: '#1E2D3D',
          }}
        >
          Controle de Embarque
        </h2>
        <button
          onClick={() => setShowNew(true)}
          className="px-4 py-2 rounded-lg transition-all"
          style={{
            background: '#D4932E',
            color: '#FFFFFF',
            fontFamily: 'var(--font-barlow-condensed)',
            fontSize: '12.5px',
            fontWeight: 600,
            letterSpacing: '0.06em',
          }}
        >
          + Novo Embarque
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#A0B4C8' }} />
          <input
            type="text"
            placeholder="Buscar por navio, booking, POL, POD..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="inp"
            style={{ paddingLeft: '36px', paddingRight: search ? '32px' : '12px' }}
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2" style={{ color: '#A0B4C8' }}>
              <X size={13} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <label
            className="text-xs uppercase tracking-widest"
            style={{ color: '#7A95B0', fontFamily: 'var(--font-barlow-condensed)', fontSize: '11px', letterSpacing: '0.1em' }}
          >
            POL
          </label>
          <select value={polFilter} onChange={(e) => setPolFilter(e.target.value)} className="sel">
            <option value="">Todos</option>
            {polOptions.map((pol) => <option key={pol} value={pol}>{pol}</option>)}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-sm" style={{ color: '#A0B4C8' }}>
          {embarques.length === 0 ? 'Nenhum embarque cadastrado.' : 'Nenhum resultado encontrado.'}
        </div>
      ) : (
        <div
          className="overflow-x-auto rounded-xl"
          style={{ background: '#FFFFFF', border: '1px solid #E2EAF2', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
        >
          <table className="w-full text-sm text-left" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F5F8FC', borderBottom: '1px solid #E2EAF2' }}>
                <th className="px-4 py-3" style={thStyle}>Navio + Viagem</th>
                <th className="px-4 py-3" style={thStyle}>POL</th>
                <th className="px-4 py-3" style={thStyle}>POD</th>
                <th className="px-4 py-3" style={thStyle}>Volume</th>
                <th className="px-4 py-3" style={thStyle}>Booking</th>
                <th className="px-4 py-3" style={thStyle}>ETB</th>
                <th className="px-4 py-3 text-center" style={thStyle}>Pedido</th>
                <th className="px-4 py-3 text-center" style={thStyle}>Lista</th>
                <th className="px-4 py-3 text-center" style={thStyle}>Manifesto</th>
                <th className="px-4 py-3" style={thStyle}>ADR</th>
                <th className="px-4 py-3" style={thStyle}>Embarque</th>
                <th className="px-4 py-3 text-center" style={thStyle}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e, i) => (
                <tr
                  key={e.id}
                  style={{
                    borderBottom: i < filtered.length - 1 ? '1px solid #EEF3F8' : 'none',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={(ev) => { (ev.currentTarget as HTMLTableRowElement).style.background = '#F8FAFD'; }}
                  onMouseLeave={(ev) => { (ev.currentTarget as HTMLTableRowElement).style.background = 'transparent'; }}
                >
                  <td className="px-4 py-3 font-semibold whitespace-nowrap" style={{ color: '#1E2D3D' }}>
                    {e.navio_viagem}
                  </td>
                  <td className="px-4 py-3 font-semibold" style={{ color: '#C4821A', fontFamily: 'var(--font-jetbrains)', fontSize: '12px' }}>
                    {e.pol}
                  </td>
                  <td className="px-4 py-3" style={{ color: '#3A5068', fontFamily: 'var(--font-jetbrains)', fontSize: '12px' }}>
                    {e.pod}
                  </td>
                  <td className="px-4 py-3" style={{ color: '#4E6A85' }}>{e.volume}</td>
                  <td className="px-4 py-3" style={{ color: '#3A5068', fontFamily: 'var(--font-jetbrains)', fontSize: '12px' }}>
                    {e.booking}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap" style={{ color: '#5A7A96', fontFamily: 'var(--font-jetbrains)', fontSize: '12px' }}>
                    {formatDate(e.etb)}
                  </td>

                  {(['pedido', 'lista', 'manifesto'] as const).map((field) => (
                    <td key={field} className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleCheck(e.id, field, e[field])}
                        disabled={loadingKey === e.id + field}
                        className="w-6 h-6 rounded-md flex items-center justify-center mx-auto transition-all"
                        style={{
                          background: e[field] ? '#16A34A' : '#fff',
                          border: e[field] ? 'none' : '1.5px solid #CBD5E1',
                          color: e[field] ? '#fff' : 'transparent',
                          opacity: loadingKey === e.id + field ? 0.5 : 1,
                          boxShadow: e[field] ? '0 1px 3px rgba(22,163,74,0.3)' : 'none',
                        }}
                      >
                        <Check size={12} strokeWidth={2.5} />
                      </button>
                    </td>
                  ))}

                  <td className="px-4 py-3">
                    <select
                      value={e.status_adr}
                      onChange={(ev) => updateStatus(e.id, 'status_adr', ev.target.value)}
                      disabled={loadingKey === e.id + 'status_adr'}
                      className="sel"
                    >
                      {ADR_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </td>

                  <td className="px-4 py-3">
                    <select
                      value={e.status_embarque}
                      onChange={(ev) => updateStatus(e.id, 'status_embarque', ev.target.value)}
                      disabled={loadingKey === e.id + 'status_embarque'}
                      className="sel"
                    >
                      {EMBARQUE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex justify-center">
                      <button
                        onClick={() => setDeleteId(e.id)}
                        className="p-1.5 rounded-lg transition-all"
                        style={{ color: '#94AABF' }}
                        title="Excluir"
                        onMouseEnter={(ev) => {
                          (ev.currentTarget as HTMLButtonElement).style.color = '#DC2626';
                          (ev.currentTarget as HTMLButtonElement).style.background = '#FEF2F2';
                        }}
                        onMouseLeave={(ev) => {
                          (ev.currentTarget as HTMLButtonElement).style.color = '#94AABF';
                          (ev.currentTarget as HTMLButtonElement).style.background = 'transparent';
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showNew && <EmbarqueModal onClose={() => setShowNew(false)} onSuccess={refresh} />}

      {deleteId && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'rgba(17,30,53,0.5)', backdropFilter: 'blur(2px)' }}>
          <div
            className="w-full max-w-sm mx-4 rounded-2xl p-6"
            style={{ background: '#FFFFFF', border: '1px solid #FECACA', boxShadow: '0 24px 60px rgba(0,0,0,0.15)' }}
          >
            <h2
              className="mb-2 uppercase"
              style={{ fontFamily: 'var(--font-barlow-condensed)', fontSize: '17px', fontWeight: 700, letterSpacing: '0.07em', color: '#B91C1C' }}
            >
              Excluir Embarque
            </h2>
            <p className="text-sm mb-5" style={{ color: '#5A7A96' }}>
              Tem certeza que deseja excluir este embarque? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-lg text-sm transition-all"
                style={{ color: '#7A95B0', border: '1px solid #D0DAE8', background: '#fff' }}
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-5 py-2 rounded-lg text-sm font-semibold uppercase transition-all"
                style={{ background: '#DC2626', color: '#fff', fontFamily: 'var(--font-barlow-condensed)', letterSpacing: '0.06em' }}
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
