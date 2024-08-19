import { useState } from 'react'
import {BrowserRouter, Route, Routes, Navigate, useLocation} from 'react-router-dom'
import Login from './pages/login'
import Register from './pages/register'
import Notfound from './pages/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/home'
import Profile from './pages/profile'
import Blog from './pages/Blog'

function RegisterLogout() {
    localStorage.clear()
    console.log("went to register");
    return <Register />
}

function Logout() {
    localStorage.clear();
    console.log("log out");
    return <Navigate to='/login' />;
}

function BlogWrapper() {
  const location = useLocation();
  return <Blog {...location.state} />;
}

function App() {
    return (<>
        <BrowserRouter>
            <Routes>
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<RegisterLogout />} />
                <Route path='*' element={<Notfound />} />
                <Route path='/logout' element={<Logout />} />
                <Route path='/blog' element={<BlogWrapper />} />
                <Route path='/' element={
                    <ProtectedRoute>
                        <Home />
                    </ProtectedRoute>
                } />
                <Route path='/home' element={
                    <ProtectedRoute>
                        <Home />
                    </ProtectedRoute>
                } />
                <Route path='/profile' element={<Profile />} />
            </Routes>
        </BrowserRouter>
    </>)
}

export default App
