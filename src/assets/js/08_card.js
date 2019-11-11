
'use strict';
(function() {
  /*
   *  Карточки объявления для выбранной метки на карте
   */
  
  const map = document.querySelector('.map');
  const filtersContainer = document.querySelector('.map__filters-container');

  const templateCard = document.querySelector('template').content.querySelector('.map__card');
 
  const typeApartToName = {
    flat: 'Квартира',
    bungalo: 'Бунгало',
    house: 'Дом',
    palace: 'Дворец'
  };

  const featureClassMap = {
    wifi: '.feature--wifi',
    dishwasher: '.feature--dishwasher',
    parking: '.feature--parking',
    washer: '.feature--washer',
    elevator: '.feature--elevator',
    conditioner: '.feature--conditioner'
  };

  const getFeaturesUnavailable = function(card) {
    const keys = Object.keys(featureClassMap);

    const arr = keys.filter(function(i) {
      return card.offer.features.indexOf(i) < 0;
    })
    return arr;
  };

  const makeElement = function(arr){
    let fragment = document.createDocumentFragment();
    arr.forEach(function(el) {
      let newLi = document.createElement('li');
      let newImg = document.createElement('img');
      newImg.src = el;
      newLi.appendChild(newImg);
      fragment.appendChild(newLi);
    });
    return fragment;
  };

  const renderCardElement = function(card) {
    let cardElement = templateCard.cloneNode(true);
    cardElement.querySelector('.popup__title').textContent = card.offer.title;
    cardElement.querySelector('.popup__text--address').textContent = card.offer.address;
    cardElement.querySelector('.popup__price').textContent = card.offer.price + " \u20BD/ночь";
    cardElement.querySelector('.popup__type').textContent = typeApartToName[card.offer.type];
    cardElement.querySelector('.popup__text--capacity').textContent = card.offer.rooms + " комнаты для " + card.offer.guests;
    cardElement.querySelector('.popup__text--time').textContent = "Заезд после " + card.offer.checkin + ", выезд до  " + card.offer.checkout;
    getFeaturesUnavailable(card).forEach( el => {
      cardElement.querySelector(featureClassMap[el]).style.display = 'none';
    });
    cardElement.querySelector('.popup__description').textContent = card.offer.description;
    cardElement.querySelector('.popup__avatar').src = 'assets/' + card.author.avatar;
    cardElement.querySelector('.popup__pictures').appendChild(makeElement(card.offer.photos));
    return cardElement;
 };

  let cardCloseElement;
  let card;
  let chosenPin;

  const deleteCard = function() {
    if (card) {
      map.removeChild(card);
      document.removeEventListener('keydown', onEscPress);
      cardCloseElement.removeEventListener('click', deleteCard)
    }
    card = '';
  };

  const onEscPress = function(evt) {
    window.util.onEscPress(evt, deleteCard);
  };

  const renderCard = function(data) {
    const fragment = document.createDocumentFragment();
    fragment.appendChild(renderCardElement(data));
    map.insertBefore(fragment, filtersContainer);
  };

  const showCard = function(evt, data) {
    deleteCard();
    renderCard(data);

    const target = evt.target.closest('.map__pin');
    if (chosenPin) {
      chosenPin.classList.remove('map__pin--active');
    };
    chosenPin = target;
    chosenPin.classList.add('map__pin--active');

    card = map.querySelector('.map__card');
    document.addEventListener('keydown', onEscPress);

    cardCloseElement = map.querySelector('.popup .popup__close');
    cardCloseElement.addEventListener('click', deleteCard)
  };


  window.card = {
    delete: deleteCard,
    show: showCard
  };

})();

