'use strict';
(function() {
  /*
   *  Работа с картой, главной меткой на карте.
   *  Загрузка данных с сервера
   */

  const mapElement = document.querySelector('.map');
  const mainPinElement = document.querySelector('.map__pin--main');

  const map = {
    able: function() {
      mapElement.classList.remove('map--faded');
      window.filter.update();
    },
    disable: function() {
      mapElement.classList.add('map--faded');
    }
  };


  //
  // Движение главной метки по карте
  //

  const mainPin = {
    defaultPosition: {},
    size: {},
    coords: {}
  };

  mainPin.defaultPosition = {
    _left: '50%',
    _top: '375px',
    _resetPosition: function() {
      mainPinElement.style.left = mainPin.defaultPosition._left;
      mainPinElement.style.top = mainPin.defaultPosition._top;
    }
  };

  mainPin.size = {
    _width: 65,
    _height: 51,
    _tailHeight: 22,
  };

  mainPin.coords = {
    startX: '',
    startY: '',
    currentX: '',
    currentY: '',
    _constraints: {
      left: 0,
      top: 130,
      right: '',
      bottom: 630
    },
    _setX: function(x){
      if (x >= this._constraints.left && 
        x <= this._constraints.right) {
        this.currentX = x; 
      } else if (x <= this._constraints.left) {
        this.currentX = this._constraints.left;
      } else if (x >= this._constraints.right) {
        this.currentX = this._constraints.right;
      };
    },
    _setY: function(y) {
      if (y >= this._constraints.top && 
        y <= this._constraints.bottom) {
        this.currentY = y; 
      } else if (y <= this._constraints.top) {
        this.currentY = this._constraints.top;
      } else if (y >= this._constraints.bottom) {
        this.currentY = this._constraints.bottom;
      };
    },
    _rewriteStartCoords: function(evt) {
      mainPin.coords.startX = evt.clientX;
      mainPin.coords.startY = evt.clientY;
    }
  };

  // Вычисление _constraints для mainPin
  
  const bodyWidth = document.body.clientWidth
  mainPin.coords._constraints.left = Math.floor(mainPin.size._width/2); 
  mainPin.coords._constraints.right = Math.floor(bodyWidth - mainPin.size._width/2);


  //
  // Заполнение адреса в форме
  //

  const addressFieldElement = document.querySelector('#address');

  const addressField = {
    _startX: '',
    _startY:'',
    currentX: '',
    currentY: '',
    countX: function(leftPosition) { 
      return Math.floor(leftPosition + mainPin.size._width/2)
    },
    countY: function(topPosition){
      return Math.floor(topPosition + mainPin.size._height + mainPin.size._tailHeight);
    },
    setCurrent: function() {
      addressFieldElement.value = this.currentX + ', ' + this.currentY; 
    },
    setDefault: function() {
      addressFieldElement.value = this._startX + ', ' + this._startY; 
    }
  };

  addressField._startX = Math.floor(bodyWidth/2);
  addressField._startY = addressField.countY(+mainPin.defaultPosition._top.slice(0,3));

  addressField.setDefault();


  //
  // Перемещение главной метки по карте 
  //

  mainPinElement.addEventListener('mousedown', function(evt) {
    mainPin.coords._rewriteStartCoords(evt);

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  function onMouseMove(moveEvt) {
    // Дельта смещения
    const shift = {
      x: mainPin.coords.startX - moveEvt.clientX,
      y: mainPin.coords.startY - moveEvt.clientY
    };

    // Новые координаты для следующего смещения
    mainPin.coords._rewriteStartCoords(moveEvt);

    // Расчет смещения mainPin
    mainPin.coords.currentX = mainPinElement.offsetLeft - shift.x;
    mainPin.coords.currentY = mainPinElement.offsetTop - shift.y;

    // Проверка на ограничение передвижения метки
    mainPin.coords._setX(mainPin.coords.currentX);
    mainPin.coords._setY(mainPin.coords.currentY);

    // Запись новых координат метки в стили элемента
    mainPinElement.style.left = mainPin.coords.currentX + 'px';
    mainPinElement.style.top = mainPin.coords.currentY + 'px';

    // Запись нового адреса в поле формы
    addressField.currentX = addressField.countX(mainPin.coords.currentX);
    addressField.currentY = addressField.countX(mainPin.coords.currentY);
    addressField.setCurrent();
  };

  function onMouseUp(upEvt) {
    upEvt.preventDefault();
    map.able();
    window.form.able();
    window.filter.update();

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };


  // Вернуть mainPin на исходную позицию
  // Перезаписать адрес в поле формы

  window.resetMainPin = function() {
      mainPin.defaultPosition._resetPosition();
      addressField.setDefault();
  };

})();