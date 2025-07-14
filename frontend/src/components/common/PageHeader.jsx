/**
 * Reusable Header Component
 * Provides consistent header styling across pages
 */
import { cn } from "../../lib/utils";

const PageHeader = ({ 
  title, 
  subtitle, 
  logo = true, 
  sticky = false,
  glass = false,
  className = "",
  children 
}) => {
  const baseClasses = "border-b border-gray-200 shadow-sm";
  const stickyClasses = sticky ? "sticky top-0 z-50" : "";
  const glassClasses = glass ? "bg-white/90 backdrop-blur-sm" : "bg-white";

  return (
    <header className={cn(baseClasses, stickyClasses, glassClasses, className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo Section */}
          {logo && (
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-lg flex items-center justify-center shadow-lg">
                <img src="/logo.jpg" alt="Homiee" className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h1>
                {subtitle && (
                  <p className="text-sm text-gray-600 hidden sm:block">{subtitle}</p>
                )}
              </div>
            </div>
          )}

          {/* Custom Content */}
          {children}
        </div>
      </div>
    </header>
  );
};

export default PageHeader;
