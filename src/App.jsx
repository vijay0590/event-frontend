import{ BrowserRouter,Routes,Route} from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Test from "./pages/Test"
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";


const App = () => {
  return (
  <BrowserRouter>
  <MainLayout>
  <Routes>
    
        <Route path="/" element={<Home/>}></Route>
         <Route path="/login" element={<Login/>}></Route>
         <Route path="/register" element={<Register/>}></Route>
  </Routes>
  </MainLayout>
  </BrowserRouter>
  )
}

export default App;

