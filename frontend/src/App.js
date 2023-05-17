/*
 * The App.js file represents your application or main component.
 */
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CreateRoomPage from "./pages/CreateRoomPage";
import RoomJoinPage from "./pages/RoomJoinPage";
import Room from "./pages/Room";
import "./App.css";

/*
 * The App function returns a BrowserRouter (Router) component that is able to declare individual routes within the application.
 * The current browser URL will be matched against these routes and the matching route will be rendered.
 * Ref: https://reactrouter.com/en/main/router-components/browser-router#browserrouter
 */
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
