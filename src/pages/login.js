import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useRouter } from "next/router";
import { useAuth } from "../contexts/AuthContext";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  
  const [showPassword, setShowPassword] = useState(false);
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
    
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Please enter a valid email";
    if (!formData.password) newErrors.password = "Password is required";

    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!validateForm()) return;
    
    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      // Check if user has completed profile
      if (result.user.bio && result.user.city) {
        router.push("/dashboard");
      } else {
        router.push("/profile-setup");
      }
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
            <div className="w-8 h-8 bg-gradient-to-r from-[#f38406] to-[#e07405] rounded-lg"></div>
            Homiee
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your account</p>
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

          {/* Password */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
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
                Signing In...
              </div>
            ) : (
              "Sign In"
            )}
          </motion.button>

          {/* Forgot Password */}
          <div className="text-center mt-4">
            <Link href="/forgot-password" className="text-sm text-[#f38406] hover:text-[#e07405] transition-colors">
              Forgot your password?
            </Link>
          </div>

          {/* Signup Link */}
          <div className="text-center mt-6 text-sm text-gray-600">
            Don't have an account?{" "}
            <Link href="/signup" className="text-[#f38406] hover:text-[#e07405] font-medium transition-colors">
              Create one
            </Link>
          </div>
        </motion.form>

        {/* Footer */}
        <div className="text-center mt-8 text-xs text-gray-500">
          By signing in, you agree to our{" "}
          <Link href="/terms" className="text-[#f38406] hover:underline">Terms of Service</Link>
          {" "}and{" "}
          <Link href="/privacy" className="text-[#f38406] hover:underline">Privacy Policy</Link>
        </div>
      </motion.div>
    </div>
  );
}
