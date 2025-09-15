import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';
import {
  Box,
  Typography,
  Button,
  Alert,
  Paper,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';

const ScannerContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  margin: theme.spacing(2, 0),
  textAlign: 'center',
  '& #qr-reader': {
    border: 'none',
    '& > div': {
      border: `2px solid ${theme.palette.primary.main}`,
      borderRadius: theme.shape.borderRadius,
    }
  }
}));

const QRScanner = ({ onScanSuccess, onScanError, expectedSecret }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');
  const scannerRef = useRef(null);
  const qrScannerRef = useRef(null);

  const startScanner = async () => {
    setIsScanning(true);
    setError('');
    
    try {
      // Request camera permission explicitly
      await navigator.mediaDevices.getUserMedia({ video: true });
      
      if (qrScannerRef.current) {
        await qrScannerRef.current.clear();
      }

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
        disableFlip: false,
        videoConstraints: {
          facingMode: "environment"
        },
        showTorchButtonIfSupported: true,
        supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA]
      };

      qrScannerRef.current = new Html5QrcodeScanner(
        "qr-reader",
        config,
        /* verbose= */ false
      );

      qrScannerRef.current.render(
        (decodedText) => {
          // Success callback
          if (expectedSecret && decodedText === expectedSecret) {
            onScanSuccess(decodedText);
            stopScanner();
          } else if (!expectedSecret) {
            onScanSuccess(decodedText);
            stopScanner();
          } else {
            setError('QR code does not match the expected secret. Please try again.');
            if (onScanError) {
              onScanError('Invalid QR code');
            }
          }
        },
        (error) => {
          // Error callback - only log significant errors
          if (error && !error.includes('NotFoundException')) {
            console.warn('QR scan error:', error);
          }
        }
      );
    } catch (error) {
      console.error('Camera permission error:', error);
      setError('Camera permission denied. Please allow camera access and try again.');
      setIsScanning(false);
    }
  };

  const stopScanner = async () => {
    if (qrScannerRef.current) {
      try {
        await qrScannerRef.current.clear();
        qrScannerRef.current = null;
      } catch (err) {
        console.error('Error stopping scanner:', err);
      }
    }
    setIsScanning(false);
  };

  useEffect(() => {
    return () => {
      if (qrScannerRef.current) {
        qrScannerRef.current.clear().catch(console.error);
      }
    };
  }, []);

  return (
    <ScannerContainer elevation={3}>
      <Typography variant="h6" gutterBottom>
        QR Code Scanner
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {!isScanning ? (
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Click the button below to start scanning for the QR code.
          </Typography>
          <Button 
            variant="contained" 
            onClick={startScanner}
            size="large"
          >
            Start QR Scanner
          </Button>
        </Box>
      ) : (
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Point your camera at the QR code
          </Typography>
          <div id="qr-reader" ref={scannerRef}></div>
          <Button 
            variant="outlined" 
            onClick={stopScanner}
            sx={{ mt: 2 }}
          >
            Stop Scanner
          </Button>
        </Box>
      )}
    </ScannerContainer>
  );
};

export default QRScanner;