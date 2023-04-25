const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const timerElement = document.getElementById("timer");
const nameVideo= document.getElementById("name_video");

let mediaRecorder;
let timerInterval;
let seconds = 0;

startButton.addEventListener("click", () => {
  startButton.disabled = true;
  stopButton.disabled = false;
  startRecording();
});

stopButton.addEventListener("click", () => {
  stopButton.disabled = true;
  mediaRecorder.stop();
});


function startRecording() {
  const displayMediaOptions = {
    video: {
      // cursor: "pointer"
      // cursorSize: 999999999999,
      width: { ideal: 1920 },
      height: { ideal: 1080 },
      bitrate: { ideal: 10000000 } // 10 Mbps
    },
    audio: {
      sampleRate: { ideal: 48000 },
      channelCount: { ideal: 2 },
      bitrate: { ideal: 192000 } // 192 Kbps
    }
  };

  

  navigator.mediaDevices.getDisplayMedia(displayMediaOptions)
    .then(stream => {
      mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: 10000000, // 10 Mbps
        audioBitsPerSecond: 192000 // 192 Kbps
      });

      mediaRecorder.start();

      // Actualizar el tiempo de grabación en la pantalla
      timerInterval = setInterval(() => {
        seconds++;
        timerElement.innerText = `Duración de la grabación: ${seconds} segundos`;
      }, 1000);

      // Escuchar el evento de finalización de la grabación
      mediaRecorder.addEventListener("dataavailable", event => {
        clearInterval(timerInterval);
        const blob = new Blob([event.data], { type: "video/mp4" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        let nombre = nameVideo.value;
        a.download = nombre+".mp4";
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);

        // Restablecer los botones de inicio y detención de la grabación
        startButton.disabled = false;
        stopButton.disabled = true;
        seconds = 0;
      });
    })
    .catch(error => {
      console.error(error);
    });
}


