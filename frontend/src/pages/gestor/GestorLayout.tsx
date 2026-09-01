import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export function GestorLayout({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <div className="sidebar">
        <div className="sidebar-brand">
          benner <span style={{ color: '#6b7684' }}>| rh</span>
        </div>
        <div className="sidebar-item">Dossiê</div>
        <div className="sidebar-item">Assinaturas</div>
        <Link to="/gestor" className="sidebar-item active">
          Onboarding
        </Link>
        <div className="sidebar-item">Gestão de treinamentos</div>
        <div className="sidebar-item">Gestão de desempenho</div>
        <Link
          to="/"
          className="sidebar-item"
          style={{ marginTop: 'auto', borderTop: '0.5px solid #2f3a49', paddingTop: 16 }}
        >
          ← Trocar de perfil
        </Link>
      </div>
      <div className="app-main">{children}</div>
    </div>
  );
}
