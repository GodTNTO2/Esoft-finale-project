import { NavLink } from "react-router-dom";
import { frontendPath } from "../../../shared/path";
import '../css/Bars/NavBar.scss';
import cartShoping from '../assets/cart-shopping-svgrepo-com.svg';
import accIcon from "../assets/user_3334284.png";
import logo from '../assets/logo.jpg';
import { useSelector } from "react-redux";
import { selectCurrentUser, selectIsAuthenticated } from "../store/reducers/authSlicer";
import { selectCartItemsCount } from "../store/reducers/cartSlicer";




const NavBar = () => {

    const isAuth = useSelector(selectIsAuthenticated)
    const user = useSelector(selectCurrentUser)
    const cartItemsCount = useSelector(selectCartItemsCount)

    return (
        <div className="nav-bar">
            <div className="nav-bar-icon">
                <NavLink to={frontendPath.app}>
                <img src={logo} alt="Логотип" />
                </NavLink>
            </div>
            
            <div className="nav-bar-navigation">
                <NavLink 
                    className={({ isActive }) => (isActive ? 'active' : 'static')}
                    to={frontendPath.app} 
                > 
                    Главная
                </NavLink>
                <NavLink
                    className={({ isActive }) => (isActive ? 'active' : 'static')}
                    to={`${frontendPath.cards.flowers}`}
                >
                    Цветы
                </NavLink>
                <NavLink 
                    className={({ isActive }) => (isActive ? 'active' : 'static')}
                    to={`${frontendPath.cards.gifts}`}
                > 
                    Подарки
                </NavLink>
            </div>

            {isAuth ? 
                <div className="nav-bar-right">
                    <div className="cart">
                        <NavLink to={frontendPath.basket}>
                        <img src={cartShoping} alt="Корзина" />
                        {cartItemsCount > 0 && <div className="cart-badge">{cartItemsCount}</div>}
                        </NavLink>
                    </div>
                    <div className="account">
                        <NavLink to={`${frontendPath.account}/${user?.id}`}>
                        <img src={accIcon} alt="Аккаунт" />
                        <div className="user-id">{user?.id}</div>
                        </NavLink>
                    </div>
                </div>
            :
                <div className="nav-bar-auth">
                    <NavLink to={frontendPath.login} className="auth-link">
                        Войти
                    </NavLink>
                    <NavLink to={frontendPath.registration} className="auth-link">
                        Регистрация
                    </NavLink>
                </div>
            }
        </div>
    )
}

export default NavBar