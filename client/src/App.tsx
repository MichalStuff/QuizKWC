import Test from "./Pages/Test";
import "./App.css";
import { useState } from "react";
import Main from "./Pages/Main";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import { Route, Routes } from "react-router-dom";
import LearnMenu from "./Pages/LearnMenu";
import LearnBasic from "./Pages/LearnBasic";
import LearnSpecial from "./Pages/LearnSpecial";
import UserQuestions from "./Pages/UserQuestions";
import ProtectedRoute from "./Pages/ProtectedRoute";
import UserQuestion from "./Pages/UserQuestion";

export type UserDataType = {
  id: number;
  name: string;
  baseProgress: number;
  specialProgress: number;
  taggedBaseIds: number[];
  taggedSpecialIds: number[];
  wrongBaseIds: number[];
  wrongSpecialIds: number[];
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const token = localStorage.getItem("token");
    return !!token;
  });

  const [userData, setUserData] = useState<UserDataType | null>(() => {
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;
    return user;
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    console.log("loguot");
  };

  const handleUserData = (user: UserDataType) => {
    setUserData(user);
    localStorage.setItem("user", JSON.stringify(user));
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
          element={
            <Login
              setIsLoggedIn={setIsLoggedIn}
              // userData={userData}
              handleUserData={handleUserData}
            />
          }
        />
        <Route path="/register" element={<Register />} />
        <Route
          path="/test"
          element={
            <Test
              isLoggedIn={isLoggedIn}
              userData={userData !== null ? userData : null}
              handleUserData={handleUserData}
            />
          }
        />
        <Route path="/learn" element={<LearnMenu />} />
        <Route
          path="/learn/basic"
          element={
            <LearnBasic
              isLoggedIn={isLoggedIn}
              userData={userData}
              handleUserData={handleUserData}
            />
          }
        />
        <Route
          path="/learn/special"
          element={
            <LearnSpecial
              isLoggedIn={isLoggedIn}
              userData={userData}
              handleUserData={handleUserData}
            />
          }
        />
        <Route
          path="/user/questions"
          element={
            <ProtectedRoute user={userData}>
              <UserQuestions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/base/tagged"
          element={
            <ProtectedRoute user={userData}>
              <UserQuestion
                userData={userData}
                handleUserData={handleUserData}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/base/wrong"
          element={
            <ProtectedRoute user={userData}>
              <UserQuestion
                userData={userData}
                handleUserData={handleUserData}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/special/tagged"
          element={
            <ProtectedRoute user={userData}>
              <UserQuestion
                userData={userData}
                handleUserData={handleUserData}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/special/wrong"
          element={
            <ProtectedRoute user={userData}>
              <UserQuestion
                userData={userData}
                handleUserData={handleUserData}
              />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
