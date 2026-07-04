import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import client from '../api/client';

function TopoBackground() {
  return (
    <svg className="hero-topo" viewBox="0 0 900 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" stroke="#2F4A3C" strokeWidth="1">
        <path opacity="0.15" d="M-20 380 Q 150 300 300 360 T 600 340 T 950 380" />
        <path opacity="0.15" d="M-20 410 Q 160 340 320 400 T 620 380 T 950 410" />
        <path opacity="0.15" d="M-20 440 Q 170 380 340 430 T 640 420 T 950 445" />
        <path opacity="0.1" d="M-20 470 Q 180 420 360 460 T 660 455 T 950 475" />
      </g>
    </svg>
  );
}

export default function Home() {
  const [stats, setStats] = useState({ count: 0, states: 0 });

  useEffect(() => {
    client.get('/campground').then(({ data }) => {
      const camps = data.camp || [];
      const states = new Set(camps.map(c => c.location?.split(',').pop()?.trim()).filter(Boolean));
      setStats({ count: camps.length, states: states.size });
    }).catch(() => {});
  }, []);

  return (
    <>
      <section className="hero">
        <TopoBackground />
        <div className="container hero-content">
          <div className="eyebrow">Field notes from real campers</div>
          <h1>Find the site, pitch the tent, tell the truth about it.</h1>
          <p className="lede">
            Basecamp is a working log of campgrounds people have actually stayed at —
            real coordinates, real prices, real reviews from the trail.
          </p>
          <div className="hero-actions">
            <Link to="/campgrounds" className="btn btn-primary">Browse campgrounds</Link>
            <Link to="/campgrounds/new" className="btn btn-outline">Log a new site</Link>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="num">{stats.count}</div>
              <div className="lbl">campgrounds logged</div>
            </div>
            <div className="hero-stat">
              <div className="num">{stats.states}</div>
              <div className="lbl">regions covered</div>
            </div>
            <div className="hero-stat">
              <div className="num">24/7</div>
              <div className="lbl">trail-tested access</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
