"use client";
import React, { createContext, useContext, useState } from "react";

type AuthContextType = {
  step: "signin" | "otp";
  setStep: (step: "signin" | "otp") => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [step, setStep] = useState<"signin" | "otp">("signin");

  return (
    <AuthContext.Provider value={{ step, setStep }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}