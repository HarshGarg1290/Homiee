import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, Phone } from "lucide-react";
import { useRouter } from "next/router";
import { useAuth } from "../contexts/AuthContext";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const { register, isLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    clearErrors(name);
  };

  const clearErrors = (fieldName) => {
    if (error) setError("");
    if (fieldErrors[fieldName]) {
      setFieldErrors(prev => ({
        ...prev,
        [fieldName]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Please enter a valid email";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!validateForm()) return;
    
    // Create user account with basic info
    const result = await register(formData.email, formData.password, `${formData.firstName} ${formData.lastName}`, {
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone
    });
    
    if (result.success) {
      // Redirect to profile setup
      router.push("/profile-setup");
    } else {
      if (result.errors) {
        const errors = {};
        result.errors.forEach(err => {
          errors[err.path] = err.msg;
        });
        setFieldErrors(errors);
      } else {
        setError(result.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold text-gray-800 mb-4">
            <motion.img
						transition={{ duration: 0.3 }}
						onClick={() => {router.push('/')}}
						src="/logo.jpg"
						alt="Homiee Logo"
						className="relative w-6 h-6 rounded-sm transition-all duration-300 cursor-pointer"
					/>
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h1>
          <p className="text-gray-600">Join thousands finding their perfect flatmate</p>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-6"
          >
            {error}
          </motion.div>
        )}

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="John"
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#f38406] focus:border-transparent transition-all duration-200 text-gray-800 ${
                    fieldErrors.firstName ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                />
              </div>
              {fieldErrors.firstName && <p className="text-red-500 text-xs mt-1">{fieldErrors.firstName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Doe"
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#f38406] focus:border-transparent transition-all duration-200 text-gray-800 ${
                    fieldErrors.lastName ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                />
              </div>
              {fieldErrors.lastName && <p className="text-red-500 text-xs mt-1">{fieldErrors.lastName}</p>}
            </div>
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="john.doe@example.com"
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#f38406] focus:border-transparent transition-all duration-200 text-gray-800 ${
                  fieldErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
              />
            </div>
            {fieldErrors.email && <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>}
          </div>

          {/* Phone (Optional) */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number <span className="text-gray-400 text-xs">(Optional)</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+91 9876543210"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f38406] focus:border-transparent transition-all duration-200 text-gray-800"
              />
            </div>
          </div>

          {/* Password Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create password"
                  className={`w-full pl-10 pr-10 py-3 border rounded-xl focus:ring-2 focus:ring-[#f38406] focus:border-transparent transition-all duration-200 text-gray-800 ${
                    fieldErrors.password ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {fieldErrors.password && <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm password"
                  className={`w-full pl-10 pr-10 py-3 border rounded-xl focus:ring-2 focus:ring-[#f38406] focus:border-transparent transition-all duration-200 text-gray-800 ${
                    fieldErrors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {fieldErrors.confirmPassword && <p className="text-red-500 text-xs mt-1">{fieldErrors.confirmPassword}</p>}
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-[#f38406] to-[#e07405] text-white py-3 px-6 rounded-xl font-medium hover:from-[#e07405] hover:to-[#d06304] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Creating Account...
              </div>
            ) : (
              "Create Account & Continue"
            )}
          </motion.button>

          {/* Login Link */}
          <div className="text-center mt-6 text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-[#f38406] hover:text-[#e07405] font-medium transition-colors">
              Sign in
            </Link>
          </div>
        </motion.form>

        {/* Footer */}
        <div className="text-center mt-8 text-xs text-gray-500">
          By creating an account, you agree to our{" "}
          <Link href="/terms" className="text-[#f38406] hover:underline">Terms of Service</Link>
          {" "}and{" "}
          <Link href="/privacy" className="text-[#f38406] hover:underline">Privacy Policy</Link>
        </div>
      </motion.div>
    </div>
  );
}
