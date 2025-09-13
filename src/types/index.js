// Типы данных для приложения (JSDoc комментарии для TypeScript-подобной типизации)

/**
 * @typedef {Object} User
 * @property {string} id - Уникальный идентификатор пользователя
 * @property {string} client_code - Код клиента
 * @property {string} name - Имя пользователя
 * @property {string} email - Email адрес
 * @property {string} status - Статус пользователя (individual, business, vip, premium)
 * @property {string} city - Город
 * @property {number} age - Возраст
 * @property {string} created_at - Дата создания
 * @property {string} updated_at - Дата обновления
 */

/**
 * @typedef {Object} Profile
 * @property {string} name - Имя
 * @property {number} age - Возраст
 * @property {string} status - Статус
 * @property {number} average_balance - Средний баланс
 * @property {string} city - Город
 */

/**
 * @typedef {Object} Balance
 * @property {number} current_balance - Текущий баланс
 * @property {string} currency - Валюта
 * @property {string} last_updated - Последнее обновление
 */

/**
 * @typedef {Object} Transaction
 * @property {string} id - Уникальный идентификатор
 * @property {number} amount - Сумма транзакции
 * @property {string} description - Описание
 * @property {string} category - Категория
 * @property {string} date - Дата транзакции
 * @property {string} status - Статус (completed, pending, failed, cancelled)
 * @property {string} reference - Номер операции
 * @property {string} created_at - Дата создания
 */

/**
 * @typedef {Object} Transfer
 * @property {string} id - Уникальный идентификатор
 * @property {string} type - Тип перевода (outgoing, incoming, internal, external)
 * @property {number} amount - Сумма перевода
 * @property {string} recipient - Получатель
 * @property {string} recipient_account - Счет получателя
 * @property {string} description - Описание
 * @property {string} date - Дата перевода
 * @property {string} status - Статус (completed, pending, failed, cancelled)
 * @property {string} reference - Номер операции
 * @property {string} created_at - Дата создания
 */

/**
 * @typedef {Object} PushNotification
 * @property {string} id - Уникальный идентификатор
 * @property {string} message - Текст уведомления
 * @property {string} type - Тип уведомления
 * @property {string} created_at - Дата создания
 * @property {boolean} read - Прочитано ли уведомление
 */

/**
 * @typedef {Object} Recommendation
 * @property {string} product_name - Название продукта
 * @property {string} push_text - Текст рекомендации
 * @property {string} category - Категория продукта
 * @property {number} priority - Приоритет рекомендации
 */

/**
 * @typedef {Object} ApiResponse
 * @property {boolean} success - Успешность запроса
 * @property {*} data - Данные ответа
 * @property {string} message - Сообщение
 * @property {string} error - Ошибка
 */

/**
 * @typedef {Object} AuthResponse
 * @property {string} token - JWT токен
 * @property {User} user - Данные пользователя
 * @property {string} expires_in - Время жизни токена
 */

/**
 * @typedef {Object} LoginCredentials
 * @property {string} client_code - Код клиента
 * @property {string} password - Пароль
 */

/**
 * @typedef {Object} RegisterData
 * @property {string} client_code - Код клиента
 * @property {string} password - Пароль
 * @property {string} name - Имя
 * @property {string} status - Статус
 * @property {string} city - Город
 */

/**
 * @typedef {Object} TransactionFilters
 * @property {string} search - Поиск по описанию
 * @property {string} category - Категория
 * @property {string} dateFrom - Дата от
 * @property {string} dateTo - Дата до
 * @property {number} amountMin - Минимальная сумма
 * @property {number} amountMax - Максимальная сумма
 * @property {number} limit - Лимит записей
 * @property {number} offset - Смещение
 */

/**
 * @typedef {Object} TransferFilters
 * @property {string} search - Поиск по получателю
 * @property {string} type - Тип перевода
 * @property {string} dateFrom - Дата от
 * @property {string} dateTo - Дата до
 * @property {number} amountMin - Минимальная сумма
 * @property {number} amountMax - Максимальная сумма
 * @property {number} limit - Лимит записей
 * @property {number} offset - Смещение
 */

/**
 * @typedef {Object} NewTransaction
 * @property {number} amount - Сумма
 * @property {string} description - Описание
 * @property {string} category - Категория
 * @property {string} date - Дата
 */

/**
 * @typedef {Object} NewTransfer
 * @property {string} type - Тип перевода
 * @property {number} amount - Сумма
 * @property {string} recipient - Получатель
 * @property {string} recipient_account - Счет получателя
 * @property {string} description - Описание
 * @property {string} date - Дата
 */

/**
 * @typedef {Object} NotificationSettings
 * @property {boolean} push - Push-уведомления
 * @property {boolean} email - Email-уведомления
 * @property {boolean} sms - SMS-уведомления
 * @property {boolean} security - Уведомления безопасности
 */

/**
 * @typedef {Object} Theme
 * @property {Object} colors - Цвета
 * @property {Object} typography - Типографика
 * @property {Object} spacing - Отступы
 * @property {Object} borderRadius - Радиусы скругления
 * @property {Object} shadows - Тени
 * @property {Object} breakpoints - Точки останова
 */

/**
 * @typedef {Object} ButtonProps
 * @property {string} variant - Вариант кнопки (primary, secondary, outline, ghost, danger, success)
 * @property {string} size - Размер (sm, md, lg)
 * @property {boolean} fullWidth - Полная ширина
 * @property {boolean} loading - Состояние загрузки
 * @property {boolean} disabled - Отключена
 * @property {string} type - Тип кнопки
 * @property {Function} onClick - Обработчик клика
 * @property {*} children - Дочерние элементы
 */

/**
 * @typedef {Object} InputProps
 * @property {string} label - Метка поля
 * @property {string} name - Имя поля
 * @property {string} type - Тип поля
 * @property {string} value - Значение
 * @property {Function} onChange - Обработчик изменения
 * @property {string} placeholder - Плейсхолдер
 * @property {string} error - Ошибка
 * @property {string} helpText - Текст помощи
 * @property {boolean} required - Обязательное поле
 * @property {string} size - Размер (sm, md, lg)
 * @property {boolean} disabled - Отключено
 */

/**
 * @typedef {Object} CardProps
 * @property {boolean} hoverable - Интерактивная карточка
 * @property {string} padding - Размер отступов
 * @property {*} children - Дочерние элементы
 */

/**
 * @typedef {Object} TableProps
 * @property {Array} data - Данные таблицы
 * @property {Array} columns - Колонки таблицы
 * @property {Function} onRowClick - Обработчик клика по строке
 * @property {boolean} loading - Состояние загрузки
 * @property {boolean} sortable - Возможность сортировки
 */

/**
 * @typedef {Object} ModalProps
 * @property {boolean} isOpen - Открыто ли модальное окно
 * @property {Function} onClose - Обработчик закрытия
 * @property {string} title - Заголовок
 * @property {string} subtitle - Подзаголовок
 * @property {string} maxWidth - Максимальная ширина
 * @property {boolean} showCloseButton - Показывать кнопку закрытия
 * @property {*} children - Дочерние элементы
 */

/**
 * @typedef {Object} ToastProps
 * @property {string} id - Уникальный идентификатор
 * @property {string} type - Тип уведомления (success, error, warning, info)
 * @property {string} title - Заголовок
 * @property {string} message - Сообщение
 * @property {number} duration - Длительность показа (мс)
 * @property {Function} onClose - Обработчик закрытия
 */

// Экспорт типов для использования в JSDoc
export const Types = {
  User: 'User',
  Profile: 'Profile',
  Balance: 'Balance',
  Transaction: 'Transaction',
  Transfer: 'Transfer',
  PushNotification: 'PushNotification',
  Recommendation: 'Recommendation',
  ApiResponse: 'ApiResponse',
  AuthResponse: 'AuthResponse',
  LoginCredentials: 'LoginCredentials',
  RegisterData: 'RegisterData',
  TransactionFilters: 'TransactionFilters',
  TransferFilters: 'TransferFilters',
  NewTransaction: 'NewTransaction',
  NewTransfer: 'NewTransfer',
  NotificationSettings: 'NotificationSettings',
  Theme: 'Theme',
  ButtonProps: 'ButtonProps',
  InputProps: 'InputProps',
  CardProps: 'CardProps',
  TableProps: 'TableProps',
  ModalProps: 'ModalProps',
  ToastProps: 'ToastProps'
};

export default Types;
