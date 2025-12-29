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

      const filtered = res.map(t => ({
        threadId: t.threadId,
        title: t.title
      }));

      setAllThreads(filtered);   // ✅ FIXED
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

  return (
    <section className="sidebar">
      <button onClick={createNewChat}>
        <img src="/blacklogo.png" alt="logo" className="logo" />
        <span><i className="fa-solid fa-pen-to-square"></i></span>
      </button>

      <ul className="history">
        {allThreads?.map((t) => (
          <li
            key={t.threadId}
            className={t.threadId === currthreadId ? "highlighted" : ""}
            onClick={() => changeThread(t.threadId)}
          >
            {t.title}
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
