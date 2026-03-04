import { createContext, useContext, useState } from "react";
import aiService from "../services/aiService";

const AIContext = createContext();

export const AIProvider = ({ children }) => {
  const [aiReply, setAiReply] = useState("");
  const [recommendations, setRecommendations] = useState([]);

  const askAI = async (question) => {
    const res = await aiService.ask(question);
    setAiReply(res.reply);
    setRecommendations(res.recommendations || []);
  };

  return (
    <AIContext.Provider
      value={{ aiReply, recommendations, askAI }}
    >
      {children}
    </AIContext.Provider>
  );
};

export const useAI = () => useContext(AIContext);
