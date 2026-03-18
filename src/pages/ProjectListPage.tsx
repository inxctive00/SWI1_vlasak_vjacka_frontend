import { useNavigate } from 'react-router-dom';
import type { Project } from './UserListPage';

interface ProjectListPageProps {
    projects: Project[];
    isLoading: boolean;
}

const ProjectListPage = ({ projects, isLoading }: ProjectListPageProps) => {
    const navigate = useNavigate();

    return (
        <div className="page">
            <header className="page-header">
                <div>
                    <h2>Hudební Projekty</h2>
                    <p>Přehled kapel a jejich obsazení</p>
                </div>
                <button onClick={() => navigate('/')} className="refresh-btn">Zpět na Dashboard</button>
            </header>

            {isLoading ? (
                <div className="loader">Načítám projekty...</div>
            ) : (
                <div className="project-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                    gap: '20px',
                    marginTop: '20px'
                }}>
                    {projects.map(project => (
                        <div key={project.id} className="detail-card" style={{ padding: '20px' }}>
                            <h3
                                onClick={() => navigate(`/projects/${project.id}`)}
                                style={{ color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}
                            >
                                {project.name}
                            </h3>
                            <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '20px', minHeight: '40px' }}>
                                {project.description}
                            </p>

                            <div className="members-section">
                                <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#888', textTransform: 'uppercase' }}>
                                    Členové ({project.members?.length || 0})
                                </label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
                                    {project.members && project.members.length > 0 ? (
                                        project.members.map(member => (
                                            <div
                                                key={member.id}
                                                onClick={() => navigate(`/users/${member.id}`)}
                                                style={{
                                                    padding: '5px 12px',
                                                    borderRadius: '20px',
                                                    backgroundColor: '#f0f0f0',
                                                    fontSize: '0.85rem',
                                                    cursor: 'pointer',
                                                    border: '1px solid #ddd'
                                                }}
                                                title="Zobrazit profil"
                                            >
                                                👤 {member.username}
                                            </div>
                                        ))
                                    ) : (
                                        <span style={{ color: '#ccc', fontStyle: 'italic' }}>Bez členů</span>
                                    )}
                                </div>
                            </div>

                            <button
                                style={{
                                    marginTop: '20px',
                                    width: '100%',
                                    padding: '10px',
                                    backgroundColor: '#28a745',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer'
                                }}
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