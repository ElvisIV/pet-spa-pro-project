import React from 'react';
import { validatePassword } from '../../utils/validators';

const styles = {
  container: { marginTop: 8 },
  bar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#e0e0e0',
    transition: 'width 0.3s',
  },
  text: {
    fontSize: 12,
    marginTop: 2,
  },
};

const colors = {
  weak: '#ff4d4d',
  medium: '#ffa64d',
  strong: '#2ecc71',
};

function PasswordStrengthMeter({ password }) {
  if (!password) return null;

  const { strength } = validatePassword(password);
  const label = {
    weak: 'Débil',
    medium: 'Media',
    strong: 'Fuerte',
  }[strength];

  const width = { weak: '33%', medium: '66%', strong: '100%' }[strength];

  return (
    <div style={styles.container}>
      <div style={{ ...styles.bar, width, backgroundColor: colors[strength] }} />
      <div style={{ ...styles.text, color: colors[strength] }}>{label}</div>
    </div>
  );
}

export default PasswordStrengthMeter;