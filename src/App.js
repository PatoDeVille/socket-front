import { Link, Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import Login from "./components/structural/login/login";
import { NoMatch } from "./components/structural/noMatch/noMatch";
import PrivateRoutes from "./components/structural/privateRoute/privateRoute";
import Signup from "./components/structural/signup/signup";
import { getUserToken, removeSession } from "./utils/localStorage.utils";
//Conexión para escuchar y enviar eventos
import io from "socket.io-client";
import PrivateChatView from "./components/private-chat-view/private-chat-view";
import PublicChat from "./components/public-chat/public-chat";
const socket = io("http://localhost:3005");
function App() {
  const navigate = useNavigate();

  return (
    <div>
      <nav>
        <h1> ROUTING EXAMPLES</h1>
        <ul>
          <li>
            <Link to="/public">Public Chat</Link>
          </li>
          {getUserToken() && (
            <li>
              <Link to="/private">Private chat</Link>
            </li>
          )}

          {!getUserToken() && (
            <>
              <li>
                <Link to="/signup">Signup</Link>
              </li>
              <li>
                <Link to="/login">Login</Link>
              </li>
            </>
          )}

          {getUserToken() && (
            <button
              className="logout-button"
              onClick={() => {
                removeSession();
                navigate("/login");
              }}
            >
              Logout
            </button>
          )}
        </ul>
      </nav>
      <div className="main-router">
        <Routes>
          <Route path="/" element={<PrivateRoutes />}>
            <Route path="private" element={<PrivateChatView />} />
          </Route>
          <Route path="signup" element={<Signup />} />
          <Route path="login" element={<Login />} />
          <Route path="public" element={<PublicChat socket={socket} />} />

          <Route path="*" element={<NoMatch />} />
        </Routes>
        {/* <MyRouter /> */}
      </div>
    </div>
  );
}

export default App;
