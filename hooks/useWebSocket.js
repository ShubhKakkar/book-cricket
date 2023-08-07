"use client";
import { useEffect, useState } from "react";

const useWebSocket = () => {
  const [ws, setWebSocket] = useState(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");
    setWebSocket(socket);

    return () => {
      socket.close();
    };
  }, []);

  return ws;
};

export default useWebSocket;
