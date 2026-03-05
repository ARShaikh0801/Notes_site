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
            if(data.token) localStorage.setItem('token', data.token);
            if(data.username) localStorage.setItem('username', data.username);
            navigate('/notes');
        } catch (err) {
            setError({error_view: err.response?.data?.error_view}); // err.response?.data (Optional Chaining = if err.response exist than access err.response.data)
        }
    };

    return(<>
        <div className='login-div'>
            <h2>Login</h2>
            {error.error_view && <p className="error-line" aria-required>{error.error_view}</p>}
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