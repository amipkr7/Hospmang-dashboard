import React, { useContext, useEffect } from 'react'
import {BrowserRouter as Router ,Routes,Route} from 'react-router-dom'
import Login from '../src/Components/login.jsx';
import Messages from '../src/Components/Messages.jsx'
import Dashboard from '../src/Components/Dashboard.jsx';
import Doctors from '../src/Components/Doctors.jsx';
import AddNewAdmin from '../src/Components/AddNewAdmin.jsx';
import AddNewDoctor from '../src/Components/AddNewDoctor.jsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Context} from './main.jsx';
import axios from 'axios'
import Sidebar from './Components/Sidebar.jsx';
import DashboardPage from './pages/dashboardPage.jsx';
import Login from '../../frontend/src/Pages/Login.jsx';


const App = () => {
  const { isAuthenticated, setIsAuthenticated, admin, setAdmin } =
    useContext(Context);
 console.log(isAuthenticated)

 const fetchUser = async () => {
   try {
     const response = await axios.get(
       "https://hospmang-backend.onrender.com/api/v1/user/admin/me",
       {
         withCredentials: true,
       }
     );
     setIsAuthenticated(true);
     setAdmin(response.data.user);
   } catch (error) {
     setIsAuthenticated(false);
     setAdmin({});
   }
 };
 
  useEffect(() => {
    fetchUser();
  }, [isAuthenticated]);
  console.log("Rendering App component");

  return (
    
    <Router>
        <Sidebar/>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/" element={<DashboardPage />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/doctor/addnew" element={<AddNewDoctor />} />
        <Route path="/admin/addnew" element={<AddNewAdmin />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/doctors" element={<Doctors />} />
      </Routes>
      <ToastContainer position="top-center" />
    </Router>
  );
};

export default App;