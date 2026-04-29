import type { User } from './UserListPage';
import '/src/pages-styles/HomePage.css'; // Import the new CSS file
interface HomePageProps {
    users: User[];
    fetchUsers: () => void;
    isLoading: boolean;
}

const HomePage = ({ users, fetchUsers, isLoading }: HomePageProps) => {
    //const currentUsername = localStorage.getItem('currentUser') || 'User';
    //const currentUserRole = localStorage.getItem('userRole');
    //const isAdmin = currentUserRole === 'ROLE_ADMIN';

    return (
        <div className="page home-container">
            <header className="home-header">
                <button
                    onClick={fetchUsers}
                    disabled={isLoading}
                    className="submit-btn home-refresh-btn"
                >
                    {isLoading ? 'Syncing...' : 'Refresh Data'}
                </button>
            </header>

            <main>
                <div className="metrics-grid">
                    {/* Metric Card 1 */}
                    <div className="detail-card metric-card">
                        <h3 className="metric-label">Nalezeno uživatelů</h3>
                        <div className="metric-value">{users.length}</div>
                    </div>

                    {/* Metric Card 2 */}
                    <div className="detail-card metric-card">
                        <h3 className="metric-label">Status</h3>
                        <div className="status-indicator">
                            <div className="status-dot"></div>
                            <span className="status-text">Online & Active</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default HomePage;