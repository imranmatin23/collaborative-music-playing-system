import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CreateRoomPage from "./pages/CreateRoomPage";
import RoomJoinPage from "./pages/RoomJoinPage";
import Room from "./pages/Room";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route path="/join" element={<RoomJoinPage />} />
          <Route path="/create" element={<CreateRoomPage />} />
          <Route path="/room/:roomCode" element={<Room />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
