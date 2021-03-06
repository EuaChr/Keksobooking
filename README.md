# Проект

Кексобукинг. Реализация интерактивного поведения для учебного проекта по Javascript (уровень 1) от HTML Academy.

## Запуск проекта

Скачайте проект и наберите команду в папке проекта

```
npm install
gulp
```

## ТЗ проекта
Кексобукинг — сервис размещения объявлений о сдаче в аренду недвижимости в центре Токио. 
Пользователям предоставляется возможность размещать объявления о своей недвижимости или просматривать уже размещённые объявления.

#### При первом движении главной метки на карте: 
- сайт переключается в активное состояние,
- форма и фильтры разблокируются, 
- подгружаются данны и показываются метки похожих объявлений.

#### Похожие объявления:
- данные для отрисовки меток подгружаются с сервера,
- похожие объявления можно фильтровать настройками фильтра, 
- при клике по метке показывается карточка с подробной информацией.

#### Форма для размещения своего объявления: 
- перемещение большой метки по карте записывает координаты в поле адреса, 
- загруженные картинки для аватарки и фото апартаментов отрисовываются,
- валидация данных при отправке формы, 
- при успешной отправке все данные из полей стираются, большая метка возвращается на свое место,
- поля "время заезда/выезда", "комнаты/гости" синхронизированы.

#### Сброс данных в форме, возврат главной метки на исходное положение: 
- при успешной отправке формы,
- при нажатии на кнопку reset.


## Автор
* **Евгения Чернова** - *скрипты* 
* **HTML Academy** - *макет, верстка*
