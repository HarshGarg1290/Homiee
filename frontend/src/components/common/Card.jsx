/**
 * Reusable Card Component
 * Provides consistent styling for cards throughout the application
 */
import { cn } from "../../lib/utils";

const Card = ({ 
  children, 
  className = "", 
  variant = "default",
  padding = "default",
  shadow = "default",
  hover = false,
  ...props 
}) => {
  const variants = {
    default: "bg-white border border-gray-100",
    glass: "bg-white/95 backdrop-blur-sm",
    elevated: "bg-white border border-gray-200",
    minimal: "bg-white border-0"
  };

  const paddings = {
    none: "",
    sm: "p-4",
    default: "p-6", 
    lg: "p-8",
    xl: "p-12"
  };

  const shadows = {
    none: "",
    sm: "shadow-sm",
    default: "shadow-lg",
    xl: "shadow-xl",
    "2xl": "shadow-2xl"
  };

  const hoverEffects = hover ? "hover:shadow-xl transition-all duration-300 cursor-pointer" : "";

  return (
    <div 
      className={cn(
        "rounded-2xl",
        variants[variant],
        paddings[padding],
        shadows[shadow],
        hoverEffects,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// Specialized card variants
export const FormCard = ({ children, className, ...props }) => (
  <Card 
    variant="default" 
    padding="lg" 
    shadow="default"
    className={cn("mb-8", className)}
    {...props}
  >
    {children}
  </Card>
);

export const DashboardCard = ({ children, className, hover = true, ...props }) => (
  <Card 
    variant="default" 
    padding="lg" 
    shadow="default"
    hover={hover}
    className={cn("", className)}
    {...props}
  >
    {children}
  </Card>
);

export const GlassCard = ({ children, className, ...props }) => (
  <Card 
    variant="glass" 
    padding="xl" 
    shadow="2xl"
    className={cn("w-full max-w-4xl", className)}
    {...props}
  >
    {children}
  </Card>
);

export default Card;
