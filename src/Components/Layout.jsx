import Navbar from './Navbar';
import Footer from './Footer';
import './Layout.css';
function Layout({ children }) {
    return (
      <div>
        <Navbar />
        <main>
          {children}
        </main>
        <Footer />
      </div>
    );
  }
  
  export default Layout;