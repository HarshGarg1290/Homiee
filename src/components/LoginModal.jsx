import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import Modal from "./ui/Modal";
import { useModal } from "../contexts/ModalContext";
import { useRouter } from "next/router";
import { FcGoogle } from "react-icons/fc";

export default function LoginModal() {
  const { isLoginOpen, closeModals } = useModal();
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      closeModals();
    }, 2000);
  };

  return (
    <Modal isOpen={isLoginOpen} onClose={closeModals} title="Welcome Back">
      <form onSubmit={handleSubmit} className="space-y-2">
        {/* Email Field */}
        <div>
          <label className="text-sm font-medium text-gray-700">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#f38406] focus:border-transparent transition-all duration-200 font-body text-sm text-black"
              required
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#f38406] focus:border-transparent transition-all duration-200 font-body text-sm text-black"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-1 pl-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        
        <div className="flex ">
              <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isLoading}
          className="w-1/2 bg-gradient-to-r from-[#f38406] via-[#e07405] to-[#d06304] text-white py-2.5 rounded-lg font-bold transition-all duration-300 hover:from-[#e07405] hover:via-[#d06304] hover:to-[#c05503] disabled:opacity-50 disabled:cursor-not-allowed font-body text-sm"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Signing in...
            </div>
          ) : (
            "Sign In"
          )}
        </motion.button>
          <button
            type="button"
            className="w-1/2 text-xs text-center text-[#f38406] hover:text-[#e07405] font-medium transition-colors"
          >
            Forgot password?
          </button>
        </div>

 
      

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        {/* Social Login Buttons */}
        <div className=" flex items-center justify-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            className="flex items-center justify-center px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-body text-sm text-black"
          >
            <FcGoogle />
              
          </motion.button>
        </div>

        {/* Sign Up Link */}
        <div className="text-center text-xs text-gray-600">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => {
              closeModals();
              router.push("/signup");
            }}
            className="text-[#f38406] hover:text-[#e07405] font-medium transition-colors cursor-pointer"
          >
            Sign up
          </button>
        </div>
      </form>
    </Modal>
  );
}
