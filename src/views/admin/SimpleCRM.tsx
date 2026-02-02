/**
 * Simple CRM - Clean Up Bros Admin
 * Main entry point for the new simplified admin panel
 * 
 * Created: February 2, 2026
 */

import React, { useState } from 'react';
import { AdminLayout } from './AdminLayout';
import { TodayView } from './TodayView';
import { QuotesView } from './QuotesView';
import { JobsView } from './JobsView';
import { CustomersView } from './CustomersView';
import { MoneyView } from './MoneyView';

type AdminPage = 'today' | 'quotes' | 'jobs' | 'customers' | 'money';

export const SimpleCRM: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<AdminPage>('today');

  const renderPage = () => {
    switch (currentPage) {
      case 'today':
        return <TodayView onNavigate={(page) => setCurrentPage(page as AdminPage)} />;
      case 'quotes':
        return <QuotesView />;
      case 'jobs':
        return <JobsView />;
      case 'customers':
        return <CustomersView />;
      case 'money':
        return <MoneyView />;
      default:
        return <TodayView onNavigate={(page) => setCurrentPage(page as AdminPage)} />;
    }
  };

  return (
    <AdminLayout
      currentPage={currentPage}
      onNavigate={(page) => setCurrentPage(page as AdminPage)}
    >
      {renderPage()}
    </AdminLayout>
  );
};

export default SimpleCRM;
