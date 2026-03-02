import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserTable from '../components/UserTable';

// 1. Exportujeme interface, aby ho mohl importovat i App.tsx
export interface User {
    id: string;
    username: string;
    email: string;
    instruments?: Instrument[];
}

export type SortableUserKey = keyof Omit<User, 'instruments'>;

export interface Instrument {
    id: string;
    name: string;
    price: number;
    description: string;
}

// 2. Definujeme rozhraní pro Props (data, která sem tečou z App.tsx)
interface UserListPageProps {
    users: User[];
    isLoading: boolean;
}

type UserSortKey = keyof Omit<User, 'instruments'>;

// 3. Komponenta nyní přijímá props v parametru
const UserListPage = ({ users, isLoading }: UserListPageProps) => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: SortableUserKey; direction: 'asc' | 'desc' }>({
        key: 'id',
        direction: 'asc'
    });

    // Funkce pro změnu řazení
    const requestSort = (key: SortableUserKey) => {
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
        const key = sortConfig.key as UserSortKey; // Explicitní přetypování pro TS
        const direction = sortConfig.direction === 'asc' ? 1 : -1;

        const aValue = a[key];
        const bValue = b[key];

        // Ošetření případu, kdy by hodnota byla undefined (řeší chybu TS18048)
        if (aValue === undefined) return 1;
        if (bValue === undefined) return -1;

        // Univerzální porovnání pro stringy
        if (typeof aValue === 'string' && typeof bValue === 'string') {
            return aValue.localeCompare(bValue) * direction;
        }

        // Porovnání pro čísla nebo jiné typy
        if (aValue < bValue) return -1 * direction;
        if (aValue > bValue) return 1 * direction;
        return 0;
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