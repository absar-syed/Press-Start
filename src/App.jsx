import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import HomePage from './Pages/Home/HomePage';
import StockPage from './Pages/Stock/StockPage';
import TradeInPage from './Pages/TradeIn/TradeInPage';
import RepairPage from './Pages/Repair/RepairPage';
import ClientListPage from './Pages/Clients/ClientListPage';
import Footer from './Components/Footer';
import Login from './Pages/Login/Login';
import PrivateRoute from "./PrivateRoute"; 

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/profile", { credentials: "include" })
      .then((res) => {
        console.log("Profile response status:", res.status);
        if (res.ok) {
          return res.json();
        }
        throw new Error("Not authenticated");
      })
      .then((data) => {
        console.log("Profile data:", data);
        setIsLoggedIn(true);
      })
      .catch((err) => {
        console.log("Profile error:", err);
        setIsLoggedIn(false);
      });
  }, []);

  return (
    <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/stock" element={<PrivateRoute isLoggedIn={isLoggedIn}><StockPage /></PrivateRoute>} />
          <Route path="/trade-in" element={<PrivateRoute isLoggedIn={isLoggedIn}><TradeInPage /></PrivateRoute>} />
          <Route path="/repair" element={<PrivateRoute isLoggedIn={isLoggedIn}><RepairPage /></PrivateRoute>} />
          <Route path="/clients" element={<PrivateRoute isLoggedIn={isLoggedIn}><ClientListPage /></PrivateRoute>} />
          <Route path="/Login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        </Routes>
        <Footer></Footer>
    </Router>
  );
}

export default App;
