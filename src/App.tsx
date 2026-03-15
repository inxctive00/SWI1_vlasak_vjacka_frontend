import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios'; // Importujeme axios pro interceptor
import HomePage from './pages/HomePage';
import UserListPage, {type Instrument} from './pages/UserListPage';
import UserDetailPage from "./pages/UserDetailPage.tsx";
import AddUserPage from "./pages/AddUserPage.tsx";
import AddInstrumentPage from "./pages/AddInstrumentPage.tsx";
import Login from "./components/Login.tsx"; // Ujisti se, že cesta sedí
import './App.css';

// 1. Definice rozhraní
interface User {
    id: string;
    username: string;
    email: string;
    role: string;
    instruments?: Instrument[];
}

// 2. Nastavení Axios Interceptoru přímo v App.tsx (pro jednoduchost)
// Toto zajistí, že každý dotaz přes axios ponese náš token
axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Basic ${token}`;
    }
    return config;
});

function App() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState<string | null>(localStorage.getItem('username'));

    const addUser = (newUser: User) => {
        setUsers(prev => [...prev, newUser]);
    };

    // 3. Funkce pro stahování dat přes Axios
    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            // Axios automaticky parsuje JSON, takže stačí response.data
            const response = await axios.get<User[]>('/api/users/all');
            setUsers(response.data);
        } catch (error) {
            console.error("Chyba při stahování uživatelů:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Spustí se po přihlášení nebo při startu, pokud je uživatel v localStorage
    useEffect(() => {
        if (currentUser) {
            fetchUsers();
        }
    }, [currentUser]);

    // 4. Podmíněný rendering: Pokud není uživatel, ukaž Login
    if (!currentUser) {
        return (
            <div className="login-wrapper">
                <Login onLoginSuccess={(data) => setCurrentUser(data.username)} />
            </div>
        );
    }

    // 5. Hlavní aplikace (po přihlášení)
    return (
        <Router>
            <div className="app-container">
                <nav className="main-nav">
                    <span>Přihlášen jako: <b>{currentUser}</b></span>
                    <button onClick={() => {
                        localStorage.clear();
                        setCurrentUser(null);
                    }}>
                        Odhlásit
                    </button>
                </nav>

                <Routes>
                    <Route path="/" element={
                        <HomePage users={users} fetchUsers={fetchUsers} isLoading={isLoading} />
                    } />
                    <Route path="/users" element={
                        <UserListPage users={users} isLoading={isLoading} />
                    } />
                    <Route path="/users/:id" element={<UserDetailPage users={users} />} />
                    <Route path="/users/add" element={<AddUserPage onUserAdded={addUser} />} />
                    <Route
                        path="/users/:userId/add-instrument"
                        element={<AddInstrumentPage onRefresh={fetchUsers} />}
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;