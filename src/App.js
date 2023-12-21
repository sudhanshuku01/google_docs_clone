import { useEffect } from "react";
import TextEditor from "./TextEditor"
import {
  Routes,
  Route,
  useNavigate,
} from "react-router-dom"
import { v4 as uuidV4 } from "uuid"

const Home = () => {
  const navigate = useNavigate();
  useEffect(() => {

    navigate(`/documents/${uuidV4()}`);
  // eslint-disable-next-line
  }, []);
  return null;
};

function App() { 
  return (
    <Routes>
      <Route path="/"  element={<Home />}  />
      <Route path="/documents/:id" element={ <TextEditor />} />
    </Routes>
  )
}

export default App