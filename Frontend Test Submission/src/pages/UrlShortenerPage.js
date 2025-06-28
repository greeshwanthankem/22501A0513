import React, { useState, useEffect } from 'react';
import { Container, Typography, Box } from '@mui/material';
import UrlForm from '../components/UrlShortener/UrlForm';
import UrlResults from '../components/UrlShortener/UrlResults';
import { Log } from '../utils/logger';

const UrlShortenerPage = () => {
  const [shortenedUrls, setShortenedUrls] = useState([]);

  useEffect(() => {
    Log('frontend', 'info', 'page', 'URL shortener page loaded');
  }, []);

  const handleUrlsCreated = (urls) => {
    setShortenedUrls(urls);
    Log('frontend', 'info', 'page', `received ${urls.length} shortened URLs`);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          URL Shortener
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Transform long URLs into short, manageable links
        </Typography>
      </Box>

      <UrlForm onUrlsCreated={handleUrlsCreated} />
      <UrlResults urls={shortenedUrls} />
    </Container>
  );
};

export default UrlShortenerPage;
