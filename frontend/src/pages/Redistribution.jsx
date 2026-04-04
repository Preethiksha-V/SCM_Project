import React, { useState } from 'react';
import axios from 'axios';
import './Redistribution.css';

function Redistribution() {

  const [surplus, setSurplus] = useState(50);
  const [result, setResult] = useState(null);
  const [location, setLocation] = useState(null);
  const [mapUrl, setMapUrl] = useState("");

  const handleCheck = async () => {
    const res = await axios.post('http://localhost:8000/predict', {
      day: 'Monday',
      event: 'None',
      meal_type: 'Lunch',
      planned: parseInt(surplus) + 150
    });

    setResult(res.data.redistribution);
  };

  const getLocation = () => {

    if (navigator.geolocation) {

      navigator.geolocation.getCurrentPosition((position) => {

        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setLocation({ lat, lng });

        // Google Maps search centered on location
        const url =
          `https://maps.google.com/maps?q=ngo&t=&z=14&ie=UTF8&iwloc=&output=embed&ll=${lat},${lng}`;

        setMapUrl(url);

      });

    } else {
      alert("Geolocation not supported by your browser.");
    }

  };

  return (
    <div className="redistribution-page">

      <h1>🤝 Redistribution Planner</h1>
      <p className="subtitle">Match surplus food with nearby NGOs and volunteers</p>

      <div className="surplus-input-card">

        <h3>Enter Expected Surplus</h3>

        <div className="surplus-row">

          <input
            type="number"
            value={surplus}
            onChange={(e) => setSurplus(e.target.value)}
            placeholder="Enter surplus meals"
          />

          <button onClick={handleCheck}>
            🔍 Find NGOs
          </button>

          <button onClick={getLocation}>
            📍 Find Nearby NGOs
          </button>

        </div>
      </div>


      {/* MAP SECTION */}

      {location && (

        <div className="map-container">

          <h3>Nearby NGOs Around You</h3>

          <iframe
            title="ngo-map"
            width="100%"
            height="400"
            src={mapUrl}
            style={{ border: 0, borderRadius: "10px", marginTop: "20px" }}
            loading="lazy"
            allowFullScreen
          />

        </div>

      )}


      {result && (

        <div className="redistribution-results">

          <div className={`total-banner ${result.fully_allocated ? 'green' : 'yellow'}`}>
            <span>Total Surplus: <strong>{result.total_surplus} meals</strong></span>
            <span>
              {result.fully_allocated ? '✅ Fully Allocated' : '⚠️ Partially Allocated'}
            </span>
          </div>


          <div className="ngo-grid">

            {result.suggestions.map((s, i) => (

              <div key={i} className="ngo-detail-card">

                <div className="ngo-header">
                  <span className="ngo-number">#{i + 1}</span>
                  <span className="ngo-title">{s.ngo}</span>
                </div>

                <div className="ngo-info">
                  <div className="info-row">📍 <span>{s.area}</span></div>
                  <div className="info-row">📞 <span>{s.contact}</span></div>
                  <div className="info-row meals">
                    🍱 <span>{s.allocated_meals} meals allocated</span>
                  </div>
                </div>

              </div>

            ))}

          </div>


          {result.unallocated > 0 && (
            <div className="unallocated-warning">
              ⚠️ {result.unallocated} meals could not be allocated — consider adding more NGOs
            </div>
          )}

        </div>

      )}

    </div>
  );
}

export default Redistribution;