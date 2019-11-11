'use strict';
(function() {
 /*
  *  Отправка данных на сервер
  */


  let formElement = document.querySelector('.notice__form');
  
  window.uploadFiles = {
    avatar: '',
    photos: []
  };
  
  //
  // Добавить картинку - аватар автора объявления
  //

  const avatar = formElement.querySelector('.notice__photo img');
  const avatarDropArea = formElement.querySelector('.notice__photo .drop-zone');
  const avatarChooser = formElement.querySelector('.notice__photo input[type=file]');

  const IMG_TYPES = ['png', 'jpeg', 'jpg', 'gif'];
  const DROP_EVENTS = {
    on: ['dragenter', 'dragover'],
    out: ['dragleave', 'drop']
  };

  const dropArea = {
    highlight: function(dropAreaElement) {
      dropAreaElement.classList.add('highlight');
    },
    unhighlight: function(dropAreaElement) {
      dropAreaElement.classList.remove('highlight');
    }
  }
    const preventDefaults = function(evt){
    evt.preventDefault();
    evt.stopPropagation();
  };

  const handleAvatarDrop = function(file) {
    const isImage = checkFileFormat(file);
    if (isImage) {
      const reader = new FileReader();
      reader.addEventListener('load', function() {
        avatar.src = reader.result;
      });
      reader.readAsDataURL(file);
    }
  };

  const checkFileFormat = function(file) {
    const fileName = file.name.toLowerCase();
    return IMG_TYPES.some((el) => fileName.endsWith(el));
  };

  // Добавление аватара через input:file

  avatarChooser.addEventListener('change', function() {
    const files = avatarChooser.files;
    const file = files[0];
    window.uploadFiles.avatar = file;
    handleAvatarDrop(file);
  });

  // Добавление аватара через Drag& Drop

  for (let prop in DROP_EVENTS) {
    DROP_EVENTS[prop].forEach((eventName) => {
      avatarDropArea.addEventListener(eventName, preventDefaults);
    })
  };

  DROP_EVENTS.on.forEach((eventName) => {
    avatarDropArea.addEventListener(eventName, function() {
      dropArea.highlight(avatarDropArea);
    });
  });

  DROP_EVENTS.out.forEach((eventName) => {
    avatarDropArea.addEventListener(eventName, function() {
      dropArea.unhighlight(avatarDropArea);
    });
  });

  avatarDropArea.addEventListener('drop', function(evt) {
    const files = evt.dataTransfer.files;
    const file = files[0];
    window.uploadFiles.avatar = file;
    handleAvatarDrop(file);
  });

  //
  // Добавить фотографии апартаментов
  //

  const photoDropArea = formElement.querySelector('.form__photo-container .drop-zone');
  const photoChooser = formElement.querySelector('.form__photo-container input[type=file]');
  const photoGallery = formElement.querySelector('.form__gallery');

  const handlePhotoDrop = function(file) {
    const isImage = checkFileFormat(file);
    let img = document.createElement('img');
    
    if (isImage) {
      const reader = new FileReader();
      reader.addEventListener('load',function() {
        img.src = reader.result;
      });
      reader.readAsDataURL(file);
    }
    return img;
  };


  // Добавление фотографий через input[file]
  
  photoChooser.addEventListener('change', function(evt) {
  
    const files = photoChooser.files;
    let fragment = document.createDocumentFragment();

    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      window.uploadFiles.photos.push(file);
      const img = handlePhotoDrop(file);
      fragment.appendChild(img);
    }
    photoGallery.appendChild(fragment);
  });

  // Добавление фотографий через Drag& Drop

  for (let prop in DROP_EVENTS) {
    DROP_EVENTS[prop].forEach((eventName) => {
      photoDropArea.addEventListener(eventName, preventDefaults);
    })
  };

  DROP_EVENTS.on.forEach((eventName) => {
    photoDropArea.addEventListener(eventName, function() {
      dropArea.highlight(photoDropArea);
    });
  });

  DROP_EVENTS.out.forEach((eventName) => {
    photoDropArea.addEventListener(eventName, function() {
      dropArea.unhighlight(photoDropArea);
    });
  });

  photoDropArea.addEventListener('drop', function(evt) {
    const files = evt.dataTransfer.files;
    let fragment = document.createDocumentFragment();
    Array.from(files, (elem) => {
    window.uploadFiles.photos.push(elem);
    const img = handlePhotoDrop(elem);
    fragment.appendChild(img);
  })
    photoGallery.appendChild(fragment);
  });
  
})();