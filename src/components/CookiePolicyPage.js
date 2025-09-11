import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Tailwind conversion: removed external CSS import

const CookiePolicyPage = () => {
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
        <button className="mb-3 text-sm text-gray-600 hover:text-emerald-700" onClick={handleGoBack}>
          ← Go Back
        </button>

        <div className="rounded-xl border border-emerald-100 bg-white p-6 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Cookie Policy</h1>
            <p className="mt-1 text-gray-700">Learn about how we use cookies on our website</p>
          </div>

          <div className="mt-6 space-y-5">
            <section>
              <h2 className="text-lg font-semibold text-gray-900">Cookie Information</h2>
              <p className="mt-1 text-gray-700">
                We use cookies to enhance your browsing experience and provide personalized content.
                By using our website, you agree to our use of cookies.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900">Contact Us</h2>
              <p className="mt-1 text-gray-700">
                If you have any questions about our cookie policy, please contact us.
              </p>
            </section>

            <section className="rounded-lg border border-emerald-100 bg-emerald-50/60 p-4">
              <h3 className="font-semibold text-emerald-900">Need Help?</h3>
              <p className="text-emerald-900">Email: info@gemsofinsight.com</p>
              <p className="text-emerald-900">Phone: +254794491920</p>
              <p className="text-emerald-900">Address: Nairobi, Kenya</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicyPage;
