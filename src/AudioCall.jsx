import React, { useState, useRef } from "react";

function AudioCall() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioRef = useRef(null);

  const startRecording = async () => {
    // Request access to the user's microphone
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    // Create a new MediaRecorder instance
    mediaRecorderRef.current = new MediaRecorder(stream);

    // Clear previous audio chunks if any
    audioChunksRef.current = [];

    // Collect audio data in chunks
    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    // When recording stops, create a Blob and a URL for the recorded audio
    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioBlob(audioBlob);
      setAudioUrl(audioUrl);
    };

    // Start recording
    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    // Stop the media recorder
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  const downloadAudio = () => {
    if (audioBlob) {
      const link = document.createElement("a");
      link.href = audioUrl;
      link.download = "recording.wav"; // Specify the download file name
      link.click();
    }
  };

  const playAudio = () => {
    if (audioUrl) {
      audioRef.current.src = audioUrl;
      audioRef.current.play();
    }
  };

  return (
    <div>
      <h1>Audio Recorder</h1>
      <div>
        {isRecording ? (
          <button onClick={stopRecording}>Stop Recording</button>
        ) : (
          <button onClick={startRecording}>Start Recording</button>
        )}
      </div>

      {audioUrl && (
        <div>
          <h3>Recorded Audio</h3>
          <audio ref={audioRef} controls />
          <div>
            <button onClick={playAudio}>Play</button>
            <button onClick={downloadAudio}>Download</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AudioCall;

//--------------------------------------------------------------------------------------------------------------------
// import React, { useState, useRef } from "react";

// function AudioCall() {
//   const [isRecording, setIsRecording] = useState(false);
//   const [audioUrl, setAudioUrl] = useState(null);
//   const [audioBlob, setAudioBlob] = useState(null);
//   const mediaRecorderRef = useRef(null);
//   const audioChunksRef = useRef([]);
//   const audioRef = useRef(null);

//   const startRecording = async () => {
//     // Request access to the user's microphone
//     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

//     // Create a new MediaRecorder instance
//     mediaRecorderRef.current = new MediaRecorder(stream);

//     // Collect audio data in chunks
//     mediaRecorderRef.current.ondataavailable = (event) => {
//       audioChunksRef.current.push(event.data);
//     };

//     // When recording stops, create a Blob and a URL for the recorded audio
//     mediaRecorderRef.current.onstop = () => {
//       const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
//       const audioUrl = URL.createObjectURL(audioBlob);
//       setAudioBlob(audioBlob);
//       setAudioUrl(audioUrl);
//     };

//     // Start recording
//     mediaRecorderRef.current.start();
//     setIsRecording(true);
//   };

//   const stopRecording = () => {
//     // Stop the media recorder
//     mediaRecorderRef.current.stop();
//     setIsRecording(false);
//   };

//   const downloadAudio = () => {
//     if (audioBlob) {
//       const link = document.createElement("a");
//       link.href = audioUrl;
//       link.download = "recording.wav"; // Specify the download file name
//       link.click();
//     }
//   };

//   const playAudio = () => {
//     if (audioUrl) {
//       audioRef.current.src = audioUrl;
//       audioRef.current.play();
//     }
//   };

//   return (
//     <div>
//       <h1>Audio Recorder</h1>
//       <div>
//         {isRecording ? (
//           <button onClick={stopRecording}>Stop Recording</button>
//         ) : (
//           <button onClick={startRecording}>Start Recording</button>
//         )}
//       </div>

//       {audioUrl && (
//         <div>
//           <h3>Recorded Audio</h3>
//           <audio ref={audioRef} controls />
//           <div>
//             <button onClick={playAudio}>Play</button>
//             <button onClick={downloadAudio}>Download</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default AudioCall;
//-------------------------------------------------------------------------------------------------------------
// import "./App.css";
// import axios from "axios";

// let gumStream = null;
// let recorder = null;
// let audioContext = null;

// function RecorderJSDemo() {
//   const startRecording = () => {
//     let constraints = {
//       audio: true,
//       video: false,
//     };

//     audioContext = new window.AudioContext();
//     console.log("sample rate: " + audioContext.sampleRate);

//     navigator.mediaDevices
//       .getUserMedia(constraints)
//       .then(function (stream) {
//         console.log("initializing Recorder.js ...");

//         gumStream = stream;

//         let input = audioContext.createMediaStreamSource(stream);

//         recorder = new window.Recorder(input, {
//           numChannels: 1,
//         });

//         recorder.record();
//         console.log("Recording started");
//       })
//       .catch(function (err) {
//         console.log("Error", err);
//       });
//   };

//   const stopRecording = () => {
//     console.log("stopButton clicked");

//     recorder.stop(); //stop microphone access
//     gumStream.getAudioTracks()[0].stop();

//     recorder.exportWAV(onStop);
//   };

//   const onStop = (blob) => {
//     console.log("uploading...");

//     let data = new FormData();

//     data.append("text", "this is the transcription of the audio file");
//     data.append("wavfile", blob, "recording.wav");

//     const config = {
//       headers: { "content-type": "multipart/form-data" },
//     };
//     axios.post("https://192.168.0.75:7173/", data, config);
//   };

//   return (
//     <div>
//       <button onClick={startRecording} type="button">
//         Start
//       </button>
//       <button onClick={stopRecording} type="button">
//         Stop
//       </button>
//     </div>
//   );
// }

// export default RecorderJSDemo;
