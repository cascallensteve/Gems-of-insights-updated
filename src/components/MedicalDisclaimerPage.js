import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MedicalDisclaimerPage = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);
  
  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="mt-[64px] md:mt-[72px]">
      <div className="mx-auto max-w-3xl px-4">
        {/* Navigation Header */}
        <div className="mb-4 flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-800 hover:bg-gray-50" onClick={handleGoBack}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Medical Disclaimer</h1>
        </div>

        {/* Disclaimer Content */}
        <div className="rounded-xl border border-emerald-100 bg-white p-6 shadow-sm">
          <div className="prose prose-emerald max-w-none">
            <div className="disclaimer-section">
              <h2>Important Medical Information</h2>
              <div className="warning-box">
                <p><strong>⚠️ WARNING:</strong> The information provided on this website is for educational and informational purposes only and is not intended as medical advice.</p>
              </div>
            </div>

            <div className="disclaimer-section">
              <h2>1. Not Medical Advice</h2>
              <p>The content on Gems of Insight, including but not limited to text, graphics, images, and information, is for general informational purposes only. It is not intended to be a substitute for professional medical advice, diagnosis, or treatment.</p>
              <p>Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition or treatment.</p>
            </div>

            <div className="disclaimer-section">
              <h2>2. Professional Consultation Required</h2>
              <p>Before starting any new health regimen, including herbal remedies, supplements, or wellness practices, we strongly recommend:</p>
              <ul>
                <li>Consulting with a qualified healthcare professional</li>
                <li>Discussing your medical history and current medications</li>
                <li>Understanding potential interactions and side effects</li>
                <li>Getting proper diagnosis for any health concerns</li>
              </ul>
            </div>

            <div className="disclaimer-section">
              <h2>3. Product Information</h2>
              <p>Products and services mentioned on this site are not intended to:</p>
              <ul>
                <li>Diagnose, treat, cure, or prevent any disease</li>
                <li>Replace professional medical treatment</li>
                <li>Guarantee specific health outcomes</li>
                <li>Provide emergency medical care</li>
              </ul>
              <p>Individual results may vary, and what works for one person may not work for another.</p>
            </div>

            <div className="disclaimer-section">
              <h2>4. Herbal Remedies and Supplements</h2>
              <p>While herbal remedies have been used traditionally for centuries, it's essential to understand:</p>
              <ul>
                <li>Natural does not always mean safe</li>
                <li>Herbs can interact with medications</li>
                <li>Quality and potency can vary significantly</li>
                <li>Some herbs may not be suitable for everyone</li>
                <li>Pregnant and nursing women should be especially cautious</li>
              </ul>
            </div>

            <div className="disclaimer-section">
              <h2>5. Emergency Situations</h2>
              <p>If you are experiencing a medical emergency:</p>
              <ul>
                <li><strong>Call emergency services immediately (112 in Kenya)</strong></li>
                <li>Do not rely on information from this website</li>
                <li>Seek immediate professional medical attention</li>
                <li>Do not attempt self-diagnosis or self-treatment</li>
              </ul>
            </div>

            <div className="disclaimer-section">
              <h2>6. Individual Responsibility</h2>
              <p>You are responsible for:</p>
              <ul>
                <li>Consulting healthcare professionals before making health decisions</li>
                <li>Understanding the risks and benefits of any treatment</li>
                <li>Following dosage and usage instructions carefully</li>
                <li>Monitoring your health and reporting any adverse effects</li>
                <li>Discontinuing use if you experience negative reactions</li>
              </ul>
            </div>

            <div className="disclaimer-section">
              <h2>7. Research and Evidence</h2>
              <p>While we strive to provide accurate information:</p>
              <ul>
                <li>Scientific research on herbal remedies is ongoing</li>
                <li>Traditional use does not guarantee effectiveness</li>
                <li>Information may change as new research emerges</li>
                <li>We encourage you to verify information with reliable sources</li>
              </ul>
            </div>

            <div className="disclaimer-section">
              <h2>8. Children and Vulnerable Populations</h2>
              <p>Special precautions apply to:</p>
              <ul>
                <li><strong>Children:</strong> Always consult a pediatrician</li>
                <li><strong>Pregnant Women:</strong> Many herbs are contraindicated during pregnancy</li>
                <li><strong>Elderly:</strong> May be more sensitive to herb effects</li>
                <li><strong>Immunocompromised:</strong> Higher risk of adverse reactions</li>
                <li><strong>Those with Chronic Conditions:</strong> May have specific contraindications</li>
              </ul>
            </div>

            <div className="disclaimer-section">
              <h2>9. Quality and Safety</h2>
              <p>We are committed to quality, but please note:</p>
              <ul>
                <li>Herbal products are not regulated like pharmaceutical drugs</li>
                <li>Quality standards can vary between manufacturers</li>
                <li>Always purchase from reputable sources</li>
                <li>Check for proper labeling and expiration dates</li>
                <li>Store products according to manufacturer instructions</li>
              </ul>
            </div>

            <div className="disclaimer-section">
              <h2>10. Legal and Regulatory Compliance</h2>
              <p>This disclaimer is provided in accordance with:</p>
              <ul>
                <li>Kenyan health regulations</li>
                <li>International health information standards</li>
                <li>Best practices for health websites</li>
                <li>Consumer protection guidelines</li>
              </ul>
            </div>

            <div className="disclaimer-section">
              <h2>11. Contact Information</h2>
              <p>For questions about this disclaimer or medical concerns, please contact us:</p>
              <div className="contact-info">
                <p><strong>Email:</strong> medical@gemsofinsight.com</p>
                <p><strong>Phone:</strong> +254 794 491 920</p>
                <p><strong>Address:</strong> Thika Town, Kiambu County, Central Kenya Region</p>
                <p><strong>Note:</strong> For medical emergencies, please contact emergency services immediately.</p>
              </div>
            </div>

            <div className="disclaimer-section">
              <h2>12. Acceptance of Terms</h2>
              <p>By using this website and our services, you acknowledge that:</p>
              <ul>
                <li>You have read and understood this medical disclaimer</li>
                <li>You will consult healthcare professionals before making health decisions</li>
                <li>You understand the limitations of the information provided</li>
                <li>You accept responsibility for your health choices</li>
              </ul>
            </div>

            <div className="mt-6 text-sm text-gray-600">
              <p><strong>Last Updated:</strong> January 2024</p>
              <p>This Medical Disclaimer is effective as of the date listed above and will remain in effect except with respect to any changes in its provisions in the future.</p>
              <p><strong>Your health and safety are our top priority. Please consult healthcare professionals for medical advice.</strong></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalDisclaimerPage;
