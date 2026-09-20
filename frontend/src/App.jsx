import { BrowserRouter } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";

function App() {
  return (
    <BrowserRouter>
      <Sidebar />
    </BrowserRouter>
  );
}

export default App;