import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Button,
  Divider
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import UrlStatsCard from '../components/Statistics/UrlStatsCard';
import { Log } from '../utils/logger';

const StatisticsPage = () => {
  const [urlStats, setUrlStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Log('frontend', 'info', 'page', 'statistics page loaded');
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    setLoading(true);
    setError('');
    
    try {
      Log('frontend', 'info', 'api', 'fetching URL statistics');
      
      // Mock API call - replace with actual API
      const response = await fetch('/api/statistics');
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      setUrlStats(data.urls || []);
      Log('frontend', 'info', 'api', `fetched statistics for ${data.urls?.length || 0} URLs`);
      
    } catch (err) {
      Log('frontend', 'error', 'api', `failed to fetch statistics: ${err.message}`);
      setError('Failed to load statistics. Please try again.');
      
      // For demo purposes, show mock data if API fails
      const mockData = [
        {
          shortUrl: 'http://localhost:3000/abc123',
          originalUrl: 'https://example.com/very-long-url-that-needs-shortening',
          createdAt: new Date().toISOString(),
          expiryDate: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
          totalClicks: 15,
          clicks: [
            {
              timestamp: new Date().toISOString(),
              source: 'Twitter',
              location: 'New York, US'
            },
            {
              timestamp: new Date(Date.now() - 3600000).toISOString(),
              source: 'Direct',
              location: 'London, UK'
            }
          ]
        },
        {
          shortUrl: 'http://localhost:3000/xyz789',
          originalUrl: 'https://another-example.com/path/to/resource',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          expiryDate: new Date(Date.now() - 3600000).toISOString(), // Expired
          totalClicks: 3,
          clicks: [
            {
              timestamp: new Date(Date.now() - 7200000).toISOString(),
              source: 'Email',
              location: 'Tokyo, JP'
            }
          ]
        }
      ];
      setUrlStats(mockData);
    } finally {
      setLoading(false);
    }
  };

  const refreshStats = () => {
    Log('frontend', 'info', 'component', 'manual statistics refresh triggered');
    fetchStatistics();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          URL Statistics
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Track performance and analytics for your shortened URLs
        </Typography>
        <Button
          startIcon={<RefreshIcon />}
          onClick={refreshStats}
          disabled={loading}
          variant="outlined"
          sx={{ mt: 2 }}
        >
          {loading ? 'Refreshing...' : 'Refresh Data'}
        </Button>
      </Box>

      <Divider sx={{ mb: 4 }} />

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {!loading && urlStats.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No URLs found
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Create some short URLs first to see statistics here.
          </Typography>
        </Box>
      )}

      {!loading && urlStats.length > 0 && (
        <Box>
          <Typography variant="h5" gutterBottom>
            Your URLs ({urlStats.length})
          </Typography>
          
          {urlStats.map((urlData, index) => (
            <UrlStatsCard key={index} urlData={urlData} />
          ))}
        </Box>
      )}
    </Container>
  );
};

export default StatisticsPage;
