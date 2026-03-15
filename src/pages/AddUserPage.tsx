import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Importujeme axios
import type { User } from './UserListPage';
import * as React from "react";

interface AddUserPageProps {
    onUserAdded: (user: User) => void;
}

const AddUserPage = ({ onUserAdded }: AddUserPageProps) => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'ROLE_USER' // Upravil jsem na ROLE_ prefix, pokud ho Spring očekává
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => { // Opraven typ eventu na FormEvent
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            // Používáme axios místo fetch. Interceptor v App.tsx přidá token sám.
            const response = await axios.post<User>('http://localhost:8080/api/users/add', formData);

            // Axios vrací data přímo v response.data
            const createdUser = response.data;

            // 1. Aktualizujeme globální stav v App.tsx
            onUserAdded(createdUser);
            // 2. Vrátíme se na seznam uživatelů
            navigate('/users');

        }  catch (err) {
        // 1. Zjistíme, jestli jde o chybu z Axiosu
        if (axios.isAxiosError(err)) {
            // Teď už TS ví, že err je AxiosError a dovolí ti přístup k response
            const message = err.response?.data?.message || err.message || 'Server error';
            setError(message);
        } else if (err instanceof Error) {
            // Klasická JS chyba (např. chyba v kódu)
            setError(err.message);
        } else {
            // Pro úplnou jistotu
            setError('An unexpected error occurred');
        }
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
                {error && <div className="error-box" style={{color: 'red'}}>{error}</div>}

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
                        {/* Změnil jsem hodnoty na ROLE_, aby to ladilo se Spring Security */}
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