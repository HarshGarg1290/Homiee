/**
 * Reusable Layout Component
 * Provides consistent page layout with optional header and footer
 */
import PageHeader from "./PageHeader";
import { cn } from "../../lib/utils";

const Layout = ({ 
  children,
  className = "",
  background = "gradient",
  header = null,
  showDefaultHeader = false,
  headerProps = {}
}) => {
  const backgrounds = {
    gradient: "bg-gradient-to-br from-blue-50 via-white to-purple-50",
    white: "bg-white",
    gray: "bg-gray-50",
    dark: "bg-gray-900"
  };

  return (
    <div className={cn("min-h-screen", backgrounds[background])}>
      {/* Custom Header */}
      {header}
      
      {/* Default Header */}
      {showDefaultHeader && <PageHeader {...headerProps} />}
      
      {/* Main Content */}
      <main className={cn("", className)}>
        {children}
      </main>
    </div>
  );
};

// Specialized layout variants
export const AuthLayout = ({ children, title, subtitle }) => (
  <Layout background="gradient">
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/logo.jpg" alt="Homiee" className="w-16 h-16 mx-auto mb-4 rounded-xl shadow-lg" />
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="text-gray-600 mt-2">{subtitle}</p>}
        </div>
        {children}
      </div>
    </div>
  </Layout>
);

export const DashboardLayout = ({ children, title, subtitle }) => (
  <Layout 
    background="gradient"
    showDefaultHeader={true}
    headerProps={{ title, subtitle, sticky: true }}
  >
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {children}
    </div>
  </Layout>
);

export const CenteredLayout = ({ children }) => (
  <Layout background="gradient">
    <div className="min-h-screen flex items-center justify-center p-4">
      {children}
    </div>
  </Layout>
);

export default Layout;
