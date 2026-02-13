
import React, { useRef, useState } from 'react';
import { X, Download, Share2, Check } from 'lucide-react';

interface QRCodeModalProps {
  shopId: string;
  shopName: string;
  onClose: () => void;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({ shopId, shopName, onClose }) => {
  const [copied, setCopied] = useState(false);
  const qrUrl = `shopakart://shop/${shopId}`;
  
  // Using a visual placeholder as real canvas requires library
  // In a real app we'd use 'qrcode.react'
  
  const handleCopy = () => {
    navigator.clipboard.writeText(qrUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="p-4 flex justify-between items-center border-b">
          <h3 className="font-bold text-slate-800">Shop QR Code</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100"><X size={20}/></button>
        </div>
        
        <div className="p-8 flex flex-col items-center">
          <div className="bg-emerald-50 p-6 rounded-2xl mb-6">
             {/* Mock QR Representation */}
            <div className="w-48 h-48 bg-white border-8 border-white shadow-sm flex items-center justify-center relative">
               <div className="grid grid-cols-6 grid-rows-6 gap-1 w-full h-full opacity-80">
                  {Array.from({ length: 36 }).map((_, i) => (
                    <div key={i} className={`rounded-sm ${Math.random() > 0.4 ? 'bg-slate-800' : 'bg-transparent'}`} />
                  ))}
               </div>
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white p-2 rounded-lg shadow-md">
                     <div className="w-8 h-8 bg-emerald-600 rounded flex items-center justify-center text-white font-bold text-xs">SK</div>
                  </div>
               </div>
            </div>
          </div>
          
          <p className="text-center font-semibold text-slate-900 mb-1">{shopName}</p>
          <p className="text-center text-xs text-slate-500 mb-6 font-mono break-all px-4">{qrUrl}</p>
          
          <div className="grid grid-cols-2 gap-3 w-full">
            <button 
              onClick={handleCopy}
              className="flex items-center justify-center gap-2 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-colors"
            >
              {copied ? <Check size={18} className="text-emerald-600" /> : <Share2 size={18} />}
              {copied ? 'Copied' : 'Share Link'}
            </button>
            <button 
              className="flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-emerald-200"
            >
              <Download size={18} />
              Save PNG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeModal;
