import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import type { Project, User } from './UserListPage';
//import '/src/pages-styles/ProjectListPage.css';
import '/src/style.css';

interface ProjectListPageProps {
    projects: Project[];
    users: User[];
    isLoading: boolean;
    onRefresh: () => void;
}

const ProjectListPage = ({ projects, users, isLoading, onRefresh }: ProjectListPageProps) => {
    const navigate = useNavigate();

    const currentUserRole = localStorage.getItem('userRole');
    const currentUsername = localStorage.getItem('currentUser');

    // Find the current user's full object to get their ID
    const currentUserInfo = users.find(u => u.username === currentUsername);

    const handleJoinProject = async (projectId: string) => {
        if (!currentUserInfo) {
            alert("Nepodařilo se identifikovat vaše ID uživatele.");
            return;
        }

        if (window.confirm("Opravdu se chcete přidat k tomuto projektu?")) {
            try {
                await axios.post(`/api/projects/${projectId}/add-user/${currentUserInfo.id}`);
                onRefresh(); // Znovu načte projekty ze serveru
            } catch (error) {
                console.error("Chyba při přidávání k projektu:", error);
                alert("Nepodařilo se přidat k projektu.");
            }
        }
    };
    // Nová funkce pro opuštění projektu
    const handleLeaveProject = async (projectId: string) => {
        if (!currentUserInfo) return;

        if (window.confirm("Opravdu chcete opustit tento projekt?")) {
            try {
                await axios.post(`/api/projects/${projectId}/remove-user/${currentUserInfo.id}`);
                onRefresh();
            } catch (error) {
                console.error("Chyba při opouštění projektu:", error);
                alert("Nepodařilo se opustit projekt.");
            }
        }
    };

    return (
        <div className="page">
            <header className="project-list-header">
                <div>
                    <h2>Hudební Projekty</h2>
                    <p>Přehled kapel a jejich obsazení</p>
                </div>
                <div className="header-actions">
                    <button onClick={() => navigate('/')} className="btn-secondary">
                        Zpět na hlavní stránku
                    </button>
                    {currentUserRole === 'ROLE_ADMIN' && (
                        <button onClick={() => navigate('/projects/add')} className="submit-btn" style={{ margin: 0, width: 'auto' }}>
                            + Přidat projekt
                        </button>
                    )}
                </div>
            </header>

            {isLoading ? (
                <div className="loader">Načítám projekty...</div>
            ) : (
                <div className="project-grid">
                    {projects.map(project => {
                        // Check if the current user is already in this specific project
                        const isMember = project.members?.some(member => member.username === currentUsername);

                        return (
                            <div key={project.id} className="project-card">
                                <h3
                                    onClick={() => navigate(`/projects/${project.id}`)}
                                    className="project-card-title"
                                >
                                    {project.name}
                                </h3>
                                <p className="project-card-desc">
                                    {project.description}
                                </p>

                                <div className="members-section">
                                    <span className="members-section-label">
                                        Členové ({project.members?.length || 0})
                                    </span>
                                    <div className="member-tags">
                                        {project.members && project.members.length > 0 ? (
                                            project.members.map(member => (
                                                <div
                                                    key={member.id}
                                                    onClick={() => navigate(`/users/${member.id}`)}
                                                    className="member-tag"
                                                    title="Zobrazit profil"
                                                >
                                                    {member.username}
                                                </div>
                                            ))
                                        ) : (
                                            <span className="empty-members">Bez členů</span>
                                        )}
                                    </div>
                                </div>

                                {isMember ? (
                                    <button
                                        className="join-btn"
                                        onClick={() => handleLeaveProject(project.id)}
                                        style={{ backgroundColor: 'var(--danger)' }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--danger-hover)'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--danger)'}
                                    >
                                        Opustit projekt
                                    </button>
                                ) : (
                                    <button
                                        className="join-btn"
                                        onClick={() => handleJoinProject(project.id)}
                                    >
                                        Přidat se k projektu
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ProjectListPage;