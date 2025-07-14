/**
 * Reusable Button Components
 * Standardized button styles and variants
 */
import { cn } from "../../lib/utils";

export const Button = ({ 
  children,
  variant = "primary",
  size = "md",
  className = "",
  loading = false,
  disabled = false,
  fullWidth = false,
  ...props
}) => {
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white shadow-lg hover:shadow-xl", 
    outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white",
    ghost: "text-blue-600 hover:bg-blue-50",
    danger: "bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl",
    success: "bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl"
  };

  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  return (
    <button
      className={cn(
        "rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center space-x-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

// Specialized button variants
export const SubmitButton = ({ children = "Submit", loading, ...props }) => (
  <Button type="submit" loading={loading} {...props}>
    {children}
  </Button>
);

export const CancelButton = ({ children = "Cancel", ...props }) => (
  <Button variant="outline" {...props}>
    {children}
  </Button>
);

export const DeleteButton = ({ children = "Delete", ...props }) => (
  <Button variant="danger" {...props}>
    {children}
  </Button>
);

export const LinkButton = ({ href, children, external = false, ...props }) => (
  <a 
    href={href}
    target={external ? "_blank" : undefined}
    rel={external ? "noopener noreferrer" : undefined}
    className={cn(
      "inline-block rounded-lg font-medium transition-all duration-200 transform hover:scale-105",
      "px-6 py-3 text-base",
      "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl",
      props.className
    )}
  >
    {children}
  </a>
);

export default Button;
