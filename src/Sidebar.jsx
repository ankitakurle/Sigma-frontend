import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./Context";
import { v1 as uuidv1 } from "uuid";

const API_BASE = import.meta.env.VITE_API_BASE;

function Sidebar() {
  const {
    allThreads,
    setAllThreads,
    currthreadId,
    setNewChat,
    setPrompt,
    setReply,
    setcurrThreadId,
    setPrevChats
  } = useContext(MyContext);

  const getAllThreads = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/thread`);
      const res = await response.json();

      setAllThreads(
        res.map(t => ({
          threadId: t.threadId,
          title: t.title
        }))
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getAllThreads();
  }, [currthreadId]);

  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setcurrThreadId(uuidv1());
    setPrevChats([]);
  };

  const changeThread = async (id) => {
    setcurrThreadId(id);
    try {
      const response = await fetch(`${API_BASE}/api/thread/${id}`);
      const res = await response.json();
      setPrevChats(res);
      setNewChat(false);
      setReply(null);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ DELETE THREAD (WORKING)
  const deleteThread = async (e, threadId) => {
    e.stopPropagation(); // ⛔ stop opening thread

    try {
      await fetch(`${API_BASE}/api/thread/${threadId}`, {
        method: "DELETE"
      });

      // 🔥 Update UI immediately
      setAllThreads(prev =>
        prev.filter(t => t.threadId !== threadId)
      );

      // if deleted thread was open → reset chat
      if (threadId === currthreadId) {
        createNewChat();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="sidebar">
      <button onClick={createNewChat}>
        <img src="/blacklogo.png" alt="logo" className="logo" />
        <span>
          <i className="fa-solid fa-pen-to-square"></i>
        </span>
      </button>

      <ul className="history">
        {allThreads.map(thread => (
          <li
            key={thread.threadId}
            className={thread.threadId === currthreadId ? "highlighted" : ""}
            onClick={() => changeThread(thread.threadId)}
          >
            {thread.title}

            {/* ✅ DELETE ICON */}
            <i
              className="fa-solid fa-trash"
              onClick={(e) => deleteThread(e, thread.threadId)}
            ></i>
          </li>
        ))}
      </ul>

      <div className="sign">
        <p>By SigmaGPT ♥</p>
      </div>
    </section>
  );
}

export default Sidebar;

