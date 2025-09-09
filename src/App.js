import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { ToastProvider } from './context/ToastContext';

import Navbar from './components/Navbar';
import AppointmentModal from './components/AppointmentModal';
import AdminLayout from './components/admin/AdminLayout';
import Hero from './components/Hero';
// SearchBar component removed from home page
import FeatureBenefits from './components/FeatureBenefits';
//import FeaturedServices from './components/FeaturedServices';
import NewArrivals from './components/NewArrivals';
import PromotionalBanners from './components/PromotionalBanners';
import BestSellers from './components/BestSellers';
import BlackFridayBanner from './components/BlackFridayBanner';
import DealOfTheWeek from './components/DealOfTheWeek';
import BlogSection from './components/BlogSection';

import BlogPage from './components/BlogPage';
import LoginPage from './components/LoginPage';
import LogoutPage from './components/LogoutPage';
import UserProfile from './components/UserProfile';
import OrdersPage from './components/OrdersPage';
import ProductSection from './components/ProductSection';
import ConsultationPage from './components/ConsultationPage';
import ContactPage from './components/ContactPage';
import Shop from './components/Shop';
import Cart from './components/Cart';
import CartPage from './components/CartPage';
import ProductViewPage from './components/ProductViewPage';
import QuickView from './components/QuickView';
import CoursesPage from './components/CoursesPage';
import CheckoutPage from './components/CheckoutPage';

import WhatsAppFloat from './components/WhatsAppFloat';
import NewFooter from './components/NewFooter';

// Authentication Pages
import VerifyEmailPage from './components/VerifyEmailPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import ResetPasswordPage from './components/ResetPasswordPage';
import AboutPage from './components/AboutPage';
import AdminLogin from './components/admin/AdminLogin';
import AdminSignup from './components/admin/AdminSignup';
import LocationPage from './components/LocationPage';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import TermsOfServicePage from './components/TermsOfServicePage';
import CookiePolicyPage from './components/CookiePolicyPage';
import RefundPolicyPage from './components/RefundPolicyPage';
import MedicalDisclaimerPage from './components/MedicalDisclaimerPage';
import FAQPage from './components/FAQPage';
import ShippingInfoPage from './components/ShippingInfoPage';
import ReturnsPage from './components/ReturnsPage';
import TrackOrderPage from './components/TrackOrderPage';
import CustomerSupportPage from './components/CustomerSupportPage';
import CookieConsent from './components/CookieConsent';

import BlogPostView from './components/BlogPostView';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <NotificationProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </NotificationProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

function AppContent() {
  const location = useLocation();
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

  const handleOpenAppointmentModal = () => {
    setIsAppointmentModalOpen(true);
  };

  const handleCloseAppointmentModal = () => {
    setIsAppointmentModalOpen(false);
  };

  const handleOpenCart = () => {
    // Navigate to cart page
    window.location.href = '/cart';
  };

  // Admin routes that should not show Navbar/Footer
  const isAdminRoute = location.pathname.startsWith('/admin');
  return (
    <>
      {!isAdminRoute && (
        <Navbar 
          openAppointmentModal={handleOpenAppointmentModal}
          openCart={handleOpenCart}
        />
      )}
      <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero />
                <FeatureBenefits />
                {/* <FeaturedServices /> */}
                <NewArrivals />
                <PromotionalBanners />
                <BestSellers />
                <BlackFridayBanner />
                <DealOfTheWeek />
                <BlogSection />
              </>
            }
          />

          {/* Authentication Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/logout" element={<LogoutPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/signup" element={<AdminSignup />} />

          {/* User Pages */}
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/products" element={<ProductSection />} />
          <Route path="/consultation" element={<ConsultationPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/product/:id" element={<ProductViewPage />} />
          <Route path="/quickview/:id" element={<QuickView />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/location" element={<LocationPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsOfServicePage />} />
        <Route path="/cookies" element={<CookiePolicyPage />} />
        <Route path="/refund" element={<RefundPolicyPage />} />
        <Route path="/disclaimer" element={<MedicalDisclaimerPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/shipping" element={<ShippingInfoPage />} />
        <Route path="/returns" element={<ReturnsPage />} />
        <Route path="/track" element={<TrackOrderPage />} />
        <Route path="/support" element={<CustomerSupportPage />} />
          <Route path="/admin" element={<AdminLayout />} />
          <Route path="/blog/:postId" element={<BlogPostView />} />
        </Routes>

      {!isAdminRoute && <WhatsAppFloat />}
      {!isAdminRoute && <NewFooter />}
      
      {/* Cookie Consent */}
      <CookieConsent />
      {/* Appointment Modal */}
      <AppointmentModal 
        isOpen={isAppointmentModalOpen}
        onClose={handleCloseAppointmentModal}
      />
    </>
  );
}

export default App;
