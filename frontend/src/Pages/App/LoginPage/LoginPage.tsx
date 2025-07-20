import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../../../css/Pages/LoginPage.css';
import { frontendPath } from '../../../../../shared/path';
import type { AppDispatch, RootState } from '../../../store/store';
import { login, logout } from '../../../store/reducers/authSlicer';



const LoginPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state: RootState) => state.auth);

    const [formData, setFormData] = useState({
        phone: '',
        password: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
        ...formData,
        [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            await dispatch(login({
                phone: formData.phone,
                password: formData.password,
            })).unwrap();
            
            navigate(frontendPath.app)
        } catch (err) {
        console.error('Ошибка авторизации:', err);
        }
    };

    return (
        <div className="login-container">
            <div className="login-form-wrapper">
                <div className="login-header">
                    <h2 className="login-title">Вход в аккаунт</h2>
                </div>
                    <form className="login-form" onSubmit={handleSubmit}>
                    <div className="input-fields">
                        <div>
                        <label htmlFor="phone" className="sr-only">Телефон</label>
                        <input
                            id="phone"
                            name="phone"
                            type="tel"
                            required
                            className="login-input first"
                            placeholder="Номер телефона"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="sr-only">Пароль</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="login-input last"
                            placeholder="Пароль"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                {error && (
                    <div className="error-message">
                    {error}
                    </div>
                )}

                <div>
                    <button
                    type="submit"
                    disabled={loading}
                    className={`submit-button ${loading ? 'loading' : ''}`}
                    >
                    {loading ? 'Вход...' : 'Войти'}
                    </button>
                </div>
                </form>
                
                <div className="register-link-container">
                    <p className="register-link-text">
                        Нет аккаунта?{' '}
                        <Link 
                        to={frontendPath.registration} 
                        className="register-link"
                        >
                        Зарегистрироваться
                        </Link>
                    </p>
                </div>
            </div>
            <button onClick={async() => {
                await dispatch(logout())
            }}></button>
        </div>
    )
}

export default LoginPage