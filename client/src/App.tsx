import { io } from "socket.io-client";

function App() {
  const socket = io("ws://localhost:8000", {
    transports: ["websocket"],
    auth: {
      token: "yugfwygfuwufufgwf",
    },
    query: {
      token: "yugfwygfuwufufgwf",
      id: "1",
      phone: "123456789",
    },
  });

  socket.on("connect", () => {
    console.log(socket.id); // x8WIv7-mJelg7on_ALbx
  });

  return <main className="w-full">hello</main>;
}

export default App;
