import React from 'react';
import { generateQRCodeSVG } from '../../services/qrCodeService';
import { X, Copy, Check, QrCode } from 'lucide-react';
import toast from 'react-hot-toast';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomId: string;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose, roomId }) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const roomUrl = `${window.location.origin}/room/${roomId}`;
  const qrSvg = generateQRCodeSVG(roomUrl, 200, '#ffffff', '#090d16');

  const handleCopy = () => {
    navigator.clipboard.writeText(roomUrl);
    setCopied(true);
    toast.success('Room link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl p-6 w-full max-w-sm backdrop-blur-2xl text-center">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-5">
          <div className="flex items-center gap-2">
            <QrCode size={18} className="text-indigo-400" />
            <h3 className="text-sm font-bold text-white">Scan to Join Room</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div
          className="flex justify-center my-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80"
          dangerouslySetInnerHTML={{ __html: qrSvg }}
        />

        <p className="text-xs text-slate-400 mb-4">
          Scan with your mobile camera or tablet to test multi-device cursor sync instantly.
        </p>

        <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs text-slate-300 font-mono mb-4">
          <span className="truncate flex-1 text-left px-1">{roomUrl}</span>
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shrink-0 cursor-pointer"
            title="Copy URL"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors cursor-pointer"
        >
          Done
        </button>
      </div>
    </div>
  );
};
