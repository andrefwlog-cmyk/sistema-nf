export interface NotaFiscal {
  id: string;
  numero: string;
  emissor: string;
  valor: number;
  descricao: string | null;
  data_emissao: string;
  data_impressao: string | null;
  responsavel: string;
  status: 'aprovada' | 'pendente' | 'cancelada';
  comentario: string | null;
  created_at: string;
  user_id: string;
}

export type NotaFiscalInsert = Omit<NotaFiscal, 'id' | 'created_at' | 'user_id'>;
