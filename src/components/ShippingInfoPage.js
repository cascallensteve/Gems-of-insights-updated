import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ShippingInfoPage.css';

const ShippingInfoPage = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);
  
  const handleGoBack = () => {
    navigate(-1);
  };

  const shippingMethods = [
    {
      name: "Standard Shipping",
      time: "3-5 business days",
      cost: "KSh 500",
      description: "Reliable ground shipping within Kenya",
      icon: "🚚"
    },
    {
      name: "Express Shipping",
      time: "1-2 business days",
      cost: "KSh 1,200",
      description: "Fast delivery for urgent orders",
      icon: "⚡"
    },
    {
      name: "International Shipping",
      time: "7-14 business days",
      cost: "From KSh 2,500",
      description: "Worldwide delivery to most countries",
      icon: "🌍"
    },
    {
      name: "Free Shipping",
      time: "3-5 business days",
      cost: "FREE",
      description: "On orders over KSh 5,000",
      icon: "🎁"
    }
  ];

  const shippingZones = [
    {
      zone: "Nairobi & Surrounding Areas",
      time: "1-2 business days",
      cost: "KSh 300"
    },
    {
      zone: "Major Cities (Mombasa, Kisumu, Nakuru)",
      time: "2-3 business days",
      cost: "KSh 500"
    },
    {
      zone: "Other Towns & Rural Areas",
      time: "3-5 business days",
      cost: "KSh 700"
    },
    {
      zone: "International Orders",
      time: "7-14 business days",
      cost: "From KSh 2,500"
    }
  ];

  return (
    <div className="shipping-info-page">
      <button className="back-button" onClick={handleGoBack}>
        ← Go Back
      </button>
      
      <div className="shipping-container">
        <div className="shipping-header">
          <h1>Shipping Information</h1>
          <p>Fast, reliable shipping to get your natural remedies delivered safely</p>
        </div>

        <div className="shipping-section">
          <h2>🚚 Shipping Methods</h2>
          <div className="shipping-methods">
            {shippingMethods.map((method, index) => (
              <div key={index} className="shipping-method">
                <h4>{method.name}</h4>
                <p>{method.description}</p>
                <p>⏱️ {method.time} | 💰 {method.cost}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="shipping-section">
          <h2>📍 Shipping Zones & Delivery Times</h2>
          <div className="shipping-zones">
            <div className="zone-header">Zone Information</div>
            <div className="zone-content">
              {shippingZones.map((zone, index) => (
                <p key={index}>
                  <strong>{zone.zone}:</strong> {zone.time} - {zone.cost}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="shipping-section">
          <h2>📦 Order Processing</h2>
          <p>Orders are processed within 24 hours (Monday-Friday) and shipped with tracking information.</p>
          <p>You'll receive email updates when your order ships and arrives.</p>
        </div>

        <div className="shipping-section">
          <h2>📋 Important Information</h2>
          <ul>
            <li>Orders placed after 2:00 PM are processed the next business day</li>
            <li>We don't process orders on weekends or public holidays</li>
            <li>All orders include tracking information</li>
            <li>Signature confirmation is required for all deliveries</li>
            <li>Our packaging is eco-friendly and recyclable</li>
          </ul>
        </div>

        <div className="contact-info">
          <h3>Questions about shipping?</h3>
          <p>Our shipping team is here to help with any delivery questions.</p>
          <p>Phone: +254 794 491 920</p>
          <p>Email: shipping@gemsofinsight.com</p>
        </div>
      </div>
    </div>
  );
};

export default ShippingInfoPage;
