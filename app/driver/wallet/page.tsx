'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/stores/authStore';
import { walletApi } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Wallet, ArrowUpRight, ArrowDownLeft, History, Building, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function DriverWalletPage() {
  
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Withdrawal State
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [bankDetails, setBankDetails] = useState({
      bankName: '',
      accountNumber: '',
      accountName: ''
  });

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      const balanceRes = await walletApi.getWalletBalance('driver');
      if (balanceRes.success && balanceRes.data) {
        setBalance(balanceRes.data.balance);
      }

      const historyRes = await walletApi.getTransactionHistory('driver');
      if (historyRes.success && historyRes.data) {
        setTransactions(historyRes.data.transactions);
      }
    } catch (error) {
      console.error('Error fetching wallet data', error);
      toast.error('Failed to load wallet info');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!amount || isNaN(Number(amount))) return;
    const withdrawAmount = Number(amount);
    
    if (withdrawAmount > balance) {
        toast.error("Insufficient funds");
        return;
    }

    setIsWithdrawing(true);
    try {
      const res = await walletApi.withdrawFromWallet({
          amount: withdrawAmount,
          bankDetails // This is just passed to backend for record
      });

      if (res.success) {
        toast.success(`Withdrawal of ₦${withdrawAmount} successful`);
        setBalance(res.balance);
        setTransactions([res.transaction, ...transactions]);
        setShowWithdrawModal(false);
        setAmount('');
      } else {
         toast.error(res.message || "Withdrawal failed");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
        setIsWithdrawing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-rider-primary p-6 pb-12 text-white">
        <h1 className="text-2xl font-bold font-jakarta">My Wallet</h1>
        <p className="text-rider-bg/80 text-sm">Track your earnings and withdrawals</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-8 space-y-6">
        {/* Balance Card */}
        <Card className="shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 mb-1">Available Balance</p>
                <h2 className="text-3xl font-bold font-jakarta text-rider-primary">
                  ₦{balance.toLocaleString()}
                </h2>
              </div>
              <div className="w-10 h-10 bg-rider-primary/10 rounded-full flex items-center justify-center">
                <Wallet className="w-5 h-5 text-rider-primary" />
              </div>
            </div>

            <Button 
                onClick={() => setShowWithdrawModal(true)}
                className="w-full mt-6 bg-rider-primary hover:bg-rider-hover text-white h-12 text-base font-medium"
            >
                <ArrowUpRight className="w-4 h-4 mr-2" />
                Withdraw Funds
            </Button>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <div>
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <History className="w-5 h-5 text-gray-400" />
            Recent Transactions
          </h3>

          <div className="space-y-3">
             {isLoading ? (
                 <div className="text-center py-8 text-gray-500">Loading transactions...</div>
             ) : transactions.length > 0 ? (
                 transactions.map((tx) => (
                    <Card key={tx._id || tx.id} className="border-0 shadow-sm">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                    tx.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                }`}>
                                    {tx.type === 'credit' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 capitalize">{tx.description || tx.type}</p>
                                    <p className="text-xs text-gray-500">{new Date(tx.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <span className={`font-bold ${
                                tx.type === 'credit' ? 'text-green-600' : 'text-red-600'
                            }`}>
                                {tx.type === 'credit' ? '+' : '-'}₦{tx.amount.toLocaleString()}
                            </span>
                        </CardContent>
                    </Card>
                 ))
             ) : (
                 <div className="text-center py-10 bg-white rounded-lg border-2 border-dashed border-gray-200">
                     <History className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                     <p className="text-gray-500">No transactions yet</p>
                 </div>
             )}
          </div>
        </div>
      </div>

      {/* Withdraw Modal */}
      <Dialog open={showWithdrawModal} onOpenChange={setShowWithdrawModal}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Withdraw Funds</DialogTitle>
                <DialogDescription>Withdraw your earnings to your bank account</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Amount to Withdraw (₦)</label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₦</span>
                        <Input 
                            type="number"
                            placeholder="e.g. 5000"
                            className="pl-8"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>
                    {/* Just visual inputs for bank details */}
                    <div className="grid grid-cols-1 gap-2 mt-2">
                        <Input placeholder="Bank Name" value={bankDetails.bankName} onChange={e => setBankDetails({...bankDetails, bankName: e.target.value})} />
                        <Input placeholder="Account Number" value={bankDetails.accountNumber} onChange={e => setBankDetails({...bankDetails, accountNumber: e.target.value})} />
                        <Input placeholder="Account Name" value={bankDetails.accountName} onChange={e => setBankDetails({...bankDetails, accountName: e.target.value})} />
                    </div>
                </div>

                <Button 
                    onClick={handleWithdraw}
                    disabled={!amount || isWithdrawing}
                    className="w-full bg-rider-primary hover:bg-rider-hover text-white"
                >
                    {isWithdrawing ? <Loader2 className="animate-spin mr-2" /> : <Building className="mr-2 w-4 h-4" />}
                    {isWithdrawing ? 'Processing...' : 'Withdraw Now'}
                </Button>
            </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
