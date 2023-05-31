import { useEffect } from "react";
import ChatroomListItem from "./childcomponents/ChatroomListItem";

const ChatroomList = ({chatroom, chatroomList, fetchMessageHistoryForChatroom, user, addLoggedInUserToChatroom, postNewChatroom}) => {
    
    const list = chatroomList.map((chatroomObject) => <ChatroomListItem key={chatroomObject.id} 
    chatroom={chatroom}
    chatroomObject={chatroomObject} 
    addLoggedInUserToChatroom={addLoggedInUserToChatroom}
    fetchMessageHistoryForChatroom={fetchMessageHistoryForChatroom} 
    user={user}/>)


    const handleAddingNewChatroom = () => {
        postNewChatroom();
        console.log("button clicked");
    }

    return ( 
        <>
            <h2>Chatrooms</h2>
            <button onClick={handleAddingNewChatroom}>+</button>
            {list}
        </>
     );
}
 
export default ChatroomList;