import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./Context.jsx";
import { useContext, useState, useEffect } from "react";
import { ScaleLoader } from "react-spinners";
import { sendMessage } from "./api/chat.js";
import { v1 as uuidv1 } from "uuid";

function ChatWindow() {
  const {
    prompt,
    setPrompt,
    reply,
    setReply,
    currthreadId,
    prevChats,
    setPrevChats,
    setNewChat,
    setcurrThreadId
  } = useContext(MyContext);

  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  /* ---------------- SEND MESSAGE ---------------- */
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

  /* ---------------- APPEND CHAT ---------------- */
  useEffect(() => {
    if (prompt && reply) {
      setPrevChats(prev => ([
        ...prev,
        { role: "user", content: prompt },
        { role: "assistant", content: reply }
      ]));
    }
    setPrompt("");
  }, [reply]);

  /* ================= USER MENU LOGIC ================= */

  // SETTINGS
  const handleSettings = () => {
    alert("Settings coming soon");
    setIsOpen(false);
  };

  // UPGRADE
  const handleUpgrade = () => {
    alert("Upgrade plan coming soon");
    setIsOpen(false);
  };

  // LOGOUT
  const handleLogout = () => {
    setPrompt("");
    setReply(null);
    setPrevChats([]);
    setNewChat(true);
    setcurrThreadId(uuidv1());
    setIsOpen(false);
  };

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

      {/* 🔽 DROPDOWN (UNCHANGED UI, ONLY LOGIC ADDED) */}
      {isOpen && (
        <div className="dropDown">
          <div className="dropDownItem" onClick={handleSettings}>
            <i className="fa-solid fa-gear"></i> Settings
          </div>

          <div className="dropDownItem" onClick={handleUpgrade}>
            <i className="fa-solid fa-cloud-arrow-up"></i> Upgrade
          </div>

          <div className="dropDownItem" onClick={handleLogout}>
            <i className="fa-solid fa-right-from-bracket"></i> Logout
          </div>
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
