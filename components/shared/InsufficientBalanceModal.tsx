//components/shared/InsufficientBalanceModal.tsx
'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Wallet, CreditCard, AlertCircle } from 'lucide-react';

interface InsufficientBalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBalance: number;
  requiredAmount: number;
  onFundWallet: () => void;
}

export function InsufficientBalanceModal({
  isOpen,
  onClose,
  currentBalance,
  requiredAmount,
  onFundWallet,
}: InsufficientBalanceModalProps) {
  const shortage = requiredAmount - currentBalance;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md fixed bottom-4 left-1/2 translate-x-[-50%] translate-y-0 top-auto sm:bottom-8 rounded-t-2xl rounded-b-2xl p-6 data-[state=open]:slide-in-from-bottom-10 data-[state=closed]:slide-out-to-bottom-10">
        <DialogHeader>
          <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <DialogTitle className="text-center text-xl">Insufficient Balance</DialogTitle>
          <DialogDescription className="text-center">
            You don't have enough funds in your wallet for this ride.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Required Amount</span>
              <span className="font-semibold">₦{requiredAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Wallet Balance</span>
              <span className="font-semibold text-red-600">₦{currentBalance.toLocaleString()}</span>
            </div>
            <div className="border-t pt-2 mt-2 flex justify-between font-medium">
              <span>Shortage</span>
              <span className="text-gray-900">₦{shortage.toLocaleString()}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Button
              onClick={onFundWallet}
              className="w-full bg-student-primary hover:bg-student-hover text-white flex items-center gap-2"
            >
              <Wallet className="w-4 h-4" />
              Fund Wallet
            </Button>
            <Button onClick={onClose} variant="ghost" className="w-full">
              Continue with cash
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
