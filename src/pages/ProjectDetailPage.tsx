import { useParams, useNavigate } from 'react-router-dom';
import type { Project, User } from './UserListPage';

interface ProjectDetailPageProps {
    projects: Project[];
}

const ProjectDetailPage = ({ projects }: ProjectDetailPageProps) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const project = projects.find(p => p.id === id);

    if (!project) {
        return <div className="page">Projekt nenalezen...</div>;
    }

    return (
        <div className="page" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <header className="page-header" style={{ marginBottom: '30px' }}>
                <button onClick={() => navigate(-1)} className="refresh-btn">← Zpět</button>
                <h1>{project.name}</h1>
            </header>

            <div className="detail-card" style={{ padding: '30px' }}>
                <section style={{ marginBottom: '40px' }}>
                    <h3 style={{ borderBottom: '2px solid #007bff', paddingBottom: '10px' }}>O projektu</h3>
                    <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#444' }}>
                        {project.description}
                    </p>
                </section>

                <section>
                    <h3 style={{ marginBottom: '20px' }}>Sestava / Členové ({project.members?.length || 0})</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        {project.members && project.members.map((member: User) => (
                            <div
                                key={member.id}
                                onClick={() => navigate(`/users/${member.id}`)}
                                style={{
                                    padding: '15px',
                                    borderRadius: '10px',
                                    border: '1px solid #eee',
                                    backgroundColor: '#fcfcfc',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    transition: 'transform 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    backgroundColor: '#007bff',
                                    color: 'white',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    fontWeight: 'bold'
                                }}>
                                    {member.username.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <strong style={{ display: 'block' }}>{member.username}</strong>
                                    <span style={{ fontSize: '0.8rem', color: '#888' }}>{member.role}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ProjectDetailPage;