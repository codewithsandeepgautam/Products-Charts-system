import React, { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  if (!token) return <Login setToken={setToken} />;

  return <Dashboard />;
}

export default App;