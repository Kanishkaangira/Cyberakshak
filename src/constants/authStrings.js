// Centralized user-facing Auth text strings (English default, Hindi translate-ready)
export const AUTH_STRINGS = {
  // Common Buttons & Labels
  appName: 'Cyberakshak',
  appTagline: 'Indian Cyber Fraud Safety & Defense',
  login: 'Log in',
  signUp: 'Create an Account',
  logout: 'Log out',
  confirmLogout: 'Are you sure you want to log out?',
  deleteAccount: 'Delete My Account',
  confirmDeleteAccount: 'Are you sure you want to delete your account? This will permanently remove all your profile data and cannot be undone.',
  continue: 'Continue',
  submit: 'Submit',
  verify: 'Verify OTP',
  resendCode: 'Resend Code',
  resendCooldown: (seconds) => `Resend code in ${seconds}s`,
  backToLogin: 'Back to Login',
  cancel: 'Cancel',

  // Welcome Screen
  welcomeTitle: 'Protect Yourself from Digital Scams',
  welcomeSubtitle: 'Real-time threat intelligence, scam reporting, and cyber fraud guidance across India.',

  // Login Screen
  loginTitle: 'Welcome Back',
  loginSubtitle: 'Sign in to access your cyber safety account',
  emailLabel: 'Email Address',
  emailPlaceholder: 'name@example.com',
  passwordLabel: 'Password',
  passwordPlaceholder: 'Enter your password',
  forgotPasswordLink: 'Forgot password?',
  noAccountPrompt: "Don't have an account?",

  // SignUp Screen
  signUpTitle: 'Create Account',
  signUpSubtitle: 'Join Cyberakshak to stay safe from online fraud',
  fullNameLabel: 'Full Name',
  fullNamePlaceholder: 'Enter your full name',
  phoneLabel: 'Phone Number (Optional)',
  phonePlaceholder: '10-digit mobile number',
  cityLabel: 'City (Optional)',
  cityPlaceholder: 'Enter your city',
  confirmPasswordLabel: 'Confirm Password',
  confirmPasswordPlaceholder: 'Re-enter your password',
  alreadyHaveAccount: 'Already have an account?',

  // OTP Verification Screen
  otpTitle: 'Verify Your Email',
  otpSubtitle: (email) => `We have sent a 6-digit verification code to ${email}`,
  enterOtpLabel: 'Enter 6-Digit Code',
  otpPlaceholder: '123456',
  otpExpired: 'Verification code expired or invalid. Please request a new code.',
  otpSentSuccess: 'A fresh 6-digit OTP code has been sent to your email.',

  // Forgot & Reset Password
  forgotTitle: 'Forgot Password',
  forgotSubtitle: 'Enter your registered email address to receive a password reset code.',
  resetTitle: 'Set New Password',
  resetSubtitle: 'Enter the 6-digit code sent to your email and choose a new password.',
  newPasswordLabel: 'New Password',
  newPasswordPlaceholder: 'Minimum 8 characters',

  // Errors & Validation
  errEmailRequired: 'Please enter a valid email address.',
  errPasswordMinLength: 'Password must be at least 8 characters long.',
  errPasswordMismatch: 'Passwords do not match.',
  errFullNameRequired: 'Please enter your full name.',
  errOtpLength: 'Please enter the complete 6-digit OTP code.',
  errNetwork: 'Unable to connect to server. Please check your internet connection.',
  errGeneric: 'An unexpected error occurred. Please try again.',
};
