import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './Pages/Home/HomePage';
import StockPage from './Pages/Stock/StockPage';
import TradeInPage from './Pages/TradeIn/TradeInPage';
import RepairPage from './Pages/Repair/RepairPage';
import ClientListPage from './Pages/Clients/ClientListPage';
import Layout from './Components/Layout';
import Login from './Pages/Login/Login';
function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/stock" element={<StockPage />} />
          <Route path="/trade-in" element={<TradeInPage />} />
          <Route path="/repair" element={<RepairPage />} />
          <Route path="/clients" element={<ClientListPage />} />
          <Route path="/Login" element={<Login />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
