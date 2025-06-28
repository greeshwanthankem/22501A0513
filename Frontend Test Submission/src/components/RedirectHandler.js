import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, CircularProgress, Alert, Button } from '@mui/material';
import { Log } from '../utils/logger';

const RedirectHandler = () => {
  const { shortcode } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [redirectUrl, setRedirectUrl] = useState('');

  useEffect(() => {
    Log('frontend', 'info', 'component', `redirect handler loaded for shortcode: ${shortcode}`);
    handleRedirect();
  }, [shortcode]);

  const handleRedirect = async () => {
    try {
      Log('frontend', 'info', 'api', `looking up original URL for shortcode: ${shortcode}`);
      
      // Track the click
      const clickData = {
        shortcode: shortcode,
        timestamp: new Date().toISOString(),
        source: document.referrer || 'Direct',
        userAgent: navigator.userAgent
      };

      // Mock API call to get original URL and track click
      const response = await fetch(`/api/redirect/${shortcode}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(clickData)
      });

      if (response.status === 404) {
        Log('frontend', 'warn', 'api', `shortcode not found: ${shortcode}`);
        setError('Short URL not found or has expired');
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.expired) {
        Log('frontend', 'warn', 'api', `shortcode expired: ${shortcode}`);
        setError('This short URL has expired');
        setLoading(false);
        return;
      }

      Log('frontend', 'info', 'api', `redirecting to: ${data.originalUrl}`);
      setRedirectUrl(data.originalUrl);
      
      // Redirect after a brief delay
      setTimeout(() => {
        window.location.href = data.originalUrl;
      }, 1500);

    } catch (err) {
      Log('frontend', 'error', 'api', `redirect failed: ${err.message}`);
      setError('Failed to redirect. The URL may not exist or has expired.');
      setLoading(false);
    }
  };

  const manualRedirect = () => {
    if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  };

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Typography variant="h5" gutterBottom>
          Oops! Something went wrong
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          The short URL "{shortcode}" could not be found or has expired.
        </Typography>
        <Button 
          variant="contained" 
          href="/shortener"
          sx={{ mt: 2 }}
        >
          Create New Short URL
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
      <Box sx={{ mb: 4 }}>
        <CircularProgress size={60} />
      </Box>
      
      <Typography variant="h4" gutterBottom>
        Redirecting...
      </Typography>
      
      <Typography variant="body1" color="text.secondary" gutterBottom>
        You're being redirected to the original URL.
      </Typography>

      {redirectUrl && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            If you're not redirected automatically, click below:
          </Typography>
          <Button 
            variant="contained" 
            onClick={manualRedirect}
            sx={{ mt: 1 }}
          >
            Go to URL
          </Button>
        </Box>
      )}

      <Box sx={{ mt: 4, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Short URL: /{shortcode}
        </Typography>
      </Box>
    </Container>
  );
};

export default RedirectHandler;
