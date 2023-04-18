import React from 'react';
import AppSidebar from 'src/components/layout/AppSidebar';
import AppHeader from 'src/components/layout/AppHeader';
import AppContent from 'src/components/layout/AppContent';
import AppFooter from 'src/components/layout/AppFooter';

const MainLayout: React.FC = () => {
  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <AppHeader />
        <div className="body flex-grow-1 px-3">
          <AppContent />
        </div>
        <AppFooter />
      </div>
    </div>
  );
};

export default MainLayout;
