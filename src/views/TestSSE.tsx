import React, { useState, useRef, useCallback } from "react";

const useChatWithAI = () => {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState("");
  const readerRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(
    null
  );
  const decoderRef = useRef(new TextDecoder("utf-8"));

  const sendMessage = useCallback(async () => {
    const requestBody = {
      model: "Gemini 1.5 Flash",
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
      temperature: 0.2,
      top_p: 0.5,
      top_k: 0,
    };

    try {
      const response = await fetch("http://localhost:8000/stream_chat_es", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      readerRef.current = response.body?.getReader() ?? null;

      const processResult = async (
        result: ReadableStreamReadResult<Uint8Array>
      ) => {
        if (result.done) return;
        const token = decoderRef.current.decode(result.value!);
        if (token.endsWith(".") || token.endsWith("!") || token.endsWith("?")) {
          setResult((prevResult) => prevResult + token + "<br>");
        } else {
          setResult((prevResult) => prevResult + token + " ");
        }
        await readerRef.current!.read().then(processResult);
      };

      readerRef.current?.read().then(processResult);
    } catch (error) {
      console.error("Error:", error);
    }
  }, [message]);

  return { message, setMessage, result, sendMessage };
};

const ChatWithAI: React.FC = () => {
  const { message, setMessage, result, sendMessage } = useChatWithAI();

  return (
    <div style={styles.body}>
      <div style={styles.chatContainer}>
        <h1>Chat with AI</h1>
        <div
          id="result"
          style={styles.result}
          dangerouslySetInnerHTML={{ __html: result }}
        ></div>
        <input
          type="text"
          id="message"
          placeholder="Type your message here"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={styles.message}
        />
        <button onClick={sendMessage} style={styles.button}>
          Send Message
        </button>
      </div>
    </div>
  );
};

const styles = {
  body: {
    fontFamily: "Arial, sans-serif",
    margin: 0,
    padding: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f2f2f2",
  } as React.CSSProperties,
  chatContainer: {
    borderRadius: "5px",
    backgroundColor: "white",
    padding: "20px",
    maxWidth: "500px",
    width: "100%",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
  } as React.CSSProperties,
  result: {
    height: "400px",
    overflowY: "auto",
    border: "1px solid #ccc",
    padding: "10px",
    marginBottom: "10px",
  } as React.CSSProperties,
  message: {
    width: "70%",
    padding: "10px",
    marginRight: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  } as React.CSSProperties,
  button: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#007BFF",
    color: "white",
  } as React.CSSProperties,
};

export default ChatWithAI;
