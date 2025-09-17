import React, { useState } from 'react';
import { newsletterService } from '../services/newsletterService';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaTiktok } from 'react-icons/fa';
import { MdLocalShipping, MdSupportAgent, MdEco } from 'react-icons/md';
import { BsShieldLock, BsTelephone, BsEnvelope } from 'react-icons/bs';


const NewFooter = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const handleSubscribe = async () => {
    if (!email) return;
    setMsg(''); setErr('');
    try {
      setLoading(true);
      const res = await newsletterService.subscribe(email);
      setMsg(res.message || 'Subscribed successfully!');
      setEmail('');
      setTimeout(()=>setMsg(''), 6000);
    } catch (e) {
      setErr(e.message || 'Subscription failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="mt-12 bg-emerald-800">
      <div className="max-w-7xl mx-auto px-4 py-10 text-white">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div>
              <img 
                src="/images/LOGOGEMS.png" 
                alt="Gems of Insight Logo" 
              className="h-28 w-auto object-contain"
              width="160"
              height="160"
              loading="lazy"
              decoding="async"
            />
            <p className="mt-2 text-sm text-emerald-50">Your trusted partner in natural wellness and organic living</p>
            <div className="mt-3 flex items-center gap-3 text-xl text-emerald-100">
              <a href="https://www.facebook.com/share/19mQFYr7oK/" className="hover:text-white" aria-label="Facebook" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
              <a href="https://www.instagram.com/gems_of_insight/" className="hover:text-white" aria-label="Instagram" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
              <a href="https://x.com/gems_ofinsight" className="hover:text-white" aria-label="Twitter/X" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
              <a href="https://youtube.com/@gemsofinsight_official" className="hover:text-white" aria-label="YouTube" target="_blank" rel="noopener noreferrer"><FaYoutube /></a>
              <a href="https://tiktok.com/@gems_ofinsight" className="hover:text-white" aria-label="TikTok" target="_blank" rel="noopener noreferrer"><FaTiktok /></a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white">Quick Links</h4>
            <ul className="mt-2 space-y-1 text-sm text-emerald-100">
              <li><Link to="/" className="hover:text-white">Home</Link></li>
              <li><Link to="/shop" className="hover:text-white">Shop</Link></li>
              <li><Link to="/blog" className="hover:text-white">Blog</Link></li>
              <li><Link to="/about" className="hover:text-white">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white">Categories</h4>
            <ul className="mt-2 space-y-1 text-sm text-emerald-100">
              <li><Link to="/shop?category=supplements" className="hover:text-white">Supplements</Link></li>
              <li><Link to="/shop?category=herbs" className="hover:text-white">Herbal Products</Link></li>
              <li><Link to="/shop?category=superfoods" className="hover:text-white">Superfoods</Link></li>
              <li><Link to="/shop?category=wellness" className="hover:text-white">Wellness</Link></li>
              <li><Link to="/shop?category=new-arrivals" className="hover:text-white">New Arrivals</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white">Stay Updated</h4>
            <p className="mt-1 text-sm text-emerald-100">Get health tips and exclusive offers</p>
            <div className="mt-2 flex items-center gap-2">
              <input type="email" placeholder="Your email" value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full rounded-md border border-white/20 bg-white/10 placeholder:text-emerald-100 px-3 py-2 text-sm text-white focus:ring-2 focus:ring-white/30 outline-none" />
              <button type="button" onClick={handleSubscribe} disabled={loading} className="inline-flex items-center rounded-md bg-white text-emerald-800 px-4 py-2 text-sm font-medium shadow hover:bg-emerald-50">{loading ? 'Subscribing...' : 'Subscribe'}</button>
            </div>
            {msg && <div className="mt-2 rounded-md bg-white/10 px-3 py-2 text-sm text-white">{msg}</div>}
            {err && <div className="mt-2 rounded-md bg-red-500/20 px-3 py-2 text-sm text-red-100">{err}</div>}
            <div className="mt-3 space-y-1 text-sm text-emerald-100">
              <div className="flex items-center gap-2"><BsTelephone className="text-emerald-100" /><span>+254 794 491 920</span></div>
              <div className="flex items-center gap-2"><BsEnvelope className="text-emerald-100" /><span>info@gemsofinsight.com</span></div>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-md bg-white/5 p-4 text-xs text-emerald-100">
          <p>
            <strong>Disclaimer:</strong> The information provided on this website is for educational and informational purposes only and is not intended as medical advice. It is not a substitute for professional healthcare diagnosis, treatment, or guidance. Always consult with a qualified physician or licensed naturopathic doctor before making changes to your health regimen, especially if you have a medical condition or are taking medications. Products and services mentioned on this site are not intended to diagnose, treat, cure, or prevent any disease. Individual results may vary. Gems of Insight disclaims any liability for decisions made based on the content of this website. By using this site, you agree to these terms. If you do not agree, please discontinue use.
          </p>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between text-sm text-emerald-100">
            <p>&copy; {currentYear} GemsOfInsight. All rights reserved.</p>
          <div className="flex items-center gap-3 mt-2 sm:mt-0">
            <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white">Terms of Service</Link>
            <Link to="/cookies" className="hover:text-white">Cookie Policy</Link>
            <Link to="/refund" className="hover:text-white">Refund Policy</Link>
            <Link to="/disclaimer" className="hover:text-white">Medical Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default NewFooter;