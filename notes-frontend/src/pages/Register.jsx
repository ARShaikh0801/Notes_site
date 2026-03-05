import { useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import api from '../api/axios'

function Register(){

    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/auth/register/', formData);
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.username);
            navigate('/notes');
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong');
        }
    };
    
    return(<>
        <div className="register-div">
            <h2>Register</h2>
            {error && <p className="error-line">{error}</p>}
            <input
                name="username"
                placeholder="Username"
                onChange={handleChange}
            />
            <input
                name="email"
                type="email"
                placeholder="Email"
                onChange={handleChange}
            />
            <input
                name="password"
                type="password"
                placeholder="Password"
                onChange={handleChange}
            />
            <button onClick={handleSubmit}>Register</button>
            <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
    </>);
}

export default Register