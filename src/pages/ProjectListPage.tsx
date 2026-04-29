import { useNavigate } from 'react-router-dom';
import type { Project } from './UserListPage';
import '/src/pages-styles/ProjectListPage.css';

interface ProjectListPageProps {
    projects: Project[];
    isLoading: boolean;
}

const ProjectListPage = ({ projects, isLoading }: ProjectListPageProps) => {
    const navigate = useNavigate();
    const currentUserRole = localStorage.getItem('userRole');

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
                    {projects.map(project => (
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

                            <button
                                className="join-btn"
                                onClick={() => alert('Zde implementujeme endpoint pro přidání se!')}
                            >
                                Přidat se k projektu
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProjectListPage;