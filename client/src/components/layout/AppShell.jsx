import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import useUIStore from '../../store/uiStore';

export default function AppShell() {
  const { sidebarOpen } = useUIStore();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', paddingTop: '60px' }}>
      <Topbar />
      <Sidebar />
      <main
        style={{
          flex: 1,
          marginLeft: sidebarOpen ? '230px' : '0',
          padding: '32px',
          minHeight: 'calc(100vh - 60px)',
          transition: 'margin-left 0.3s',
          background: 'var(--bg)',
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}
