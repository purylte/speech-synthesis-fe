"use client";

import { useState } from "react";

export default function Task({ params }: { params: { taskId: string } }) {
  const [taskId, setTaskId] = useState(params.taskId);
  const [data, setData] = useState("");
  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();

    const url = `http://www.localhost:8000/api/tasks/${taskId}`;
    fetch(url)
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            setData(data);
          });
        }
      })
      .catch((error) => {
        return alert(`Form submit error ${error}`);
      });
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-y-6">
      <form
        className="w-1/3 flex flex-col items-start justify-center gap-3"
        onSubmit={handleSubmit}
      >
        <h1 className="mb-4 w-full text-center text-3xl text-black font-bold">
          Task Status
        </h1>

        <div className="mb-4 w-full flex flex-col items-center justify-center gap-3">
          <label htmlFor="task-id" className="font-bold w-full">
            Task ID:
          </label>
          <input
            type="text"
            id="task-id"
            name="task-id"
            value={taskId}
            onChange={(event) => setTaskId(event.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md border-gray-400"
          />
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

      {data !== "" && (
        <div className="max-w-2xl">
          <h1>Response: </h1>
          <pre className="p-4 bg-stone-300 rounded-lg overflow-x-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
