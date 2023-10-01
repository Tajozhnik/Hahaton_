# Hahaton_
Запуск проекта происходи из папки "9_54hakaton01"!!!
Инструкция по запуску:
1) Запустить start.bat
2) В открывшейся командной строке прописать: "node index.js"
3) В браузере перейти по адресу: "http://localhost:3000/"


----------------------------------------------------------------------------------------------------------------------------------------------------------
Вот инструкция по использованию предоставленного кода для генерации React-кода на основе данных из Figma с использованием искусственного интеллекта ChatGPT:

Шаг 1: Подготовка окружения
Откройте файл .env в директории проекта и добавьте в переменную API_KEY значение вашего ключа API от OpenAI.

Пример .env файла:
API_KEY='ваш_ключ_api'

Установите необходимые зависимости, выполнив команду в терминале в корневой директории вашего проекта:
npm install axios dotenv openai

Шаг 2: Получение данных из Figma
Замените access_token и file_id в коде на ваши данные Figma API:
const access_token = 'ваш_токен_доступа_к_Figma_API';
const file_id = 'идентификатор_вашего_Figma_файла';

Шаг 3: Запуск программы
Сохраните предоставленный код в файле, например, generate-react-from-figma.js.
Запустите программу, выполнив этот файл с помощью Node.js. Откройте терминал в корневой директории вашего проекта и выполните следующую команду:
node generate-react-from-figma.js

Шаг 4: Ожидание результатов
После запуска программы она выполнит запрос к Figma API и извлечет данные о вашем дизайне.
Затем программа отправит полученные данные в OpenAI API для генерации React-кода на основе вашего дизайна.

Шаг 5: Использование сгенерированного React-кода
После завершения выполнения программы сгенерированный React-код будет выведен в консоль.
Скопируйте сгенерированный React-код из консоли и вставьте его в ваш проект React.

Примечание:
Убедитесь, что ваш проект React настроен и импортирует необходимые зависимости, чтобы использовать сгенерированный код.
После вставки сгенерированного кода в ваш проект React, тщательно проверьте его и внесите необходимые изменения в соответствии с вашими требованиями.

Эта программа позволяет автоматически генерировать React-код на основе данных Figma и использовать искусственный интеллект для оптимизации процесса разработки пользовательского интерфейса. Не забудьте подготовить данные Figma и настроить свой ключ API OpenAI перед использованием.
