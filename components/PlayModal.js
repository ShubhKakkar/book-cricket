"use client";
import React, { useEffect, useState } from "react";
import styles from "./PlayModal.module.css";
import useWebSocket from "@/hooks/useWebSocket";

const PlayModal = ({
  player1,
  player2,
  player1TotalOuts,
  player1TotalRuns,
  player2TotalOuts,
  player2TotalRuns,
  totalBallsPlayedByPlayer1,
  totalBallsPlayedByPlayer2,
  game
}) => {
  const ws = useWebSocket();
  useEffect(() => {
    if (!ws) return;

    ws.onmessage = async (message) => {
      const response = await JSON.parse(message.data);
    };

    // Clean up the event listener when the component unmounts
    return () => {
      ws.onmessage = null;
      ws.onerror = null;
      ws.onopen = null;
    };
  }, [ws]);
  const handlePlay = () => {
    const playPayload = {
      method: "play",
      clientId: localStorage.getItem("clientId"),
      gameId: localStorage.getItem("gameId"),
      runsScored: Math.floor(Math.random() * 10),
    };
    ws.send(JSON.stringify(playPayload));
  };
  return (
    <div className={styles.wrapper}>
      <div className={styles.play__container}>
        <div className={styles.player_box}>
          <h1>Player 1</h1>
          <p>client_id: {player1}</p>
          <p>Total Runs: {player1TotalRuns}</p>
          <p>Total Outs: {player1TotalOuts}</p>
          <p>Total Balls Played: {totalBallsPlayedByPlayer1}</p>
          {localStorage.getItem("clientId") === player1 && (
            <button onClick={handlePlay}>Swipe Page</button>
          )}
        </div>
        <div className={styles.player_box}>
          <h1>Player 2</h1>
          <p>client_id: {player2}</p>
          <p>Total Runs: {player2TotalRuns}</p>
          <p>Total Outs: {player2TotalOuts}</p>
          <p>Total Balls Played: {totalBallsPlayedByPlayer2}</p>
          {localStorage.getItem("clientId") === player2 && (
            <button onClick={handlePlay}>Swipe Page</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayModal;
