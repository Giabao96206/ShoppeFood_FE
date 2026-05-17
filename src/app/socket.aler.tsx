import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { useCurrentApp } from "../context/app.context";
import { connectSocket } from "./socket";

const AlerSocket = () => {
  const { appState, setLastMessgae } = useCurrentApp();
  const [newMessageAlert, setNewMessageAlert] = useState<string | null>(null);

  useEffect(() => {
    if (!appState?.user?._id) return;
    const socket = connectSocket(appState.access_token);
    if (!socket) return;

    const handleNewMessage = (message: any) => {
      setNewMessageAlert("Bạn có tin nhắn mới");
      setLastMessgae((prev: IUser[]) =>
        prev.map((user) =>
          user._id === message.conversation_id
            ? {
                ...user,
                lastMessage: {
                  ...user.lastMessage,
                  sender_id: message.sender_id,
                  content: message.content,
                  createdAt: message.createdAt,
                },
              }
            : user,
        ),
      );
      setTimeout(() => {
        setNewMessageAlert(null);
      }, 2000);
    };

    socket.on("receive_new_message", handleNewMessage);

    return () => {
      socket.off("receive_new_message", handleNewMessage);
    };
  }, [appState?.user._id]);

  return (
    <>
      {newMessageAlert ? (
        <View
          style={{
            position: "absolute",
            top: 50,
            alignSelf: "center",
            backgroundColor: "#000",
            padding: 10,
            borderRadius: 10,
            zIndex: 999,
          }}
        >
          <Text style={{ color: "white" }}>{newMessageAlert}</Text>
        </View>
      ) : (
        <View></View>
      )}
    </>
  );
};

export default AlerSocket;
