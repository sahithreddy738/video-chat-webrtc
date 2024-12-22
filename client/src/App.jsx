import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/home";
import RoomPage from "./pages/room";
import { SocketProvider } from "./providers/socket";

function App() {
  return (
    <SocketProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/room/:roomId" element={<RoomPage />} />
      </Routes>
    </SocketProvider>
  );
}

export default App;
