import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { deleteOnboardingProcess, fetchOnboardingProcess, OnboardingProcess } from '../../services/api';
import {
  contarEtapasConcluidas,
  contarItensEtapa,
  contarItensProcesso,
  diasDeOnboarding,
  statusEtapa,
  STATUS_LABEL,
} from '../../utils/progresso';
import { GestorLayout } from './GestorLayout';

function formatarData(data: string) {
  return new Date(data).toLocaleDateString('pt-BR');
}

export function ProcessDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [processo, setProcesso] = useState<OnboardingProcess | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchOnboardingProcess(id)
      .then(setProcesso)
      .catch((err: Error) => setError(err.message));
  }, [id]);

  async function handleExcluir() {
    if (!id) return;
    if (!confirm('Excluir este processo de onboarding?')) return;
    await deleteOnboardingProcess(id);
    navigate('/gestor');
  }

  if (error) {
    return (
      <GestorLayout>
        <p>Erro ao carregar processo: {error}</p>
      </GestorLayout>
    );
  }

  if (!processo) {
    return (
      <GestorLayout>
        <p>Carregando...</p>
      </GestorLayout>
    );
  }

  const { concluidos, total } = contarItensProcesso(processo);
  const { concluidas, total: totalEtapas } = contarEtapasConcluidas(processo);

  return (
    <GestorLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
        <div>
          <h2 style={{ margin: '0 0 2px', fontSize: 18 }}>Onboarding</h2>
          <p style={{ margin: '0 0 16px', color: 'var(--text-secondary)' }}>
            {processo.colaboradorNome} · {processo.cargo} · admitido(a) em {formatarData(processo.dataAdmissao)}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link to={`/gestor/processos/${processo._id}/editar`} className="btn btn-secondary" style={{ textDecoration: 'none' }}>
            Editar
          </Link>
          <button className="btn btn-danger" onClick={handleExcluir}>
            Excluir
          </button>
        </div>
      </div>

      <div className="kpi-grid" style={{ maxWidth: 640 }}>
        <div className="kpi-card">
          <div className="kpi-label">Itens concluídos</div>
          <div className="kpi-value">
            {concluidos} / {total}
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Blocos concluídos</div>
          <div className="kpi-value">
            {concluidas} / {totalEtapas}
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Dias de onboarding</div>
          <div className="kpi-value">{diasDeOnboarding(processo.dataAdmissao)}</div>
        </div>
      </div>

      <div className="card" style={{ padding: 0, maxWidth: 900 }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Bloco</th>
              <th>Itens</th>
              <th>Progresso</th>
              <th>Situação</th>
            </tr>
          </thead>
          <tbody>
            {processo.etapas.map((etapa) => {
              const { concluidos: c, total: t } = contarItensEtapa(etapa);
              const status = statusEtapa(etapa);
              const pct = t === 0 ? 0 : Math.round((c / t) * 100);
              const cor = status === 'concluido' ? 'var(--green)' : status === 'em_andamento' ? 'var(--amber)' : '#c9c6bb';
              return (
                <tr key={etapa._id}>
                  <td>
                    {etapa.titulo}
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{etapa.periodo}</div>
                  </td>
                  <td>
                    {c}/{t}
                  </td>
                  <td>
                    <div className="progress-track" style={{ minWidth: 120 }}>
                      <div className="progress-fill" style={{ width: `${pct}%`, background: cor }} />
                    </div>
                  </td>
                  <td>
                    <span className={`badge badge-${status}`}>{STATUS_LABEL[status]}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </GestorLayout>
  );
}
