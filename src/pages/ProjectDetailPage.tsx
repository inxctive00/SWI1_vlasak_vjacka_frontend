import {useParams, useNavigate} from 'react-router-dom';
import {useState} from 'react';
import type {Project, User} from './UserListPage';

interface ProjectDetailPageProps {
    projects: Project[],
    allUsers: User[],
    onAddUser: (projectId: string, userId: string) => Promise<void>,
    onRemoveUser: (projectId: string, userId: string) => Promise<void>,
    userRole?: string
}

const ProjectDetailPage = ({projects, allUsers, onAddUser, onRemoveUser, userRole}: ProjectDetailPageProps) => {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [isAdding, setIsAdding] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);
    const isAdmin = userRole === 'ROLE_ADMIN';

    const project = projects.find(p => p.id === id);

    if (!project) {
        return <div className="page">Projekt nenalezen...</div>;
    }

    // Filtrujeme uživatele, kteří v projektu ještě nejsou
    const availableUsers = allUsers.filter(user =>
        !project.members?.some(member => member.id === user.id)
    );

    const handleAddUser = async (userId: string) => {
        setIsSubmitting(true);
        try {
            await onAddUser(project.id, userId);
            setIsAdding(false);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            alert("Chyba při přidávání uživatele.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRemoveUser = async (userId: string) => {
        if (window.confirm("Opravdu chcete tohoto člena odebrat z projektu?")) {
            await onRemoveUser(project.id, userId);
            // Režim odebírání necháme aktivní, aby mohl uživatel vyhodit víc lidí najednou
        }
    };
    console.log("Aktuální role v detailu projektu:", userRole);

    return (
        <div className="page" style={{maxWidth: '800px', margin: '0 auto'}}>
            <header className="page-header" style={{
                marginBottom: '30px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <button onClick={() => navigate(-1)} className="refresh-btn">← Zpět</button>
                <h1 style={{margin: 0}}>{project.name}</h1>
                <div style={{width: '80px'}}></div>
                {/* Spacer pro symetrii */}
            </header>

            <div className="detail-card" style={{padding: '30px'}}>
                <section style={{marginBottom: '40px'}}>
                    <h3 style={{borderBottom: '2px solid #007bff', paddingBottom: '10px'}}>O projektu</h3>
                    <p style={{fontSize: '1.1rem', lineHeight: '1.6', color: '#444'}}>
                        {project.description}
                    </p>
                </section>

                <section>
                    {/* Sjednocená hlavička s ovládacími prvky */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '20px',
                        borderBottom: '2px solid #007bff',
                        paddingBottom: '10px'
                    }}>
                        <h3 style={{margin: 0}}>Sestava / Členové ({project.members?.length || 0})</h3>
                        {isAdmin && (
                            <div style={{display: 'flex', gap: '10px'}}>
                                <button
                                    onClick={() => {
                                        setIsAdding(!isAdding);
                                        setIsRemoving(false);
                                    }}
                                    style={{
                                        backgroundColor: isAdding ? '#6c757d' : '#28a745',
                                        color: 'white',
                                        border: 'none',
                                        padding: '8px 15px',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {isAdding ? 'Zrušit' : '+ Přidat člena'}
                                </button>
                                <button
                                    onClick={() => {
                                        setIsRemoving(!isRemoving);
                                        setIsAdding(false);
                                    }}
                                    style={{
                                        backgroundColor: isRemoving ? '#6c757d' : '#dc3545',
                                        color: 'white',
                                        border: 'none',
                                        padding: '8px 15px',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {isRemoving ? 'Hotovo' : '- Odebrat člena'}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* SEZNAM UŽIVATELŮ K PŘIDÁNÍ (Zobrazí se jen při isAdding) */}
                    {isAdding && (
                        <div style={{
                            backgroundColor: '#f8f9fa',
                            padding: '20px',
                            borderRadius: '10px',
                            marginBottom: '25px',
                            border: '2px dashed #28a745'
                        }}>
                            <h4 style={{marginTop: 0, color: '#28a745'}}>Kdo další se přidá k projektu?</h4>
                            {availableUsers.length > 0 ? (
                                <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                                    {availableUsers.map(user => (
                                        <div key={user.id} style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '10px 15px',
                                            backgroundColor: 'white',
                                            borderRadius: '6px',
                                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                                        }}>
                                            <span><b>{user.username}</b> ({user.email})</span>
                                            <button
                                                disabled={isSubmitting}
                                                onClick={() => handleAddUser(user.id)}
                                                style={{
                                                    backgroundColor: '#28a745',
                                                    color: 'white',
                                                    border: 'none',
                                                    padding: '5px 12px',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                {isSubmitting ? '...' : 'Přidat'}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p style={{color: '#888', fontStyle: 'italic'}}>Žádní další uživatelé k dispozici.</p>
                            )}
                        </div>
                    )}

                    {/* SEZNAM STÁVAJÍCÍCH ČLENŮ (Zobrazuje se vždy, mění styl při isRemoving) */}
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px'}}>
                        {project.members?.map((member) => (
                            <div key={member.id} style={{position: 'relative'}}>
                                <div
                                    onClick={() => !isRemoving && navigate(`/users/${member.id}`)}
                                    style={{
                                        padding: '15px',
                                        borderRadius: '10px',
                                        border: isRemoving ? '2px solid #dc3545' : '1px solid #eee',
                                        backgroundColor: isRemoving ? '#fff5f5' : '#fcfcfc',
                                        cursor: isRemoving ? 'default' : 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        backgroundColor: isRemoving ? '#dc3545' : '#007bff',
                                        color: 'white',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        fontWeight: 'bold'
                                    }}>
                                        {member.username.charAt(0).toUpperCase()}
                                    </div>
                                    <div style={{flex: 1}}>
                                        <strong style={{display: 'block'}}>{member.username}</strong>
                                        <span style={{fontSize: '0.8rem', color: '#888'}}>{member.role}</span>
                                    </div>

                                    {isRemoving && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemoveUser(member.id);
                                            }}
                                            style={{
                                                backgroundColor: '#dc3545',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '50%',
                                                width: '30px',
                                                height: '30px',
                                                cursor: 'pointer',
                                                fontWeight: 'bold',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }}
                                            title="Odebrat z projektu"
                                        >
                                            ✕
                                        </button>
                                    )}
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