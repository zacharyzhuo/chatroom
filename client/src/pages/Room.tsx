import React, { useRef, useState, useEffect } from "react";
import { Paper, TextField, Button, makeStyles } from "@material-ui/core";

import useChat from "./useChatRoom";
import clsx from "clsx";

// material-ui css設定
const useStyles = makeStyles({
    container: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#263238"
    },
    paper: {
        width: "50em",
        height: "80%",
        position: "relative"
    },
    action: {
        display: "flex",
        width: "96%",
        alignItems: "center",
        margin: "1em",
        position: "absolute",
        bottom: 0
    },
    sendButton: {
        width: "10em",
        height: "50%",
        margin: "0 2em"
    },
    messageInput: {
        width: "100%"
    },
    messageContainer: {
        overflowY: "auto",
        height: "85%"
    },
    divider: {
        margin: "0.1em"
    },
    message: {
        listStyle: "none"
    },
    guest: {
        margin: "1em",
        backgroundColor: "#0091EA",
        padding: "0.5em 1.5em",
        borderRadius: "20px",
        color: "#FFF",
        wordBreak: "break-word",
        maxWidth: "65%",
        width: "fit-content",
        marginRight: "auto"
    },
    owner: {
        margin: "1em",
        backgroundColor: "#8BC34A",
        padding: "0.5em 1.5em",
        borderRadius: "20px",
        color: "#FFF",
        wordBreak: "break-word",
        maxWidth: "65%",
        width: "fit-content",
        marginLeft: "auto"
    },
    ol: {
        paddingInlineEnd: "40px"
    }
});

const Room = () => {
    // 處理來自socket的訊息狀態
    const { messages, sendMessage } = useChat();
    // 綁定輸入欄位的訊息狀態
    const [newMessage, setNewMessage] = useState("");
    const classes = useStyles();
    // 設定插入訊息效果
    const messageRef = useRef<HTMLInputElement>(null);

    // 輸入欄位onChange事件
    const handleNewMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewMessage(event.currentTarget.value);
    };

    // 點擊按鈕送出訊息事件
    const handleSendMessage = () => {
        if (newMessage !== "") {
            sendMessage(newMessage);
            setNewMessage("");
        }
    };

    // 點擊enter送出訊息事件
    const handleKeyUp = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Enter") {
            if (newMessage !== "") {
                sendMessage(newMessage);
                setNewMessage("");
            }
        }
    }

    // 頁面渲染時執行
    useEffect(() => {
        if (messageRef && messageRef.current) {
            messageRef.current.scrollIntoView({ behavior: "smooth" })
        }
    })

    return (
        <div className={classes.container}>
            <Paper elevation={5} className={classes.paper}>
                <div className={classes.messageContainer}>
                    <ol className={classes.ol}>
                        {messages.map((message, i) => (
                            <li
                                key={i}
                                className={clsx(classes.message, message.isOwner ? classes.owner : classes.guest)}
                            >
                                <span>{message.message}</span>
                            </li>
                        ))}
                    </ol>
                    <div ref={messageRef}></div>
                </div>
                <div className={classes.action}>
                    <TextField
                        className={classes.messageInput}
                        id="message"
                        label="Message"
                        placeholder="enter message here"
                        variant="outlined"
                        value={newMessage}
                        onChange={handleNewMessageChange}
                        onKeyUp={handleKeyUp}
                    />
                    <Button
                        disabled={!newMessage}
                        variant="contained"
                        color="primary"
                        onClick={handleSendMessage}
                        className={classes.sendButton}
                    >
                        Send
                    </Button>
                </div>
            </Paper>
        </div>
    );
};

export default Room;