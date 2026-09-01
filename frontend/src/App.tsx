import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { HomeRoleSelect } from './pages/HomeRoleSelect';
import { Dashboard } from './pages/gestor/Dashboard';
import { ProcessForm } from './pages/gestor/ProcessForm';
import { ProcessDetail } from './pages/gestor/ProcessDetail';
import { SelectColaborador } from './pages/colaborador/SelectColaborador';
import { Checklist } from './pages/colaborador/Checklist';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeRoleSelect />} />
        <Route path="/gestor" element={<Dashboard />} />
        <Route path="/gestor/processos/novo" element={<ProcessForm />} />
        <Route path="/gestor/processos/:id" element={<ProcessDetail />} />
        <Route path="/gestor/processos/:id/editar" element={<ProcessForm />} />
        <Route path="/colaborador" element={<SelectColaborador />} />
        <Route path="/colaborador/:id" element={<Checklist />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
