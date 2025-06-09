
import React from 'react';
import { Sidebar } from '../admin/Sidebar';

interface DashboardLayoutProps {
  children?: React.ReactNode;
  fullWidth?: boolean;
  hideNavbar?: boolean;
  disableLayout?: boolean;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  fullWidth = false,
  hideNavbar = false,
  disableLayout = false
}) => {
  // If disableLayout is true, we just render the children without the layout
  if (disableLayout) {
    return <>{children}</>;
  }

  return (
    <div className="overflow-hidden">
      <div className="flex max-md:flex-col max-md:items-stretch">
        <div className="flex-shrink-0 max-md:w-full">
          <Sidebar activeTab='null' setActiveTab={undefined} />
        </div>
        <div className={`flex-grow ${fullWidth ? 'ml-1' : 'ml-5'} max-md:w-full max-md:ml-0`}>
          <div className="flex w-full flex-col items-center max-md:max-w-full">
            <main className={`w-full ${fullWidth ? 'max-w-full px-2' : 'max-w-[1032px] px-4'}`}>
              {children}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
