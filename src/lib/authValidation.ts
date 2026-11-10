export interface PasswordStrength {
  valid: boolean;
  score: number;
  checks: {
    minLength: boolean;
    hasUpper: boolean;
    hasLower: boolean;
    hasNumber: boolean;
    hasSymbol: boolean;
  };
}

export function validateEmailFormat(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

export function checkPasswordStrength(password: string): PasswordStrength {
  const checks = {
    minLength: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSymbol: /[^A-Za-z0-9]/.test(password),
  };
  const score = Object.values(checks).filter(Boolean).length;
  return {
    valid: checks.minLength && checks.hasUpper && checks.hasLower && checks.hasNumber && checks.hasSymbol,
    score,
    checks,
  };
}

export function validateAgeConfirmation(dob: string, referenceDate = new Date()): {
  valid: boolean;
  age: number | null;
  isUnder18: boolean;
  error?: string;
} {
  if (!dob) {
    return { valid: false, age: null, isUnder18: false, error: 'Date of birth is required for age-appropriate safety.' };
  }
  const parsed = new Date(dob);
  if (Number.isNaN(parsed.getTime())) {
    return { valid: false, age: null, isUnder18: false, error: 'Please enter a valid date of birth.' };
  }
  let age = referenceDate.getUTCFullYear() - parsed.getUTCFullYear();
  const monthDiff = referenceDate.getUTCMonth() - parsed.getUTCMonth();
  if (monthDiff < 0 || (monthDiff === 0 && referenceDate.getUTCDate() < parsed.getUTCDate())) {
    age -= 1;
  }
  if (age < 13 || age > 110) {
    return { valid: false, age, isUnder18: age < 18, error: 'Users must be at least 13 years old to create an account.' };
  }
  return { valid: true, age, isUnder18: age < 18 };
}
