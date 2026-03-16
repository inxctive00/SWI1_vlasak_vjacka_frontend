import { useParams, useNavigate } from 'react-router-dom';
import type { User, Instrument, Project } from './UserListPage';

interface UserDetailPageProps {
    users: User[];
}

const UserDetailPage = ({ users }: UserDetailPageProps) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // Najdeme uživatele
    const user = users.find(u => u.id === id);

    if (!user) {
        return (
            <div className="page" style={{ textAlign: 'center', padding: '50px' }}>
                <h2>Uživatel nenalezen</h2>
                <button onClick={() => navigate('/users')} className="submit-btn">Zpět na seznam</button>
            </div>
        );
    }

    return (
        <div className="page" style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
            <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                    <h1 style={{ margin: 0 }}>Profil uživatele</h1>
                    <p style={{ color: '#666', margin: '5px 0 0' }}>Správa osobních údajů, nástrojů a projektů</p>
                </div>
                <button onClick={() => navigate('/users')} className="refresh-btn">← Zpět do seznamu</button>
            </header>

            <div className="grid-container" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>

                {/* LEVÝ SLOUPEC: Osobní info */}
                <aside>
                    <div className="detail-card" style={{ padding: '25px', position: 'sticky', top: '20px' }}>
                        <div className="user-avatar" style={{ width: '80px', height: '80px', fontSize: '2rem', margin: '0 auto 20px' }}>
                            {user.username.charAt(0).toUpperCase()}
                        </div>
                        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>{user.username}</h2>

                        <div style={{ borderTop: '1px solid #eee', paddingTop: '20px' }}>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ fontSize: '0.8rem', color: '#888', textTransform: 'uppercase' }}>Email</label>
                                <p style={{ margin: '5px 0', fontWeight: '500' }}>{user.email}</p>
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ fontSize: '0.8rem', color: '#888', textTransform: 'uppercase' }}>Role</label>
                                <p style={{ margin: '5px 0' }}>
                                    <span className={`role-badge ${user.role}`} style={{ display: 'inline-block' }}>{user.role}</span>
                                </p>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.8rem', color: '#888', textTransform: 'uppercase' }}>ID Systému</label>
                                <p style={{ margin: '5px 0', fontSize: '0.75rem', fontFamily: 'monospace', color: '#aaa' }}>{user.id}</p>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* PRAVÝ SLOUPEC: Seznamy */}
                <main style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>

                    {/* SEKCE NÁSTROJE */}
                    <section className="detail-card" style={{ padding: '25px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0 }}>Vybavení a nástroje</h3>
                            <button
                                className="add-btn"
                                onClick={() => navigate(`/users/${user.id}/add-instrument`)}
                                style={{ padding: '8px 15px', fontSize: '0.9rem' }}
                            >
                                + Přidat nástroj
                            </button>
                        </div>

                        {user.instruments && user.instruments.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {user.instruments.map((inst: Instrument) => (
                                    <div key={inst.id} style={{
                                        padding: '15px',
                                        borderRadius: '8px',
                                        border: '1px solid #eee',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        backgroundColor: '#fafafa'
                                    }}>
                                        <div>
                                            <strong style={{ fontSize: '1.1rem', display: 'block' }}>{inst.name || "Nepojmenovaný nástroj"}</strong>
                                            <small style={{ color: '#888' }}>{inst.description || "Bez popisu"}</small>
                                        </div>
                                        <div style={{ fontWeight: 'bold', color: '#28a745', fontSize: '1.1rem' }}>
                                            {inst.price?.toLocaleString() || 0} CZK
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '30px', border: '2px dashed #eee', borderRadius: '10px', color: '#aaa' }}>
                                Uživatel zatím nemá žádné nástroje.
                            </div>
                        )}
                    </section>

                    {/* SEKCE PROJEKTY */}
                    <section className="detail-card" style={{ padding: '25px' }}>
                        <h3 style={{ marginBottom: '20px' }}>Aktivní projekty (M:N)</h3>
                        {user.projects && user.projects.length > 0 ? (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                {user.projects.map((proj: Project) => (
                                    <div
                                        key={proj.id}
                                        onClick={() => navigate(`/projects/${proj.id}`)} // Proklik na detail projektu
                                        style={{
                                            padding: '15px',
                                            borderRadius: '8px',
                                            backgroundColor: '#eef6ff',
                                            border: '1px solid #d0e3ff',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <strong style={{ color: '#0056b3' }}>{proj.name}</strong>
                                        <p style={{ margin: '5px 0 0', fontSize: '0.85rem' }}>{proj.description}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{ color: '#aaa', fontStyle: 'italic' }}>Tento uživatel není členem žádného projektu.</p>
                        )}
                    </section>
                </main>
            </div>
        </div>
    );
};

export default UserDetailPage;