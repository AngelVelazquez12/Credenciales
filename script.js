feather.replace();

const controls = document.querySelector('.controls');
const cameraOptions = document.querySelector('.video-options>select');
const video = document.querySelector('video');
const canvas = document.querySelector('canvas');
const screenshotImage = document.querySelector('img');
const buttons = [...controls.querySelectorAll('button')];
let streamStarted = false;

const [play, pause, screenshot] = buttons;

const constraints = {
  video: {
    facingMode: 'environment',
    width: { ideal: 1920 },
    height: { ideal: 1080 },
    aspectRatio: 16 / 9
  }
};


const getCameraSelection = async () => {
  const devices = await navigator.mediaDevices.enumerateDevices();
  const videoDevices = devices.filter(device => device.kind === 'videoinput');
  const options = videoDevices.map(videoDevice => {
    return `<option value="${videoDevice.deviceId}">${videoDevice.label}</option>`;
  });
  cameraOptions.innerHTML = options.join('');
};

play.onclick = () => {
  if (streamStarted) {
    video.play();
    play.classList.add('d-none');
    pause.classList.remove('d-none');
    return;
  }
  if ('mediaDevices' in navigator && navigator.mediaDevices.getUserMedia) {
    const updatedConstraints = {
      ...constraints,
      deviceId: {
        exact: cameraOptions.value
      }

    };
    startStream(updatedConstraints);
  }
};

const startStream = async (constraints) => {
  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  handleStream(stream);
};

const handleStream = (stream) => {
  video.srcObject = stream;
  play.classList.add('d-none');
  pause.classList.remove('d-none');
  screenshot.classList.remove('d-none');

};

getCameraSelection();

cameraOptions.onchange = () => {
  const updatedConstraints = {
    ...constraints,
    deviceId: {
      exact: cameraOptions.value
    }
  };
  startStream(updatedConstraints);
};

const pauseStream = () => {
  video.pause();
  play.classList.remove('d-none');
  pause.classList.add('d-none');
};

const doScreenshot = () => {
  const aspectRatio = video.videoWidth / video.videoHeight;
  const maxWidth = window.innerWidth;
  const maxHeight = window.innerHeight;

  let captureWidth, captureHeight;

  // Calculate capture dimensions based on aspect ratio and screen size
  if (aspectRatio > 1) {
    captureWidth = Math.min(video.videoWidth, maxWidth);
    captureHeight = captureWidth / aspectRatio;
  } else {
    captureHeight = Math.min(video.videoHeight, maxHeight);
    captureWidth = captureHeight * aspectRatio;
  }


  canvas.width = captureWidth;
  canvas.height = captureHeight;
  canvas.getContext('2d').drawImage(video, 0, 0, captureWidth, captureHeight);

  // Convertir el lienzo a un formato de imagen base64
  const imageData = canvas.toDataURL('image/webp');

  // Enviar la imagen al servidor usando AJAX
  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'guardar_imagen.php');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function () {
    if (xhr.status === 200) {
      console.log('Imagen guardada en: ' + xhr.responseText);
      // Puedes realizar otras acciones después de guardar la imagen
    } else {
      console.error('Error al guardar la imagen');
    }
  };
  xhr.send('imageData=' + encodeURIComponent(imageData));
};


pause.onclick = pauseStream;
screenshot.onclick = doScreenshot;