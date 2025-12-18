// components/shared/PaymentMethodModal.tsx
'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Wallet, CreditCard, AlertCircle } from 'lucide-react';
import { useState } from 'react';

interface PaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (method: 'Cash' | 'Wallet') => void;
  fare: number;
  walletBalance: number; 
}

export function PaymentMethodModal({
  isOpen,
  onClose,
  onConfirm,
  fare,
  walletBalance,
}: PaymentMethodModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<'Cash' | 'Wallet'>('Cash');

  const handleSelect = () => {
    if (selectedMethod === 'Wallet' && walletBalance < fare) {
      // Don't close — let parent handle showing insufficient modal
      return;
    }
    onConfirm(selectedMethod);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md fixed bottom-4 left-1/2 translate-x-[-50%] translate-y-0 top-auto sm:bottom-8 rounded-t-2xl rounded-b-2xl p-6 data-[state=open]:slide-in-from-bottom-10 data-[state=closed]:slide-out-to-bottom-10">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">Select Payment Method</DialogTitle>
          <DialogDescription className="text-center">
            Choose how you’d like to pay for this ride.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          {/* Cash Option */}
          <Button
            variant={selectedMethod === 'Cash' ? "studentOutline" : 'outline'}
            className={`w-full justify-start gap-3 p-8 ${selectedMethod === 'Cash' ? 'bg-student-primary/20' : ''}`}
            onClick={() => setSelectedMethod('Cash')}
          >
            <CreditCard className="w-5 h-5" />
            <div className="flex-1 text-left">
              <div>Cash</div>
              <div className="text-sm text-gray-500">Pay driver directly</div>
            </div>
            <div className="font-semibold">₦{fare.toLocaleString()}</div>
          </Button>

          {/* Wallet Option */}
          <Button
            variant={selectedMethod === 'Wallet' ? "studentOutline" : 'outline'}
            className={`w-full justify-start gap-3 p-8 ${selectedMethod === 'Wallet' ? 'bg-student-primary/20' : ''}`}
            onClick={() => setSelectedMethod('Wallet')}
          >
            <Wallet className="w-5 h-5" />
            <div className="flex-1 text-left">
              <div>Wallet</div>
              <div className="text-sm text-gray-500">Balance: ₦{walletBalance.toLocaleString()}</div>
            </div>
            <div className={`font-semibold ${walletBalance < fare ? 'text-red-600' : ''}`}>
              ₦{fare.toLocaleString()}
            </div>
          </Button>

          {/* Show warning if wallet is insufficient */}
          {selectedMethod === 'Wallet' && walletBalance < fare && (
            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div className="text-sm text-red-700">
                Insufficient balance. You need ₦{Math.ceil(fare - walletBalance).toLocaleString()} more.
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button onClick={onClose} variant="ghost" className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handleSelect}
            disabled={selectedMethod === 'Wallet' && walletBalance < fare}
            className="flex-1 bg-student-primary hover:bg-student-hover text-white"
          >
            Select Payment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}