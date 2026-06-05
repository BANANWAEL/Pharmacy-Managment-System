import emailjs from "@emailjs/browser";

const SERVICE_ID = "service_cmykaej";
const TEMPLATE_ID = "template_5vpn7a8";
const PUBLIC_KEY = "DCdQgHxncNrnmkQyo";

// Store OTP in memory
let storedOTP = "";
let otpExpiry = 0;

export const sendOTP = async (toEmail: string): Promise<void> => {
  // Generate 6-digit OTP
  storedOTP = Math.floor(100000 + Math.random() * 900000).toString();
  otpExpiry = Date.now() + 5 * 60 * 1000; // expires in 5 min
console.log("Sending OTP with:", {   // 🔍 add this
    SERVICE_ID,
    TEMPLATE_ID,
    PUBLIC_KEY,
    toEmail,
    storedOTP,
  });
  await emailjs.send(
    SERVICE_ID,
    TEMPLATE_ID,
    {
      to_email: toEmail,
      otp_code: storedOTP,
    },
    PUBLIC_KEY
  );
};

export const verifyOTP = (inputCode: string): boolean => {
  if (Date.now() > otpExpiry) return false; // expired
  return inputCode === storedOTP;
};