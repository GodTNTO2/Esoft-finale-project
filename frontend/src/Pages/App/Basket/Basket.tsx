
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../store/store';
import { NavLink, useNavigate } from 'react-router-dom';
import { addCartItem, clearCart, removeCartItem, selectCartItems, selectCartItemsCount, selectCartTotal } from '../../../store/reducers/cartSlicer';
import { frontendPath } from '../../../../../shared/path';
import '../../../css/Pages/CartPage.css';


const Basket = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const itemsCount = useSelector(selectCartItemsCount);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity > 0) {
        items.map((i) => {
            console.log(i.product_id)
        })
        dispatch(addCartItem({ productId, quantity: newQuantity }))
        console.log(newQuantity)
    } else {
      dispatch(removeCartItem(productId))
      console.log(newQuantity)
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate(frontendPath.login);
      return;
    }
    navigate(frontendPath.app);
  };

  if (itemsCount === 0) {
    return (
      <div className="empty-cart">
        <h2>Ваша корзина пуста</h2>
        <NavLink to={frontendPath.app} className="continue-shopping">
          Продолжить покупки
        </NavLink>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1 className="cart-title">Корзина ({itemsCount})</h1>
      
      <div className="cart-container">
        <div className="cart-items">
          {items.map((item) => (
            <div key={item.product_id} className="cart-item">
              <div className="item-image">
                <img 
                  src={item.image} 
                  alt={item.image} 
                />
              </div>
              
              <div className="item-details">
                <h3 className="item-name">{item.name}</h3>
                <div className="item-price">{item.price} ₽</div>
              </div>
              
              <div className="item-quantity">
                <button 
                  onClick={() => handleQuantityChange(item.product_id, item.quantity - 1)}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button 
                  onClick={() => handleQuantityChange(item.product_id, item.quantity + 1)}
                >
                  +
                </button>
              </div>
              
              <div className="item-total">{item.price * item.quantity} ₽</div>
              
              <button 
                className="remove-item"
                onClick={() => dispatch(removeCartItem(item.product_id))}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        
        <div className="cart-summary">
          <h3>Итого</h3>
          <div className="summary-row">
            <span>Товары ({itemsCount})</span>
            <span>{total} ₽</span>
          </div>
          <div className="summary-row">
            <span>Доставка</span>
            <span>Бесплатно</span>
          </div>
          <div className="summary-row total">
            <span>Общая сумма</span>
            <span>{total} ₽</span>
          </div>
          
          <button 
            className="checkout-btn"
            onClick={handleCheckout}
          >
            Оформить заказ
          </button>
          
          <button 
            className="clear-cart"
            onClick={() => dispatch(clearCart())}
          >
            Очистить корзину
          </button>
          
          <NavLink to={frontendPath.app} className="continue-shopping">
            Продолжить покупки
          </NavLink>
        </div>
      </div>
    </div>
  )
}

export default Basket

