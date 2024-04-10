import { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";
function Chat() {
  const host = "http://localhost:3579";
  const socketRef = useRef();
  const [mess, setMess] = useState([]);
  const [message, setMessage] = useState("");
  const [id, setId] = useState();
  useEffect(() => {
    socketRef.current = socketIOClient.connect(host);
    socketRef.current.on("getId", (data) => {
      setId(data);
    });
    // phần này đơn giản để gán id cho mỗi phiên kết nối vào page.
    //Mục đích chính là để phân biệt đoạn nào là của mình đang chat.

    socketRef.current.on("sendDataServer", (dataGot) => {
      setMess((oldMsgs) => [...oldMsgs, dataGot.data]);
    }); // mỗi khi có tin nhắn thì mess sẽ được render thêm

    return () => {
      console.log("disconect");
      socketRef.current.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (message !== null) {
      console.log("id:", id);
      const msg = {
        content: message,
        id: id,
      };
      socketRef.current.emit("sendDataClient", msg);

      /*Khi emit('sendDataClient') bên phía server sẽ nhận được sự kiện có tên 'sendDataClient' và handle như câu lệnh trong file index.js
             socket.on("sendDataClient", function(data) { // Handle khi có sự kiện tên là sendDataClient từ phía client
               socketIo.emit("sendDataServer", { data });// phát sự kiện  có tên sendDataServer cùng với dữ liệu tin nhắn từ phía server
             })
       */
      setMessage("");
    }
  };
  return (
    <div>
      <h1>Chat với admin</h1>
      <div className="box-chat">
        <div className="box-chat_message">
          {mess.map((m, index) => (
            <div
              key={index}
              className={`${
                m.id === id ? "your-message" : "other-people"
              } chat-item`}
            >
              {m.content}
            </div>
          ))}
        </div>

        <div className="send-box">
          <textarea
            value={message}
            onKeyPress={(event) => event.key === "Enter" && sendMessage()}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Nhập tin nhắn ..."
          />
          <button onClick={() => sendMessage()}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
