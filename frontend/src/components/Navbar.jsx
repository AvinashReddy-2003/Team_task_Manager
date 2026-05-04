import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, FolderKanban, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="sidebar">
      <div className="mb-4">
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
          Team Task Manager
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Welcome, {user?.name}
        </p>
        <span className="badge badge-progress mt-4">{user?.role}</span>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <NavLink 
          to="/dashboard"
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            color: isActive ? 'var(--primary-color)' : 'var(--text-primary)',
            backgroundColor: isActive ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
            fontWeight: isActive ? 600 : 500
          })}
        >
          <LayoutDashboard size={20} /> Dashboard
        </NavLink>
        <NavLink 
          to="/projects"
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            color: isActive ? 'var(--primary-color)' : 'var(--text-primary)',
            backgroundColor: isActive ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
            fontWeight: isActive ? 600 : 500
          })}
        >
          <FolderKanban size={20} /> Projects
        </NavLink>
      </div>

      <button 
        onClick={logout}
        className="btn btn-outline"
        style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}
      >
        <LogOut size={18} /> Logout
      </button>
    </nav>
  );
};

export default Navbar;
