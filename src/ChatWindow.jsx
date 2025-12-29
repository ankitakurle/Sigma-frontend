import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./Context.jsx";
import { useContext, useState, useEffect } from "react";
import { ScaleLoader } from "react-spinners";
import { sendMessage } from "./api/chat.js";

function ChatWindow() {
  const {
    prompt,
    setPrompt,
    reply,
    setReply,
    currthreadId,
    prevChats,
    setPrevChats,
    setNewChat
  } = useContext(MyContext);

  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const getReply = async () => {
    if (!prompt.trim()) return;

    setNewChat(false);
    setLoading(true);

    try {
      const rep = await sendMessage(currthreadId, prompt);
      setReply(rep);
    } catch (err) {
      console.error(err);
      alert("Server not responding");
    }

    setLoading(false);
  };

  useEffect(() => {
    if (prompt && reply) {
      setPrevChats(prev => ([
        ...prev,
        { role: "user", content: prompt },
        { role: "assistant", content: reply }   // ✅ FIXED
      ]));
    }
    setPrompt("");
  }, [reply]);

  return (
    <div className="ChatWindow">
      <div className="Navbar">
        <span>SigmaGPT</span>
        <div className="userIconDiv" onClick={() => setIsOpen(!isOpen)}>
          <span className="userIcon">
            <i className="fa-solid fa-user"></i>
          </span>
        </div>
      </div>

      {isOpen && (
        <div className="dropDown">
          <div className="dropDownItem">Settings</div>
          <div className="dropDownItem">Upgrade</div>
          <div className="dropDownItem">Logout</div>
        </div>
      )}

      <Chat />

      <ScaleLoader color="#fff" loading={loading} />

      <div className="chatInput">
        <div className="inputBox">
          <input
            placeholder="Ask anything"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && getReply()}
          />
          <div id="submit" onClick={getReply}>
            <i className="fa-solid fa-paper-plane"></i>
          </div>
        </div>

        <p className="info">
          SigmaGPT can make mistakes. Check important info.
        </p>
      </div>
    </div>
  );
}

export default ChatWindow;
