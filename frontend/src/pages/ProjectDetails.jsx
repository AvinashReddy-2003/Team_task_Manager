import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Plus, User as UserIcon, Calendar, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProjectDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', assigneeId: '', dueDate: '' });

  useEffect(() => {
    fetchProjectDetails();
    if (user?.role === 'ADMIN') {
      fetchUsers();
    }
  }, [id]);

  const fetchProjectDetails = async () => {
    try {
      const response = await api.get(`/projects/${id}`);
      setProject(response.data);
    } catch (error) {
      console.error('Failed to fetch project', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/auth/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users', error);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', { ...newTask, projectId: id });
      setShowModal(false);
      setNewTask({ title: '', description: '', assigneeId: '', dueDate: '' });
      fetchProjectDetails();
    } catch (error) {
      console.error('Failed to create task', error);
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      fetchProjectDetails();
    } catch (error) {
      console.error('Failed to update task', error);
    }
  };

  if (!project) return <div>Loading...</div>;

  const tasksByStatus = {
    TODO: project.tasks.filter(t => t.status === 'TODO'),
    IN_PROGRESS: project.tasks.filter(t => t.status === 'IN_PROGRESS'),
    DONE: project.tasks.filter(t => t.status === 'DONE'),
  };

  return (
    <div>
      <Link to="/projects" className="btn btn-outline mb-4" style={{ display: 'inline-flex', padding: '0.25rem 0.75rem' }}>
        <ArrowLeft size={16} style={{ marginRight: '0.5rem' }} /> Back to Projects
      </Link>

      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 700 }}>{project.name}</h1>
          <p style={{ color: 'var(--text-secondary)' }}>{project.description}</p>
        </div>
        {user?.role === 'ADMIN' && (
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={18} /> Add Task
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '2rem', alignItems: 'start' }}>
        {Object.entries(tasksByStatus).map(([status, tasks]) => (
          <div key={status} className="card" style={{ backgroundColor: 'var(--bg-color)' }}>
            <div className="flex justify-between items-center mb-4">
              <h3 style={{ fontWeight: 600 }}>{status.replace('_', ' ')}</h3>
              <span className="badge badge-todo">{tasks.length}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {tasks.map(task => (
                <div key={task.id} className="card" style={{ padding: '1rem' }}>
                  <h4 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>{task.title}</h4>
                  {task.description && <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>{task.description}</p>}
                  
                  <div className="flex items-center gap-4 mb-3" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {task.assignee && (
                      <div className="flex items-center gap-1">
                        <UserIcon size={14} /> {task.assignee.name}
                      </div>
                    )}
                    {task.dueDate && (
                      <div className="flex items-center gap-1">
                        <Calendar size={14} /> {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  {/* Status controls */}
                  <div className="flex gap-2 mt-2">
                    {status !== 'TODO' && (
                      <button className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', flex: 1 }} onClick={() => updateTaskStatus(task.id, 'TODO')}>Todo</button>
                    )}
                    {status !== 'IN_PROGRESS' && (
                      <button className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', flex: 1 }} onClick={() => updateTaskStatus(task.id, 'IN_PROGRESS')}>In Progress</button>
                    )}
                    {status !== 'DONE' && (
                      <button className="btn btn-primary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', flex: 1 }} onClick={() => updateTaskStatus(task.id, 'DONE')}>Done</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div className="card" style={{ width: '100%', maxWidth: '500px' }}>
            <h2 className="mb-4" style={{ fontSize: '1.5rem', fontWeight: 600 }}>Create New Task</h2>
            <form onSubmit={handleCreateTask}>
              <div className="input-group">
                <label>Task Title</label>
                <input required value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} placeholder="e.g. Design homepage" />
              </div>
              <div className="input-group">
                <label>Description</label>
                <textarea rows="3" value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})} placeholder="Task details..."></textarea>
              </div>
              <div className="input-group">
                <label>Assign To</label>
                <select value={newTask.assigneeId} onChange={e => setNewTask({...newTask, assigneeId: e.target.value})}>
                  <option value="">Unassigned</option>
                  {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
                </select>
              </div>
              <div className="input-group">
                <label>Due Date</label>
                <input type="date" value={newTask.dueDate} onChange={e => setNewTask({...newTask, dueDate: e.target.value})} />
              </div>
              <div className="flex justify-between mt-4">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
