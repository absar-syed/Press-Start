import './HomePage.css';
import Navbar from '../../Components/Navbar';

function HomePage() {
    return (
    <div>
    <Navbar />
      <section className="home-page">
        <h1>Welcome, firstName!</h1>
        <div className="carousel-container">
          {/* Implement a carousel or placeholder here */}
          <p>News, Promotions Carousel</p>
        </div>
      </section>
      </div>
    );
  }
  
  export default HomePage;
  