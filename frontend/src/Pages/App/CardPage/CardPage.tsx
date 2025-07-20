import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import '../../../css/Pages/ProductPage.css';
import type { AppDispatch, RootState } from '../../../store/store';
import { fetchProductById } from '../../../store/reducers/productsSlicer';
import { frontendPath } from '../../../../../shared/path';
import { addCartItem } from '../../../store/reducers/cartSlicer';

const CardPage = () => {
    const { id } = useParams<{ id: string }>()
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()
    
    const product = useSelector((state: RootState) => state.products.currentProduct)
    const loading = useSelector((state: RootState) => state.products.loading)
    const error = useSelector((state: RootState) => state.products.error)
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)
    const [quantity, setQuantity] = React.useState(1)

    useEffect(() => {
        if (id) {
        dispatch(fetchProductById(Number(id)));
        }
    }, [dispatch, id]);

    const handleAddToCart = () => {
        if (!isAuthenticated) {
            navigate(frontendPath.login);
            return;
        }
        
        if (product) {
            dispatch(addCartItem({ 
                productId: product.product_id, 
                quantity 
            }));
        }
    };

    if (loading) {
        return <div className="loading-spinner">Загрузка...</div>
    }

  if (error) {
    return <div className="error-message">Ошибка: {error}</div>
  }

  if (!product) {
    return <div className="error-message">Товара нет {error}</div>
  }

  return (
    <div className="product-page">
      <div className="product-container">
        <div className="product-gallery">
          {product.images.length > 0 ? (
            <>
              <div className="main-image">
                <img 
                  src={product.images[0]} 
                  alt={product.name} 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                  }}
                />
              </div>
              <div className="thumbnails">
                {product.images.slice(0, 4).map((image, index) => (
                  <div 
                    key={index} 
                    className="thumbnail"
                    onClick={() => {
                      // Логика смены основного изображения
                    }}
                  >
                    <img 
                      src={image} 
                      alt={`${product.name} ${index + 1}`} 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                      }}
                    />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="no-image">
              <img src="/images/placeholder.jpg" alt="Нет изображения" />
            </div>
          )}
        </div>

        <div className="product-details">
          <h1 className="product-title">{product.name}</h1>
          
          <div className="product-meta">
            <span className="product-id">Артикул: {product.product_id}</span>
            <span className={`product-status ${product.is_available ? 'in-stock' : 'out-of-stock'}`}>
              {product.is_available ? 'В наличии' : 'Нет в наличии'}
            </span>
            {product.remains > 0 && (
              <span className="product-remains">Остаток: {product.remains} шт.</span>
            )}
          </div>

          <div className="product-price">
            {product.price} ₽
          </div>

          <div className="product-description">
            <h3>Описание</h3>
            <p>{product.description || 'Описание отсутствует'}</p>
          </div>

          {product.is_available && (
            <div className="product-actions">
              <div className="quantity-selector">
                <button 
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span>{quantity}</span>
                <button 
                  onClick={() => setQuantity(prev => prev + 1)}
                  disabled={product.remains > 0 && quantity >= product.remains}
                >
                  +
                </button>
              </div>
              <button 
                className="add-to-cart-btn"
                onClick={handleAddToCart}
              >
                Добавить в корзину
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Блок похожих товаров можно добавить позже */}
    </div>
  );
};

export default CardPage;