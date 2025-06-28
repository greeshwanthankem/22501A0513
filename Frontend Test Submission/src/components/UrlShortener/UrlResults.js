import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  Alert,
  IconButton,
  Tooltip,
  Snackbar
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { formatExpiryDate } from '../../utils/validation';
import { Log } from '../../utils/logger';

const UrlResults = ({ urls }) => {
  const [copiedUrl, setCopiedUrl] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const copyToClipboard = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      setSnackbarOpen(true);
      Log('frontend', 'info', 'component', 'short URL copied to clipboard');
    } catch (error) {
      Log('frontend', 'error', 'component', `clipboard copy failed: ${error.message}`);
    }
  };

  const openUrl = (url) => {
    window.open(url, '_blank');
    Log('frontend', 'info', 'component', 'original URL opened in new tab');
  };

  if (!urls || urls.length === 0) {
    return null;
  }

  return (
    <>
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Your Shortened URLs
          </Typography>
          <Alert severity="success" sx={{ mb: 2 }}>
            Successfully created {urls.length} short URL{urls.length > 1 ? 's' : ''}!
          </Alert>

          {urls.map((url, index) => (
            <Box
              key={index}
              sx={{
                p: 2,
                mb: 2,
                border: '1px solid #e0e0e0',
                borderRadius: 1,
                backgroundColor: '#f9f9f9'
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Chip label={`URL ${index + 1}`} color="primary" size="small" />
                <Chip 
                  label={url.expiryDate ? `Expires: ${formatExpiryDate(url.expiryDate)}` : 'No expiry'} 
                  variant="outlined" 
                  size="small" 
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Original URL:
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      wordBreak: 'break-all',
                      flex: 1,
                      fontFamily: 'monospace',
                      fontSize: '0.9rem'
                    }}
                  >
                    {url.originalUrl}
                  </Typography>
                  <Tooltip title="Open original URL">
                    <IconButton 
                      size="small" 
                      onClick={() => openUrl(url.originalUrl)}
                    >
                      <OpenInNewIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Short URL:
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography 
                    variant="h6" 
                    color="primary"
                    sx={{ 
                      fontFamily: 'monospace',
                      fontSize: '1.1rem',
                      flex: 1
                    }}
                  >
                    {url.shortUrl}
                  </Typography>
                  <Tooltip title="Copy short URL">
                    <IconButton 
                      size="small" 
                      onClick={() => copyToClipboard(url.shortUrl)}
                      color="primary"
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              {url.customShortcode && (
                <Box sx={{ mt: 1 }}>
                  <Chip 
                    label={`Custom code: ${url.customShortcode}`} 
                    variant="outlined" 
                    size="small" 
                    color="secondary"
                  />
                </Box>
              )}
            </Box>
          ))}

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              💡 Tip: Bookmark this page or save these URLs. You can view statistics and manage them from the Statistics page.
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="URL copied to clipboard!"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </>
  );
};

export default UrlResults;
