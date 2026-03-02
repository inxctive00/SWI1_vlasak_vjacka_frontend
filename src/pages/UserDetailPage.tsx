import { useParams, useNavigate } from 'react-router-dom';
import type {Instrument, User} from './UserListPage';

interface UserDetailPageProps {
    users: User[];
}

const UserDetailPage = ({ users }: UserDetailPageProps) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // Najdeme konkrétního uživatele v datech, která už máme
    const user = users.find(u => u.id === id);

    if (!user) {
        return (
            <div className="page">
                <h2>User not found</h2>
                <button onClick={() => navigate('/users')}>Back to list</button>
            </div>
        );
    }

    return (
        <div className="page">
            <header className="page-header">
                <h2>User Profile</h2>
                <button onClick={() => navigate('/users')}>← Back to List</button>
                <div className="header-actions">
                    <button onClick={() => navigate('/users')}>← Back</button>
                    {/* Tlačítko pro navigaci na formulář nástroje */}
                    <button
                        className="add-btn"
                        onClick={() => navigate(`/users/${id}/add-instrument`)}
                    >
                        + Add Instrument
                    </button>
                </div>
            </header>

            <div className="detail-card">
                <div className="user-avatar">
                    {user.username.charAt(0).toUpperCase()}
                </div>
                <div className="user-info">
                    <div className="info-group">
                        <label>Username</label>
                        <p>{user.username}</p>
                    </div>
                    <div className="info-group">
                        <label>Email Address</label>
                        <p>{user.email}</p>
                    </div>
                    <div className="info-group">
                        <label>Internal ID</label>
                        <p><code>{user.id}</code></p>
                    </div>
                    <div className="info-group">
                        <label>Account Status</label>
                        <span className="badge-active">Active</span>
                    </div>
                    <div className="instruments-section">
                        <h3>Owned Instruments</h3>
                        {user.instruments && user.instruments.length > 0 ? (
                            <ul className="instrument-list">
                                {user.instruments.map((inst: Instrument) => (
                                    <li key={inst.id} className="instrument-item">
                                        <strong>{inst.name}</strong> - {inst.price} CZK
                                        <p>{inst.description}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>This user has no instruments yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDetailPage;