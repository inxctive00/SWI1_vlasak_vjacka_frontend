import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserTable from '../components/UserTable';
import '/src/pages-styles/UserListPage.css'; // Import the new CSS file

export interface Instrument {
    id: string;
    name: string;
    price: number;
    description: string;
}

export interface Project {
    id: string;
    name: string;
    description: string;
    members?: User[];
}

export interface User {
    id: string;
    username: string;
    email: string;
    role: string;
    instruments?: Instrument[];
    projects?: Project[];
}

export type SortableUserKey = keyof Omit<User, 'instruments'>;

interface UserListPageProps {
    users: User[];
    isLoading: boolean;
}

const UserListPage = ({ users, isLoading }: UserListPageProps) => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    const currentUserRole = localStorage.getItem('userRole');

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

    const formattedUsers = sortedUsers.map(user => ({
        ...user,
        role: user.role ? user.role.replace('ROLE_', '') : user.role
    }));

    return (
        <div className="page">
            <header className="user-list-header">
                <div className="header-top-row">
                    <h2 className="header-title">Management uživatelů</h2>
                    <div className="header-actions">
                        <button className="btn-secondary" onClick={() => navigate('/')}>
                            Zpět na úvodní stránku
                        </button>

                        {currentUserRole === 'ROLE_ADMIN' && (
                            <button className="btn-primary" onClick={() => navigate('/users/add')}>
                                + Přidat uživatele
                            </button>
                        )}
                    </div>
                </div>

                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Hledat podle jména nebo emailu..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                        autoFocus
                    />
                    {searchTerm && (
                        <button
                            className="clear-search"
                            onClick={() => setSearchTerm('')}
                        >
                            ×
                        </button>
                    )}
                </div>
            </header>

            <div className="user-table-wrapper">
                {isLoading ? (
                    <div className="loader">Načítám data ze serveru...</div>
                ) : (
                    <UserTable
                        users={formattedUsers}
                        sortConfig={sortConfig}
                        onRequestSort={requestSort}
                    />
                )}
            </div>
        </div>
    );
};

export default UserListPage;