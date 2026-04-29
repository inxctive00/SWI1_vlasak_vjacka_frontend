import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import type { Project, User } from './UserListPage';
import '/src/pages-styles/ProjectDetailPage.css';

interface ProjectDetailPageProps {
    projects: Project[];
    allUsers: User[];
    onAddUser: (projectId: string, userId: string) => Promise<void>;
    onRemoveUser: (projectId: string, userId: string) => Promise<void>;
    userRole?: string;
}

const ProjectDetailPage = ({ projects, allUsers, onAddUser, onRemoveUser, userRole }: ProjectDetailPageProps) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [isAdding, setIsAdding] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);

    const isAdmin = userRole === 'ROLE_ADMIN';
    const project = projects.find(p => p.id === id);

    if (!project) {
        return <div className="page">Projekt nenalezen...</div>;
    }

    const availableUsers = allUsers.filter(user =>
        !project.members?.some(member => member.id === user.id)
    );

    const handleAddUser = async (userId: string) => {
        setIsSubmitting(true);
        try {
            await onAddUser(project.id, userId);
            setIsAdding(false);
        } catch (error) {
            alert("Chyba při přidávání uživatele.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRemoveUser = async (userId: string) => {
        if (window.confirm("Opravdu chcete tohoto člena odebrat z projektu?")) {
            await onRemoveUser(project.id, userId);
        }
    };

    const handleEditProject = () => {
        navigate('/projects/add', { state: { editProject: project } });
    };

    return (
        <div className="page project-detail-container">
            <header className="project-detail-header">
                <button onClick={() => navigate(-1)} className="btn-secondary">← Zpět</button>
                <h1>{project.name}</h1>
                <div style={{ width: '80px' }}></div>
            </header>

            <div className="project-detail-grid">
                {/* LEVÝ SLOUPEC: O projektu + Editace */}
                <aside>
                    <div className="project-sidebar-card">
                        <h3 className="project-about-title">O projektu</h3>
                        <p className="project-about-desc">
                            {project.description}
                        </p>

                        {isAdmin && (
                            <button className="edit-project-btn" onClick={handleEditProject}>
                                Upravit projekt
                            </button>
                        )}
                    </div>
                </aside>

                {/* PRAVÝ SLOUPEC: Členové */}
                <main className="project-main-content">
                    <div className="members-header">
                        <h3>Sestava / Členové ({project.members?.length || 0})</h3>
                        {isAdmin && (
                            <div className="members-actions">
                                <button
                                    onClick={() => {
                                        setIsAdding(!isAdding);
                                        setIsRemoving(false);
                                    }}
                                    className={`action-btn ${isAdding ? 'btn-cancel' : 'btn-add'}`}
                                >
                                    {isAdding ? 'Zrušit' : '+ Přidat člena'}
                                </button>
                                <button
                                    onClick={() => {
                                        setIsRemoving(!isRemoving);
                                        setIsAdding(false);
                                    }}
                                    className={`action-btn ${isRemoving ? 'btn-done' : 'btn-remove'}`}
                                >
                                    {isRemoving ? 'Hotovo' : '- Odebrat člena'}
                                </button>
                            </div>
                        )}
                    </div>

                    {isAdding && (
                        <div className="add-users-section">
                            <h4 className="add-users-title">Kdo další se přidá k projektu?</h4>
                            {availableUsers.length > 0 ? (
                                <div>
                                    {availableUsers.map(user => (
                                        <div key={user.id} className="available-user-item">
                                            <span><b>{user.username}</b> ({user.email})</span>
                                            <button
                                                disabled={isSubmitting}
                                                onClick={() => handleAddUser(user.id)}
                                                className="action-btn btn-add"
                                                style={{ padding: '6px 12px' }}
                                            >
                                                {isSubmitting ? '...' : 'Přidat'}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                                    Žádní další uživatelé k dispozici.
                                </p>
                            )}
                        </div>
                    )}

                    <div className="member-grid">
                        {project.members?.map((member) => (
                            <div
                                key={member.id}
                                className={`member-card ${isRemoving ? 'is-removing' : ''}`}
                                onClick={() => !isRemoving && navigate(`/users/${member.id}`)}
                                style={{ cursor: isRemoving ? 'default' : 'pointer' }}
                            >
                                <div className="member-avatar">
                                    {member.username.charAt(0).toUpperCase()}
                                </div>
                                <div className="member-info">
                                    <strong>{member.username}</strong>
                                    <span>{member.role?.replace('ROLE_', '')}</span>
                                </div>

                                {isRemoving && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveUser(member.id);
                                        }}
                                        className="member-remove-btn"
                                        title="Odebrat z projektu"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ProjectDetailPage;