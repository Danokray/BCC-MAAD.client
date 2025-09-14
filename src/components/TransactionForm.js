import React, { useState } from 'react';

const TransactionForm = ({ onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    currency: 'KZT',
    clientCode: ''
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.category.trim()) {
      newErrors.category = 'Категория обязательна';
    }

    if (!formData.amount.trim()) {
      newErrors.amount = 'Сумма обязательна';
    } else if (isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Сумма должна быть положительным числом';
    }

    if (!formData.currency.trim()) {
      newErrors.currency = 'Валюта обязательна';
    }

    if (!formData.clientCode.trim()) {
      newErrors.clientCode = 'Код клиента обязателен';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
      setFormData({
        category: '',
        amount: '',
        currency: 'KZT',
        clientCode: ''
      });
      setErrors({});
    } catch (error) {
      console.error('Ошибка при отправке формы:', error);
    }
  };

  const categories = [
    { value: 'food', label: 'Питание', icon: '🍽️' },
    { value: 'transport', label: 'Транспорт', icon: '🚗' },
    { value: 'shopping', label: 'Покупки', icon: '🛍️' },
    { value: 'entertainment', label: 'Развлечения', icon: '🎬' },
    { value: 'utilities', label: 'Коммунальные услуги', icon: '🏠' },
    { value: 'healthcare', label: 'Здравоохранение', icon: '🏥' },
    { value: 'education', label: 'Образование', icon: '📚' },
    { value: 'salary', label: 'Зарплата', icon: '💰' },
    { value: 'other', label: 'Другое', icon: '📄' }
  ];

  const currencies = [
    { value: 'KZT', label: 'KZT (Тенге)', flag: '🇰🇿' },
    { value: 'USD', label: 'USD (Доллар)', flag: '🇺🇸' },
    { value: 'EUR', label: 'EUR (Евро)', flag: '🇪🇺' },
    { value: 'RUB', label: 'RUB (Рубль)', flag: '🇷🇺' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Category */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
          Категория *
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm ${
            errors.category ? 'border-red-300 bg-red-50' : 'border-gray-300'
          }`}
        >
          <option value="">Выберите категорию</option>
          {categories.map(category => (
            <option key={category.value} value={category.value}>
              {category.icon} {category.label}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="mt-1 text-xs text-red-600">{errors.category}</p>
        )}
      </div>

      {/* Amount */}
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
          Сумма *
        </label>
        <input
          type="number"
          id="amount"
          name="amount"
          value={formData.amount}
          onChange={handleInputChange}
          placeholder="0.00"
          step="0.01"
          min="0"
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm ${
            errors.amount ? 'border-red-300 bg-red-50' : 'border-gray-300'
          }`}
        />
        {errors.amount && (
          <p className="mt-1 text-xs text-red-600">{errors.amount}</p>
        )}
      </div>

      {/* Currency */}
      <div>
        <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
          Валюта *
        </label>
        <select
          id="currency"
          name="currency"
          value={formData.currency}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm ${
            errors.currency ? 'border-red-300 bg-red-50' : 'border-gray-300'
          }`}
        >
          {currencies.map(currency => (
            <option key={currency.value} value={currency.value}>
              {currency.flag} {currency.label}
            </option>
          ))}
        </select>
        {errors.currency && (
          <p className="mt-1 text-xs text-red-600">{errors.currency}</p>
        )}
      </div>

      {/* Client Code */}
      <div>
        <label htmlFor="clientCode" className="block text-sm font-medium text-gray-700 mb-1">
          Код клиента *
        </label>
        <input
          type="text"
          id="clientCode"
          name="clientCode"
          value={formData.clientCode}
          onChange={handleInputChange}
          placeholder="Введите код клиента"
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm ${
            errors.clientCode ? 'border-red-300 bg-red-50' : 'border-gray-300'
          }`}
        />
        {errors.clientCode && (
          <p className="mt-1 text-xs text-red-600">{errors.clientCode}</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Добавление...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Добавить транзакцию
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;