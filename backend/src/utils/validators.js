const validateMoroccanPhone = (phone) => {
  // Moroccan phone format: +212 followed by 9 digits OR 0 followed by 9 digits
  // Examples: +212612345678, 0612345678, 212612345678
  const patterns = [
    /^\+212[5-7]\d{8}$/,    // +212 format
    /^0[5-7]\d{8}$/,         // 0 format
    /^212[5-7]\d{8}$/        // 212 format without +
  ];
  
  return patterns.some(pattern => pattern.test(phone.replace(/\s/g, '')));
};

const formatMoroccanPhone = (phone) => {
  // Remove spaces and format to +212 format
  const cleaned = phone.replace(/\s/g, '');
  
  if (cleaned.startsWith('+212')) {
    return cleaned;
  } else if (cleaned.startsWith('212')) {
    return '+' + cleaned;
  } else if (cleaned.startsWith('0')) {
    return '+212' + cleaned.substring(1);
  }
  
  return cleaned;
};

module.exports = {
  validateMoroccanPhone,
  formatMoroccanPhone
};
