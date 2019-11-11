'use strict';
(function() {
  /*
   * Служебные утилиты
   */
  
  const ESC_KEY = 27;
  const DEBOUNCE_INTERVAL = 100; //ms

  const onEscPress = function(evt, func) {
    if (evt.keyCode === ESC_KEY) func();
  };


  // Устраняет дребезг

  const debounce = function(func) {
    let lastTimeout;

    return function() {
      let args = arguments;
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      };
      lastTimeout = window.setTimeout(function() {
        func.apply(null, args);
      }, DEBOUNCE_INTERVAL);
    }
  };

  window.util = {
    onEscPress: onEscPress,
    debounce: debounce
  };

})();