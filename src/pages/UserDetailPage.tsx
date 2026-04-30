import { useParams, useNavigate } from 'react-router-dom';
import type { User, Instrument, Project } from './UserListPage';
//import '/src/pages-styles/UserDetailPage.css';
import '/src/style.css';

interface UserDetailPageProps {
    users: User[];
}

const UserDetailPage = ({ users }: UserDetailPageProps) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const isAdmin = localStorage.getItem('userRole') == 'ROLE_ADMIN';

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

    const handleEditUser = () => {
        navigate('/users/add', { state: { editUser: user } });
    };

    return (
        <div className="page user-detail-container">
            <header className="user-detail-header">
                <div className="header-title-group">
                    <h1>Profil uživatele</h1>
                    <p className="header-subtitle">Správa osobních údajů, nástrojů a projektů</p>
                </div>
                <button onClick={() => navigate('/users')} className="btn-secondary">← Zpět do seznamu</button>
            </header>

            <div className="user-detail-grid">
                {/* LEVÝ SLOUPEC: Osobní info */}
                <aside>
                    <div className="detail-card user-sidebar-card">
                        <div className="user-avatar-large">
                            {user.username.charAt(0).toUpperCase()}
                        </div>
                        <h2 className="user-name-title">{user.username}</h2>

                        <div className="user-info-section">
                            <div>
                                <span className="info-label">Email</span>
                                <p className="info-value">{user.email}</p>
                            </div>
                            <div>
                                <span className="info-label">Role</span>
                                <p className="info-value">
                                    <span className="badge-active">
                                        {user.role?.replace('ROLE_', '')}
                                    </span>
                                </p>
                            </div>
                            <div>
                                <span className="info-label">ID</span>
                                <p className="info-value-mono">{user.id}</p>
                            </div>
                        </div>

                        {/* Tlačítko pro úpravu (Zobrazí se pouze adminovi) */}
                        {isAdmin && (
                            <button className="edit-user-btn" onClick={handleEditUser}>
                                Upravit uživatele
                            </button>
                        )}
                    </div>
                </aside>

                {/* PRAVÝ SLOUPEC: Seznamy */}
                <main className="user-main-content">
                    {/* SEKCE NÁSTROJE */}
                    <section className="detail-card">
                        <div className="section-header">
                            <h3>Vybavení a nástroje</h3>
                            <button
                                className="submit-btn"
                                onClick={() => navigate(`/users/${user.id}/add-instrument`)}
                                style={{ width: 'auto', margin: 0, padding: '8px 16px' }}
                            >
                                + Přidat nástroj
                            </button>
                        </div>

                        {user.instruments && user.instruments.length > 0 ? (
                            <div className="instrument-list">
                                {user.instruments.map((inst: Instrument) => (
                                    <div key={inst.id} className="instrument-card">
                                        <div>
                                            <span className="instrument-name">{inst.name || "Nepojmenovaný nástroj"}</span>
                                            <span className="instrument-desc">{inst.description || "Bez popisu"}</span>
                                        </div>
                                        <div className="instrument-price">
                                            {inst.price?.toLocaleString() || 0} CZK
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state">
                                Uživatel zatím nemá žádné nástroje.
                            </div>
                        )}
                    </section>

                    {/* SEKCE PROJEKTY */}
                    <section className="detail-card">
                        <div className="section-header">
                            <h3>Aktivní projekty (M:N)</h3>
                        </div>
                        {user.projects && user.projects.length > 0 ? (
                            <div className="project-grid">
                                {user.projects.map((proj: Project) => (
                                    <div
                                        key={proj.id}
                                        className="project-card"
                                        onClick={() => navigate(`/projects/${proj.id}`)}
                                    >
                                        <strong>{proj.name}</strong>
                                        <p>{proj.description}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="empty-state">Tento uživatel není členem žádného projektu.</p>
                        )}
                    </section>
                </main>
            </div>
        </div>
    );
};

export default UserDetailPage;