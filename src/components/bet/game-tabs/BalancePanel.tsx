import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useGame } from '@/hooks/bet/useGame';
import { motion, AnimatePresence } from 'framer-motion';
import SlotButton from '@/components/UI/SlotButton';
import Image from 'next/image';
import ArrowDownIcon from '@/assets/icons/ArrowDownIcon';
import ArrowUpIcon from '@/assets/icons/ArrowUpIcon';
import useWindowSize from '@/hooks/useWindowSize';

interface BalancePanelProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const BalancePanel: React.FC<BalancePanelProps> = ({
  onClose,
  isOpen = true,
}) => {
  const { isMobile, isLargeScreen } = useWindowSize();
  const { solBalance, depositSol, withdrawSol } = useGame();
  const [depositAmount, setDepositAmount] = useState('0.1');
  const [withdrawAmount, setWithdrawAmount] = useState('0.1');
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit');
  const [isLoading, setIsLoading] = useState(false);
  const [transactionSuccess, setTransactionSuccess] = useState(false);
  const [transactionError, setTransactionError] = useState<string | null>(null);
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);

  // Set up portal element when component mounts
  useEffect(() => {
    setPortalElement(document.body);
  }, []);

  const handleDeposit = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      setTransactionError(null);
      await depositSol(parseFloat(depositAmount));
      setTransactionSuccess(true);
      setTimeout(() => setTransactionSuccess(false), 3000);
    } catch (error) {
      setTransactionError(
        error instanceof Error ? error.message : 'Transaction failed'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      setTransactionError(null);
      await withdrawSol(parseFloat(withdrawAmount));
      setTransactionSuccess(true);
      setTimeout(() => setTransactionSuccess(false), 3000);
    } catch (error) {
      setTransactionError(
        error instanceof Error ? error.message : 'Transaction failed'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const incrementAmount = (type: 'deposit' | 'withdraw') => {
    const currentAmount = parseFloat(
      type === 'deposit' ? depositAmount : withdrawAmount
    );
    const newAmount = Math.max(0.1, currentAmount + 0.1);
    if (type === 'deposit') {
      setDepositAmount(newAmount.toFixed(1));
    } else {
      setWithdrawAmount(newAmount.toFixed(1));
    }
  };

  const decrementAmount = (type: 'deposit' | 'withdraw') => {
    const currentAmount = parseFloat(
      type === 'deposit' ? depositAmount : withdrawAmount
    );
    const newAmount = Math.max(0.1, currentAmount - 0.1);
    if (type === 'deposit') {
      setDepositAmount(newAmount.toFixed(1));
    } else {
      setWithdrawAmount(newAmount.toFixed(1));
    }
  };

  const setQuickAmount = (amount: number, type: 'deposit' | 'withdraw') => {
    if (type === 'deposit') {
      setDepositAmount(amount.toString());
    } else {
      setWithdrawAmount(amount.toString());
    }
  };

  const maxWithdrawAmount = parseFloat(solBalance?.availableBalance || '0');
  const isWithdrawDisabled = parseFloat(withdrawAmount) > maxWithdrawAmount;

  if (isMobile && !isOpen) {
    return null;
  }

  const panelContent = (
    <motion.div
      className={`w-full h-full bg-[#262626] p-4 font-pixel flex flex-col gap-4 
        ${
          isMobile
            ? 'rounded-lg shadow-xl'
            : 'border-r-[2px] border-b-[2px] border-border'
        }`}
      initial={{ opacity: 0, x: isMobile ? 20 : 0, y: isMobile ? 50 : 0 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, x: isMobile ? 20 : 0, y: isMobile ? 50 : 0 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }}
    >
      {/* Mobile Close Button */}
      {isMobile && onClose && (
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-white text-xl font-bold">Balance</h3>
          <button
            onClick={onClose}
            className="text-white p-1 rounded-full hover:bg-white/10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      )}

      {/* Balance Display */}
      <div className="bg-[#171717]/50 rounded-md p-3 backdrop-blur-sm text-white">
        <h3 className="text-xs uppercase mb-1 text-[#a0c380]">
          Available Balance
        </h3>
        <motion.div
          className="text-xl font-bold"
          animate={{
            textShadow: [
              '0px 0px 0px rgba(255,255,255,0)',
              '0px 0px 10px rgba(160,195,128,0.8)',
              '0px 0px 0px rgba(255,255,255,0)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {solBalance?.availableBalance || '0.00'} SOL
        </motion.div>
      </div>

      {/* Tab Buttons */}
      <div className="flex gap-1 bg-[#171717]/30 rounded-md p-1">
        <button
          className={`flex-1 py-2 text-xs rounded transition-all ${
            activeTab === 'deposit'
              ? 'bg-[#a0c380] text-black font-bold'
              : 'text-white hover:bg-[#333]'
          }`}
          onClick={() => setActiveTab('deposit')}
        >
          Deposit
        </button>
        <button
          className={`flex-1 py-2 text-xs rounded transition-all ${
            activeTab === 'withdraw'
              ? 'bg-[#a0c380] text-black font-bold'
              : 'text-white hover:bg-[#333]'
          }`}
          onClick={() => setActiveTab('withdraw')}
        >
          Withdraw
        </button>
      </div>

      {/* Transaction Form */}
      <div className="bg-[#171717]/30 rounded-md p-3 space-y-3">
        <h4 className="text-white text-xs uppercase">
          {activeTab === 'deposit' ? 'Deposit Amount' : 'Withdraw Amount'}
        </h4>

        {/* Custom Amount Input */}
        <div className="relative">
          {activeTab === 'withdraw' && isWithdrawDisabled && (
            <div className="absolute -top-5 left-0 text-[#FF0018] text-[10px]">
              INSUFFICIENT BALANCE
            </div>
          )}
          <input
            className="w-full bg-[#171717] text-white px-3 py-2 rounded border border-[#979797] text-xs pr-12"
            type="number"
            step="0.1"
            min="0.1"
            value={activeTab === 'deposit' ? depositAmount : withdrawAmount}
            onChange={(e) => {
              const value = e.target.value;
              if (activeTab === 'deposit') {
                setDepositAmount(value);
              } else {
                setWithdrawAmount(value);
              }
            }}
            placeholder="Enter amount"
          />
          <div className="flex flex-col absolute top-0 right-3 h-full justify-center gap-1">
            <div
              className="cursor-pointer hover:opacity-70"
              onClick={() => incrementAmount(activeTab)}
            >
              <ArrowUpIcon width={12} height={6} />
            </div>
            <div
              className="cursor-pointer hover:opacity-70"
              onClick={() => decrementAmount(activeTab)}
            >
              <ArrowDownIcon width={12} height={6} />
            </div>
          </div>
        </div>

        {/* Quick Amount Buttons */}
        <div className="grid grid-cols-4 gap-1">
          {[0.1, 0.5, 1, 2].map((amount) => (
            <button
              key={amount}
              className={`py-1 text-[10px] rounded transition-all ${
                parseFloat(
                  activeTab === 'deposit' ? depositAmount : withdrawAmount
                ) === amount
                  ? 'bg-[#a0c380] text-black'
                  : 'bg-[#333] text-white hover:bg-[#444]'
              } ${
                activeTab === 'withdraw' && amount > maxWithdrawAmount
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }`}
              onClick={() => setQuickAmount(amount, activeTab)}
              disabled={activeTab === 'withdraw' && amount > maxWithdrawAmount}
            >
              {amount}
            </button>
          ))}
        </div>

        {/* Max Button for Withdraw */}
        {activeTab === 'withdraw' && maxWithdrawAmount > 0 && (
          <button
            className="w-full py-1 text-[10px] rounded bg-[#555] text-white hover:bg-[#666] transition-all"
            onClick={() => setWithdrawAmount(maxWithdrawAmount.toString())}
          >
            MAX ({maxWithdrawAmount.toFixed(2)} SOL)
          </button>
        )}

        {/* Action Button */}
        <SlotButton
          className="w-full py-2 text-xs"
          onClick={activeTab === 'deposit' ? handleDeposit : handleWithdraw}
          disabled={
            isLoading ||
            (activeTab === 'withdraw' && isWithdrawDisabled) ||
            parseFloat(
              activeTab === 'deposit' ? depositAmount : withdrawAmount
            ) <= 0
          }
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-3 h-3 border-2 border-t-white border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              <span>Processing...</span>
            </div>
          ) : (
            `${activeTab === 'deposit' ? 'Deposit' : 'Withdraw'} ${
              activeTab === 'deposit' ? depositAmount : withdrawAmount
            } SOL`
          )}
        </SlotButton>
      </div>

      {/* Transaction Result */}
      <AnimatePresence>
        {(transactionSuccess || transactionError) && (
          <motion.div
            className={`text-[10px] p-2 rounded ${
              transactionSuccess
                ? 'bg-green-500/20 text-green-400'
                : 'bg-red-500/20 text-red-400'
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {transactionSuccess
              ? 'Transaction completed successfully!'
              : transactionError}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Section */}
      <div className="bg-[#171717]/30 rounded-md p-3 space-y-2">
        <h5 className="text-[#a0c380] text-[10px] uppercase">Session Stats</h5>
        <div className="flex justify-between text-[10px] text-white">
          <span>Total Deposited:</span>
          <span>0.00 SOL</span>
        </div>
        <div className="flex justify-between text-[10px] text-white">
          <span>Total Withdrawn:</span>
          <span>0.00 SOL</span>
        </div>
        <div className="flex justify-between text-[10px] text-white">
          <span>Net P&L:</span>
          <span className="text-[#a0c380]">+0.00 SOL</span>
        </div>
      </div>

      {/* Logo */}
      <div className="mt-auto pt-2 flex justify-center">
        <Image
          src="/images/bet/afel-logo.png"
          alt="AFEL Logo"
          width={40}
          height={40}
          className="opacity-40"
        />
      </div>
    </motion.div>
  );

  // Mobile Portal Version
  if (isMobile && portalElement && isOpen) {
    return createPortal(
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 z-50 bg-black/80 flex items-start justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose} // Close when clicking backdrop
        >
          <motion.div
            className="w-full max-w-[400px] mx-auto mt-20 p-4"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking panel
          >
            <div className="bg-black/20 rounded-lg p-1">{panelContent}</div>
          </motion.div>
        </motion.div>
      </AnimatePresence>,
      portalElement
    );
  }

  // Desktop Version
  return panelContent;
};

export default BalancePanel;
