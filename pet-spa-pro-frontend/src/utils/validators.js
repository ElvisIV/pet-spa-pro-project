export const validatePassword = (password) => {
  const errors = [];
  
  if (password.length < 8) {
    errors.push('Mínimo 8 caracteres');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Debe tener mayúsculas');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Debe tener minúsculas');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Debe tener números');
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Debe tener símbolos');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    strength: calculateStrength(password)
  };
};

const calculateStrength = (password) => {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  
  if (score <= 2) return 'weak';
  if (score <= 4) return 'medium';
  return 'strong';
};

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};