"use client";
import { useEffect, useState } from "react";

const speakers: string[] = [];
for (let i = 0; i <= 108; i++) {
  speakers.push(`http://www.localhost:8000/static/samples/${i}.wav`);
}

export default function Home() {
  const [filename, setFilename] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [speakerIndex, setSpeakerIndex] = useState("");
  const [prompt, setPrompt] = useState("");

  const offsetIndex = (offset: number) => {
    let newIndex = currentIndex + offset;
    if (newIndex < 0) {
      newIndex = speakers.length - 1;
    } else if (newIndex >= speakers.length) {
      newIndex = 0;
    }
    setCurrentIndex(newIndex);
  };

  const handleSpeakerIndexFieldChange = (event: {
    target: { value: string };
  }) => {
    const result = event.target.value.replace(/\D/g, "");

    setSpeakerIndex(result);
  };

  const changeSpeakerIndex = () => {
    let index = Number(speakerIndex);
    if (index < 0) index = 0;
    else if (index >= speakers.length) index = speakers.length - 1;
    setCurrentIndex(index);
    setSpeakerIndex(index.toString());
  };

  const playAudio = () => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    audio?.play();
  };

  useEffect(() => {
    setAudio((prev) => {
      if (prev) {
        prev.pause();
        prev.currentTime = 0;
      }
      return new Audio(speakers[currentIndex]);
    });
  }, [currentIndex]);

  useEffect(() => {
    audio?.play();
  }, [audio]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form className="w-1/3">
        <div className="mb-4">
          <label htmlFor="prompt" className="block font-bold mb-1">
            Your text:
          </label>
          <textarea
            id="prompt"
            name="prompt"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md border-gray-400"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="speaker-index" className="block font-bold mb-1">
            Speaker Index:
          </label>

          <div id="speaker-selection" className="relative w-48 h-16">
            <input
              type="text"
              size={1}
              id="speaker-index"
              value={speakerIndex}
              onChange={handleSpeakerIndexFieldChange}
              className="w-full px-3 py-2 border rounded-md border-gray-400"
            />
            <a href="#" onClick={changeSpeakerIndex}>
              Go
            </a>

            <div className="">
              <a
                href="#"
                className="" // make this in the left positions
                onClick={() => {
                  offsetIndex(-1);
                }}
              >
                &#10094;
              </a>
              <div className="">{currentIndex}</div>
              <audio id="audio-sample"></audio>
              <a href="#" className="" onClick={playAudio}>
                &#9654;
              </a>
              <a
                href="#"
                className=""
                onClick={() => {
                  offsetIndex(1);
                }}
              >
                &#10095;
              </a>
            </div>
          </div>
        </div>

        <div className="mb-4 flex flex-row items-center justify-start max-w-sm gap-8">
          <label htmlFor="filename" className="block font-bold mb-1">
            Filename:
          </label>
          <div className="flex flex-row items-center">
            <input
              type="text"
              size={7}
              id="filename"
              name="filename"
              value={filename}
              onChange={(event) => setFilename(event.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md border-gray-400"
            />
            <div>.wav</div>
          </div>
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
