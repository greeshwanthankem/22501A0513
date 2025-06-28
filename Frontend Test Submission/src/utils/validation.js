import { Log } from './logger';

export const validateUrl = (url) => {
  if (!url || typeof url !== 'string') {
    Log('frontend', 'warn', 'utils', 'empty or invalid URL provided');
    return { isValid: false, error: 'URL is required' };
  }

  try {
    const urlObj = new URL(url);
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      Log('frontend', 'warn', 'utils', 'invalid protocol in URL');
      return { isValid: false, error: 'URL must start with http:// or https://' };
    }
    Log('frontend', 'debug', 'utils', 'URL validation passed');
    return { isValid: true };
  } catch (error) {
    Log('frontend', 'warn', 'utils', `URL validation failed: ${error.message}`);
    return { isValid: false, error: 'Please enter a valid URL' };
  }
};

export const validateValidityPeriod = (validity) => {
  if (!validity) {
    Log('frontend', 'debug', 'utils', 'no validity period provided, will use default');
    return { isValid: true };
  }

  const num = parseInt(validity, 10);
  if (isNaN(num) || num <= 0) {
    Log('frontend', 'warn', 'utils', 'invalid validity period provided');
    return { isValid: false, error: 'Validity must be a positive number' };
  }

  if (num > 525600) { // max 1 year in minutes
    Log('frontend', 'warn', 'utils', 'validity period too long');
    return { isValid: false, error: 'Validity cannot exceed 1 year (525600 minutes)' };
  }

  Log('frontend', 'debug', 'utils', 'validity period validation passed');
  return { isValid: true };
};

export const validateShortcode = (shortcode) => {
  if (!shortcode) {
    Log('frontend', 'debug', 'utils', 'no custom shortcode provided');
    return { isValid: true };
  }

  const alphanumeric = /^[a-zA-Z0-9]+$/;
  if (!alphanumeric.test(shortcode)) {
    Log('frontend', 'warn', 'utils', 'shortcode contains invalid characters');
    return { isValid: false, error: 'Shortcode must be alphanumeric' };
  }

  if (shortcode.length < 3 || shortcode.length > 20) {
    Log('frontend', 'warn', 'utils', 'shortcode length invalid');
    return { isValid: false, error: 'Shortcode must be 3-20 characters long' };
  }

  Log('frontend', 'debug', 'utils', 'shortcode validation passed');
  return { isValid: true };
};

export const formatExpiryDate = (expiryTimestamp) => {
  try {
    const date = new Date(expiryTimestamp);
    return date.toLocaleString();
  } catch (error) {
    Log('frontend', 'error', 'utils', `date formatting failed: ${error.message}`);
    return 'Invalid date';
  }
};
