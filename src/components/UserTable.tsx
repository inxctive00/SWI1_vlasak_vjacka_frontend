import type { SortableUserKey, User } from '../pages/UserListPage';
import { Link } from "react-router-dom";

interface UserTableProps {
    users: User[];
    sortConfig: { key: SortableUserKey; direction: 'asc' | 'desc' };
    onRequestSort: (key: SortableUserKey) => void;
}

const UserTable = ({ users, sortConfig, onRequestSort }: UserTableProps) => {

    // Pomocná funkce pro vykreslení šipky řazení
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
                            <Link to={`/users/${user.id}`} className="user-link">
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
                    </tr>
                ))
            ) : (
                <tr>
                    <td colSpan={5} className="no-results">No users found.</td>
                </tr>
            )}
            </tbody>
        </table>
    );
};

export default UserTable;