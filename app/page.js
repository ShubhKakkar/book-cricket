"use client";
import Image from 'next/image'
import styles from './page.module.css'
import { useEffect, useState } from 'react';
import useWebSocket from "@/hooks/useWebSocket"; 

export default function Home() {
  const ws = useWebSocket();
  useEffect(() => {
    if (!ws) return;
    ws.onmessage = async(message) => {
      // Handle WebSocket message
      const response = await JSON.parse(message.data);
      console.log(response);
      if(response.method === "connect") {
        localStorage.setItem("clientId", response?.clientId);
        console.log("Client Id is set successfully " + response?.clientId);
        const createPayload = {
          method: "create",
          clientId: localStorage.clientId,
        };
        ws.send(JSON.stringify(createPayload));
      }
      if (response.method === "create") {
        let gameId = response?.game?.gameId;
        localStorage.setItem("gameId", gameId);
        console.log("game Id is set successfully " + gameId);
      }
    };

    // Clean up the event listener when the component unmounts
    return () => {
      ws.onmessage = null;
    };
  }, [ws]);
  const handleCreateClientAndJoin = async() => {
    if (ws) {
      const payload = {
        method: "connect",
        clientId: "123456",
        userId: "Shubham Kakkar",
        totalRuns: 1001,
        userId: "123456",
        email: "webkoala1998@gmail.com",
        name: "Shubham Kakkar",
      };
      ws.send(JSON.stringify(payload));
    }
  }
  return (
    <main className={styles.create_game}>
      {/* Game Generation */}
      <div className={styles.rules_banner}>
        <div className={styles.rules_set}>
          <h2>Rules</h2>
          <p>
            1 Lorem ipsum dolor sit amet consectetur. Nulla vel acconsequat sed
            sagittis
          </p>
          <p>
            2 Lorem ipsum dolor sit amet consectetur. Nulla vel ac consequat sed
            sagittis
          </p>
          <p>
            3 Lorem ipsum dolor sit amet consectetur. Nulla vel ac consequat sed
            sagittis
          </p>
        </div>
      </div>
      <div className={styles.title}>Book Cricket</div>
      <div className={styles.action_buttons}>
        <button className={styles.button} onClick={handleCreateClientAndJoin}>VS</button>
        <p className={styles.button_note}>Play against friends</p>
      </div>
    </main>
  );
}
