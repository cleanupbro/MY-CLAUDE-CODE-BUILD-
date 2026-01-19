
import React, { useState, useCallback, useEffect, lazy, Suspense } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
// ChatWidget removed - user will add 11 Labs widget later
// import { ChatWidget } from './components/ChatWidget';
import { AntigravityBackground } from './components/AntigravityBackground';
import { FloatingWhatsAppWithStyles } from './components/FloatingWhatsApp';
import { ServiceType, ViewType } from './types';
import { RetryBanner } from './components/RetryBanner';
import { ToastProvider } from './contexts/ToastContext';
import {
  checkSession,
  signOut,
  initAuthListener,
  type AuthState
} from './services/authService';

// Lazy load views for better performance
const LandingView = lazy(() => import('./views/LandingViewNew'));
const ResidentialQuoteView = lazy(() => import('./views/ResidentialQuoteView'));
const CommercialQuoteView = lazy(() => import('./views/CommercialQuoteView'));
const AirbnbQuoteView = lazy(() => import('./views/AirbnbQuoteView'));
const JobApplicationView = lazy(() => import('./views/JobApplicationView'));
const ClientFeedbackView = lazy(() => import('./views/ClientFeedbackView'));
const SubmissionSuccessView = lazy(() => import('./views/SubmissionSuccessView'));
const AdminLoginView = lazy(() => import('./views/AdminLoginView'));
const AdminDashboardView = lazy(() => import('./views/AdminDashboardView'));
const AboutView = lazy(() => import('./views/AboutView'));
const ReviewsView = lazy(() => import('./views/ReviewsView'));
const ContactView = lazy(() => import('./views/ContactView'));
const ServicesView = lazy(() => import('./views/ServicesView'));
const CleanUpCardView = lazy(() => import('./views/CleanUpCardView'));
const GiftCardPurchaseView = lazy(() => import('./views/GiftCardPurchaseView'));
const AdminGiftCardsView = lazy(() => import('./views/AdminGiftCardsView'));
const AirbnbContractView = lazy(() => import('./views/AirbnbContractView'));
const BasicContractView = lazy(() => import('./views/BasicContractView'));
const CommercialInvoiceView = lazy(() => import('./views/CommercialInvoiceView'));
const AdminContractsView = lazy(() => import('./views/AdminContractsView'));
const CheckBalanceView = lazy(() => import('./views/CheckBalanceView'));

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center">
      <svg className="animate-spin h-12 w-12 text-brand-gold mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p className="text-luxury-text-secondary font-medium">Loading...</p>
    </div>
  </div>
);

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('Landing');
  const [successMessage, setSuccessMessage] = useState('');
  const [initialFormData, setInitialFormData] = useState<any | null>(null);
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isAdmin: false,
    user: null,
    session: null,
  });
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [retryKey, setRetryKey] = useState(0);

  const handleSubmissionFail = () => {
    setRetryKey(k => k + 1);
  };

  // Check session on mount and set up auth listener
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const initAuth = async () => {
      try {
        // Check existing session
        const state = await checkSession();
        setAuthState(state);

        // Set up auth state listener
        unsubscribe = initAuthListener((newState) => {
          setAuthState(newState);
        });
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsAuthLoading(false);
      }
    };

    initAuth();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const handleLoginSuccess = (email: string) => {
    // Auth state will be updated via the listener
    navigateTo('AdminDashboard');
  };

  const handleLogout = async () => {
    await signOut();
    setAuthState({
      isAuthenticated: false,
      isAdmin: false,
      user: null,
      session: null,
    });
    navigateTo('Landing');
  };

  const navigateTo = useCallback((view: ViewType, message?: string, initialState?: any) => {
    setCurrentView(view);
    if (message) {
      setSuccessMessage(message);
    }
    if (initialState) {
        setInitialFormData(initialState);
    } else {
        setInitialFormData(null);
    }
    window.scrollTo(0, 0);
  }, []);

  // Helper to check if user has admin access
  const hasAdminAccess = authState.isAuthenticated && authState.isAdmin;
  const adminEmail = authState.user?.email || null;

  const renderView = () => {
    // Show loading while checking auth
    if (isAuthLoading) {
      return <LoadingSpinner />;
    }

    if (currentView === 'AdminLogin') {
        return <AdminLoginView onLoginSuccess={handleLoginSuccess} />;
    }
    if (currentView === 'AdminDashboard') {
        if (hasAdminAccess && adminEmail) {
            return <AdminDashboardView onLogout={handleLogout} adminEmail={adminEmail} navigateTo={navigateTo} />;
        }
        return <AdminLoginView onLoginSuccess={handleLoginSuccess} />;
    }

    switch (currentView) {
      case ServiceType.Residential:
        return <ResidentialQuoteView navigateTo={navigateTo} initialData={initialFormData} onSubmissionFail={handleSubmissionFail} />;
      case ServiceType.Commercial:
        return <CommercialQuoteView navigateTo={navigateTo} onSubmissionFail={handleSubmissionFail} />;
      case ServiceType.Airbnb:
        return <AirbnbQuoteView navigateTo={navigateTo} onSubmissionFail={handleSubmissionFail} />;
      case ServiceType.Jobs:
        return <JobApplicationView navigateTo={navigateTo} onSubmissionFail={handleSubmissionFail} />;
      case 'ClientFeedback':
        return <ClientFeedbackView navigateTo={navigateTo} onSubmissionFail={handleSubmissionFail} />;
      case 'Success':
        return <SubmissionSuccessView message={successMessage} navigateTo={navigateTo} referenceId={initialFormData?.referenceId} />;
      case 'About':
        return <AboutView navigateTo={navigateTo} />;
      case 'Reviews':
        return <ReviewsView navigateTo={navigateTo} />;
      case 'Contact':
        return <ContactView navigateTo={navigateTo} />;
      case 'Services':
        return <ServicesView navigateTo={navigateTo} />;
      case 'CleanUpCard':
        return <CleanUpCardView navigateTo={navigateTo} />;
      case 'GiftCardPurchase':
        return <GiftCardPurchaseView navigateTo={navigateTo} />;
      case 'CheckBalance':
        return <CheckBalanceView navigateTo={navigateTo} />;
      case 'AdminGiftCards':
        if (hasAdminAccess && adminEmail) {
          return <AdminGiftCardsView />;
        }
        return <AdminLoginView onLoginSuccess={handleLoginSuccess} />;
      case 'AirbnbContract':
        if (hasAdminAccess && adminEmail) {
          return <AirbnbContractView navigateTo={navigateTo} />;
        }
        return <AdminLoginView onLoginSuccess={handleLoginSuccess} />;
      case 'BasicContract':
        if (hasAdminAccess && adminEmail) {
          return <BasicContractView navigateTo={navigateTo} />;
        }
        return <AdminLoginView onLoginSuccess={handleLoginSuccess} />;
      case 'CommercialInvoice':
        if (hasAdminAccess && adminEmail) {
          return <CommercialInvoiceView navigateTo={navigateTo} />;
        }
        return <AdminLoginView onLoginSuccess={handleLoginSuccess} />;
      case 'AdminContracts':
        if (hasAdminAccess && adminEmail) {
          return <AdminContractsView navigateTo={navigateTo} />;
        }
        return <AdminLoginView onLoginSuccess={handleLoginSuccess} />;
      case 'Landing':
      default:
        return <LandingView navigateTo={navigateTo} onSubmissionFail={handleSubmissionFail} />;
    }
  };

  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col font-sans antialiased bg-luxury-bg text-luxury-text">
        <AntigravityBackground />
        <Header navigateTo={navigateTo} isAdminLoggedIn={hasAdminAccess} onLogout={handleLogout} />
        <main className="flex-grow w-full relative z-10">
          <div className="w-full">
              <RetryBanner key={retryKey} />
              <Suspense fallback={<LoadingSpinner />}>
                {renderView()}
              </Suspense>
          </div>
        </main>
        <Footer navigateTo={navigateTo} />
        {/* ChatWidget removed - user will add 11 Labs widget later */}
        <FloatingWhatsAppWithStyles />
      </div>
    </ToastProvider>
  );
};

export default App;
