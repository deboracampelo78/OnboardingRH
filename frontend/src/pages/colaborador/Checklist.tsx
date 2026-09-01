import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchOnboardingProcess, OnboardingProcess, toggleOnboardingItem } from '../../services/api';
import { contarItensEtapa, contarItensProcesso } from '../../utils/progresso';

export function Checklist() {
  const { id } = useParams<{ id: string }>();
  const [processo, setProcesso] = useState<OnboardingProcess | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchOnboardingProcess(id)
      .then(setProcesso)
      .catch((err: Error) => setError(err.message));
  }, [id]);

  async function handleToggle(etapaId: string, itemId: string, concluida: boolean) {
    if (!id || !processo) return;

    setProcesso({
      ...processo,
      etapas: processo.etapas.map((etapa) =>
        etapa._id === etapaId
          ? { ...etapa, itens: etapa.itens.map((item) => (item._id === itemId ? { ...item, concluida } : item)) }
          : etapa
      ),
    });

    try {
      const atualizado = await toggleOnboardingItem(id, etapaId, itemId, concluida);
      setProcesso(atualizado);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  if (error) {
    return (
      <div style={{ padding: 24 }}>
        <p>Erro ao carregar seu onboarding: {error}</p>
      </div>
    );
  }

  if (!processo) {
    return (
      <div style={{ padding: 24 }}>
        <p>Carregando...</p>
      </div>
    );
  }

  const { concluidos, total } = contarItensProcesso(processo);
  const pctGeral = total === 0 ? 0 : Math.round((concluidos / total) * 100);

  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: '32px 16px' }}>
      <Link
        to="/"
        style={{ fontSize: 13, color: 'var(--text-secondary)', textDecoration: 'none', display: 'inline-block', marginBottom: 12 }}
      >
        ← Trocar de perfil
      </Link>
      <h1 style={{ fontSize: 20, marginBottom: 2 }}>Olá, {processo.colaboradorNome.split(' ')[0]} 👋</h1>
      <p style={{ color: 'var(--text-secondary)', margin: '0 0 4px', fontSize: 13 }}>
        {concluidos} de {total} passos concluídos no seu onboarding
      </p>
      <div className="progress-track thin" style={{ marginBottom: 24 }}>
        <div className="progress-fill" style={{ width: `${pctGeral}%`, background: 'var(--green)' }} />
      </div>

      {processo.etapas.map((etapa) => {
        const { concluidos: c, total: t } = contarItensEtapa(etapa);
        const pct = t === 0 ? 0 : Math.round((c / t) * 100);
        return (
          <div className="card" key={etapa._id} style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
              <h3 style={{ margin: 0 }}>{etapa.titulo}</h3>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{etapa.periodo}</span>
            </div>
            <p style={{ margin: '0 0 4px', color: 'var(--text-secondary)', fontSize: 13 }}>
              {c} de {t} concluídos
            </p>
            <div className="progress-track thin" style={{ marginBottom: 14 }}>
              <div className="progress-fill" style={{ width: `${pct}%`, background: 'var(--green)' }} />
            </div>
            <div>
              {etapa.itens.map((item) => (
                <label className="checklist-row" key={item._id}>
                  <input
                    type="checkbox"
                    checked={item.concluida}
                    onChange={(e) => handleToggle(etapa._id, item._id, e.target.checked)}
                  />
                  <span className={`txt${item.concluida ? ' done' : ''}`}>{item.titulo}</span>
                </label>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
