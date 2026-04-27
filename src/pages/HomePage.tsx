import { Link } from 'react-router-dom';

interface User {
    id: string;
    username: string;
    email: string;
}

interface HomePageProps {
    users: User[];
    fetchUsers: () => void;
    isLoading: boolean;
}

const HomePage = ({ users, fetchUsers, isLoading }: HomePageProps) => {
    // Můžeme si vytáhnout info o přihlášeném uživateli z localStorage
    const currentUsername = localStorage.getItem('username');
    const currentUserRole = localStorage.getItem('userRole');

    return (
        <div className="page">
            <header className="page-header">
                <div className="header-titles">
                    <h1>Admin Dashboard</h1>
                    <p>Welcome back, <strong>{currentUsername}</strong> ({currentUserRole})</p>
                </div>
                <nav>
                    <Link to="/users" className="nav-link">Go to User List →</Link>
                </nav>
            </header>

            <main className="content">
                <section className="api-info">
                    <h3>System Overview</h3>
                    <p><Link to="/users">List of users</Link></p>
                    <p>Current Users Count: <strong>{users.length}</strong></p>

                    <div className="controls">
                        <button
                            type="button"
                            onClick={fetchUsers}
                            disabled={isLoading}
                            className="refresh-btn"
                        >
                            {isLoading ? 'Syncing...' : 'Refresh Data'}
                        </button>

                        {/* Ukázka: Tlačítko pro přidání uživatele zobrazíme jen Adminovi */}
                        {currentUserRole === 'ROLE_ADMIN' && (
                            <Link to="/users/add" className="add-btn-link">
                                <button style={{ marginLeft: '10px' }}>+ Add New User</button>
                            </Link>
                        )}
                    </div>
                </section>

                <section className="preview-section">
                    <h3>Database Snapshot (JSON)</h3>
                    <textarea
                        className="textbox"
                        value={isLoading ? "Loading data from server..." : JSON.stringify(users, null, 2)}
                        readOnly
                        rows={12}
                        placeholder="No data loaded yet."
                        style={{
                            fontFamily: 'monospace',
                            width: '100%',
                            backgroundColor: '#f4f4f4',
                            padding: '10px'
                        }}
                    />
                </section>
            </main>
        </div>
    );
};

export default HomePage;