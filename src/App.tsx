
import React, { useState, useCallback, useEffect, lazy, Suspense } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
// ChatWidget removed - user will add 11 Labs widget later
// import { ChatWidget } from './components/ChatWidget';
import { AntigravityBackground } from './components/AntigravityBackground';
import { FloatingWhatsAppWithStyles } from './components/FloatingWhatsApp';
import { NewsletterPopup, useNewsletterPopup } from './components/NewsletterPopup';
import { QuickQuoteModal } from './components/QuickQuoteModal';
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
const SimpleCRM = lazy(() => import('./views/admin/SimpleCRM'));
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
const BookingLookupView = lazy(() => import('./views/BookingLookupView'));
const SuburbLandingView = lazy(() => import('./views/SuburbLandingView'));
const ServiceLandingView = lazy(() => import('./views/ServiceLandingView'));
const PricingView = lazy(() => import('./views/PricingView'));

// Import suburb and service data
import { SUBURBS } from './views/SuburbLandingView';
import { SERVICES } from './views/ServiceLandingView';

// URL to View mapping - enables direct URL navigation
const urlToViewMap: Record<string, ViewType> = {
  '/': 'Landing',
  '/residential': ServiceType.Residential,
  '/residential-cleaning': ServiceType.Residential,
  '/commercial': ServiceType.Commercial,
  '/commercial-cleaning': ServiceType.Commercial,
  '/airbnb': ServiceType.Airbnb,
  '/airbnb-cleaning': ServiceType.Airbnb,
  '/jobs': ServiceType.Jobs,
  '/careers': ServiceType.Jobs,
  '/client-feedback': 'ClientFeedback',
  '/feedback': 'ClientFeedback',
  '/success': 'Success',
  '/about': 'About',
  '/reviews': 'Reviews',
  '/contact': 'Contact',
  '/services': 'Services',
  '/clean-up-card': 'CleanUpCard',
  '/gift-card': 'CleanUpCard',
  '/gift-card-purchase': 'GiftCardPurchase',
  '/check-balance': 'CheckBalance',
  '/admin': 'SimpleCRM',
  '/admin-login': 'AdminLogin',
  '/adminlogin': 'AdminLogin',
  '/admin-dashboard': 'SimpleCRM',
  '/admindashboard': 'SimpleCRM',
  '/admin-gift-cards': 'AdminGiftCards',
  '/airbnb-contract': 'AirbnbContract',
  '/basic-contract': 'BasicContract',
  '/commercial-invoice': 'CommercialInvoice',
  '/admin-contracts': 'AdminContracts',
  '/track': 'BookingLookup',
  '/booking-lookup': 'BookingLookup',
  '/track-booking': 'BookingLookup',
  // Suburb landing pages
  '/cleaning-services-liverpool': 'SuburbLanding',
  '/cleaning-services-cabramatta': 'SuburbLanding',
  '/cleaning-services-casula': 'SuburbLanding',
  '/cleaning-services-moorebank': 'SuburbLanding',
  '/cleaning-services-prestons': 'SuburbLanding',
  '/cleaning-services-bankstown': 'SuburbLanding',
  '/cleaning-services-fairfield': 'SuburbLanding',
  '/cleaning-services-campbelltown': 'SuburbLanding',
  '/cleaning-services-ingleburn': 'SuburbLanding',
  '/cleaning-services-glenfield': 'SuburbLanding',
  '/cleaning-services-edmondson-park': 'SuburbLanding',
  '/bond-cleaning-liverpool': 'SuburbLanding',
  '/end-of-lease-cleaning-liverpool': 'SuburbLanding',
  // Service-specific landing pages
  '/residential-cleaning-liverpool': 'ServiceLanding',
  '/airbnb-cleaning-liverpool': 'ServiceLanding',
  '/commercial-cleaning-liverpool': 'ServiceLanding',
  '/office-cleaning-western-sydney': 'ServiceLanding',
  // Content pages
  '/pricing': 'Pricing',
  '/prices': 'Pricing',
  '/cleaning-prices': 'Pricing',
};

// Get suburb slug from URL path
const getSuburbFromUrl = (): string | null => {
  const path = window.location.pathname.toLowerCase();
  // Match patterns like /cleaning-services-liverpool or /bond-cleaning-liverpool
  const match = path.match(/(?:cleaning-services-|bond-cleaning-|end-of-lease-cleaning-)([a-z-]+)$/);
  if (match) {
    return match[1]; // Returns 'liverpool', 'cabramatta', etc.
  }
  return null;
};

// Get service slug from URL path
const getServiceFromUrl = (): string | null => {
  const path = window.location.pathname.toLowerCase().replace(/^\//, '');
  // Check if it matches a service landing page
  if (path.includes('residential-cleaning-') || 
      path.includes('airbnb-cleaning-') || 
      path.includes('commercial-cleaning-') || 
      path.includes('office-cleaning-')) {
    return path;
  }
  return null;
};

// Get initial view from URL
const getViewFromUrl = (): ViewType => {
  const path = window.location.pathname.toLowerCase();
  return urlToViewMap[path] || 'Landing';
};

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
  const [currentView, setCurrentView] = useState<ViewType>(getViewFromUrl);
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
  const [showQuickQuote, setShowQuickQuote] = useState(false);

  // Newsletter popup - shows every 2-3 minutes, NOT on form pages
  const { showPopup: showNewsletter, closePopup: closeNewsletter, markSubscribed } = useNewsletterPopup(currentView);

  const handleSubmissionFail = () => {
    setRetryKey(k => k + 1);
  };

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.view) {
        // User pressed back/forward, restore the view from history
        setCurrentView(event.state.view);
        if (event.state.message) {
          setSuccessMessage(event.state.message);
        }
        if (event.state.initialState) {
          setInitialFormData(event.state.initialState);
        } else {
          setInitialFormData(null);
        }
        window.scrollTo(0, 0);
      } else {
        // No state means we're at the initial page (Landing)
        setCurrentView('Landing');
        setSuccessMessage('');
        setInitialFormData(null);
        window.scrollTo(0, 0);
      }
    };

    // Set initial state based on current URL so back button works correctly
    const initialView = getViewFromUrl();
    const currentPath = window.location.pathname;
    window.history.replaceState({ view: initialView }, '', currentPath);

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

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

    // Push to browser history for proper back button support
    const viewPath = view === 'Landing' ? '/' : `/${view.toLowerCase().replace(/([A-Z])/g, '-$1').replace(/^-/, '')}`;
    window.history.pushState({ view, message, initialState }, '', viewPath);

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
    if (currentView === 'SimpleCRM') {
        // SimpleCRM handles its own auth internally
        return <SimpleCRM />;
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
      case 'BookingLookup':
        return <BookingLookupView navigateTo={navigateTo} />;
      case 'Pricing':
        return <PricingView navigateTo={navigateTo} />;
      case 'ServiceLanding':
        const serviceSlug = getServiceFromUrl();
        const serviceData = serviceSlug ? SERVICES[serviceSlug] : null;
        if (serviceData) {
          return <ServiceLandingView navigateTo={navigateTo} service={serviceData} />;
        }
        // Fallback to services page if service not found
        return <ServicesView navigateTo={navigateTo} />;
      case 'SuburbLanding':
        const suburbSlug = getSuburbFromUrl();
        const suburbData = suburbSlug ? SUBURBS[suburbSlug] : null;
        if (suburbData) {
          return <SuburbLandingView navigateTo={navigateTo} suburb={suburbData} />;
        }
        // Fallback to landing if suburb not found
        return <LandingView navigateTo={navigateTo} onSubmissionFail={handleSubmissionFail} />;
      case 'Landing':
      default:
        return <LandingView navigateTo={navigateTo} onSubmissionFail={handleSubmissionFail} />;
    }
  };

  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col font-sans antialiased bg-luxury-bg text-luxury-text">
        <AntigravityBackground />
        <Header navigateTo={navigateTo} isAdminLoggedIn={hasAdminAccess} onLogout={handleLogout} onGetQuote={() => setShowQuickQuote(true)} />
        <main className="flex-grow w-full relative z-10">
          <div className="w-full">
              <RetryBanner key={retryKey} />
              <Suspense fallback={<LoadingSpinner />}>
                {renderView()}
              </Suspense>
          </div>
        </main>
        <Footer navigateTo={navigateTo} onGetQuote={() => setShowQuickQuote(true)} />
        {/* ChatWidget removed - user will add 11 Labs widget later */}
        <FloatingWhatsAppWithStyles />

        {/* Newsletter Popup - shows every 2-3 mins, NOT on form pages */}
        {showNewsletter && (
          <NewsletterPopup
            onClose={closeNewsletter}
            onSubmit={(email: string) => {
              console.log('Newsletter signup:', email);
              markSubscribed();
            }}
          />
        )}

        {/* Quick Quote Modal - Global access from any page */}
        <QuickQuoteModal
          isOpen={showQuickQuote}
          onClose={() => setShowQuickQuote(false)}
          navigateTo={navigateTo}
        />
      </div>
    </ToastProvider>
  );
};

export default App;
