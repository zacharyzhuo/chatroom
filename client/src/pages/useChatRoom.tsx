import { useEffect, useRef, useState } from "react";
import { io, Socket } from 'socket.io-client';
import { ChatMessage } from './types';
import { pipe } from "fp-ts/lib/function";

const NEW_MESSAGE_EVENT = "new-message-event";
const SOCKET_SERVER_URL = "http://localhost:3030";

const useChatRoom = () => {
    // 綁定來自socket的訊息狀態
    const [messages, setMessages] = useState<Array<ChatMessage>>([]);
    // 使用useRef建立socket物件
    const socketRef = useRef<Socket>(null!);

    // 每次畫面渲染時執行
    useEffect(() => {
        socketRef.current = io(SOCKET_SERVER_URL);
        // 監聽接收訊息事件
        socketRef.current.on(NEW_MESSAGE_EVENT, (message) => {

            pipe(
                message,
                () => ({
                    ...message,
                    isOwner: message.senderId === socketRef.current.id,
                }),
                (incomingMessage) => setMessages((messages) => [...messages, incomingMessage])
            )

            // // 判斷使否訊息發送人並重新賦值
            // const incomingMessage = {
            //     ...message,
            //     isOwner: message.senderId === socketRef.current.id,
            // };
            
            // // 改變訊息狀態
            // setMessages((messages) => [...messages, incomingMessage]);

        });

        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    // 發送訊息並廣播訊息
    const sendMessage = (messageBody: string) => {
        socketRef.current.emit(NEW_MESSAGE_EVENT, {
            message: messageBody,
            senderId: socketRef.current.id,
        });
    };

    return { messages, sendMessage };
};

export default useChatRoom;