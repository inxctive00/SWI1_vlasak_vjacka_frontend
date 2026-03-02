import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserTable from '../components/UserTable';

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
                <div className="header-actions">
                    <button onClick={() => navigate('/')}>Back</button>
                    <button className="add-btn" onClick={() => navigate('/users/add')}>+ Add User</button>
                </div>
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
                    <p>Loading...</p>
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