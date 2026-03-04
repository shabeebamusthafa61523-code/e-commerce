import { useState } from "react";
import API from "../../services/api";

export default function AIChat() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");

  const askAI = async () => {
    const res = await API.post("/ai/chat", { message });
    setResponse(res.data.reply);
  };

  return (
    <div className="bg-white p-4 rounded-xl border space-y-3">
      <h3 className="font-semibold text-lg">AI Shopping Assistant</h3>

      <input
        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none"
        placeholder="Ask something..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button
        onClick={askAI}
        className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
      >
        Ask AI
      </button>

      {response && (
        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
          {response}
        </p>
      )}
    </div>
  );
}
