import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserTable from '../components/UserTable';

// 1. Exportujeme interface pro zbytek aplikace
export interface Instrument {
    id: string;
    name: string;
    price: number;
    description: string;
}

export interface User {
    id: string;
    username: string;
    email: string;
    role: string;
    instruments?: Instrument[];
}

// Typ pro klíče, podle kterých se dá řadit (vše kromě pole instrumentů)
export type SortableUserKey = keyof Omit<User, 'instruments'>;

interface UserListPageProps {
    users: User[];
    isLoading: boolean;
}

const UserListPage = ({ users, isLoading }: UserListPageProps) => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    // Získáme roli z localStorage, abychom mohli schovat tlačítko pro ne-adminy
    const currentUserRole = localStorage.getItem('role');

    const [sortConfig, setSortConfig] = useState<{ key: SortableUserKey; direction: 'asc' | 'desc' }>({
        key: 'username',
        direction: 'asc'
    });

    const requestSort = (key: SortableUserKey) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedUsers = [...filteredUsers].sort((a, b) => {
        const direction = sortConfig.direction === 'asc' ? 1 : -1;
        const key = sortConfig.key;

        const aValue = a[key];
        const bValue = b[key];

        if (aValue === undefined) return 1;
        if (bValue === undefined) return -1;

        if (typeof aValue === 'string' && typeof bValue === 'string') {
            return aValue.localeCompare(bValue) * direction;
        }

        if (aValue < bValue) return -1 * direction;
        if (aValue > bValue) return 1 * direction;
        return 0;
    });

    return (
        <div className="page">
            <header className="page-header">
                <h2>Management uživatelů</h2>
                <div className="header-actions">
                    <button onClick={() => navigate('/')}>Zpět na Dashboard</button>

                    {/* Tlačítko Add User vidí jen ADMIN */}
                    {currentUserRole === 'ROLE_ADMIN' && (
                        <button className="add-btn" onClick={() => navigate('/users/add')}>
                            + Přidat uživatele
                        </button>
                    )}
                </div>

                <div className="search-container" style={{ marginTop: '20px' }}>
                    <input
                        type="text"
                        placeholder="Hledat podle jména nebo emailu..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                        autoFocus
                        style={{ padding: '8px', width: '300px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                    {searchTerm && (
                        <button
                            className="clear-search"
                            onClick={() => setSearchTerm('')}
                            style={{ marginLeft: '-25px', border: 'none', background: 'none', cursor: 'pointer' }}
                        >
                            ×
                        </button>
                    )}
                </div>
            </header>

            <div className="table-container" style={{ marginTop: '20px' }}>
                {isLoading ? (
                    <div className="loader">Načítám data ze serveru...</div>
                ) : (
                    <UserTable
                        users={sortedUsers}
                        sortConfig={sortConfig}
                        onRequestSort={requestSort}
                    />
                )}
            </div>
        </div>
    );
};

export default UserListPage;