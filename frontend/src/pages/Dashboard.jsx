import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, Clock, AlertCircle, ListTodo } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    todo: 0,
    inProgress: 0,
    done: 0,
    overdue: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/dashboard');
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="mb-4" style={{ fontSize: '1.875rem', fontWeight: 700 }}>Dashboard Overview</h1>
      <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>Here's what's happening with your tasks today.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
        
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary-color)', borderRadius: '0.5rem' }}>
            <ListTodo size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Total Tasks</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats.total}</h3>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning-color)', borderRadius: '0.5rem' }}>
            <Clock size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>In Progress</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats.inProgress}</h3>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'rgba(34, 197, 94, 0.1)', color: 'var(--success-color)', borderRadius: '0.5rem' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Completed</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats.done}</h3>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger-color)', borderRadius: '0.5rem' }}>
            <AlertCircle size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Overdue</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats.overdue}</h3>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
