'use strict';
(function () {
  /*
   *  Загрузка массива объявлений
   */

  let ads = []; /* Массив объявлений */

  // Сохраняет загруженные с сервера данные в ads

  window.onLoad = function(data) {
    ads = data;
  }; 

  window.onError = function(errorMessage) {
   console.log('Ошибка загрузки данных: ' + errorMessage)
  };

  // Загрузка данных с сервера

  window.backend.load(window.onLoad, window.onError);


  //
  // Фильтрация похожих объявлений
  //

  // Набор значений фильтров

  const filterSet = {
    main: {
      type: '',
      priceRange: '',
      rooms: '',
      guests: ''
    },
    minor:[],
    reset: function(){}
  };

  // Конструктор поля фильтра

  const FilterField = function(selector) {
    this.selector = selector;
    this.value = '';
  };
  FilterField.prototype._setValue = function(elem) {
    this.value = elem.value;
  };
  FilterField.prototype._getElement = function() {
    return document.querySelector(this.selector);
  }
  FilterField.prototype._onValueChange = function(evt) {};


  // Фильтр: тип апартаментов

  const filterType = new FilterField('#housing-type');

  filterType._onValueChange = function(evt) {
    filterSet.main.type = evt.target.value;
    updateFilter(ads);
  };

  const filterTypeElement = filterType._getElement();
  filterSet.main.type = filterTypeElement.value;
  filterTypeElement.addEventListener('change', filterType._onValueChange);


  // Фильтр: цена

  const filterPrice = new FilterField('#housing-price');

  filterPrice._getPriceRange = function(price) {
   if (filterSet.main.priceRange === 'any') {
     return 'any';
   } else if (+price < 10000) {
      return 'low';
    } else if (+price > 50000) {
      return 'high';
    } 
    return 'middle';
  };

  filterPrice._onValueChange = function(evt) {
    filterSet.main.priceRange = evt.target.value;
    updateFilter(ads);
  };

  const filterPriceElement = filterPrice._getElement();
  filterSet.main.priceRange = filterPriceElement.value;
  filterPriceElement.addEventListener('change', filterPrice._onValueChange);


  // Фильтр - комнаты

  const filterRooms = new FilterField('#housing-rooms');
  
  filterRooms._onValueChange = function(evt) {
    const val = evt.target.value;
    filterSet.main.rooms = (val === 'any') ? 'any' : +val;
    updateFilter(ads);
  };

  const filterRoomsElement = filterRooms._getElement();
  filterSet.main.rooms = filterRoomsElement.value;
  filterRoomsElement.addEventListener('change', filterRooms._onValueChange);


  // Фильтр - гости

  const filterGuests = new FilterField('#housing-guests');
  filterGuests._onValueChange = function(evt) {
    const val = evt.target.value;
    filterSet.main.guests = (val === 'any') ? 'any' : +val;
    updateFilter(ads);
  };

  const filterGuestsElement = filterGuests._getElement();
  filterSet.main.guests = filterGuestsElement.value;
  filterGuestsElement.addEventListener('change', filterGuests._onValueChange);

  // Фильтр по features

  const featureElement = document.querySelector('.features');
  let checkedFeatures;

  const getCheckedFeatures = function() {
    checkedFeatures = featureElement.querySelectorAll('input:checked');
    filterSet.minor = [];

    if (checkedFeatures.length > 0) {
      checkedFeatures.forEach((el) => {
        filterSet.minor.push(el.value);
      });
    }
  };

  getCheckedFeatures();
  featureElement.addEventListener('change', () => {
    getCheckedFeatures();
    updateFilter(ads);
  });
 

  // Ресет значений фильтра

  filterSet.reset = function() {
    filterSet.main.type = filterTypeElement.value;
    filterSet.main.priceRange = filterPriceElement.value;
    filterSet.main.rooms = filterRoomsElement.value;
    filterSet.main.guests = filterGuestsElement.value;
    filterSet.minor = [];
  };
 

  //
  // Показ похожих объявлений: метки на карте и карточки объявлений
  //

  // Показ отсортированных меток

  const sortByFields = function(elem) {
    let isMatchToFields;
    for (let prop in filterSet.main) {
      isMatchToFields = ((filterSet.main[prop] === 'any')) ? true : (filterSet.main[prop] === elem.offer[prop]);
      if (!isMatchToFields) break;
    };
    return isMatchToFields;
  };

  const sortByFeatures = function(elem) {
    let isMatchToFeatures = true;

    for (let i = 0, len = filterSet.minor.length; i < len; i++) {
      if (len > 0) {
        isMatchToFeatures = (elem.offer.features.indexOf(filterSet.minor[i]) >= 0);
        if (!isMatchToFeatures) break;
      } 
    };
    return isMatchToFeatures;
  };

  const onChangeFilter = function() {
    window.card.delete();

    let copyAds = ads.slice();
    let sortedAds = copyAds.filter((elem) => {

      elem.offer.priceRange = filterPrice._getPriceRange(elem.offer.price);
      let isMatch;
      isMatch = sortByFields(elem);

      if (isMatch) {
        isMatch = sortByFeatures(elem);
      };
   
      return isMatch;
    });
    window.pin.render(sortedAds);
  };

  const updateFilter = window.util.debounce(onChangeFilter);

  const resetFilter = function() {
    document.querySelector('.map__filters').reset();
    filterSet.reset();
  };

  window.filter = {
    update: updateFilter,
    reset: resetFilter
  };
})();