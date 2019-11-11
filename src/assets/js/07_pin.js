'use strict';
(function() {
  /*
   *  Рендер метки объявления на карте
   */

  const similar = document.querySelector('.map__similar-pins');
  const template = document.querySelector('template');
  const templatePin = template.content.querySelector('.map__pin');

  const renderPinElement = function(pinData) {
    const pin = templatePin.cloneNode(true);

    pin.style.left = pinData.location.x + 'px';
    pin.style.top = pinData.location.y + 'px';
    pin.querySelector('img').src = 'assets/' + pinData.author.avatar;
    pin.querySelector('img').alt = pinData.offer.title;

    pin.addEventListener('click', function (evt) {
      window.card.show(evt, pinData);
    })
    return pin;
  };

  window.pin = {
    render: function(data) {
      similar.innerHTML = '';

      const fragment = document.createDocumentFragment();
      const pinQuantity = data.length > 5 ? 5 : data.length;

      for (let i = 0; i < pinQuantity; i++) {
        fragment.appendChild(renderPinElement(data[i]));
      }
      similar.appendChild(fragment);
    },
    clear: function() {
      similar.innerHTML = '';
    }
  };
  
})();

