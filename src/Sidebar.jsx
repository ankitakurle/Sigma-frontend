import "./Sidebar.css"
import { useContext, useEffect } from "react"
import { MyContext } from "./Context"
import {v1 as uuidv1} from "uuid"


function Sidebar(){
    const {allThreads,setAllThreads,currthreadId,setNewChat,setPrompt,setReply,setcurrThreadId,setPrevChats}=useContext(MyContext);

   const getAllThreads=async ()=>{
    try{
        const response=await fetch("http://localhost:8080/api/thread");
        const res = await response.json();
        const filteredData = res.map(thread=>({threadId:thread.threadId,title:thread.title}))
        // console.log(filteredData);
        setAllThreads(filteredData);

    }catch(err){
        console.log(err);
    }

   };

   useEffect(()=>{
    getAllThreads();

   },[currthreadId])

   const createNewChat =()=>{
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setcurrThreadId(uuidv1());
    setPrevChats([]);
    
   }

   const changeThread=async(newthreadId)=>{
    setcurrThreadId(newthreadId);

    try{
        const response=await fetch(`http://localhost:8080/api/thread/${newthreadId}`);
        const res=await response.json();
        console.log(res);
        setPrevChats(res);
        setNewChat(false);
        setReply(null);

    }catch(err){
        console.log(err);
    }

   }

   const deleteThread=async(threadId)=>{
       try{
        const response=await fetch(`http://localhost:8080/api/thread/${threadId}`,{method:"delete"});
        const res=await response.json();
        

        //updated threads rerender
        setAllThreads(prev=>prev.filter(thread=>thread.threadId!==threadId));

        if(threadId===currthreadId){
            createNewChat();
        }

       }catch(err){
        console.log(err);
       }
   }

    return(
        <section className="sidebar">
            {/* new chat button */}
            <button onClick={createNewChat}>
                <img src="src/assets/blacklogo.png" alt="Gpt logo" className="logo"></img>
                <span><i className="fa-solid fa-pen-to-square"></i></span>
            </button>

            {/* history */}
            <ul className="history">
               {
                allThreads?.map((thread,idx)=>(
                    <li key={idx} onClick={()=>changeThread(thread.threadId)} className={thread.threadId===currthreadId ? "highlighted":" "}>{thread.title}
                    <i className="fa-solid fa-trash" onClick={(e)=>{
                        e.stopPropagation();//stop event bubbling
                        deleteThread(thread.threadId);
                    }}></i></li>
                ))
               }

            </ul>

            {/* sign */}
            <div className="sign">
                <p>By SigmaGPT &hearts;</p>
            </div>

            

        </section>
    )
}

export default Sidebar;