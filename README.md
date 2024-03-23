# Homework 2: Node Rest API

Write the controllers taking into account the following requirements:

The REST API must support such routes.

- GET /api/contacts

 Викликає функцію-сервіс listContacts для роботи з json-файлом contacts.json

 Повертає масив всіх контактів в json-форматі зі статусом 200


- GET /api/contacts/:id

 Викликає функцію-сервіс getContactById для роботи з json-файлом contacts.json

 Якщо контакт за id знайдений, повертає об'єкт контакту в json-форматі зі статусом 200

 Якщо контакт за id не знайдено, повертає json формату {"message": "Not found"} зі статусом 404


- DELETE /api/contacts/:id

 Викликає функцію-сервіс removeContact для роботи з json-файлом contacts.json

 Якщо контакт за id знайдений і видалений, повертає об'єкт видаленого контакту в json-форматі зі статусом 200

 Якщо контакт за id не знайдено, повертає json формату {"message": "Not found"} зі статусом 404


- POST /api/contacts

 Отримує body в json-форматі з полями {name, email, phone}. Усі поля є обов'язковими - для валідації створи у файлі contactsSchemas.js (знаходиться у папці schemas) схему з використаням пакета joi

 Якщо в body немає якихось обов'язкових полів (або передані поля мають не валідне значення), повертає json формату {"message": error.message} (де error.message - змістовне повідомлення з суттю помилки) зі статусом 400

 Якщо body валідне, викликає функцію-сервіс addContact для роботи з json-файлом contacts.json, з передачею їй даних з body

 За результатом роботи функції повертає новостворений об'єкт з полями {id, name, email, phone} і статусом 201


- PUT /api/contacts/:id

 Отримує body в json-форматі з будь-яким набором оновлених полів (name, email, phone) (всі поля вимагати в боді як обов'язкові не потрібно: якщо якесь із полів не передане, воно має зберегтись у контакта зі значенням, яке було до оновлення)

 Якщо запит на оновлення здійснено без передачі в body хоча б одного поля, повертає json формату {"message": "Body must have at least one field"} зі статусом 400.

 Передані в боді поля мають бути провалідовані - для валідації створи у файлі contactsSchemas.js (знаходиться у папці schemas) схему з використанням пакета joi. Якщо передані поля мають не валідне значення, повертає json формату {"message": error.message} (де error.message - змістовне повідомлення з суттю помилки) зі статусом 400

 Якщо з body все добре, викликає функцію-сервіс updateContact, яку слід створити в файлі contactsServices.js (знаходиться в папці services). Ця функція має приймати id контакта, що підлягає оновленню, та дані з body, і оновити контакт у json-файлі contacts.json

 За результатом роботи функції повертає оновлений об'єкт контакту зі статусом 200.

 Якщо контакт за id не знайдено, повертає json формату {"message": "Not found"} зі статусом 404.


# Homework 3: MongoDB

Step 1:
 Напиши код для створення підключення до MongoDB за допомогою Mongoose.

 При успішному підключенні виведи в консоль повідомлення "Database connection successful".

 Обов'язково обробив помилку підключення. Виведи в консоль повідомлення помилки і заверши процес використовуючи process.exit(1).

 У функціях обробки запитів заміни код CRUD-операцій над контактами з файлу, на Mongoose-методи для роботи з колекцією контактів в базі даних.

 Схема моделі для колекції contacts:
    {
        name: {
            type: String,
            required: [true, 'Set name for contact'],
        },
        email: {
            type: String,
        },
        phone: {
            type: String,
        },
        favorite: {
            type: Boolean,
            default: false,
        },
    }


Step 2:

 У нас з'явилося в контактах додаткове поле статусу favorite, яке приймає логічне значення true або false. Воно відповідає за те, що в обраному чи ні знаходиться зазначений контакт. Потрібно реалізувати для оновлення статусу контакту новий роутер

- PATCH /api/contacts/:contactId/favorite

 Отримує параметр contactId

 Отримує body в json-форматі c оновленням поля favorite

 Якщо з body все добре, викликає функцію updateStatusContact (contactId, body) (напиши її) для поновлення контакту в базі

 За результатом роботи функції повертає оновлений об'єкт контакту і статусом 200. В іншому випадку, повертає json з ключем {" message ":" Not found "} і статусом 404.


# Homework 4: JWT

Step 1:

 У коді створи схему і модель користувача для колекції users.
    {
        password: {
            type: String,
            required: [true, 'Password is required'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
        },
        subscription: {
            type: String,
            enum: ["starter", "pro", "business"],
            default: "starter"
        },
        token: {
            type: String,
            default: null,
        },
    }

 Змініть схему контактів, щоб кожен користувач бачив тільки свої контакти. Для цього в схемі контактів додайте властивість
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    }

 Примітка: 'user' - назва колекції, у якій зберігаються користувачі


Step 2:

 - Регістрація
 
 Створити ендпоінт /users/register 

 Зробити валідацію всіх обов'язкових полів (email і password). При помилці валідації повернути Помилку валідації.

 У разі успішної валідації в моделі User створити користувача за даними, які пройшли валідацію. Для засолювання паролів використовуй bcrypt або bcryptjs

 Якщо пошта вже використовується кимось іншим, повернути Помилку Conflict.

 В іншому випадку повернути Успішна відповідь.

    * Registration request

    POST /users/register
    Content-Type: application/json
    RequestBody: {
        "email": "example@example.com",
        "password": "examplepassword"
    }


    * Registration validation error

    Status: 400 Bad Request
    Content-Type: application/json
    ResponseBody: <Помилка від Joi або іншої бібліотеки валідації>


    * Registration conflict error

    Status: 409 Conflict
    Content-Type: application/json
    ResponseBody: {
    "message": "Email in use"
    }


    * Registration success response

    Status: 201 Created
    Content-Type: application/json
    ResponseBody: {
    "user": {
        "email": "example@example.com",
        "subscription": "starter"
    }
    }


 - Логін

 Створити ендпоінт /users/login

 В моделі User знайти користувача за email.

 Зробити валідацію всіх обов'язкових полів (email і password). При помилці валідації повернути Помилку валідації.

 В іншому випадку, порівняти пароль для знайденого користувача, якщо паролі збігаються створити токен, зберегти в поточному юзера і повернути Успішна відповідь.
 Якщо пароль або імейл невірний, повернути Помилку Unauthorized.


    * Login request

    POST /users/login
    Content-Type: application/json
    RequestBody: {
        "email": "example@example.com",
        "password": "examplepassword"
    }


    * Login validation error

    Status: 400 Bad Request
    Content-Type: application/json
    ResponseBody: <Помилка від Joi або іншої бібліотеки валідації>


    * Login success response

    Status: 200 OK
    Content-Type: application/json
    ResponseBody: {
    "token": "exampletoken",
    "user": {
        "email": "example@example.com",
        "subscription": "starter"
    }
    }


    * Login auth error

    Status: 401 Unauthorized
    ResponseBody: {
    "message": "Email or password is wrong"
    }


Step 3:
 
 - Перевірка токена
 
 Створи мідлвар для перевірки токена і додай його до всіх раутів, які повинні бути захищені.
 
 Мідлвар бере токен з заголовків Authorization, перевіряє токен на валідність.
 
 У випадку помилки повернути Помилку Unauthorized.
 
 Якщо валідація пройшла успішно, отримати з токена id користувача. Знайти користувача в базі даних з цим id.
 
 Якщо користувач існує і токен збігається з тим, що знаходиться в базі, записати його дані в req.user і викликати next().
 
 Якщо користувача з таким id НЕ існує або токени не збігаються, повернути Помилку Unauthorized


    * Middleware unauthorized error

    Status: 401 Unauthorized
    Content-Type: application/json
    ResponseBody: {
    "message": "Not authorized"
    }


Step 4:

 - Логаут

 Створити ендпоінт /users/logout

 Додай в маршрут мідлвар перевірки токена.

 У моделі User знайти користувача за _id.

 Якщо користувача не існує повернути Помилку Unauthorized.

 В іншому випадку, видалити токен у поточного юзера і повернути Успішна відповідь.


    * Logout request

    POST /users/logout
    Authorization: "Bearer {{token}}"


    * Logout unauthorized error

    Status: 401 Unauthorized
    Content-Type: application/json
    ResponseBody: {
        "message": "Not authorized"
    }


    * Logout success response

    Status: 204 No Content


Step 5:

 Поточний користувач - отримати дані юзера по токені

 Створити ендпоінт /users/current

 Додай в раут мідлвар перевірки токена.

 Якщо користувача не існує повернути Помилку Unauthorized
 В іншому випадку повернути Успішну відповідь

    * Current user request

    GET /users/current
    Authorization: "Bearer {{token}}"


    * Current user unauthorized error

    Status: 401 Unauthorized
    Content-Type: application/json
    ResponseBody: {
        "message": "Not authorized"
    }


    * Current user success response

    Status: 200 OK
    Content-Type: application/json
    ResponseBody: {
        "email": "example@example.com",
        "subscription": "starter"
    }


 - Додаткове завдання - необов'язкове

 Зробити пагінацію для колекції контактів (GET /contacts?page=1&limit=20).

 Зробити фільтрацію контактів по полю обраного (GET /contacts?favorite=true)

 Оновлення підписки (subscription) користувача через ендпоінт PATCH /users. Підписка повинна мати одне з наступних значень ['starter', 'pro', 'business'].


# Homework 5: Work with files

Step 1

Створи папку public для роздачі статики. У цій папці зроби папку avatars.

Налаштуй Express на роздачу статичних файлів з папки public.

Поклади будь-яке зображення в папку public/avatars і перевір, що роздача статики працює.

При переході по такому URL браузер відобразить зображення. Shell http://locahost:<порт>/avatars/<ім'я файлу з розширенням> 


Step 2

У схему користувача додай нову властивість avatarURL для зберігання зображення.

    {
    ...
    avatarURL: String,
    ...
    }

Використовуй пакет gravatar для того, щоб при реєстрації нового користувача відразу згенерувати йому аватар по його email.


Step 3

При реєстрації користувача:

• Створюй посилання на аватарку користувача за допомогою gravatar

• Отриманий URL збережи в поле avatarURL під час створення користувача


Step 4

Додай можливість поновлення аватарки, створивши ендпоінт /users/avatars і використовуючи метод PATCH.

 Запит
PATCH /users/avatars
Content-Type: multipart/form-data
Authorization: "Bearer {{token}}"
RequestBody: завантажений файл

 Успішна відповідь
Status: 200 OK
Content-Type: application/json
ResponseBody: {
  "avatarURL": "тут буде посилання на зображення"
}

 Неуспішна відповідь
Status: 401 Unauthorized
Content-Type: application/json
ResponseBody: {
  "message": "Not authorized"
}

 Створи папку tmp в корені проекту і зберігай в неї завантажену аватарку.

 Оброби аватарку пакетом jimp і постав для неї розміри 250 на 250

 Перенеси аватарку користувача з папки tmp в папку public/avatars і дай їй унікальне ім'я для конкретного користувача.

 Отриманий URL /avatars/<ім'я файлу з розширенням> та збережи в поле avatarURL користувача



Додаткове завдання - необов'язкове

Написати unit-тести для контролера входу (логін)

За допомогою Jest

 відповідь повина мати статус-код 200
 у відповіді повинен повертатися токен
 у відповіді повинен повертатися об'єкт user з 2 полями email и subscription з типом даних String