import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { deleteOnboardingProcess, fetchOnboardingProcesses, OnboardingProcess } from '../../services/api';
import { contarEtapasConcluidas, contarItensProcesso, statusProcesso, STATUS_LABEL } from '../../utils/progresso';
import { GestorLayout } from './GestorLayout';

export function Dashboard() {
  const [processos, setProcessos] = useState<OnboardingProcess[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOnboardingProcesses()
      .then(setProcessos)
      .catch((err: Error) => setError(err.message));
  }, []);

  async function handleExcluir(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    if (!confirm('Excluir este processo de onboarding?')) return;
    await deleteOnboardingProcess(id);
    setProcessos((prev) => prev.filter((p) => p._id !== id));
  }

  return (
    <GestorLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <h2 style={{ margin: '0 0 2px', fontSize: 18 }}>Onboarding</h2>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 13 }}>
            Processos de onboarding em andamento
          </p>
        </div>
        <Link to="/gestor/processos/novo" className="btn btn-primary" style={{ textDecoration: 'none' }}>
          + Novo processo
        </Link>
      </div>

      {error && <p>Erro ao carregar processos: {error}</p>}

      {!error && processos.length === 0 && (
        <p style={{ color: 'var(--text-secondary)' }}>Nenhum processo de onboarding cadastrado.</p>
      )}

      {processos.length > 0 && (
        <div className="card" style={{ padding: 0, maxWidth: 900 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Colaborador</th>
                <th>Cargo</th>
                <th>Itens</th>
                <th>Progresso</th>
                <th>Situação</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {processos.map((processo) => {
                const { concluidos, total } = contarItensProcesso(processo);
                const { concluidas, total: totalEtapas } = contarEtapasConcluidas(processo);
                const status = statusProcesso(processo);
                const pct = total === 0 ? 0 : Math.round((concluidos / total) * 100);
                return (
                  <tr key={processo._id} onClick={() => navigate(`/gestor/processos/${processo._id}`)}>
                    <td>{processo.colaboradorNome}</td>
                    <td>{processo.cargo}</td>
                    <td>
                      {concluidos}/{total} · {concluidas}/{totalEtapas} blocos
                    </td>
                    <td>
                      <div className="progress-track thin" style={{ minWidth: 100 }}>
                        <div
                          className="progress-fill"
                          style={{ width: `${pct}%`, background: 'var(--green)' }}
                        />
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-${status}`}>{STATUS_LABEL[status]}</span>
                    </td>
                    <td>
                      <button className="link-btn danger" onClick={(e) => handleExcluir(e, processo._id)}>
                        Excluir
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </GestorLayout>
  );
}
