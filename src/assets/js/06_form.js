'use strict';
(function() {
  /*
   *  Форма для размещения своего объявления
   */

  const formElement = document.querySelector('.notice__form');
  const fieldsets = formElement.querySelectorAll('fieldset');
  const avatarDefaultSrc = formElement.querySelector('.notice__preview img').src;
  const btnSubmit = document.querySelector('.form__submit');


  // Переключение состояния формы
 
  window.form = {
    able: function() {
      formElement.classList.remove('notice__form--disabled');
      fieldsets.forEach((val) => val.disabled = false);
    },
    disable: function() {
      formElement.classList.add('notice__form--disabled');
      fieldsets.forEach((val) => val.disabled = true);
    },
    reset: function(evt) {
      formElement.reset();

      formElement.querySelector('.notice__preview img').src = avatarDefaultSrc;
      formElement.querySelector('.form__gallery').innerHTML = '';

      window.uploadFiles.avatar = '';
      window.uploadFiles.photos = [];

      window.resetMainPin();
      window.card.delete();
      window.pin.clear();
      window.filter.reset();
    }
  };



  window.form.disable();

  // Очищать форму по клику на кнопке

  document.querySelector('.form__reset').addEventListener('click', function(evt) {
    evt.preventDefault();
    window.form.reset();
  });


  // Проверка валидности: заголовок

  const titleElement = formElement.querySelector('input#title');

  titleElement.addEventListener('invalid', function(evt) {
    if (titleElement.validity.tooShort) {
      titleElement.setCustomValidity('Минимальная длина заголовка - 30 символов');
    } else if (titleElement.validity.tooLong) {
      titleElement.setCustomValidity('Максимальная длина заголовка - 100 символов');
    } else if (titleElement.validity.valueMissing) {
      titleElement.setCustomValidity('Обязательное поле');
    } else {
       titleElement.setCustomValidity('');
    }
  });

  
  // Выбор и установка мин.цены на выбранный тип жилья
  
  const priceElement = formElement.querySelector('input#price');
  const minPrice = {
    apartToPrice: {
      bungalo: 0,
      flat: 1000,
      house: 5000,
      palace: 10000
    },
    set: function(val){
      priceElement.min = this.apartToPrice[val];
      priceElement.placeholder = "От " + this.apartToPrice[val];
      priceElement.title = "Цена от " + priceElement.min + ", но не более " + priceElement.max;
    }
  };
 

  // Изменить минимальную цену в зависимости от выбранного типа жилья
  // Проверка валидности поля

  const apartTypeElement = formElement.querySelector('select#type');
  apartTypeElement.addEventListener('change', function() {
    minPrice.set(apartTypeElement.value);
  });


  priceElement.addEventListener('invalid', function(evt) {
    if (priceElement.validity.badInput) {
        priceElement.setCustomValidity('Поле может содержать только цифры');
    } else if (priceElement.validity.rangeUnderflow) {
        priceElement.setCustomValidity('Минимальная цена - ' + priceElement.placeholder + ' руб');
    } else if (priceElement.validity.rangeOverflow) {
        priceElement.setCustomValidity('Максимальная цена - 1 000 000 руб');
    } else if (priceElement.validity.valueMissing) {
        priceElement.setCustomValidity('Обязательное поле');
    } else {
        priceElement.setCustomValidity('');
    }
  });


  // Время выезда/заезда зависят друг от друга

  const timeInElement = formElement.querySelector('select#timein');
  const timeOutElement = formElement.querySelector('select#timeout');

  timeInElement.addEventListener('change', function() {
    timeOutElement.value = timeInElement.value;
  });

  timeOutElement.addEventListener('change', function() {
    timeInElement.value = timeOutElement.value;
  });


  // Показать кол-во гостей на выбранное кол-во комнат

  let capacityElement = formElement.querySelector('select#capacity');
  let capasityOptionElements = capacityElement.querySelectorAll('option');

  let roomNumberElement = formElement.querySelector('select#room_number');
  let roomNumberToPersonQty = {
   '1': ['1'],
   '2': ['2', '1'],
   '3': ['3', '2', '1'],
   '100': ['0']
  };

  let roomNumber = roomNumberElement.value;

  const setCapasityOptionsDisabled = function() {
    capasityOptionElements.forEach(function(val) {
      val.disabled = true;
    });
  };

  const showAvailableRoomCapacity = function() {
    capasityOptionElements.forEach( (val, index) => {
      if (roomNumberToPersonQty[roomNumber].indexOf(val.value) >= 0) {
        capasityOptionElements[index].disabled = false;
      }
    })
  };


  // При первой загрузке:
  // - делаем все опции кол-ва гостей disabled
  // - показываем доступные варианты для указанного количества комнат
  // - первый доступный вариант кол-ва гостей делаем selected

  setCapasityOptionsDisabled();
  showAvailableRoomCapacity(roomNumber);
  capacityElement.querySelector('option:enabled').selected = true;


  // Остлеживаем изменение количества комнат

  roomNumberElement.addEventListener('change', function() {
    roomNumber = roomNumberElement.value;

    setCapasityOptionsDisabled();
    showAvailableRoomCapacity();
    
    // Сделать selected первую доступную опцию для выбранного количества комнат
    capacityElement.querySelector('option:enabled').selected = true;
  });

  //
  // Модальное окно с сообщением
  //

  const modalElement = document.querySelector('.modal');
  const modalTitle = document.querySelector('.modal__title');
  const modalButton = document.querySelector('.modal__button');

  const ESC_KEY = 27;

  const Messages = {
    success: 'Данные успешно отправлены',
    fail: 'При отправке данных произошла ошибка. Возможно, вы неправильно ввели данные.'
  }

  const modal = {
    show: function(block,button) {
      modalElement.classList.remove('hidden');
      modalButton.addEventListener('click', modal.hide);
      document.addEventListener('click', modal.onClickOut);
      document.addEventListener('keydown', modal.onEscPress);
    },
    hide: function() {
      modalElement.classList.add('hidden');
      modalButton.removeEventListener('click', modal.hide);
      document.removeEventListener('keydown', modal.onEscPress);
      document.removeEventListener('click', modal.onClickOut);
    },
    onEscPress: function(evt) {
      if (evt.keyCode === ESC_KEY) {
        modal.hide();
      }
    },
    onClickOut: function(evt) {
      const popup = document.querySelector('.modal__content');
        if (!popup.contains(evt.target)) {
          modal.hide();
        }
    }
  };

  //
  // Отправка данных на сервер
  //

  formElement.addEventListener('submit', function(evt) {
    evt.preventDefault();

    const dataForm = new FormData(formElement);
    dataForm.append('avatar', window.uploadFiles.avatar);
    window.uploadFiles.photos.forEach((el) => dataForm.append('photo', el));

    window.backend.save(dataForm, function(response) {
      window.form.reset();
      modalTitle.textContent = Messages.success;
      modal.show();
    }, function(xhr) {
        modalTitle.textContent = Messages.fail;
        modal.show();
        console.log('Ошибка отправки формы. Статус ответа: ' + xhr.status + ' - ' + xhr.statusText);
    });
  });

})()

