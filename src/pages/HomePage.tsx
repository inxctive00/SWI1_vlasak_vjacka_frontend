import { Link } from 'react-router-dom';

// Pokud interface User používáte i zde pro náhled dat,
// je lepší ho mít v samostatném souboru types.ts,
// ale pro teď ho můžeme nechat i takto:
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
    return (
        <div className="page">
            <header className="page-header">
                <h1>Admin Dashboard</h1>
                <nav>
                    {/* Link nemění celou stránku (refresh), jen obsah v Routeru */}
                    <Link to="/users" className="nav-link">Go to User List →</Link>
                </nav>
            </header>

            <main className="content">
                <section className="api-info">
                    <h3>API Status</h3>
                    <p>Endpoint: <code>GET /api/users/all</code></p>

                    <div className="controls">
                        <button
                            type="button"
                            onClick={fetchUsers}
                            disabled={isLoading}
                            className="refresh-btn"
                        >
                            {isLoading ? 'Loading...' : 'Refresh Cache'}
                        </button>
                    </div>
                </section>

                <section className="preview-section">
                    <h3>Raw Data Preview</h3>
                    <textarea
                        className="textbox"
                        value={JSON.stringify(users, null, 2)}
                        readOnly
                        rows={10}
                        placeholder="No data loaded yet."
                    />
                </section>
            </main>
        </div>
    );
};

export default HomePage;