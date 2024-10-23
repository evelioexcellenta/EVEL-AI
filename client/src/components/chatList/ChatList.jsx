import { Link } from "react-router-dom";
import "./chatList.css";

const ChatList = () => {
  return (
    <div className="chatList">
      <span className="title">Dashboard</span>

      <Link to="/dashboard">Chat</Link>
      <Link to="/">Explore Evel AI</Link>
      <Link to="/">Contact</Link>
      <hr />
      <span className="title">RECENT CHATS</span>
      <div className="list">
        <Link to="">My chat Title</Link>
        <Link to="">My chat Title</Link>
        <Link to="">My chat Title</Link>
        <Link to="">My chat Title</Link>
        <Link to="">My chat Title</Link>
        <Link to="">My chat Title</Link>
        <Link to="">My chat Title</Link>
        <Link to="">My chat Title</Link>
        <Link to="">My chat Title</Link>
      </div>
      <hr />
      <div className="upgrade">
        <img src="/logo.png" alt="" />
        <div className="texts">
          <span>Upgrade to premium</span>
          <span>Get Unlimited access to all features</span>
        </div>
      </div>
    </div>
  );
};

export default ChatList;
