import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  createOnboardingProcess,
  fetchOnboardingProcess,
  OnboardingEtapaInput,
  OnboardingProcessInput,
  updateOnboardingProcess,
} from '../../services/api';
import { TEMPLATE_PADRAO_ETAPAS } from '../../constants/templatePadrao';
import { GestorLayout } from './GestorLayout';

function dataParaInput(data?: string) {
  if (!data) return '';
  return new Date(data).toISOString().slice(0, 10);
}

export function ProcessForm() {
  const { id } = useParams<{ id: string }>();
  const editando = Boolean(id);
  const navigate = useNavigate();

  const [colaboradorNome, setColaboradorNome] = useState('');
  const [colaboradorEmail, setColaboradorEmail] = useState('');
  const [cargo, setCargo] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [dataAdmissao, setDataAdmissao] = useState('');
  const [etapas, setEtapas] = useState<OnboardingEtapaInput[]>(TEMPLATE_PADRAO_ETAPAS);
  const [error, setError] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchOnboardingProcess(id).then((processo) => {
      setColaboradorNome(processo.colaboradorNome);
      setColaboradorEmail(processo.colaboradorEmail);
      setCargo(processo.cargo);
      setDepartamento(processo.departamento);
      setDataAdmissao(dataParaInput(processo.dataAdmissao));
      setEtapas(
        processo.etapas.map((etapa) => ({
          titulo: etapa.titulo,
          periodo: etapa.periodo,
          itens: etapa.itens.map((item) => ({ titulo: item.titulo, concluida: item.concluida })),
        }))
      );
    });
  }, [id]);

  function atualizarEtapa(index: number, campo: 'titulo' | 'periodo', valor: string) {
    setEtapas((prev) => prev.map((e, i) => (i === index ? { ...e, [campo]: valor } : e)));
  }

  function adicionarEtapa() {
    setEtapas((prev) => [...prev, { titulo: '', periodo: '', itens: [] }]);
  }

  function removerEtapa(index: number) {
    setEtapas((prev) => prev.filter((_, i) => i !== index));
  }

  function atualizarItem(etapaIndex: number, itemIndex: number, titulo: string) {
    setEtapas((prev) =>
      prev.map((e, i) =>
        i === etapaIndex
          ? { ...e, itens: e.itens.map((it, j) => (j === itemIndex ? { ...it, titulo } : it)) }
          : e
      )
    );
  }

  function adicionarItem(etapaIndex: number) {
    setEtapas((prev) =>
      prev.map((e, i) => (i === etapaIndex ? { ...e, itens: [...e.itens, { titulo: '', concluida: false }] } : e))
    );
  }

  function removerItem(etapaIndex: number, itemIndex: number) {
    setEtapas((prev) =>
      prev.map((e, i) => (i === etapaIndex ? { ...e, itens: e.itens.filter((_, j) => j !== itemIndex) } : e))
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSalvando(true);

    const payload: OnboardingProcessInput = {
      colaboradorNome,
      colaboradorEmail,
      cargo,
      departamento,
      dataAdmissao,
      etapas: etapas
        .filter((etapa) => etapa.titulo.trim() !== '')
        .map((etapa) => ({ ...etapa, itens: etapa.itens.filter((item) => item.titulo.trim() !== '') })),
    };

    try {
      if (editando && id) {
        const atualizado = await updateOnboardingProcess(id, payload);
        navigate(`/gestor/processos/${atualizado._id}`);
      } else {
        const criado = await createOnboardingProcess(payload);
        navigate(`/gestor/processos/${criado._id}`);
      }
    } catch (err) {
      setError((err as Error).message);
      setSalvando(false);
    }
  }

  return (
    <GestorLayout>
      <h2 style={{ margin: '0 0 16px', fontSize: 18 }}>
        {editando ? 'Editar processo de onboarding' : 'Novo processo de onboarding'}
      </h2>

      <form onSubmit={handleSubmit} style={{ maxWidth: 720 }}>
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="form-grid">
            <div className="form-field">
              <label>Nome do colaborador</label>
              <input value={colaboradorNome} onChange={(e) => setColaboradorNome(e.target.value)} required />
            </div>
            <div className="form-field">
              <label>E-mail</label>
              <input
                type="email"
                value={colaboradorEmail}
                onChange={(e) => setColaboradorEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-field">
              <label>Cargo</label>
              <input value={cargo} onChange={(e) => setCargo(e.target.value)} required />
            </div>
            <div className="form-field">
              <label>Departamento</label>
              <input value={departamento} onChange={(e) => setDepartamento(e.target.value)} required />
            </div>
            <div className="form-field">
              <label>Data de admissão</label>
              <input
                type="date"
                value={dataAdmissao}
                onChange={(e) => setDataAdmissao(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        <h3 style={{ fontSize: 15, margin: '0 0 8px' }}>Blocos e passos</h3>

        {etapas.map((etapa, etapaIndex) => (
          <div className="etapa-editor" key={etapaIndex}>
            <div className="etapa-editor-header">
              <input
                style={{ flex: 2 }}
                placeholder="Título do bloco (ex: Documentação e acessos)"
                value={etapa.titulo}
                onChange={(e) => atualizarEtapa(etapaIndex, 'titulo', e.target.value)}
              />
              <input
                style={{ flex: 1 }}
                placeholder="Período (ex: Dia 1)"
                value={etapa.periodo}
                onChange={(e) => atualizarEtapa(etapaIndex, 'periodo', e.target.value)}
              />
              <button type="button" className="link-btn danger" onClick={() => removerEtapa(etapaIndex)}>
                Remover bloco
              </button>
            </div>

            {etapa.itens.map((item, itemIndex) => (
              <div className="item-editor-row" key={itemIndex}>
                <input
                  type="text"
                  placeholder="Descrição do passo"
                  value={item.titulo}
                  onChange={(e) => atualizarItem(etapaIndex, itemIndex, e.target.value)}
                />
                <button
                  type="button"
                  className="link-btn danger"
                  onClick={() => removerItem(etapaIndex, itemIndex)}
                >
                  remover
                </button>
              </div>
            ))}
            <button type="button" className="link-btn" onClick={() => adicionarItem(etapaIndex)}>
              + adicionar passo
            </button>
          </div>
        ))}

        <button type="button" className="btn btn-secondary" onClick={adicionarEtapa} style={{ marginBottom: 20 }}>
          + Adicionar bloco
        </button>

        {error && <p style={{ color: '#a02020' }}>{error}</p>}

        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit" className="btn btn-primary" disabled={salvando}>
            {salvando ? 'Salvando...' : 'Salvar'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
            Cancelar
          </button>
        </div>
      </form>
    </GestorLayout>
  );
}
