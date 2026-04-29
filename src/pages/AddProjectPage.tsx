import { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import type { User, Project } from './UserListPage';
import '/src/pages-styles/AddProjectPage.css';

interface AddProjectPageProps {
    onProjectAdded: (project: Project) => void;
    allUsers: User[];
}

const AddProjectPage = ({ onProjectAdded, allUsers }: AddProjectPageProps) => {
    const navigate = useNavigate();
    const location = useLocation();

    const projectToEdit = location.state?.editProject as Project | undefined;
    const isEditing = !!projectToEdit;

    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        name: projectToEdit ? projectToEdit.name : '',
        description: projectToEdit ? projectToEdit.description : '',
        selectedUsers: projectToEdit && projectToEdit.members
            ? projectToEdit.members.map(m => m.id)
            : [] as string[]
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const filteredUsers = useMemo(() => {
        return allUsers.filter(user =>
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [allUsers, searchTerm]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const projectData = {
                name: formData.name,
                description: formData.description,
                members: formData.selectedUsers.map(id => ({ id }))
            };

            if (isEditing) {
                // Prepared for the backend PUT request you will create later
                await axios.put(`/api/projects/${projectToEdit.id}`, projectData);
            } else {
                const response = await axios.post('/api/projects/create', projectData);
                onProjectAdded(response.data);
            }

            navigate('/projects');
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || `Nepodařilo se ${isEditing ? 'upravit' : 'vytvořit'} projekt`);
            } else {
                setError(`Chyba při ${isEditing ? 'upravování' : 'vytváření'} projektu`);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUserToggle = (userId: string) => {
        setFormData(prev => ({
            ...prev,
            selectedUsers: prev.selectedUsers.includes(userId)
                ? prev.selectedUsers.filter(id => id !== userId)
                : [...prev.selectedUsers, userId]
        }));
    };

    return (
        <div className="page add-project-container">
            <header className="add-project-header">
                <h2>{isEditing ? 'Upravit projekt' : 'Nový projekt'}</h2>
                <button onClick={() => navigate('/projects')} className="btn-secondary">
                    Zrušit
                </button>
            </header>

            <form className="admin-form" style={{ maxWidth: '100%' }} onSubmit={handleSubmit}>
                {error && <div className="error-box">{error}</div>}

                <div className="form-group">
                    <label>Název projektu</label>
                    <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="např. Hudební odpoledne"
                    />
                </div>

                <div className="form-group">
                    <label>Popis</label>
                    <textarea
                        rows={3}
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Krátký popis projektu..."
                    />
                </div>

                <div className="form-group">
                    <div className="user-search-header">
                        <label>Členové týmu ({formData.selectedUsers.length})</label>
                        <input
                            type="text"
                            placeholder="Hledat uživatele..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="user-search-input"
                        />
                    </div>

                    <div className="user-select-grid">
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map(user => {
                                const isSelected = formData.selectedUsers.includes(user.id);
                                return (
                                    <label
                                        key={user.id}
                                        className={`user-select-label ${isSelected ? 'is-selected' : ''}`}
                                    >
                                        <input
                                            type="checkbox"
                                            className="user-select-checkbox"
                                            checked={isSelected}
                                            onChange={() => handleUserToggle(user.id)}
                                        />
                                        <div className="user-select-info">
                                            <span className="user-select-name">{user.username}</span>
                                            <span className="user-select-email">{user.email}</span>
                                        </div>
                                    </label>
                                );
                            })
                        ) : (
                            <div className="no-users-msg">
                                Žádní uživatelé nenalezeni
                            </div>
                        )}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting || !formData.name}
                    className="submit-btn"
                >
                    {isSubmitting
                        ? (isEditing ? 'Ukládání...' : 'Vytváření...')
                        : (isEditing ? 'Uložit změny' : 'Vytvořit projekt')}
                </button>
            </form>
        </div>
    );
};

export default AddProjectPage;