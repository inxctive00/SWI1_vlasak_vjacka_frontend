import { useParams, useNavigate } from 'react-router-dom';
import type {User} from './UserListPage';

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
                </div>
            </div>
        </div>
    );
};

export default UserDetailPage;