import React, { useState, useEffect, useCallback } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import api from '../utils/api';
import Card from '../components/Card';
import Button from '../components/Button';
import { ShieldCheck, XCircle, CheckCircle, RefreshCw, Camera, LogIn, LogOut } from 'lucide-react';

const QrScanner = () => {
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(true);
  const [scanMode, setScanMode] = useState('entry');

  const onScanSuccess = useCallback(async (decodedText) => {
    try {
      setIsScanning(false);
      setLoading(true);
      setError(null);

      const endpoint = scanMode === 'entry' ? '/scan-entry' : '/scan-exit';
      const response = await api.post(endpoint, { qr_code: decodedText });
      setScanResult({ ...response.data, mode: scanMode });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to verify QR code');
    } finally {
      setLoading(false);
    }
  }, [scanMode]);

  const onScanError = useCallback(() => {
    // ignore intermittent frame decode failures
  }, []);

  useEffect(() => {
    let scanner = null;
    if (isScanning) {
      scanner = new Html5QrcodeScanner('reader', {
        qrbox: {
          width: 250,
          height: 250,
        },
        fps: 10,
      });

      scanner.render(onScanSuccess, onScanError);
    }

    return () => {
      if (scanner) {
        scanner.clear().catch(err => console.error('Failed to clear scanner', err));
      }
    };
  }, [isScanning, onScanSuccess, onScanError]);

  const resetScanner = () => {
    setScanResult(null);
    setError(null);
    setIsScanning(true);
  };

  const formatDateTime = (value) => {
    if (!value) return '--';
    return new Date(value).toLocaleString([], {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-6 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-40 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-[100px] animate-blob"></div>
        <div className="absolute bottom-40 -right-20 w-96 h-96 bg-accent/5 rounded-full blur-[100px] animate-blob animation-delay-4000"></div>
      </div>

      <div className="container-max relative z-10 max-w-2xl mx-auto">
        <div className="text-center mb-12 space-y-4">
          <div className="flex items-center gap-3 bg-white/50 backdrop-blur-md px-4 py-2 rounded-2xl border border-gray-100 w-fit mx-auto shadow-soft">
            <ShieldCheck size={14} className="text-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Security Checkpoint</span>
          </div>
          <h1 className="text-5xl font-black text-dark tracking-tighter leading-none">
            QR <span className="text-primary italic">Validator</span>
          </h1>
          <p className="text-lg text-secondary font-medium opacity-80">
            Instant institutional access verification.
          </p>
        </div>

        <Card className="p-0 overflow-hidden border-none shadow-float rounded-[3rem] bg-white">
          {isScanning ? (
            <div className="p-10 space-y-10">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setScanMode('entry')}
                  className={`flex-1 h-12 rounded-xl border font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transition-all ${
                    scanMode === 'entry'
                      ? 'bg-success text-white border-success shadow-soft'
                      : 'bg-white text-secondary border-gray-200 hover:border-success/40'
                  }`}
                >
                  <LogIn size={16} /> Scan In
                </button>
                <button
                  onClick={() => setScanMode('exit')}
                  className={`flex-1 h-12 rounded-xl border font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transition-all ${
                    scanMode === 'exit'
                      ? 'bg-primary text-white border-primary shadow-soft'
                      : 'bg-white text-secondary border-gray-200 hover:border-primary/40'
                  }`}
                >
                  <LogOut size={16} /> Scan Out
                </button>
              </div>
              <div className="bg-gray-50 rounded-[2.5rem] overflow-hidden relative border-2 border-dashed border-gray-200">
                <div id="reader"></div>
                {!isScanning && (
                   <div className="absolute inset-0 flex items-center justify-center bg-dark/20 backdrop-blur-sm">
                      <div className="h-16 w-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                   </div>
                )}
              </div>
              <div className="flex items-center gap-4 text-secondary/60 justify-center">
                 <Camera size={18} />
                 <span className="text-xs font-black uppercase tracking-widest">
                   {scanMode === 'entry' ? 'Entry mode active' : 'Exit mode active'} - position QR code within the frame
                 </span>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center space-y-10">
              {loading ? (
                <div className="py-20 flex flex-col items-center gap-8">
                  <div className="h-20 w-20 border-8 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                  <p className="font-black text-xl text-dark animate-pulse uppercase tracking-tighter">Synchronizing Protocol...</p>
                </div>
              ) : error ? (
                <div className="space-y-10">
                  <div className="h-32 w-32 bg-danger/10 text-danger rounded-[3rem] flex items-center justify-center mx-auto shadow-lg shadow-danger/20 border border-danger/20">
                    <XCircle size={64} />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-3xl font-black text-dark tracking-tight">Access Denied</h3>
                    <p className="text-secondary font-bold text-lg bg-danger/5 py-4 px-8 rounded-2xl border border-danger/10 inline-block">{error}</p>
                  </div>
                  <Button onClick={resetScanner} className="w-full h-16 rounded-2xl bg-dark text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-4">
                    <RefreshCw size={20} /> Restart Protocol
                  </Button>
                </div>
              ) : scanResult ? (
                <div className="space-y-10">
                  <div className="h-32 w-32 bg-success/10 text-success rounded-[3rem] flex items-center justify-center mx-auto shadow-lg shadow-success/20 border border-success/20">
                    <CheckCircle size={64} />
                  </div>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-3xl font-black text-dark tracking-tight uppercase">Protocol Validated</h3>
                      <p className="text-success font-black text-sm uppercase tracking-widest mt-2">
                        {(scanResult.action || scanResult.mode) === 'checkout' || scanResult.mode === 'exit' ? 'Check-Out Executed' : 'Check-In Executed'}
                      </p>
                    </div>

                    <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100 text-left space-y-4 shadow-inner">
                       <div className="flex justify-between border-b border-gray-200/50 pb-4">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Individual</span>
                          <span className="font-black text-dark uppercase">{scanResult.visitor?.name || 'Authorized Guest'}</span>
                       </div>
                       <div className="flex justify-between border-b border-gray-200/50 pb-4">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Entry Time</span>
                          <span className="font-black text-dark uppercase">{formatDateTime(scanResult.entry_time || scanResult.log?.check_in_time)}</span>
                       </div>
                       <div className="flex justify-between border-b border-gray-200/50 pb-4">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Exit Time</span>
                          <span className="font-black text-dark uppercase">{formatDateTime(scanResult.exit_time || scanResult.log?.check_out_time)}</span>
                       </div>
                       <div className="flex justify-between">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Institutional Clearance</span>
                          <span className="text-[10px] font-black text-success uppercase tracking-widest bg-success/10 px-3 py-1 rounded-lg">Verified</span>
                       </div>
                    </div>
                  </div>
                  <Button onClick={resetScanner} className="w-full h-16 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-xs shadow-glow flex items-center justify-center gap-4">
                    <RefreshCw size={20} /> Next Individual
                  </Button>
                </div>
              ) : null}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default QrScanner;
