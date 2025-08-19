import { Route, Routes } from "react-router-dom";
import Landing from "../pages/landing";
import SignIn from "../pages/signin";
import SignUp from "../pages/signup";
import Home from "../pages/home";
import AddTask from "../pages/addTask";
import Today from "../pages/today";
import Calendar from "../pages/calendar";
import Upcoming from "../pages/upcoming";
import Completed from "../pages/completed";
import Setting from "../pages/settings";
import HomeDashboard from "../pages/home/HomeDashboard";

const Routers = () => {
  return (
    <Routes>
      <Route index element={<Landing />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/home" element={<Home />}>
        <Route index element={<HomeDashboard />} />
        <Route path="add-task" element={<AddTask />} />
        <Route path="today" element={<Today />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="upcoming" element={<Upcoming />} />
        <Route path="completed" element={<Completed />} />
        <Route path="settings" element={<Setting />} />
      </Route>
      <Route path="*" element={<div>404 NOT FOUND</div>} />
    </Routes>
  );
};

export default Routers;
