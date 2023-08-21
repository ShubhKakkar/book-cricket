"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import useWebSocket from "@/hooks/useWebSocket";
import FriendsModal from "@/components/FriendsModal";
import PlayModal from "@/components/PlayModal";

export default function Home() {
  const ws = useWebSocket();
  const [openFriendList, setOpenFriendList] = useState(false);
  const [playModal, setPlayModal] = useState(false);
  const [activePlayers, setActivePlayers] = useState([]);
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [player1TotalRuns, setPlayer1TotalRuns] = useState(0);
  const [player2TotalRuns, setPlayer2TotalRuns] = useState(0);
  const [player1TotalOuts, setPlayer1TotalOuts] = useState(0);
  const [player2TotalOuts, setPlayer2TotalOuts] = useState(0);
  const [totalBallsPlayedByPlayer1, setTotalBallsPlayedByPlayer1] = useState(0);
  const [totalBallsPlayedByPlayer2, setTotalBallsPlayedByPlayer2] = useState(0);
  const [game, setGame] = useState(0);
  useEffect(() => {
    if (!ws) return;
    ws.onmessage = async (message) => {
      // Handle WebSocket message
      const response = await JSON.parse(message.data);
      if (response.method === "connect") {
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
        setOpenFriendList(true);
        const payload = {
          method: "active-players",
        };
        ws.send(JSON.stringify(payload));
      }
      if (response.method === "active-players") {
        const livePlayers = response?.game?.livePlayers;
        setActivePlayers(livePlayers);
      }
      if (response.method === "invite-confirmation") {
        const user_id = response?.data?.user_id;
        const client_id = response?.data?.client_id;
        const gameId = response?.data?.gameId;
        const result = prompt(
          `User with client id ${client_id} has invited you to join this game ${gameId}`
        );
        if (result === "yes") {
          const confirmPayload = {
            method: "invite-answer",
            player1: localStorage.getItem("clientId"),
            player2: user_id,
            gameId: gameId,
            answer: "yes",
          };
          ws.send(JSON.stringify(confirmPayload));
        }
      }
      if (response?.method === "open-play-modal") {
        setPlayer1(response?.data?.player1);
        setPlayer2(response?.data?.player2);
        setGame(response?.data?.gameId);
        setPlayModal(true);
      }
      if (response?.method === "update") {
        let allClients = response.game.clients;
        setPlayer1TotalOuts(allClients[0].outCount);
        setPlayer2TotalOuts(allClients[1].outCount);
        setPlayer1TotalRuns(allClients[0].totalRuns);
        setPlayer2TotalRuns(allClients[1].totalRuns);

      }
      const payload = {
        method: "active-players",
      };
      ws.send(JSON.stringify(payload));
    };

    // Clean up the event listener when the component unmounts
    return () => {
      ws.onmessage = null;
    };
  }, [ws]);
  const handleCreateClientAndJoin = async () => {
    if (ws) {
      const payload = {
        method: "connect",
        clientId: "123456",
        totalRuns: 10000,
        userId: "12345",
        email: "webkoala1998@gmail.com",
        name: "Shubham Kakkar",
      };
      // const payload = {
      //   method: "connect",
      //   clientId: "1234567",
      //   totalRuns: 20000,
      //   userId: "123456",
      //   email: "testuser@gmail.com",
      //   name: "Test User",
      // };
      ws.send(JSON.stringify(payload));
    }
  };
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
        <button className={styles.button} onClick={handleCreateClientAndJoin}>
          VS
        </button>
        <p className={styles.button_note}>Play against friends</p>
      </div>
      {/* Friend Invitation */}
      {openFriendList && (
        <FriendsModal
          setOpenFriendList={setOpenFriendList}
          setPlayModal={setPlayModal}
          activePlayers={activePlayers}
        />
      )}
      {playModal && (
        <PlayModal
          setPlayModal={setPlayModal}
          player1={player1}
          player2={player2}
          player1TotalOuts={player1TotalOuts}
          player1TotalRuns={player1TotalRuns}
          player2TotalOuts={player2TotalOuts}
          player2TotalRuns={player2TotalRuns}
          totalBallsPlayedByPlayer1={totalBallsPlayedByPlayer1}
          totalBallsPlayedByPlayer2={totalBallsPlayedByPlayer2}
          game={game}
        />
      )}
    </main>
  );
}
