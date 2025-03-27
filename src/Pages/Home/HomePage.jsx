import { useState, useEffect } from 'react';
import Navbar from '../../Components/Navbar';
import './HomePage.css';

const images = [
  {
    src: "https://preview.redd.it/v1j1be6y44m91.png?width=1080&crop=smart&auto=webp&s=2a8400abca948bf1c325f19a22cd947e310b7b79",
    title: "Welcome to Press Start",
    caption: "Your retro and next-gen game destination."
  },
  {
    src: "https://cdnb.artstation.com/p/assets/images/images/075/463/079/large/omorphia-visual-game-store-2-4k.jpg?1714624403",
    title: "Trade. Play. Repair.",
    caption: "All your gaming needs under one roof."
  },
  {
    src: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmV0cm8lMjBnYW1pbmd8ZW58MHx8MHx8fDA%3D",
    title: "Stay in the Game",
    caption: "Explore our latest inventory and repair services."
  }
];

function HomePage() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % images.length);
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="homepage-container">
      <Navbar />
      <section className="carousel-fullscreen">
        <img
          src={images[current].src}
          alt={images[current].title}
          className="carousel-full-img"
        />
        <div className="carousel-overlay">
          <h1>{images[current].title}</h1>
          <p>{images[current].caption}</p>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
