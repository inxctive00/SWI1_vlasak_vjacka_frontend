import { useEffect, useState } from 'react'
import './App.css'

interface User {
    id: string;
    username: string;
    email: string;
    // Přidejte další pole, která vaše API vrací
}

function App() {
    const [users, setUsers] = useState<User[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    // Stav pro přepínání stránek: 'home' nebo 'users'
    const [currentPage, setCurrentPage] = useState('home')

    const [searchTerm, setSearchTerm] = useState('');

    // 1. Definujeme typ pro klíče, které lze řadit
    type UserSortKey = keyof User;

    // 2. Upravíme stav, aby nepoužíval obecný string
    const [sortConfig, setSortConfig] = useState<{ key: UserSortKey; direction: 'asc' | 'desc' }>({
        key: 'id',
        direction: 'asc'
    });

    const requestSort = (key: UserSortKey) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // 1. Nejdříve vyfiltrujeme uživatele podle jména (případně i e-mailu)
    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    // 2. Řadíme filtrované uživatele
    const sortedUsers = [...filteredUsers].sort((a, b) => {
        const key = sortConfig.key;
        const direction = sortConfig.direction === 'asc' ? 1 : -1;

        const aValue = a[key];
        const bValue = b[key];

        // Univerzální porovnání pro stringy i čísla
        if (typeof aValue === 'string' && typeof bValue === 'string') {
            return aValue.localeCompare(bValue) * direction;
        }

        // Fallback pro ostatní typy (např. pokud by id bylo číslo)
        if (aValue < bValue) return -1 * direction;
        if (aValue > bValue) return 1 * direction;
        return 0;
    });

    const fetchUsers = async () => {
        setIsLoading(true)
        setErrorMessage('')
        try {
            const response = await fetch('/api/users/all')
            if (!response.ok) throw new Error(`Status: ${response.status}`)

            const data = await response.json() // Předpokládáme, že API vrací JSON pole
            setUsers(data)
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'Unknown error')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    // ... ponechte veškerou logiku nahoře (useEffect, sorting, atd.) ...

    // Místo definování funkcí UsersTable a HomePage
    // to teď vykreslíme podmíněně přímo v returnu

    if (currentPage === 'home') {
        return (
            <div className="page">
                <header className="page-header">
                    <p>
                        <a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('users'); }}>
                            List of users
                        </a>
                    </p>
                    <p>GET /api/test</p>
                </header>
                <div className="controls">
                    <button type="button" onClick={fetchUsers} disabled={isLoading}>
                        {isLoading ? 'Loading...' : 'Refresh'}
                    </button>
                </div>
                <textarea
                    className="textbox"
                    value={JSON.stringify(users, null, 2)}
                    readOnly
                    rows={10}
                />
            </div>
        );
    }

    // Pokud nejsme na home, jsme na 'users'
    return (
        <div className="page">
            <header className="page-header">
                <h2>List of Users</h2>
                <button onClick={() => setCurrentPage('home')}>Back to Home</button>
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                        autoFocus // Kurzor tam bude hned při otevření stránky
                    />
                    {searchTerm && (
                        <button className="clear-search" onClick={() => setSearchTerm('')}>×</button>
                    )}
                </div>
            </header>
            <div className="table-container">
                {isLoading ? <p>Loading users...</p> : (
                    <table className="user-table">
                        <thead>
                        <tr>
                            <th onClick={() => requestSort('id')} className="sortable-th">
                                ID {sortConfig.key === 'id' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                            </th>
                            <th onClick={() => requestSort('username')} className="sortable-th">
                                Username {sortConfig.key === 'username' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                            </th>
                            <th onClick={() => requestSort('email')} className="sortable-th">
                                Email {sortConfig.key === 'email' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {sortedUsers.map(user => (
                            <tr key={user.id}>
                                <td><span className="uuid-cell" title={user.id}>{user.id.substring(0, 8)}...</span></td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>
                                    <span className="badge-active">Active</span>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
                {errorMessage && <p className="error">{errorMessage}</p>}
            </div>
        </div>
    );
}

export default App;