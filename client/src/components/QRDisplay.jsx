import React, { useRef, useState, useEffect } from 'react';
import QRCodeStyling from 'qr-code-styling';

export default function QRDisplay({ sessionId, apiUrl }) {
  const qrRef = useRef();
  const [joinUrl, setJoinUrl] = useState('');
  const qrCodeRef = useRef(null);

  useEffect(() => {
    // Get the server IP for QR code (works in npm dev mode)
    const fetchServerIP = async () => {
      try {
        // Use current hostname with backend port
        const hostname = window.location.hostname;
        const backendUrl = `http://${hostname}:3001/api/server-ip`;
        console.log('[QR] Fetching server IP from:', backendUrl);
        const response = await fetch(backendUrl);
        const data = await response.json();
        const url = `http://${data.ip}:5173/join/${sessionId}`;
        console.log('[QR] Generated QR URL:', url);
        setJoinUrl(url);
      } catch (error) {
        // Fallback: use current location for development
        console.warn('[QR] Could not fetch server IP, using current origin:', error.message);
        setJoinUrl(`${window.location.origin}/join/${sessionId}`);
      }
    };

    if (sessionId) {
      fetchServerIP();
    }
  }, [sessionId]);

  // Generate QR code when URL is ready
  useEffect(() => {
    if (joinUrl && qrRef.current) {
      if (!qrCodeRef.current) {
        qrCodeRef.current = new QRCodeStyling({
          width: 200,
          height: 200,
          data: joinUrl,
          image: undefined,
          margin: 10,
          qrOptions: {
            typeNumber: 0,
            mode: 'Byte',
            errorCorrectionLevel: 'H',
          },
          imageOptions: {
            hideBackgroundDots: true,
            imageSize: 0.4,
            margin: 0,
          },
          dotsOptions: {
            type: 'rounded',
            color: '#000000',
          },
          cornersSquareOptions: {
            type: 'extra-rounded',
            color: '#000000',
          },
          cornersDotOptions: {
            type: 'dot',
            color: '#000000',
          },
          backgroundOptions: {
            color: '#FFFFFF',
          },
        });

        qrCodeRef.current.append(qrRef.current);
      } else {
        qrCodeRef.current.update({ data: joinUrl });
      }
    }
  }, [joinUrl]);

  const downloadQR = () => {
    if (qrCodeRef.current) {
      qrCodeRef.current.download({ name: `board-game-${sessionId}` });
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-slate-800 rounded-xl">
      <h3 className="text-lg font-bold">Join Code</h3>
      <div className="text-4xl font-bold text-blue-400 tracking-widest">
        {sessionId}
      </div>

      <h3 className="text-lg font-bold mt-4">Or Scan QR Code</h3>
      <div
        ref={qrRef}
        className="p-4 bg-white rounded-lg shadow-xl"
      />

      <button
        onClick={downloadQR}
        className="btn-secondary text-sm mt-2"
        disabled={!joinUrl}
      >
        Download QR Code
      </button>

      <p className="text-xs text-gray-400 text-center mt-2 break-all">
        {joinUrl || 'Loading QR code...'}
      </p>
    </div>
  );
}
