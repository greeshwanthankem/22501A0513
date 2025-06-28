import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Collapse,
  Tooltip
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import LinkIcon from '@mui/icons-material/Link';
import { formatExpiryDate } from '../../utils/validation';
import { Log } from '../../utils/logger';

const UrlStatsCard = ({ urlData }) => {
  const [expandedClicks, setExpandedClicks] = useState(false);

  const toggleClickDetails = () => {
    setExpandedClicks(!expandedClicks);
    Log('frontend', 'debug', 'component', `click details ${expandedClicks ? 'collapsed' : 'expanded'}`);
  };

  const getStatusChip = () => {
    const now = new Date();
    const expiry = new Date(urlData.expiryDate);
    
    if (expiry < now) {
      return <Chip label="Expired" color="error" size="small" />;
    }
    return <Chip label="Active" color="success" size="small" />;
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LinkIcon color="primary" />
            <Typography variant="h6" component="div">
              {urlData.shortUrl}
            </Typography>
          </Box>
          {getStatusChip()}
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Original URL:
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              wordBreak: 'break-all',
              fontFamily: 'monospace',
              fontSize: '0.9rem',
              backgroundColor: '#f5f5f5',
              p: 1,
              borderRadius: 1
            }}
          >
            {urlData.originalUrl}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Created:
            </Typography>
            <Typography variant="body1">
              {formatExpiryDate(urlData.createdAt)}
            </Typography>
          </Box>
          
          <Box>
            <Typography variant="body2" color="text.secondary">
              Expires:
            </Typography>
            <Typography variant="body1">
              {formatExpiryDate(urlData.expiryDate)}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              Total Clicks:
            </Typography>
            <Typography variant="h6" color="primary">
              {urlData.totalClicks}
            </Typography>
          </Box>
        </Box>

        {urlData.clicks && urlData.clicks.length > 0 && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">
                Click Details ({urlData.clicks.length})
              </Typography>
              <Tooltip title={expandedClicks ? "Hide details" : "Show details"}>
                <IconButton onClick={toggleClickDetails}>
                  {expandedClicks ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </Tooltip>
            </Box>

            <Collapse in={expandedClicks}>
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Timestamp</TableCell>
                      <TableCell>Source</TableCell>
                      <TableCell>Location</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {urlData.clicks.map((click, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {formatExpiryDate(click.timestamp)}
                        </TableCell>
                        <TableCell>
                          {click.source || 'Direct'}
                        </TableCell>
                        <TableCell>
                          {click.location || 'Unknown'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Collapse>
          </>
        )}

        {(!urlData.clicks || urlData.clicks.length === 0) && (
          <Box sx={{ textAlign: 'center', py: 2, backgroundColor: '#f9f9f9', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
              No clicks recorded yet
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default UrlStatsCard;
