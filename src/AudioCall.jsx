import React, { useState, useRef, useEffect } from "react";

function AudioCall() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioRef = useRef(null);
  const buttonRef = useRef(null); // Ref for the button

  useEffect(() => {
    console.log("useEffect called");

    // Click event listener for detecting outside clicks
    const handleOutsideClick = (event) => {
      // Check if the clicked target is outside the button
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target) &&
        isRecording
      ) {
        stopRecording(); // Stop the recording when clicked outside
      }
    };

    window.addEventListener("click", handleOutsideClick);

    // Cleanup event listener
    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, [isRecording]);

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

  const stopRecording = async () => {
    // Stop the media recorder
    await mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  useEffect(() => {
    if (audioUrl && !isRecording) {
      console.log("found audioUrl");
      audioRef.current.src = audioUrl;
    }
  }, [audioUrl, isRecording]);

  return (
    <div>
      <h1>Audio Recorder</h1>
      <div>
        {isRecording ? (
          <button ref={buttonRef} onClick={stopRecording}>
            Stop Recording
          </button>
        ) : (
          <button ref={buttonRef} onClick={startRecording}>
            Start Recording
          </button>
        )}
      </div>
      {audioUrl && (
        <div>
          <h3>Recorded Audio</h3>
          <audio ref={audioRef} controls />
          <div>
            {/* <button onClick={playAudio}>Play</button> */}
            {/* <button onClick={downloadAudio}>Download</button> */}
          </div>
        </div>
      )}
    </div>
  );
}

export default AudioCall;
