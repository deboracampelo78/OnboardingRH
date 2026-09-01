import { Link } from 'react-router-dom';

export function HomeRoleSelect() {
  return (
    <div className="role-select">
      <div className="role-card">
        <h1 style={{ fontSize: 20, marginBottom: 4 }}>Onboarding RH</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 24, fontSize: 13 }}>
          Como você quer acessar?
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Link to="/gestor" className="btn btn-primary" style={{ textDecoration: 'none' }}>
            Sou gestor
          </Link>
          <Link to="/colaborador" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
            Sou colaborador
          </Link>
        </div>
      </div>
    </div>
  );
}
