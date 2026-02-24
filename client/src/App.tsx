// import Menu from "./Compoents/Menu";
import Test from "./Pages/Test";
import "./App.css";
import { useState } from "react";
import Main from "./Pages/Main";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import { Route, Routes } from "react-router-dom";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const token = localStorage.getItem("token");
    return !!token;
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    console.log("loguot");
  };

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={<Main isLoggedIn={isLoggedIn} handleLogout={handleLogout} />}
        />
        <Route
          path="/login"
          element={<Login setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route path="/register" element={<Register />} />
        <Route path="/test" element={<Test isLoggedIn={isLoggedIn} />} />
        {/* <Route path="/loading" element={<Loading />} /> */}
      </Routes>
    </div>
  );
};

export default App;
