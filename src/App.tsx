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
import AddProjectPage from './pages/AddProjectPage';

// 1. GLOBAL AXIOS CONFIG: Sets base URL for all API requests
axios.defaults.baseURL = 'http://localhost:8080';

// 2. AXIOS INTERCEPTOR: Automatically attaches JWT token from localStorage to every outgoing request
axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

function App() {
    // STATE MANAGEMENT: Holds app data and current user session info
    const [users, setUsers] = useState<User[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState<string | null>(localStorage.getItem('currentUser'));
    const [userRole, setUserRole] = useState<string | null>(localStorage.getItem('userRole'));

    // STATE UPDATERS: Append new items locally to avoid immediate refetching
    const addUser = (newUser: User) => setUsers(prev => [...prev, newUser]);
    const addProject = (newProject: Project) => setProjects(prev => [...prev, newProject]);

    // API ACTIONS: Handle adding/removing users from projects and refresh state
    const handleAddUserToProject = async (projectId: string, userId: string) => {
        await axios.post(`/api/projects/${projectId}/add-user/${userId}`);
        await fetchAllData();
    };

    const handleRemoveUserFromProject = async (projectId: string, userId: string) => {
        try {
            await axios.post(`/api/projects/${projectId}/remove-user/${userId}`);
            await fetchAllData();
        } catch (error) {
            console.error("Chyba při odebírání uživatele:", error);
        }
    };

    // 3. DATA FETCHING: Retrieves all users and projects concurrently
    const fetchAllData = useCallback(async () => {
        if (!currentUser) return; // Only fetch if logged in

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

    // TRIGGER FETCH: Runs on mount or when currentUser logs in
    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    // 4. AUTH GUARD: Render login screen if no user is authenticated
    if (!currentUser) {
        return (
            <div className="login-wrapper">
                <Login onLoginSuccess={(data) => {
                    setCurrentUser(data.username);
                    setUserRole(data.role);
                }} />
            </div>
        );
    }

    // 5. MAIN APP ROUTING: Rendered only for authenticated users
    return (
        <Router>
            <div className="app-container">
                <nav className="main-nav">
                    <div className="nav-links">
                        <Link to="/">Úvodní stránka</Link>
                        <Link to="/users">Správa uživatelů</Link>
                        <Link to="/projects">Dostupné projekty</Link>
                    </div>

                    <div className="nav-user">
                        <span>Příhlášen jako: <b>{currentUser}</b></span>
                        <button
                            className="logout-btn"
                            onClick={() => {
                                localStorage.clear();
                                setCurrentUser(null); // Triggers re-render back to <Login />
                            }}
                        >
                            Odhlásit se
                        </button>
                    </div>
                </nav>

                <main className="content">
                    <Routes>
                        {/* Dashboard */}
                        <Route path="/" element={<HomePage users={users} fetchUsers={fetchAllData} isLoading={isLoading} />} />

                        {/* User Management */}
                        <Route path="/users" element={<UserListPage users={users} isLoading={isLoading} />} />
                        <Route path="/users/:id" element={<UserDetailPage users={users} />} />
                        <Route path="/users/add" element={<AddUserPage onUserAdded={addUser} />} />
                        <Route path="/users/:userId/add-instrument" element={<AddInstrumentPage onRefresh={fetchAllData} />} />

                        {/* Project Management */}
                        <Route path="/projects" element={<ProjectListPage projects={projects} isLoading={isLoading} />} />
                        <Route path="/projects/add" element={<AddProjectPage onProjectAdded={addProject} allUsers={users} />} />
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