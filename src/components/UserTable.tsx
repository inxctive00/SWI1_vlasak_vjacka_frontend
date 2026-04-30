// UserTable.tsx updates
import type { SortableUserKey, User } from '../pages/UserListPage';
import { Link } from "react-router-dom";
import '/src/style.css';

interface UserTableProps {
    users: User[];
    sortConfig: { key: SortableUserKey; direction: 'asc' | 'desc' };
    onRequestSort: (key: SortableUserKey) => void;
    isAdmin: boolean;           // Added prop
    onDelete: (id: string) => void; // Added prop
}

const UserTable = ({ users, sortConfig, onRequestSort, isAdmin, onDelete }: UserTableProps) => {

    const getSortIcon = (key: SortableUserKey) => {
        if (sortConfig.key !== key) return '↕';
        return sortConfig.direction === 'asc' ? '↑' : '↓';
    };

    return (
        <table className="user-table">
            <thead>
            <tr>
                <th onClick={() => onRequestSort('id')} className="sortable-th">
                    ID {getSortIcon('id')}
                </th>
                <th onClick={() => onRequestSort('username')} className="sortable-th">
                    Username {getSortIcon('username')}
                </th>
                <th onClick={() => onRequestSort('email')} className="sortable-th">
                    Email {getSortIcon('email')}
                </th>
                <th onClick={() => onRequestSort('role')} className="sortable-th">
                    Role {getSortIcon('role')}
                </th>
                <th>Status</th>
                {isAdmin && <th>Akce</th>}
            </tr>
            </thead>
            <tbody>
            {users.length > 0 ? (
                users.map(user => (
                    <tr key={user.id}>
                        <td>
                            <span className="uuid-cell" title={user.id} style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                                {user.id.substring(0, 8)}...
                            </span>
                        </td>
                        <td>
                            <Link title="Editovat uživatele" to={`/users/${user.id}`} className="user-link">
                                <strong>{user.username}</strong>
                            </Link>
                        </td>
                        <td>{user.email}</td>
                        <td>
                            <span className={`role-badge ${user.role}`}>
                                {user.role}
                            </span>
                        </td>
                        <td>
                            <span className="badge-active">Active</span>
                        </td>
                        {isAdmin && (
                            <td>
                                <button
                                    className="btn-delete"
                                    onClick={() => onDelete(user.id)}
                                    title="Smazat uživatele"
                                >
                                    <p>X</p>
                                </button>
                            </td>
                        )}
                    </tr>
                ))
            ) : (
                <tr>
                    <td colSpan={isAdmin ? 6 : 5} className="no-results">No users found.</td>
                </tr>
            )}
            </tbody>
        </table>
    );
};

export default UserTable;