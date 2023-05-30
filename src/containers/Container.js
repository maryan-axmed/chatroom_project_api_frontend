import { useState, useEffect } from "react";
import Chatroom from "../components/Chatroom";
import ChatroomList from "../components/ChatroomList";
import User from "../components/User";
const SERVER_URL = 'http://localhost:8080';


const Container = () => {

    const [chatroom, setChatroom] = useState(null);
    const [chatroomList, setChatroomList] = useState([]);

    const [user, setUser] = useState({});
    const [userList, setUserList] = useState([]);

    const [message, setMessage] = useState("");
    const [messageHistory, setMessageHistory] = useState([]);

    // const [chatroomUserList, setChatroomUserList] = useState ([]);
    
    // const fetchChatroomUsers = async(chatroomId) => {
    //     const response = await fetch(`${SERVER_URL}/chatrooms/${chatroomId}`);
    //     const jsonData = await response.json();
    //     // const list = jsonData.map((chatroom) => chatroom.users);
    //     const list = await jsonData.users;
    //     setChatroomUserList(list);
    //     console.log(chatroomUserList);
    // }

    const fetchChatroomList = async() => {
        const response = await fetch(`${SERVER_URL}/chatrooms`);
        const jsonData = await response.json();
        setChatroomList(jsonData);
        // setChatroom(jsonData[0])
    };
    const fetchUserList = async() => {
        const response = await fetch(`${SERVER_URL}/users`);
        const jsonData = await response.json();
        setUserList(jsonData);
        setUser(jsonData[0]);
    };

    // const fetchMessageHistory = async() => {
    //     const response = await fetch(`${SERVER_URL}/messages/1`);
    //     const jsonData = await response.json();
    //     setMessageHistory(jsonData);
    // }

    const fetchMessageHistoryForChatroom = async (chatroomId) => {
        const response = await fetch(`${SERVER_URL}/messages/${chatroomId}`);
        const jsonData = await response.json();
        setMessageHistory(jsonData);
        const response2 = await fetch(`${SERVER_URL}/chatrooms/${chatroomId}`);
        const jsonData2 = await response2.json();
        setChatroom(jsonData2);
        // fetchChatroomUsers(chatroomId);
        
    }

    useEffect(()=>{
        if(chatroom){
            addLoggedInUserToChatroom(user.id, chatroom.id);
        }
    }, [chatroom])



    const postMessage = async (newMessage) => {
        // send to db
        const response = await fetch(`${SERVER_URL}/messages`, {
            method: "POST",
            headers: {"Content-type" : "application/json"},
            body : JSON.stringify(newMessage)
        })
        // send to client-side
        const savedMessage = await response.json();
        setMessageHistory([...messageHistory, savedMessage]);
        
    };

    const addLoggedInUserToChatroom = async (userId, chatroomId) => {
        if(chatroom){
            if(chatroom.users.some((user) => user.id === userId)){
                return
            }
        }
        const response = await fetch(`${SERVER_URL}/chatrooms/${chatroomId}/users/${userId}/add`, {
                method: "PATCH",
                headers: {"Content-type" : "application/json"},
        })
        //change on the client side
        const response2 = await fetch(`${SERVER_URL}/chatrooms/${chatroomId}`);
        const jsonData2 = await response2.json();
        setChatroom(jsonData2);
        const userResponse = await fetch(`${SERVER_URL}/users/${userId}`);
        const userDataUpdated = await userResponse.json();
        setUserList([...userList,userDataUpdated])
    };

    // const getChatroomById = async(chatroomID) => {
    //     // send to db
    //     const response = await fetch(`${SERVER_URL}/chatrooms/${chatroomID}`);
    //     const jsonData = await response.json();
    //     setChatroom(jsonData);
    //     // send to cli
    // }
    
    useEffect(() => {
        fetchChatroomList();
        fetchUserList();
    },[])

    return ( 
        <div className="mainContainer">
            <div className="user_and_logo">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Chat_icon_new_message.svg/1200px-Chat_icon_new_message.svg.png" style={{width:"100px"}}/>
                <User/>
            </div>
            {chatroom ? <Chatroom 
                chatroom={chatroom} 
                messageHistory={messageHistory} 
                message={message} 
                postMessage={postMessage} 
                user={user} 
                chatroomUserList={chatroom.users}/> : null}
            <div className="chatroomList_container">
            
            <ChatroomList 
                chatroom={chatroom} 
                chatroomList={chatroomList} 
                fetchMessageHistoryForChatroom={fetchMessageHistoryForChatroom}  
                addLoggedInUserToChatroom={addLoggedInUserToChatroom}
                user={user}/>
            </div>
        </div>

     );
}
 
export default Container;