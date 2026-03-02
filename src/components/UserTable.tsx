import type {SortableUserKey, User} from '../pages/UserListPage';
import {Link} from "react-router-dom"; // Importujeme interface

interface UserTableProps {
    users: User[];
    sortConfig: { key: SortableUserKey; direction: 'asc' | 'desc' };
    // Tady změníme keyof User na SortableUserKey
    onRequestSort: (key: SortableUserKey) => void;
}

const UserTable = ({ users, sortConfig, onRequestSort }: UserTableProps) => {
    return (
        <table className="user-table">
            <thead>
            <tr>
                <th onClick={() => onRequestSort('id')} className="sortable-th">
                    ID {sortConfig.key === 'id' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th onClick={() => onRequestSort('username')} className="sortable-th">
                    Username {sortConfig.key === 'username' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th onClick={() => onRequestSort('email')} className="sortable-th">
                    Email {sortConfig.key === 'email' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th>Status</th>
            </tr>
            </thead>
            <tbody>
            {users.length > 0 ? (
                users.map(user => (
                    <tr key={user.id}>
                        <td>
                                <span className="uuid-cell" title={user.id}>
                                    {user.id.substring(0, 8)}...
                                </span>
                        </td>
                        <td><Link to={`/users/${user.id}`} className="user-link">
                            <strong>{user.username}</strong>
                        </Link></td>
                        <td>{user.email}</td>
                        <td>
                            <span className="badge-active">Active</span>
                        </td>
                    </tr>
                ))
            ) : (
                <tr>
                    <td colSpan={4} className="no-results">No users found.</td>
                </tr>
            )}
            </tbody>
        </table>
    );
};

export default UserTable;