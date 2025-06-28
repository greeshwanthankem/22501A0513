import React, { useState } from 'react';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  Chip,
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { validateUrl, validateValidityPeriod, validateShortcode } from '../../utils/validation';
import { Log } from '../../utils/logger';

const UrlForm = ({ onUrlsCreated }) => {
  const [urlForms, setUrlForms] = useState([
    { id: 1, originalUrl: '', validity: '', customShortcode: '', errors: {} }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState('');

  const addUrlForm = () => {
    if (urlForms.length >= 5) {
      Log('frontend', 'warn', 'component', 'user tried to add more than 5 URLs');
      setGlobalError('Maximum 5 URLs allowed');
      return;
    }
    
    const newForm = {
      id: Date.now(),
      originalUrl: '',
      validity: '',
      customShortcode: '',
      errors: {}
    };
    setUrlForms([...urlForms, newForm]);
    Log('frontend', 'info', 'component', `added new URL form, total: ${urlForms.length + 1}`);
  };

  const removeUrlForm = (id) => {
    if (urlForms.length === 1) {
      Log('frontend', 'warn', 'component', 'user tried to remove last URL form');
      return;
    }
    setUrlForms(urlForms.filter(form => form.id !== id));
    Log('frontend', 'info', 'component', `removed URL form, remaining: ${urlForms.length - 1}`);
  };

  const updateForm = (id, field, value) => {
    setUrlForms(urlForms.map(form => 
      form.id === id ? { ...form, [field]: value, errors: { ...form.errors, [field]: '' } } : form
    ));
    setGlobalError('');
  };

  const validateForm = (form) => {
    const errors = {};
    
    const urlValidation = validateUrl(form.originalUrl);
    if (!urlValidation.isValid) {
      errors.originalUrl = urlValidation.error;
    }

    const validityValidation = validateValidityPeriod(form.validity);
    if (!validityValidation.isValid) {
      errors.validity = validityValidation.error;
    }

    const shortcodeValidation = validateShortcode(form.customShortcode);
    if (!shortcodeValidation.isValid) {
      errors.customShortcode = shortcodeValidation.error;
    }

    return { isValid: Object.keys(errors).length === 0, errors };
  };

  const handleSubmit = async () => {
    Log('frontend', 'info', 'component', 'URL shortening form submitted');
    setIsLoading(true);
    setGlobalError('');

    // Validate all forms
    let hasErrors = false;
    const updatedForms = urlForms.map(form => {
      const validation = validateForm(form);
      if (!validation.isValid) {
        hasErrors = true;
      }
      return { ...form, errors: validation.errors };
    });

    setUrlForms(updatedForms);

    if (hasErrors) {
      Log('frontend', 'warn', 'component', 'form validation failed');
      setIsLoading(false);
      return;
    }

    // Filter out empty forms
    const validForms = updatedForms.filter(form => form.originalUrl.trim());
    
    if (validForms.length === 0) {
      Log('frontend', 'warn', 'component', 'no valid URLs to process');
      setGlobalError('Please enter at least one URL');
      setIsLoading(false);
      return;
    }

    try {
      // Prepare data for API
      const urlData = validForms.map(form => ({
        originalUrl: form.originalUrl.trim(),
        validity: form.validity ? parseInt(form.validity, 10) : 30,
        customShortcode: form.customShortcode.trim() || undefined
      }));

      Log('frontend', 'info', 'api', `sending ${urlData.length} URLs for shortening`);

      // Mock API call for now - replace with actual API
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ urls: urlData })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();
      Log('frontend', 'info', 'api', 'URLs shortened successfully');
      
      onUrlsCreated(result.urls);
      
      // Reset forms
      setUrlForms([
        { id: Date.now(), originalUrl: '', validity: '', customShortcode: '', errors: {} }
      ]);

    } catch (error) {
      Log('frontend', 'error', 'api', `URL shortening failed: ${error.message}`);
      setGlobalError('Failed to shorten URLs. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Shorten Your URLs
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Create up to 5 short URLs at once. Default validity is 30 minutes.
        </Typography>

        {globalError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {globalError}
          </Alert>
        )}

        {urlForms.map((form, index) => (
          <Box key={form.id} sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Chip label={`URL ${index + 1}`} color="primary" size="small" />
              {urlForms.length > 1 && (
                <IconButton 
                  onClick={() => removeUrlForm(form.id)}
                  size="small"
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>

            <TextField
              fullWidth
              label="Original URL"
              placeholder="https://example.com/very-long-url"
              value={form.originalUrl}
              onChange={(e) => updateForm(form.id, 'originalUrl', e.target.value)}
              error={!!form.errors.originalUrl}
              helperText={form.errors.originalUrl}
              sx={{ mb: 2 }}
            />

            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                label="Validity (minutes)"
                placeholder="30"
                type="number"
                value={form.validity}
                onChange={(e) => updateForm(form.id, 'validity', e.target.value)}
                error={!!form.errors.validity}
                helperText={form.errors.validity || 'Default: 30 minutes'}
                sx={{ flex: 1 }}
              />

              <TextField
                label="Custom Shortcode (optional)"
                placeholder="mycode123"
                value={form.customShortcode}
                onChange={(e) => updateForm(form.id, 'customShortcode', e.target.value)}
                error={!!form.errors.customShortcode}
                helperText={form.errors.customShortcode || '3-20 alphanumeric characters'}
                sx={{ flex: 1 }}
              />
            </Box>
          </Box>
        ))}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button
            startIcon={<AddIcon />}
            onClick={addUrlForm}
            disabled={urlForms.length >= 5}
            variant="outlined"
          >
            Add Another URL ({urlForms.length}/5)
          </Button>

          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isLoading}
            size="large"
          >
            {isLoading ? 'Creating...' : 'Shorten URLs'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default UrlForm;
