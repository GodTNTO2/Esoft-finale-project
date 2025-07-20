import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createNewProduct, type Product,  } from '../../store/reducers/productsSlicer';
import type { AppDispatch, RootState } from '../../store/store';
import { frontendPath } from '../../../../shared/path';
import '../../css/Pages/AdminCreateProductPage.css';

const AdminCreateProductPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.products);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    remains: '',
    category_name: 'flowers' as 'flowers' | 'gifts',
    is_available: true,
    images: [] as File[],
  });

  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'price' || name === 'remains' ? Number(value) : value,
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFormData({
        ...formData,
        images: [...formData.images, ...files],
      });


      const previews = files.map(file => URL.createObjectURL(file));
      setPreviewImages([...previewImages, ...previews]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData({ ...formData, images: newImages });

    const newPreviews = [...previewImages];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setPreviewImages(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const imagesArr: string[] = []
    formData.images.forEach((image) => (imagesArr.push(image['name'])))


    const formDataToSend: Omit<Product, "product_id"> = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        remains: Number(formData.remains),
        category_name: formData.category_name,
        is_available: formData.is_available,
        images: imagesArr
    }



    try {
      await dispatch(createNewProduct(formDataToSend)).unwrap();
    console.log(formData.images.forEach((image) => (console.log(image['name']))))
      navigate(frontendPath.app);
    } catch (err) {
      console.error('Ошибка создания товара:', err);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        <h1>Создать новый товар</h1>
        
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-group">
            <label htmlFor="name">Название товара</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Описание</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Цена (₽)</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="remains">Количество в наличии</label>
              <input
                type="number"
                id="remains"
                name="remains"
                value={formData.remains}
                onChange={handleChange}
                min="0"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category_name">Категория</label>
              <select
                id="category_name"
                name="category_name"
                value={formData.category_name}
                onChange={handleChange}
                required
              >
                <option value="flowers">Цветы</option>
                <option value="gifts">Подарки</option>
              </select>
            </div>

            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                id="is_available"
                name="is_available"
                checked={formData.is_available}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="is_available">Доступен для заказа</label>
            </div>
          </div>

          <div className="form-group">
            <label>Изображения товара</label>
            <div className="image-upload">
              <label htmlFor="images" className="upload-button">
                Выберите файлы
                <input
                  type="file"
                  id="images"
                  name="images"
                  onChange={handleImageChange}
                  multiple
                  accept="image/*"
                  style={{ display: 'none' }}
                />
              </label>
              <span className="file-info">
                {formData.images.length > 0 
                  ? `Выбрано ${formData.images.length} файлов` 
                  : 'Файлы не выбраны'}
              </span>
            </div>

            {previewImages.length > 0 && (
              <div className="image-previews">
                {previewImages.map((preview, index) => (
                  <div key={index} className="image-preview">
                    <img src={preview} alt={`Preview ${index}`} />
                    <button 
                      type="button" 
                      className="remove-image"
                      onClick={() => removeImage(index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-actions">
            <button 
              type="submit" 
              className="submit-button"
              disabled={loading}
            >
              {loading ? 'Создание...' : 'Создать товар'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCreateProductPage;