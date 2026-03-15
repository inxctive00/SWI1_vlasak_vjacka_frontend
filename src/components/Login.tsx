import { useState, type FormEvent } from 'react';
import axios from 'axios';

interface LoginResponse {
    message: string;
    username: string;
    role: string;
    token: string;
}

interface LoginProps {
    onLoginSuccess: (data: LoginResponse) => void;
}

const Login = ({ onLoginSuccess }: LoginProps) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        try {
            // 1. Pošleme dotaz na tvůj AuthController
            const response = await axios.post<LoginResponse>('http://localhost:8080/api/auth/login', {
                username,
                password
            });

            // 2. KLÍČOVÁ ZMĚNA: Vytvoříme Basic Auth token z jména a hesla
            // btoa() zakóduje "username:password" do Base64, což Spring Security vyžaduje
            const basicToken = window.btoa(`${username}:${password}`);

            // 3. Uložíme tento funkční token do localStorage
            localStorage.setItem('token', basicToken);
            localStorage.setItem('username', response.data.username);
            localStorage.setItem('role', response.data.role);

            setError('');
            onLoginSuccess(response.data);

        } catch (err) {
            // Ošetření chyby bez 'any'
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.error || 'Neplatné jméno nebo heslo');
            } else {
                setError('Chyba při komunikaci se serverem');
            }
        }
    };

    return (
        <div className="login-container" style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', maxWidth: '300px', margin: '50px auto' }}>
            <h2>Přihlášení</h2>
            <form onSubmit={handleLogin}>
                <div style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'block' }}>Jméno:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={{ width: '100%' }}
                        required
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block' }}>Heslo:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: '100%' }}
                        required
                    />
                </div>
                <button type="submit" style={{ width: '100%', padding: '10px', cursor: 'pointer' }}>
                    Přihlásit se
                </button>
            </form>
            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        </div>
    );
};

export default Login;