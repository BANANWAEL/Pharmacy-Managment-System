"use client";
import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/UI/Button";
import { Input } from "@/components/UI/input";
import { Checkbox } from "@/components/UI/checkbox";
import { Label } from "@/components/UI/label";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { sendOTP, verifyOTP } from "@/services/otpService";
import { handleLogin, getMyProfile } from "@/services/authService";

const CONTENT = {
  signin: {
    title:
      "Log In And Take The Next Step Towards Smarter Pharmacy Management With Appthecar",
    description:
      "Manage your inventory, sales, and staff with the most advanced platform in Egypt.",
    image: "/login-bg.png",
  },
  otp: {
    title: "Verify Your Identity To Access Your Dashboard",
    description:
      "We have sent a 6-digit code to your email. Please enter it to continue.",
    image: "/login-bg.png",
  },
};

const slideVariants = {
  hidden: { x: 50, opacity: 0 },
  visible: { x: 0, opacity: 1 },
  exit: { x: -50, opacity: 0 },
};

export default function AuthForm() {
  const router = useRouter();
  const [step, setStep] = useState<"signin" | "otp">("signin");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<"manager" | "employee">("manager");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [error, setError] = useState("");

  const currentContent = CONTENT[step];

  // === 1. LOGIN ===
   const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    localStorage.removeItem("userToken");

    try {
      await handleLogin(email, password);
      await sendOTP(email);
      setStep("otp");
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  // ✅ MUST be here — inside component, before return
  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!verifyOTP(otpCode)) {
        setError("Invalid or expired OTP code.");
        return;
      }

      const token = localStorage.getItem("userToken");
      if (!token) {
        setError("Session expired. Please login again.");
        setStep("signin");
        return;
      }

      const userProfile = await getMyProfile();

      if (userProfile.employee_Role === "Admin") {
        router.push("/Dashboard/Manager");
      } else if (userProfile.employee_Role === "Pharmacist") {
        router.push("/Dashboard/Employee");
      } else {
        setError("Unauthorized role");
      }

    } catch (err: any) {
      setError(err.message || "Failed to verify identity");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex h-screen w-full">
      <div className="relative hidden w-347/864 flex-col justify-center items-center lg:flex text-white bg-mintgreen overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute inset-0 z-0"
          >
            <div className="absolute inset-0">
              <Image
                src={currentContent.image}
                alt="Background"
                fill
                priority
                className="object-fill"
              />
              <div className="absolute inset-0 bg-black/40 mix-blend-multiply" />
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="relative z-10 max-w-lg px-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={step + "-text"}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.1 }}
            >
              <div className="flex flex-col justify-center items-center max-w-lg px-5 z-10">
                <h2 className="text-3xl font-normal mb-2 leading-none">
                  {currentContent.title}
                </h2>
                <p className="text-white/90 text-1xl font-light mt-0">
                  {currentContent.description}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="flex w-full flex-col items-center justify-center lg:w-1/2 bg-background p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col items-center justify-center">
            <Image
              src="/image.png"
              alt="Logo"
              width={28}
              height={47}
              className="w-[27.44px] h-[46.5px] text-mintgreen"
              priority
            />
            <h1 className="text-mintgreen font-semibold text-4xl text-center mt-2">
              Appothecary
            </h1>
            <p className="mt-2 text-sm text-muted-text text-center">
              {step === "signin"
                ? "Enter your credentials to access your dashboard"
                : "We sent a code to your email. Please check it."}
            </p>
            <p className="text-xl font-bold tracking-tight text-primary-text mt-1">
              {step === "signin" ? "Welcome Back" : "Verify OTP"}
            </p>
          </div>

          <div className="overflow-hidden p-1">
            <AnimatePresence mode="wait">
              <motion.form
                key={step}
                variants={slideVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 1.2, ease: "easeOut" }}
                onSubmit={
                  step === "signin" ? handleLoginSubmit : handleVerifySubmit
                }
                className="space-y-6"
              >
                {step === "signin" ? (
                  <>
                    <div className="space-y-2 mb-2">
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-9 bg-secondary placeholder-darkgray"
                        placeholder="pharmacist@gmail.com"
                        required
                      />
                    </div>
                    <div className="space-y-2 mb-4">
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-9 bg-secondary! placeholder-darkgray"
                        placeholder="Password"
                        required
                      />
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="space-y-2 w-1/2 relative">
                        <select
                          value={role}
                          onChange={(e) => setRole(e.target.value as any)}
                          className="h-9 w-full appearance-none rounded-md border border-secondary bg-secondary px-3 py-1 text-sm text-primary-text focus:outline-none focus:ring-2 focus:ring-mintgreen cursor-pointer"
                        >
                          <option value="manager">Manager</option>
                          <option value="employee">Employee</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-muted-text pointer-events-none" />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      size="lg"
                      loading={loading}
                      className="w-full"
                    >
                      Sign In
                    </Button>
                    {error && (
                      <p className="text-red-500 text-sm text-center">
                        {error}
                      </p>
                    )}
                    <div className="flex items-center space-x-2">
                      <Checkbox id="remember" />
                      <Label htmlFor="remember">Remember Me</Label>
                    </div>
                  </>
                ) : (
                  <>
                    <Input
                      id="code"
                      placeholder="Enter OTP"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="text-center text-md h-9 tracking-widest"
                    />
                    <Button
                      type="submit"
                      loading={loading}
                      className="w-full mb-3"
                    >
                      Let's Get Started
                    </Button>
                    {error && (
                      <p className="text-red-500 text-sm text-center">
                        {error}
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        localStorage.removeItem("userToken");
                        setStep("signin");
                      }}
                      className="w-full text-sm text-muted-text hover:underline"
                    >
                      Back to Login
                    </button>
                  </>
                )}
              </motion.form>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
