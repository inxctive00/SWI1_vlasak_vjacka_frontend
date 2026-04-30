import type { User } from './UserListPage';
//import '/src/pages-styles/HomePage.css'; // Import the new CSS file
import '/src/style.css';

interface HomePageProps {
    users: User[];
    fetchUsers: () => void;
    isLoading: boolean;
}

const HomePage = ({ users, fetchUsers, isLoading }: HomePageProps) => {
    return (
        <div className="page home-container">
            <header className="home-header">
                <h1 className="home-title">Přehled systému</h1>

                {/* Tlačítko přesunuto do hlavičky pro lepší dostupnost */}
                <button
                    onClick={fetchUsers}
                    disabled={isLoading}
                    className="btn-secondary home-refresh-btn"
                >
                    {isLoading ? 'Načítání...' : 'Obnovit data'}
                </button>
            </header>

            <div className="home-layout-grid">
                {/* Postranní panel s metrikami */}
                <aside className="home-sidebar">
                    <div className="metrics-column">
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
                </aside>

                {/* Hlavní obsah uprostřed */}
                <main className="home-main-content">
                    <div className="detail-card info-card">
                        <h2 style={{ marginTop: 0, color: 'var(--text-primary)' }}>Vítejte v informačním systému</h2>
                        <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                            Tento informační systém slouží pro správu hudebních projektů.
                            Umožňuje evidovat uživatele, přiřazovat jim hudební nástroje a tvořit sestavy kapel nebo orchestrů.
                        </p>
                        <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                            K navigaci použijte horní menu. V sekci <strong>Uživatelé</strong> naleznete profily a nástroje jednotlivých členů.
                            V sekci <strong>Projekty</strong> můžete organizovat obsazení konkrétních uskupení.
                        </p>
                    </div>
                </main>
            </div>

            {/* Patička s kontakty */}
            <footer className="home-footer">
                <div className="contact-card">
                    <h3 style={{ margin: '0 0 12px 0' }}>Kontakt na technickou podporu</h3>
                    <p style={{ margin: '4px 0' }}>
                        <strong>Email:</strong> <a href="mailto:podpora@hudebniprojekty.cz">podpora@hudebniprojekty.cz</a>
                    </p>
                    <p style={{ margin: '4px 0' }}>
                        <strong>Telefon:</strong> +420 777 999 333 (Po-Pá 8:00 - 16:00)
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;