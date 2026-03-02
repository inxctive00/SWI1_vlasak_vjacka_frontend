import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type {User} from './UserListPage';
import * as React from "react";

interface AddUserPageProps {
    onUserAdded: (user: User) => void;
}

const AddUserPage = ({ onUserAdded }: AddUserPageProps) => {
    const navigate = useNavigate();

    // Stavy pro formulář
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'user' // defaultní hodnota
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const response = await fetch('/api/users/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create user');
            }

            const createdUser = await response.json();

            // 1. Aktualizujeme globální stav v App.tsx
            onUserAdded(createdUser);
            // 2. Vrátíme se na seznam uživatelů
            navigate('/users');

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="page">
            <header className="page-header">
                <h2>Add New User</h2>
                <button onClick={() => navigate('/users')}>Cancel</button>
            </header>

            <form className="admin-form" onSubmit={handleSubmit}>
                {error && <div className="error-box">{error}</div>}

                <div className="form-group">
                    <label>Username</label>
                    <input
                        type="text"
                        required
                        value={formData.username}
                        onChange={e => setFormData({...formData, username: e.target.value})}
                    />
                </div>

                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        required
                        value={formData.password}
                        onChange={e => setFormData({...formData, password: e.target.value})}
                    />
                </div>

                <div className="form-group">
                    <label>Role</label>
                    <select
                        value={formData.role}
                        onChange={e => setFormData({...formData, role: e.target.value})}
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="editor">Editor</option>
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