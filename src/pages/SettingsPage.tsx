import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Navbar from "@/components/features/navigation/Navbar";
import {
  Settings as SettingsIcon,
  DollarSign,
  Info,
  LogOut,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router";

export default function Settings() {
  const navigate = useNavigate();

  // State management
  const [income, setIncome] = useState("300");
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false); // New state for logout

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Prevent invalid input entirely
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setIncome(value);
      if (error) setError("");
    }
  };

  const handleSave = () => {
    // Validation check
    if (!income || income.trim() === "") {
      setError("Please enter your weekly income.");
      return;
    }

    if (parseFloat(income) <= 0) {
      setError("Income must be greater than $0.");
      return;
    }

    setError("");
    setShowSuccess(true);
    toast.success("Settings saved successfully! 🎉");
  };

  const handleLogoutClick = () => {
    // Just show the modal, don't log out yet
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    // The actual logout logic
    setShowLogoutConfirm(false);
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <div className="relative min-h-screen">
      <Navbar />

      {/* Main Content */}
      <div className="space-y-6 max-w-4xl mx-auto mt-8 mb-16 px-4 md:px-0">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary via-green-600 to-emerald-600 rounded-2xl p-8 text-white shadow-lg"
        >
          <div className="flex items-center gap-2 mb-2">
            <SettingsIcon className="w-8 h-8" />
            <h1 className="text-4xl font-bold mb-2">Profile Settings</h1>
          </div>
          <p className="text-base opacity-90">
            Customize your financial journey to match your reality
          </p>
        </motion.div>

        {/* User Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white rounded-2xl p-6 shadow-md border border-gray-200"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Account Information
          </h2>
          <div className="space-y-3">
            <div>
              <Label className="text-sm text-gray-600">Name</Label>
              <p className="text-base font-medium text-gray-800">Sarah</p>
            </div>
            <div>
              <Label className="text-sm text-gray-600">Email</Label>
              <p className="text-base font-medium text-gray-800">
                sarah@mail.com
              </p>
            </div>
          </div>
        </motion.div>

        {/* Income Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-md border border-gray-200"
        >
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-5 h-5 text-green-600" />
            <h2 className="text-xl font-bold text-gray-800">Income Settings</h2>
          </div>

          <div className="space-y-4">
            <div>
              <Label
                htmlFor="weeklyIncome"
                className={`text-base font-medium ${error ? "text-red-600" : "text-gray-700"}`}
              >
                Weekly Income (after tax)
              </Label>
              <div className="mt-2 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <Input
                  id="weeklyIncome"
                  type="text"
                  inputMode="decimal"
                  value={income}
                  onChange={handleIncomeChange}
                  className={`text-base py-5 pl-7 ${
                    error ? "border-red-500 focus-visible:ring-red-500" : ""
                  }`}
                  placeholder="0.00"
                />
              </div>

              {error ? (
                <div className="flex items-center gap-1 mt-2 text-red-600 text-sm font-medium">
                  <AlertCircle className="w-4 h-4" />
                  <p>{error}</p>
                </div>
              ) : (
                <p className="text-sm text-gray-500 mt-2">
                  This is your take-home pay per week. We'll use this to
                  calculate your savings rate.
                </p>
              )}
            </div>

            <Button
              onClick={handleSave}
              className="bg-primary hover:bg-primary/90 text-white py-5 px-6 rounded-xl font-bold transition-colors"
            >
              Save Changes
            </Button>
          </div>
        </motion.div>

        {/* Current Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl p-6 shadow-md border border-gray-200"
        >
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-5 h-5 text-green-600" />
            <h2 className="text-xl font-bold text-gray-800">Your Stats</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 rounded-xl p-4 border border-green-100">
              <div className="text-sm text-gray-600">Plant Level</div>
              <div className="text-3xl font-bold text-green-600">4</div>
            </div>
            <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
              <div className="text-sm text-gray-600">Current Streak</div>
              <div className="text-3xl font-bold text-orange-600">2 days</div>
            </div>
            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
              <div className="text-sm text-gray-600">Plant Health</div>
              <div className="text-3xl font-bold text-emerald-600">80%</div>
            </div>
          </div>
        </motion.div>

        {/* Logout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            onClick={handleLogoutClick}
            variant="outline"
            className="w-full md:w-auto border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 py-5 px-6 rounded-xl font-medium transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Log Out
          </Button>
        </motion.div>
      </div>

      {/* --- OVERLAYS & MODALS --- */}
      <AnimatePresence>
        {/* Success Modal */}
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
            onClick={() => setShowSuccess(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                All Set!
              </h3>
              <p className="text-gray-600 mb-8">
                Your income settings have been successfully updated to ${income}
                .
              </p>
              <Button
                onClick={() => setShowSuccess(false)}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-6 rounded-xl font-bold text-lg transition-colors"
              >
                Awesome
              </Button>
            </motion.div>
          </motion.div>
        )}

        {/* Logout Confirmation Modal */}
        {showLogoutConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
            onClick={() => setShowLogoutConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
                <LogOut className="w-10 h-10 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Ready to leave?
              </h3>
              <p className="text-gray-600 mb-8 text-sm">
                You will need to sign back in to access your dashboard and plant
                stats.
              </p>
              <div className="flex gap-3 w-full">
                <Button
                  onClick={() => setShowLogoutConfirm(false)}
                  variant="outline"
                  className="flex-1 py-6 rounded-xl font-bold text-gray-700 border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmLogout}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-6 rounded-xl font-bold transition-colors"
                >
                  Log Out
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
