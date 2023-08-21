"use client";
import React, { useEffect, useState } from "react";
import useWebSocket from "@/hooks/useWebSocket";
import styles from "./FriendsModal.module.css";

const FriendsModal = ({ setOpenFriendList, setPlayModal, activePlayers }) => {
  const ws = useWebSocket();

  useEffect(() => {
    if (!ws) return;

    ws.onmessage = async (message) => {
      const response = await JSON.parse(message.data);
      if(response.method === "invite-result") {
        const res = response?.result;
        console.log(result);
        // TODO: Show result to user in modal?
        if(res === "Invite accepted") {
          setOpenFriendList(false);
          setPlayModal(true);
        }
        else {
          return;
        }
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


  const sendPlayerInvite = async(client_id, userId) => {
    if(localStorage.getItem("gameId")) {
      const invitePayload = {
        method: "invite",
        client_id: client_id,
        user_id: userId,
        gameId: localStorage.getItem("gameId"),
      }
      try {
        ws.send(JSON.stringify(invitePayload));
      }
      catch(err) {
        console.log(err);
      }
    }
    else {
      return;
    }
  }

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
                    <button className={styles.send_invite} onClick={() => {
                      sendPlayerInvite(client.client_id, localStorage.getItem("clientId"));
                    }}>Send Invite</button>
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
