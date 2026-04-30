import { useState } from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import axios from 'axios';
import * as React from "react";
//import '/src/pages-styles/AddInstrumentPage.css'; // Make sure the path matches your project structure
import '/src/style.css';
interface AddInstrumentPageProps {
    onRefresh: () => void;
}

const AddInstrumentPage = ({ onRefresh }: AddInstrumentPageProps) => {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        price: 0,
        description: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            await axios.post(`/api/users/${userId}/instruments`, formData);
            onRefresh();
            navigate(`/users/${userId}`);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const message = err.response?.data?.message || err.message || 'Failed to add instrument';
                setError(message);
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Error connecting to server');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="page add-instrument-container">
            <header className="add-instrument-header">
                <div className="header-title-group">
                    <h2>Nový hudební nástroj</h2>
                </div>
                <button className="btn-cancel" onClick={() => navigate(`/users/${userId}`)}>
                    Cancel
                </button>
            </header>

            <form className="admin-form" onSubmit={handleSubmit}>
                {error && <div className="error-box">{error}</div>}

                <div className="form-group">
                    <label>Název nástroje</label>
                    <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Fender Stratocaster"
                    />
                </div>

                <div className="form-group">
                    <label>Částka (CZK)</label>
                    <input
                        type="number"
                        required
                        value={formData.price}
                        onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                    />
                </div>

                <div className="form-group">
                    <label>Popisek</label>
                    <textarea
                        rows={4}
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Condition, year of manufacture..."
                    />
                </div>

                <button type="submit" disabled={isSubmitting} className="submit-btn">
                    {isSubmitting ? 'Ukládám...' : 'Uložit'}
                </button>
            </form>
        </div>
    );
};

export default AddInstrumentPage;