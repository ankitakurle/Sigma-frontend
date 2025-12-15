import "./ChatWindow.css"
import Chat from "./Chat.jsx"
import { MyContext } from "./Context.jsx"
import { useContext, useState, useEffect } from "react"
import {ScaleLoader} from "react-spinners"



function ChatWindow(){
    const {prompt,setPrompt,reply,setReply,currthreadId, prevChats,setPrevChats,setNewChat}=useContext(MyContext)
    const [loading,setLoading]=useState(false);
    const [isOpen,setIsOpen]=useState(false);

    const getReply=async()=>{
        
        setNewChat(false);
        setLoading(true);

        console.log("message:",prompt,"threadID:",currthreadId)
        const options={
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                message:prompt,
                threadId:currthreadId
            })
        };

        try{
            const response=await fetch("http://localhost:8080/api/chat",options)
            const rep=await response.json();
            console.log(rep)
            setReply(rep.reply);
            
        }catch(err){
            console.log(err)
        }
         setLoading(false);

    }

    //append new chat to prev chats


    useEffect(()=>{
        if(prompt&&reply){
            setPrevChats(prevChats=>(
                 [...prevChats,{
                    role:"user",
                    content:prompt
                 },{
                    role:"assistance",
                    content:reply
                 }]
            ))
        }
        
        setPrompt("");

    },[reply]);

  

    const handleProfileClick =()=>{
        setIsOpen(!isOpen);
    }

    return(
        <div className="ChatWindow">
            <div className="Navbar">
                <span>SigmaGPT <i className="fa-solid fa-angle-down"></i></span>
                <div className="userIconDiv" onClick={handleProfileClick}>
                    <span className="userIcon"><i className="fa-solid fa-user"></i></span>
                </div>
            </div>
            {
                isOpen && <div className="dropDown">
                    <div className="dropDownItem"><i className="fa-solid fa-gear"></i> settings</div>
                    <div className="dropDownItem"> <i className="fa-solid fa-cloud-arrow-up"></i> Upgrade Plan</div>
                    <div className="dropDownItem"><i className="fa-solid fa-right-from-bracket"></i> Logout</div>
                </div>
            }
        
            <Chat></Chat>
            
           
            <ScaleLoader color="#fff" loading={loading}></ScaleLoader>
            <div className="chatInput">
                <div className="inputBox">
                    <input placeholder="Ask anything" value={prompt} 
                    onChange={(e)=>setPrompt(e.target.value)}
                    onKeyDown={(e)=>e.key==='Enter'?getReply():""}></input>
                    <div id="submit" onClick={getReply}>
                        <i className="fa-solid fa-paper-plane"></i>
                    </div>
                    
                </div>
                
                <p className="info">SigmaGPT can make mistakes. Check important info. See Cookie Preferences.</p>
                

            </div>
        </div>
    )
}

export default ChatWindow;