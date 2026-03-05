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
            if(data.token) localStorage.setItem('token', data.token);
            if(data.username) localStorage.setItem('username', data.username);
            navigate('/notes');
        } catch (err) {
            if(err.response?.data?.error_view){
                setError({error_view: err.response?.data?.error_view})
            }
            else{
                setError(err.response?.data || {});
            }
        }
    };
    
    return(<>
        <div className="register-div">
            <h2>Register</h2>
            {error.error_view && <p className="error-line" aria-required>{error.error_view}</p>}
            {error.username && <p className="error-line" aria-required>Username: {error.username[0]}</p>}
            {error.email && <p className="error-line" aria-required>Email: {error.email[0]}</p>}
            {error.password && <p className="error-line" aria-required>Password: {error.password[0]}</p>}
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