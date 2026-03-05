import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

function Login()
{
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/auth/login/', formData);
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.username);
            navigate('/notes');
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong'); // err.response?.data?.error (Optional Chaining = if err.response exist than access err.response.data and if err.response.data exists than acces err.response.data.error)
        }
    };

    return(<>
        <div className='login-div'>
            <h2>Login</h2>
            {error && <p className='error-line'>{error}</p>}
            <input
                name="username"
                placeholder="Username"
                onChange={handleChange}
            />
            <input
                name="password"
                type="password"
                placeholder="Password"
                onChange={handleChange}
            />
            <button onClick={handleSubmit}>Login</button>
            <p>Don't have an account? <Link to="/register">Register</Link></p>
        </div>
    
    </>);
}

export default Login