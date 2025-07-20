import type { Product } from '../store/reducers/productsSlicer';
import { NavLink } from 'react-router-dom';
import { frontendPath } from '../../../shared/path';
import '../css/Models/ProductCard.css';


const ProductCard = ({ product }: { product: Product }) => {

    return (
        <div className="product-card">
            <NavLink to={`${frontendPath.cards.all}/${product.product_id}`} className="product-link">
                    <div className="product-image-container">
                        {product.images.length > 0 ? (
                            <img 
                            src={`./..${product.images[0]}`} 
                            alt={product.name} 
                            className="product-image"
                            />
                        ) : (
                            <div className="image-placeholder">Нет изображения</div>
                        )}
                        {!product.is_available && (
                            <div className="out-of-stock">Нет в наличии</div>
                        )}
                    </div>
                    <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <div className="product-price">{product.price} ₽</div>
                        {product.remains > 0 && (
                            <div className="product-stock">Осталось: {product.remains} шт.</div>
                        )}
                </div>
            </NavLink>
        </div>
    )
}

export default ProductCard