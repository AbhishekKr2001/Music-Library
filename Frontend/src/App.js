import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/authorization/Register';
import Login from './components/authorization/Login';
import UserHome from './components/user/UserHome';
import AdminHome from './components/admin/AdminHome';
import Home from './components/Home';



import Navbar from './components/Navbar';


const App = () => {
  return (
    <Router>
      <div className="App">
        <Navbar />

        <Routes>
          <Route path='/' element={<Home />}></Route>
          <Route path='/register' element={<Register />} ></Route>
          <Route path='/login' element={<Login />} ></Route>
          <Route path='/userHome' element={<UserHome />} ></Route>
          <Route path='/adminHome' element={<AdminHome />} ></Route>



        </Routes>
      </div>
    </Router>
  );
};

export default App;
