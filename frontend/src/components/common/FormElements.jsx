/**
 * Reusable Form Components
 * Standardized form elements with consistent styling
 */
import { cn } from "../../lib/utils";

// Base Input Component
export const FormInput = ({ 
  label, 
  error, 
  className = "",
  required = false,
  ...props 
}) => (
  <div className="space-y-2">
    {label && (
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    )}
    <input
      className={cn(
        "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all",
        error && "border-red-500 focus:ring-red-500",
        className
      )}
      {...props}
    />
    {error && <p className="text-sm text-red-600">{error}</p>}
  </div>
);

// Select Component
export const FormSelect = ({ 
  label, 
  options = [], 
  error, 
  className = "",
  placeholder = "Select an option",
  required = false,
  ...props 
}) => (
  <div className="space-y-2">
    {label && (
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    )}
    <select
      className={cn(
        "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all",
        error && "border-red-500 focus:ring-red-500",
        className
      )}
      {...props}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {error && <p className="text-sm text-red-600">{error}</p>}
  </div>
);

// Checkbox Component
export const FormCheckbox = ({ 
  label, 
  error, 
  className = "",
  ...props 
}) => (
  <div className="space-y-2">
    <div className="flex items-center space-x-3">
      <input
        type="checkbox"
        className={cn(
          "w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500",
          error && "border-red-500",
          className
        )}
        {...props}
      />
      {label && (
        <label className="text-sm text-gray-700 cursor-pointer">
          {label}
        </label>
      )}
    </div>
    {error && <p className="text-sm text-red-600">{error}</p>}
  </div>
);

// Textarea Component
export const FormTextarea = ({ 
  label, 
  error, 
  className = "",
  rows = 4,
  required = false,
  ...props 
}) => (
  <div className="space-y-2">
    {label && (
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    )}
    <textarea
      rows={rows}
      className={cn(
        "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none",
        error && "border-red-500 focus:ring-red-500",
        className
      )}
      {...props}
    />
    {error && <p className="text-sm text-red-600">{error}</p>}
  </div>
);

// Radio Group Component
export const FormRadioGroup = ({ 
  label, 
  options = [], 
  name, 
  value, 
  onChange, 
  error, 
  className = "",
  required = false 
}) => (
  <div className="space-y-3">
    {label && (
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    )}
    <div className={cn("space-y-2", className)}>
      {options.map((option) => (
        <div key={option.value} className="flex items-center space-x-3">
          <input
            type="radio"
            id={`${name}-${option.value}`}
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={onChange}
            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
          />
          <label 
            htmlFor={`${name}-${option.value}`}
            className="text-sm text-gray-700 cursor-pointer"
          >
            {option.label}
          </label>
        </div>
      ))}
    </div>
    {error && <p className="text-sm text-red-600">{error}</p>}
  </div>
);
