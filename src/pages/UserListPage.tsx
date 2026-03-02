import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 1. Exportujeme interface, aby ho mohl importovat i App.tsx
export interface User {
    id: string;
    username: string;
    email: string;
}

// 2. Definujeme rozhraní pro Props (data, která sem tečou z App.tsx)
interface UserListPageProps {
    users: User[];
    isLoading: boolean;
}

type UserSortKey = keyof User;

// 3. Komponenta nyní přijímá props v parametru
const UserListPage = ({ users, isLoading }: UserListPageProps) => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: UserSortKey; direction: 'asc' | 'desc' }>({
        key: 'id',
        direction: 'asc'
    });

    // Funkce pro změnu řazení
    const requestSort = (key: UserSortKey) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Filtrování dat na základě searchTerm
    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Řazení vyfiltrovaných dat
    const sortedUsers = [...filteredUsers].sort((a, b) => {
        const { key, direction } = sortConfig;
        const factor = direction === 'asc' ? 1 : -1;
        const aValue = a[key];
        const bValue = b[key];

        return aValue.localeCompare(bValue) * factor;
    });

    return (
        <div className="page">
            <header className="page-header">
                <h2>List of Users</h2>
                <button onClick={() => navigate('/')}>Back to Home</button>
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search by username or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                        autoFocus
                    />
                    {searchTerm && (
                        <button className="clear-search" onClick={() => setSearchTerm('')}>×</button>
                    )}
                </div>
            </header>

            <div className="table-container">
                {isLoading ? (
                    <p className="loading-text">Loading users from API...</p>
                ) : (
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
                            <th>Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {sortedUsers.length > 0 ? (
                            sortedUsers.map(user => (
                                <tr key={user.id}>
                                    <td>
                                            <span className="uuid-cell" title={user.id}>
                                                {user.id.substring(0, 8)}...
                                            </span>
                                    </td>
                                    <td><strong>{user.username}</strong></td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className="badge-active">Active</span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="no-results">No users found matching your search.</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default UserListPage;