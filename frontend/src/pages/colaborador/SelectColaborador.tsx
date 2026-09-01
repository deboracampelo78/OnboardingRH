import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchOnboardingProcesses, OnboardingProcess } from '../../services/api';

export function SelectColaborador() {
  const [processos, setProcessos] = useState<OnboardingProcess[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOnboardingProcesses()
      .then(setProcessos)
      .catch((err: Error) => setError(err.message));
  }, []);

  return (
    <div className="role-select">
      <div className="role-card" style={{ width: 420 }}>
        <Link
          to="/"
          style={{ fontSize: 13, color: 'var(--text-secondary)', textDecoration: 'none', display: 'inline-block', marginBottom: 8 }}
        >
          ← Voltar
        </Link>
        <h1 style={{ fontSize: 20, marginBottom: 4 }}>Onboarding RH</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 20, fontSize: 13 }}>
          Selecione seu nome para ver seu onboarding
        </p>

        {error && <p>Erro ao carregar: {error}</p>}
        {!error && processos.length === 0 && (
          <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
            Nenhum processo de onboarding cadastrado ainda.
          </p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, textAlign: 'left' }}>
          {processos.map((processo) => (
            <button
              key={processo._id}
              className="btn btn-secondary"
              onClick={() => navigate(`/colaborador/${processo._id}`)}
            >
              {processo.colaboradorNome}
              <span style={{ color: 'var(--text-secondary)', marginLeft: 6 }}>· {processo.cargo}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
