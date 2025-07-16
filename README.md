Для запуска проекта необходимо 
git clone https://github.com/zeni2492/SimpleApi
затем
npm i
Затем нужно создать и заполнить .env
PORT=Порт на котором будет работать 
JWTSECRET=Фраза для токена
DB_HOST= хост для базы данных
DB_USER= название юзера базы данных
DB_PASSWORD= пароль от базы данных
DB_NAME=название базы данных
DB_PORT=Порт от базы данных(5432)
 
ендпоинты
POST /api/reg
{
    "email": string
    "password": string
    "dateOfBirth": string | date
    "fullName": string
    "regAdmin" : boolean (true для регистрации админа false для регистрации юзера)
}

POST /api/log 
{
    "email": string,
    "password": string
}

для этих апи нужен Bearer token 

POST /api/getusers

POST /api/getuser
{
    "ID" : UUID v4
}

POST /api/blockuser
{
    "userID" : uuid v4
}

