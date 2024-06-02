import "./addUser.css";
import { db } from "../../../../lib/firebase";
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useUserStore } from "../../../../lib/userStore";
import { useChatStore } from "../../../../lib/chatStore";

const AddUser = ({ onClose }) => {
  const { currentUser } = useUserStore();
  const { changeChat } = useChatStore();

  const getRandomUser = async () => {
    try {
      const userRef = collection(db, "users");
      const querySnapShot = await getDocs(userRef);
      const users = querySnapShot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Filtrar para excluir al usuario actual
      const filteredUsers = users.filter(user => user.id !== currentUser.id);

      if (filteredUsers.length > 0) {
        const randomUser = filteredUsers[Math.floor(Math.random() * filteredUsers.length)];
        await handleAdd(randomUser);
      } else {
        console.log("No hay otros usuarios disponibles.");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleAdd = async (selectedUser) => {
    const chatRef = collection(db, "chats");
    const userChatsRef = collection(db, "userchats");

    try {
      const newChatRef = doc(chatRef);

      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });

      await updateDoc(doc(userChatsRef, selectedUser.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: currentUser.id,
          updatedAt: Date.now(),
        }),
      });

      await updateDoc(doc(userChatsRef, currentUser.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: selectedUser.id,
          updatedAt: Date.now(),
        }),
      });

      // Change to the new chat
      changeChat(newChatRef.id, selectedUser);

      // Close the add user modal
      onClose();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="addUser">
      <button onClick={getRandomUser} className="randomUserButton">Add Random User</button>
    </div>
  );
};

export default AddUser;
