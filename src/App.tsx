import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import HomePage from './pages/HomePage';
import UserListPage from './pages/UserListPage';
import './App.css';

interface User {
    id: string;
    username: string;
    email: string;
}

function App() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/users/all');
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    return (
        <Router>
            <Routes>
                <Route path="/" element={
                    <HomePage users={users} fetchUsers={fetchUsers} isLoading={isLoading} />
                } />
                <Route path="/users" element={
                    <UserListPage users={users} isLoading={isLoading} />
                } />
            </Routes>
        </Router>
    );
}

export default App;