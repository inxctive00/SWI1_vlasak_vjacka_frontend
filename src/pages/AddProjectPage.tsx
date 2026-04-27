import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import type { User, Project } from './UserListPage';

interface AddProjectPageProps {
    onProjectAdded: (project: Project) => void;
    allUsers: User[];
}

const AddProjectPage = ({ onProjectAdded, allUsers }: AddProjectPageProps) => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        selectedUsers: [] as string[]
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Filtrování uživatelů podle vyhledávání
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
            const response = await axios.post('/api/projects/create', projectData);
            onProjectAdded(response.data);
            navigate('/projects');
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || 'Nepodařilo se vytvořit projekt');
            } else {
                setError('Chyba při vytváření projektu');
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
        <div className="page" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ margin: 0 }}>Nový projekt</h2>
                <button
                    onClick={() => navigate('/projects')}
                    style={{ padding: '8px 16px', cursor: 'pointer', background: 'transparent', border: '1px solid #ccc', borderRadius: '4px' }}
                >
                    Zrušit
                </button>
            </header>

            <form className="admin-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {error && (
                    <div className="error-box" style={{ color: '#721c24', backgroundColor: '#f8d7da', padding: '12px', borderRadius: '4px', border: '1px solid #f5c6cb' }}>
                        {error}
                    </div>
                )}

                <div className="form-group">
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Název projektu</label>
                    <input
                        type="text"
                        required
                        style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' }}
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="např. Hudební odpoledne"
                    />
                </div>

                <div className="form-group">
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Popis</label>
                    <textarea
                        rows={3}
                        style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' }}
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Krátký popis projektu..."
                    />
                </div>

                <div className="form-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '10px' }}>
                        <label style={{ fontWeight: 'bold' }}>Členové týmu ({formData.selectedUsers.length})</label>
                        <input
                            type="text"
                            placeholder="Hledat uživatele..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ padding: '6px 12px', borderRadius: '20px', border: '1px solid #ddd', fontSize: '14px' }}
                        />
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                        gap: '12px',
                        maxHeight: '350px',
                        overflowY: 'auto',
                        border: '1px solid #eee',
                        padding: '15px',
                        borderRadius: '8px',
                        backgroundColor: '#fafafa'
                    }}>
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map(user => {
                                const isSelected = formData.selectedUsers.includes(user.id);
                                return (
                                    <label
                                        key={user.id}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            padding: '10px',
                                            backgroundColor: isSelected ? '#e3f2fd' : 'white',
                                            border: isSelected ? '1px solid #2196f3' : '1px solid #eee',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            boxShadow: isSelected ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                            checked={isSelected}
                                            onChange={() => handleUserToggle(user.id)}
                                        />
                                        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                                            <span style={{ fontSize: '14px', fontWeight: 600, color: '#333' }}>{user.username}</span>
                                            <span style={{ fontSize: '12px', color: '#666', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user.email}</span>
                                        </div>
                                    </label>
                                );
                            })
                        ) : (
                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '20px', color: '#999' }}>
                                Žádní uživatelé nenalezeni
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ marginTop: '10px' }}>
                    <button
                        type="submit"
                        disabled={isSubmitting || !formData.name}
                        className="submit-btn"
                        style={{
                            width: '100%',
                            padding: '12px',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            cursor: isSubmitting ? 'not-allowed' : 'pointer',
                            opacity: isSubmitting ? 0.7 : 1
                        }}
                    >
                        {isSubmitting ? 'Vytváření...' : 'Vytvořit projekt'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddProjectPage;