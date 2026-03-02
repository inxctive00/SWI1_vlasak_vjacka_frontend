import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface AddInstrumentPageProps {
    onRefresh: () => void; // Přidáme prop pro refresh
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

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const response = await fetch(`/api/users/${userId}/instruments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to add instrument');
            }

            // Po úspěchu se vrátíme zpět na detail uživatele
            onRefresh();
            navigate(`/users/${userId}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error connecting to server');
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
                {error && <div className="error-box">{error}</div>}

                <div className="form-group">
                    <label>Instrument Name</label>
                    <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        placeholder="e.g. Fender Stratocaster"
                    />
                </div>

                <div className="form-group">
                    <label>Price (CZK)</label>
                    <input
                        type="number"
                        required
                        value={formData.price}
                        onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                    />
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        className="textbox"
                        rows={4}
                        value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
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