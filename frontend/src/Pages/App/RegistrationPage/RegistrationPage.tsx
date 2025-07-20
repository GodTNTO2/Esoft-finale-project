import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../../../store/reducers/authSlicer';
import { NavLink, useNavigate } from 'react-router-dom';
import { frontendPath } from '../../../../../shared/path';
import type { AppDispatch, RootState } from '../../../store/store';
import '../../../css/Pages/RegisterPage.css'; 



const RegistrationPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state: RootState) => state.auth);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
        ...formData,
        [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (formData.password !== formData.confirmPassword) {
            alert('Пароли не совпадают')
        return
        }

        try {
            await dispatch(register({
                name: formData.name,
                phone: formData.phone,
                email: formData.email,
                password: formData.password,
            })).unwrap()
            
            navigate(frontendPath.app)
        } catch (err) {
            console.error('Ошибка регистрации:', err)
        }
    }

    return (
        <div className="register-container">
            <div className="register-form-wrapper">
                <div className="register-header">
                    <h2 className="register-title">Создать аккаунт</h2>
                </div>
                    <form className="register-form" onSubmit={handleSubmit}>
                    <input type="hidden" name="remember" value="true" />
                    <div className="input-fields">
                        <div>
                            <label htmlFor="name" className="sr-only">Имя</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                className="register-input first"
                                placeholder="Ваше имя"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="phone" className="sr-only">Телефон</label>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                required
                                className="register-input"
                                placeholder="Номер телефона"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="sr-only">Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                className="register-input"
                                placeholder="Email (необязательно)"
                                value={formData.email}
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
                                className="register-input"
                                placeholder="Пароль"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="sr-only">Подтвердите пароль</label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                className="register-input last"
                                placeholder="Подтвердите пароль"
                                value={formData.confirmPassword}
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
                        {loading ? 'Регистрация...' : 'Зарегистрироваться'}
                        </button>
                    </div>
                    </form>
                    
                    <div className="login-link-container">
                    <p className="login-link-text">
                        Уже есть аккаунт?{' '}
                        <NavLink 
                        to={frontendPath.login} 
                        className="login-link"
                        >
                        Войти
                        </NavLink>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default RegistrationPage