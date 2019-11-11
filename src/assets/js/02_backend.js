'use strict';
(function () {
  /*
   *  Работа с серверной частью: 
   *  - загрузить данные похожих объявлений
   *  - отправить данные из формы
   */

  window.backend = {
    load: function(onLoad, onError) {},
    save: function(data, OnLoad, onError) {}
  };

  window.backend.load = function(onLoad, onError) {
    const url = 'https://js.dump.academy/keksobooking/data';
    let xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function() {
      if(xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function() {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });
    xhr.open('GET', url);
    xhr.send();
  };

  window.backend.save = function(data, onLoad, onError) {
    const url = 'https://js.dump.academy/keksobooking';
    let xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function() {
      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        onError(xhr);
      }
    });
    xhr.open('POST', url);
    xhr.send(data);
  };

})();

