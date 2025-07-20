import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import '../../../css/Pages/AccountPage.css';
import type { AppDispatch, RootState } from '../../../store/store';
import { NavLink, useNavigate } from 'react-router-dom';
import { fetchUserOrders } from '../../../store/reducers/ordersSlicer';
import { logout } from '../../../store/reducers/authSlicer';
import { frontendPath } from '../../../../../shared/path';

const AccountPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const { orders, loading, error } = useSelector((state: RootState) => state.orders);
  const [activeTab, setActiveTab] = React.useState('profile');

  useEffect(() => {
    if (user) {
      dispatch(fetchUserOrders(user.id))
    }
  }, [dispatch, user]);

  const handleLogout = () => {
    dispatch(logout())
    navigate(frontendPath.app)
  }

  if (!user) {
    return (
      <div className="auth-required">
        <h2>Требуется авторизация</h2>
        <p>Пожалуйста, <NavLink to={frontendPath.login}>войдите</NavLink> в свой аккаунт</p>
      </div>
    )
  }

  return (
    <div className="account-page">
      <div className="account-sidebar">
        <div className="user-info">
          <div className="user-avatar">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <h3>{user.name}</h3>
          <p>{user.email || 'Email не указан'}</p>
        </div>

        <nav className="account-nav">
          <button 
            className={activeTab === 'profile' ? 'active' : ''}
            onClick={() => setActiveTab('profile')}
          >
            Профиль
          </button>
          <button 
            className={activeTab === 'orders' ? 'active' : ''}
            onClick={() => setActiveTab('orders')}
          >
            Мои заказы
          </button>
          <button 
            className={activeTab === 'addresses' ? 'active' : ''}
            onClick={() => setActiveTab('addresses')}
          >
            Адреса
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            Выйти
          </button>
        </nav>
      </div>

      <div className="account-content">
        {activeTab === 'profile' && (
          <div className="profile-tab">
            <h2>Личные данные</h2>
            <div className="profile-info">
              <div className="info-row">
                <span>Имя:</span>
                <span>{user.name}</span>
              </div>
              <div className="info-row">
                <span>Телефон:</span>
                <span>{user.phone}</span>
              </div>
              <div className="info-row">
                <span>Email:</span>
                <span>{user.email || 'Не указан'}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="orders-tab">
            <h2>История заказов</h2>
            {loading ? (
              <div className="loading">Загрузка...</div>
            ) : error ? (
              <div className="error">{error}</div>
            ) : orders.length === 0 ? (
              <div className="no-orders">
                <p>У вас пока нет заказов</p>
                <NavLink to={frontendPath.app} className="shop-link">
                  Перейти в магазин
                </NavLink>
              </div>
            ) : (
              <div className="orders-list">
                {orders.map(order => (
                  <div key={order.id} className="order-card">
                    <div className="order-header">
                      <span>Заказ №{order.id}</span>
                      <span className={`status ${order.status}`}>
                        {order.status === 'delivered' ? 'Доставлен' : 
                         order.status === 'processing' ? 'В обработке' : 
                         order.status === 'cancelled' ? 'Отменен' : order.status}
                      </span>
                    </div>
                    <div className="order-details">
                      <div className="order-total">
                        {order.total_amount} ₽
                      </div>
                    </div>
                    <NavLink 
                      to={`${frontendPath.orders}/${order.id}`} 
                      className="order-details-link"
                    >
                      Подробнее
                    </NavLink>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'addresses' && (
          <div className="addresses-tab">
            <h2>Мои адреса</h2>
            <div className="addresses-list">
              <div className="address-card">
                <h3>Основной адрес</h3>
                <p>ул. TEST, д. 123, кв. 45</p>
                <p>г. TEST, 123456</p>
                <div className="address-actions">
                  <button className="edit-btn">Изменить</button>
                  <button className="remove-btn">Удалить</button>
                </div>
              </div>
              <button className="add-address">
                + Добавить новый адрес
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountPage