import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../store/store';
import { fetchProductsWithPagination } from '../../../store/reducers/productsSlicer';
import ProductCard from '../../../Models/ProductCard';
import Pagination from '../../../Models/Pagination';

import '../../../css/Pages/MainPage.css';



const MainPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { 
    products,  
    loading, 
    error 
  } = useSelector((state: RootState) => state.products?.withPagination || {
    products: [],
    pagination: { total: 0, page: 1, limit: 8 },
    loading: false,
    error: null
  })
  const total = useSelector((state: RootState) => state.products?.withPagination.total)
  const limit = useSelector((state: RootState) => state.products?.withPagination.limit)
  const page = useSelector((state: RootState) => state.products?.withPagination.page)
  const pagination = {total, limit, page}

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  useEffect(() => {
    dispatch(fetchProductsWithPagination({ page: currentPage, limit: itemsPerPage }))
  }, [dispatch, currentPage, itemsPerPage])

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  }

  if (loading && products.length === 0) {
    return <div className="loading-spinner">Загрузка...</div>
  }

  if (error) {
    return <div className="error-message">Ошибка: {error}</div>
  }

  return (
    <div className="home-page">
      <div className="products-header">
        <h1>Наши товары</h1>
        {pagination.total > 0 && (
          <div className="products-count">Найдено товаров: {pagination.total}</div>
        )}
      </div>

      {products.length > 0 ? (
        <>
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard key={product.product_id} product={product} />
            ))}
          </div>

          {pagination.total > itemsPerPage && (
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(pagination.total / itemsPerPage)}
              onPageChange={handlePageChange}
            />
          )}
        </>
      ) : (
        !loading && <div className="no-products">Товары не найдены</div>
      )}
    </div>
  )
}

export default MainPage