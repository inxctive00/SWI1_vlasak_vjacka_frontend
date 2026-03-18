import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import HomePage from './pages/HomePage';
import UserListPage, { type User, type Project } from './pages/UserListPage';
import UserDetailPage from "./pages/UserDetailPage.tsx";
import ProjectListPage from "./pages/ProjectListPage.tsx";
import AddUserPage from "./pages/AddUserPage.tsx";
import AddInstrumentPage from "./pages/AddInstrumentPage.tsx";
import ProjectDetailPage from './pages/ProjectDetailPage';
import Login from "./components/Login.tsx";
import './App.css';

// 1. Nastavení globální URL pro Axios (volitelné, zjednodušuje psaní cest)
axios.defaults.baseURL = 'http://localhost:8080';

// 2. Nastavení Axios Interceptoru
// Každý odchozí požadavek automaticky dostane Basic Auth hlavičku z localStorage
axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Basic ${token}`;
    }
    return config;
});

function App() {
    const [users, setUsers] = useState<User[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState<string | null>(localStorage.getItem('currentUser'));
    const [userRole, setUserRole] = useState<string | null>(localStorage.getItem('userRole'));
    users.find(u => u.username === currentUser);
    const addUser = (newUser: User) => {
        setUsers(prev => [...prev, newUser]);
    };
    const handleAddUserToProject = async (projectId: string, userId: string) => {
        await axios.post(`/api/projects/${projectId}/add-user/${userId}`);
        await fetchAllData(); // Toto zajistí, že se refreshnou users i projects
    };

    const handleRemoveUserFromProject = async (projectId: string, userId: string) => {
        try {
            await axios.post(`/api/projects/${projectId}/remove-user/${userId}`);
            await fetchAllData(); // Refresh dat
        } catch (error) {
            console.error("Chyba při odebírání uživatele:", error);
        }
    };

    // 3. Funkce pro synchronizované stahování všech dat
    const fetchAllData = useCallback(async () => {
        if (!currentUser) return;

        setIsLoading(true);
        try {
            const [usersRes, projectsRes] = await Promise.all([
                axios.get<User[]>('/api/users/all'),
                axios.get<Project[]>('/api/projects/all')
            ]);
            setUsers(usersRes.data);
            setProjects(projectsRes.data);
        } catch (error) {
            console.error("Chyba při stahování dat:", error);
        } finally {
            setIsLoading(false);
        }
    }, [currentUser]);

    // Spustí se při startu nebo změně uživatele
    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    // 4. Pokud není uživatel přihlášen, ukaž pouze Login
    if (!currentUser) {
        return (
            <div className="login-wrapper">
                <Login onLoginSuccess={(data) => {
                    setCurrentUser(data.username);
                    setUserRole(data.role);
                    // Token se ukládá v komponentě Login.tsx do localStorage
                }} />
            </div>
        );
    }

    // 5. Hlavní aplikace s navigací a routováním
    return (
        <Router>
            <div className="app-container">
                <nav className="main-nav" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px', backgroundColor: '#f8f9fa', borderBottom: '1px solid #ddd' }}>
                    <div className="nav-links" style={{ display: 'flex', gap: '20px' }}>
                        <Link to="/" style={{ fontWeight: 'bold', textDecoration: 'none', color: '#333' }}>🏠 Dashboard</Link>
                        <Link to="/users" style={{ textDecoration: 'none', color: '#333' }}>👥 Uživatelé</Link>
                        <Link to="/projects" style={{ textDecoration: 'none', color: '#333' }}>🎸 Projekty (M:N)</Link>
                    </div>

                    <div className="nav-user" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <span>Uživatel: <b>{currentUser}</b></span>
                        <button
                            className="logout-btn"
                            style={{ padding: '5px 10px', cursor: 'pointer', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}
                            onClick={() => {
                                localStorage.clear();
                                setCurrentUser(null);
                                window.location.href = "/"; // Reset aplikace do výchozího stavu
                            }}
                        >
                            Odhlásit
                        </button>
                    </div>
                </nav>

                <main className="content" style={{ padding: '20px' }}>
                    <Routes>
                        {/* Úvodní stránka s přehledem */}
                        <Route path="/" element={
                            <HomePage users={users} fetchUsers={fetchAllData} isLoading={isLoading} />
                        } />

                        {/* Správa uživatelů */}
                        <Route path="/users" element={
                            <UserListPage users={users} isLoading={isLoading} />
                        } />
                        <Route path="/users/:id" element={<UserDetailPage users={users} />} />
                        <Route path="/users/add" element={<AddUserPage onUserAdded={addUser} />} />

                        {/* Nástroje (1:N) */}
                        <Route
                            path="/users/:userId/add-instrument"
                            element={<AddInstrumentPage onRefresh={fetchAllData} />}
                        />

                        {/* Projekty (M:N) */}
                        <Route path="/projects" element={
                            <ProjectListPage projects={projects} isLoading={isLoading} />
                        } />
                        <Route path="/projects/:id" element={
                            <ProjectDetailPage
                                projects={projects}
                                allUsers={users}
                                onAddUser={handleAddUserToProject}
                                onRemoveUser={handleRemoveUserFromProject}
                                userRole={userRole || undefined}
                            />
                        } />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;