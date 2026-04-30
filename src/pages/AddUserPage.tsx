import { useState, type FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import type { User } from './UserListPage';
//import '/src/pages-styles/AddUserPage.css';
import '/src/style.css';
interface AddUserPageProps {
    onUserAdded: (user: User) => void;
}

const AddUserPage = ({ onUserAdded }: AddUserPageProps) => {
    const navigate = useNavigate();

    //Nutne pro editaci
    const location = useLocation();
    const userToEdit = location.state?.editUser;
    const isEditing = !!userToEdit;


    const [formData, setFormData] = useState({
        username: userToEdit ? userToEdit.username : '',
        email: userToEdit ? userToEdit.email : '',
        password: '',
        role: userToEdit ? userToEdit.role : 'ROLE_USER'
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            if(isEditing){
                await axios.put<User>(`/api/users/${userToEdit.id}`, formData);
            }
            else{
                const response = await axios.post<User>('/api/users/add', formData);
                onUserAdded(response.data);
            }
            navigate('/users');
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || err.message || 'Server error');
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unexpected error occurred');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="page add-user-container">
            <header className="add-user-header">
                <h2 className="header-title">Přidání nového uživatele</h2>
                <button className="btn-secondary" onClick={() => navigate('/users')}>
                    Cancel
                </button>
            </header>

            <form className="admin-form" onSubmit={handleSubmit}>
                {error && <div className="error-box">{error}</div>}

                <div className="form-group">
                    <label>Username</label>
                    <input
                        type="text"
                        required
                        value={formData.username}
                        onChange={e => setFormData({ ...formData, username: e.target.value })}
                    />
                </div>

                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                    />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        required
                        value={formData.password}
                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                    />
                </div>

                <div className="form-group">
                    <label>Role</label>
                    <select
                        value={formData.role}
                        onChange={e => setFormData({ ...formData, role: e.target.value })}
                    >
                        <option value="ROLE_USER">User</option>
                        <option value="ROLE_ADMIN">Admin</option>
                        <option value="ROLE_EDITOR">Editor</option>
                    </select>
                </div>

                <button type="submit" disabled={isSubmitting} className="submit-btn">
                    {isSubmitting ? 'Creating...' : 'Create User'}
                </button>
            </form>
        </div>
    );
};

export default AddUserPage;