import { Route, Routes } from "react-router-dom";
import Landing from "../pages/landing";
import SignIn from "../pages/signin";
import SignUp from "../pages/signup";
import Home from "../pages/home";

const Routers = () => {
  return (
    <Routes>
      <Route index element={<Landing />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/home" element={<Home />} />
      <Route path="*" element={<div>404 NOT FOUND</div>} />
    </Routes>
  );
};

export default Routers;
