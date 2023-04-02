"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const speakers: string[] = [];
for (let i = 0; i <= 108; i++) {
  speakers.push(`${process.env.NEXT_PUBLIC_BE_URL}/static/samples/${i}.wav`);
}

export default function Home() {
  const [filename, setFilename] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [speakerIndex, setSpeakerIndex] = useState("0");
  const [prompt, setPrompt] = useState("");

  const [taskId, setTaskId] = useState("");

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

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();

    const url = `${process.env.NEXT_PUBLIC_BE_URL}/api/generate`;
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: prompt.replace("\n", " "),
        speaker_index: currentIndex,
        output_file_name: filename,
      }),
    };
    fetch(url, requestOptions)
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            setTaskId(data.task_id);
          });
        }
      })
      .catch((error) => {
        setTaskId("");
        return alert(`Form submit error ${error}`);
      });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-10">
      <form
        className="w-1/3 flex flex-col items-start justify-center gap-5"
        onSubmit={handleSubmit}
      >
        <h1 className="w-full text-center text-3xl text-black font-bold">
          SPEECH SYNTHESIZER
        </h1>
        <div className="mb-4 w-full">
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

        <div className="mb-4 w-full">
          <label htmlFor="speaker-index" className="block font-bold mb-1">
            Speaker Index:
          </label>

          <div
            id="speaker-selection"
            className="flex flex-col justify-cente gap-3"
          >
            <div className="flex flex-row justify-center items-center gap-5 text-xl">
              <a
                href="#"
                onClick={() => {
                  offsetIndex(-1);
                }}
              >
                &#10094;
              </a>
              <div className="flex flex-col justify-center items-center">
                {currentIndex}
              </div>
              <a
                href="#"
                onClick={() => {
                  offsetIndex(1);
                }}
              >
                &#10095;
              </a>
            </div>
            <div className="flex flex-row items-center gap-3 justify-center">
              <input
                type="text"
                id="speaker-index"
                value={speakerIndex}
                onChange={handleSpeakerIndexFieldChange}
                className="w-11 px-2 py-1 border rounded-md border-gray-400"
              />
              <a href="#" onClick={changeSpeakerIndex} className="underline">
                Go
              </a>
            </div>
            <div className="flex flex-row items-center gap-3 justify-center">
              <a href="#" className="" onClick={playAudio}>
                Play Audio &#9654;
              </a>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex flex-row items-center justify-start max-w-sm gap-8">
            <label htmlFor="filename" className="block font-bold mb-1">
              Filename:
            </label>
            <div className="flex flex-row items-center gap-2">
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
        </div>
        <div className="flex justify-center w-full">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold text-lg py-3 px-6 rounded-3xl focus:outline-none focus:shadow-outline"
          >
            Submit
          </button>
        </div>
      </form>
      {taskId !== "" && (
        <div className="flex flex-col items-center">
          <div>Your tasks id: {taskId}</div>
          <Link href={`/task/${taskId}`}>See tasks status</Link>
        </div>
      )}
    </div>
  );
}
