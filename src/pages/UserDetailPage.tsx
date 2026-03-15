import { useParams, useNavigate } from 'react-router-dom';
import type { Instrument, User } from './UserListPage';

interface UserDetailPageProps {
    users: User[];
}

const UserDetailPage = ({ users }: UserDetailPageProps) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // Vytáhneme info o přihlášeném uživateli z localStorage pro kontrolu práv
    const loggedInUsername = localStorage.getItem('username');
    const loggedInRole = localStorage.getItem('role');

    // Najdeme konkrétního uživatele v datech, která už máme
    const user = users.find(u => u.id === id);

    if (!user) {
        return (
            <div className="page">
                <h2>Uživatel nenalezen</h2>
                <button onClick={() => navigate('/users')}>Zpět na seznam</button>
            </div>
        );
    }

    // Pomocná proměnná: Může tento uživatel přidávat nástroje? (Admin nebo majitel profilu)
    const canManageInstruments =
        loggedInRole === 'ROLE_ADMIN' || loggedInUsername === user.username;

    return (
        <div className="page">
            <header className="page-header">
                <div className="header-titles">
                    <h2>User Profile: {user.username}</h2>
                </div>
                <div className="header-actions">
                    <button onClick={() => navigate('/users')}>← Back to List</button>

                    {/* Zobrazíme tlačítko jen pokud má uživatel právo */}
                    {canManageInstruments && (
                        <button
                            className="add-btn"
                            onClick={() => navigate(`/users/${id}/add-instrument`)}
                            style={{ backgroundColor: '#28a745', color: 'white', marginLeft: '10px' }}
                        >
                            + Add Instrument
                        </button>
                    )}
                </div>
            </header>

            <div className="detail-card">
                <div className="user-avatar" style={{ fontSize: '2rem', background: '#007bff', color: 'white', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                    {user.username.charAt(0).toUpperCase()}
                </div>

                <div className="user-info">
                    <div className="info-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div className="info-group">
                            <label style={{ fontWeight: 'bold', display: 'block' }}>Username</label>
                            <p>{user.username}</p>
                        </div>
                        <div className="info-group">
                            <label style={{ fontWeight: 'bold', display: 'block' }}>Email Address</label>
                            <p>{user.email}</p>
                        </div>
                        <div className="info-group">
                            <label style={{ fontWeight: 'bold', display: 'block' }}>Internal ID</label>
                            <p><code>{user.id}</code></p>
                        </div>
                        <div className="info-group">
                            <label style={{ fontWeight: 'bold', display: 'block' }}>Role</label>
                            <span className="badge-role" style={{ padding: '4px 8px', borderRadius: '4px', background: '#e9ecef' }}>
                                {user.role || 'ROLE_USER'}
                            </span>
                        </div>
                    </div>

                    <hr style={{ margin: '30px 0', border: 'none', borderTop: '1px solid #eee' }} />

                    <div className="instruments-section">
                        <h3>Owned Instruments ({user.instruments?.length || 0})</h3>
                        {user.instruments && user.instruments.length > 0 ? (
                            <ul className="instrument-list" style={{ listStyle: 'none', padding: 0 }}>
                                {user.instruments.map((inst: Instrument) => (
                                    <li key={inst.id} className="instrument-item" style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '10px', borderLeft: '4px solid #007bff' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <strong>{inst.name}</strong>
                                            <span style={{ color: '#28a745', fontWeight: 'bold' }}>{inst.price.toLocaleString()} CZK</span>
                                        </div>
                                        <p style={{ margin: '10px 0 0', fontStyle: 'italic', color: '#666' }}>{inst.description}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p style={{ color: '#888' }}>Tento uživatel zatím nemá žádné nástroje.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDetailPage;