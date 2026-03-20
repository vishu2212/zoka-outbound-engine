import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import './HomePage.css';

export default function HomePage() {
  return (
    <div className="home-page">
      <div className="home-content">
        <h3 className="home-greeting">Welcome to</h3>
        <h1 className="home-title">ZOKA WORKS</h1>
        <div className="home-subtitle">
          <span>AI Cold Email Lead Gen System</span>
        </div>
        
        <Link to="/dashboard" className="home-cta">
          Launch Engine <ArrowUpRight />
        </Link>
      </div>
    </div>
  );
}
