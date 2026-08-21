import { useState, useRef } from "react";
import { Mic, Square, RotateCcw, Send } from "lucide-react";

export default function AudioRecorder({ onSubmit, submitting }) {
  const [status, setStatus] = useState("idle"); // idle | recording | recorded
  const [audioUrl, setAudioUrl] = useState(null);
  const [seconds, setSeconds] = useState(0);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const blobRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        blobRef.current = blob;
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setStatus("recording");
      setSeconds(0);

      timerRef.current = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } catch (err) {
      alert(
        "Couldn't access your microphone. Please allow mic permissions and try again.",
      );
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    clearInterval(timerRef.current);
    setStatus("recorded");
  };

  const reRecord = () => {
    setAudioUrl(null);
    blobRef.current = null;
    setStatus("idle");
    setSeconds(0);
  };

  const handleSubmit = () => {
    if (blobRef.current) {
      onSubmit(blobRef.current, seconds);
    }
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="recorder-box">
      {status === "idle" && (
        <button className="recorder-main-btn" onClick={startRecording}>
          <Mic size={20} /> Start Recording
        </button>
      )}

      {status === "recording" && (
        <div className="recorder-active">
          <div className="recorder-pulse" />
          <p className="recorder-time">{formatTime(seconds)}</p>
          <button className="recorder-stop-btn" onClick={stopRecording}>
            <Square size={16} /> Stop
          </button>
        </div>
      )}

      {status === "recorded" && (
        <div className="recorder-preview">
          <audio controls src={audioUrl} className="recorder-audio" />
          <div className="recorder-preview-actions">
            <button
              className="recorder-rerecord-btn"
              onClick={reRecord}
              disabled={submitting}
            >
              <RotateCcw size={15} /> Re-record
            </button>
            <button
              className="recorder-submit-btn"
              onClick={handleSubmit}
              disabled={submitting}
            >
              <Send size={15} /> {submitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
