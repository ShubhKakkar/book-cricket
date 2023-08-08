import React, { useEffect, useState } from "react";
import useWebSocket from "@/hooks/useWebSocket";
import styles from "./FriendsModal.module.css";

const FriendsModal = ({ setOpenFriendList }) => {
  const ws = useWebSocket();
  const [activePlayers, setActivePlayers] = useState([]);

  useEffect(() => {
    if (!ws) return;

    ws.onopen = () => {
      console.log("WebSocket connected!");
      const payload = {
        method: "active-players",
      };
      ws.send(JSON.stringify(payload));
    };

    ws.onmessage = async (message) => {
      const response = await JSON.parse(message.data);
      console.log(response);
      if (response.method === "active-players") {
        const livePlayers = response?.game?.livePlayers;
        setActivePlayers(livePlayers);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    // Clean up the event listener when the component unmounts
    return () => {
      ws.onmessage = null;
      ws.onerror = null;
      ws.onopen = null;
    };
  }, [ws]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.wrapper_inner}>
        <p
          className={styles.close}
          onClick={() => {
            setOpenFriendList(false);
          }}
        >
          &#x2715;
        </p>
        <input
          type="text"
          className={styles.input_name}
          placeholder="Search Players"
        />
        <div>
          {activePlayers?.length > 0 &&
            activePlayers.map((client, index) => {
              return (
                <div key={client.client_id} className={styles.clients_wrapper}>
                  <div className={styles.client_single}>
                    <p className={styles.list_count}>{index + 1}</p>
                    <h1 className={styles.client_name}>{client.name}</h1>
                    <h2 className={styles.client_email}>{client.email}</h2>
                    <button className={styles.send_invite}>Send Invite</button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default FriendsModal;
