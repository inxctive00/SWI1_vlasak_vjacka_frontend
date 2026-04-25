import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Importujeme axios
import * as React from "react";

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
            // Používáme axios.post s typem zpětné vazby (pokud ji nepotřebuješ, stačí axios.post)
            // URL cesty musí odpovídat tvému Controlleru na backendu
            await axios.post(`/api/users/${userId}/instruments`, formData);

            // Po úspěchu zavoláme refresh dat a navigujeme zpět
            onRefresh();
            navigate(`/users/${userId}`);
        } catch (err) {
            // TypeScript bezpečné ošetření chyb bez použití 'any'
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
        <div className="page">
            <header className="page-header">
                <h2>Add Instrument for User</h2>
                <p>Owner ID: <code>{userId}</code></p>
                <button onClick={() => navigate(`/users/${userId}`)}>Cancel</button>
            </header>

            <form className="admin-form" onSubmit={handleSubmit}>
                {error && <div className="error-box" style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

                <div className="form-group">
                    <label>Instrument Name</label>
                    <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Fender Stratocaster"
                    />
                </div>

                <div className="form-group">
                    <label>Price (CZK)</label>
                    <input
                        type="number"
                        required
                        value={formData.price}
                        onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                    />
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        className="textbox"
                        rows={4}
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Condition, year of manufacture..."
                    />
                </div>

                <button type="submit" disabled={isSubmitting} className="submit-btn">
                    {isSubmitting ? 'Saving...' : 'Save Instrument'}
                </button>
            </form>
        </div>
    );
};

export default AddInstrumentPage;