import { useState } from "react";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { useChatStore } from "../../lib/chatStore";
import { auth, db } from "../../lib/firebase";
import { useUserStore } from "../../lib/userStore";
import "./detail.css";

const Detail = () => {
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock, resetChat } =
    useChatStore();
  const { currentUser } = useUserStore();

  const [isHelpVisible, setIsHelpVisible] = useState(false);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);

  const handleBlock = async () => {
    if (!user) return;

    const userDocRef = doc(db, "users", currentUser.id);

    try {
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });
      changeBlock();
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    auth.signOut();
    resetChat();
  };

  const toggleHelp = () => {
    setIsHelpVisible(!isHelpVisible);
  };

  const handleHelpClick = () => {
    setIsOverlayVisible(true);
  };

  const handleOverlayClick = () => {
    setIsOverlayVisible(false);
  };

  return (
    <div className="detail">
      {isOverlayVisible && (
        <div className="overlay" onClick={handleOverlayClick}>
          <div className="help-popup" onClick={(e) => e.stopPropagation()}>
            <p>¿Necesitas ayuda?</p>
            <button onClick={handleOverlayClick}>Sí</button>
            <button onClick={handleOverlayClick}>No</button>
          </div>
        </div>
      )}
      <div className="user">
        <img src={user?.avatar || "./avatar.png"} alt="" />
        <p>USUARIO:</p>
        <h2>{user?.username}</h2>
      </div>
      <div className="info">
        <div className="option">
          <div className="title">
            <span>Chat</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Configuracion del chat</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title" onClick={toggleHelp}>
            <span>¿NECESITAS AYUDA?</span>
            <img src={isHelpVisible ? "./arrowDown.png" : "./arrowUp.png"} alt="" />
          </div>
          {isHelpVisible && (
            <button className="help-button" onClick={handleHelpClick}>
              AYUDA
            </button>
          )}
        </div>
        <button onClick={handleBlock}>
          {isCurrentUserBlocked
            ? "¡Te han bloqueado!"
            : isReceiverBlocked
            ? "Usuario Bloqueado"
            : "Bloquear usuario"}
        </button>
        <button className="logout" onClick={handleLogout}>
          Salir
        </button>
      </div>
    </div>
  );
};

export default Detail;
