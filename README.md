#WingPad



## Что нового

* авторизация пользователей
* создание/удаление документов
* возможность просмотра и редактирования документов


## Более конкретно

* серверная часть была переписана с использованием expressjs (`/server/app.js`, `/server/middleware`, `/server/models/index.js`, `/server/routes`, `/server/utils`). 
* для хранения данных используется mongodb
* добавлены две страницы - страница авторизации и главная, где отображаются созданные документы. По нажатию на существующий документ открывается редактор с содержимым документа. (папка `/blocks` перешла в `/pages/editor`, другие страницы, соответственно: `/pages/dashboard` и `/pages/auth`)


P.S. на данный момент (02.12.2014) реализация неполная и код слегка хромающий. В ближайшее время это будет исправлено.
