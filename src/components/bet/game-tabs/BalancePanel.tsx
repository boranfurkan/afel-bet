import React, { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { useGame } from "@/hooks/bet/useGame";
import { motion, AnimatePresence } from "framer-motion";
import SlotButton from "@/components/UI/SlotButton";
import Image from "next/image";
import ArrowDownIcon from "@/assets/icons/ArrowDownIcon";
import ArrowUpIcon from "@/assets/icons/ArrowUpIcon";
import useWindowSize from "@/hooks/useWindowSize";
import { Gift, TrendingUp, TrendingDown, Users } from "lucide-react";
import { useReferral } from "@/hooks/bet/useReferral";
import {
  showErrorToast,
  showSuccessToast,
  showLoadingToast,
} from "@/utils/toast";
import { toast } from "sonner";
import { useSlotMachine } from "@/contexts/SlotMachineContext";

interface BalancePanelProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const BalancePanel: React.FC<BalancePanelProps> = ({
  onClose,
  isOpen = true,
}) => {
  const { isMobile, isTablet, isLargeScreen } = useWindowSize();
  const { solBalance, depositSol, withdrawSol } = useGame();
  const { isSpinning, spinCompleted } = useSlotMachine();

  // Update the default deposit amount
  const [depositAmount, setDepositAmount] = useState("0.01");

  // Update the default withdraw amount
  const [withdrawAmount, setWithdrawAmount] = useState("0.05");

  const [activeTab, setActiveTab] = useState<"deposit" | "withdraw">("deposit");
  const [isLoading, setIsLoading] = useState(false);
  const [transactionSuccess, setTransactionSuccess] = useState(false);
  const [transactionError, setTransactionError] = useState<string | null>(null);
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);
  const [referralCode, setReferralCode] = useState("");

  // Add display balance state similar to PlayPanel
  const [displayBalance, setDisplayBalance] = useState("0.00");

  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const {
    referralCode: userReferralCode,
    applyReferralCode,
    referralStats,
    refreshReferralStats,
  } = useReferral();
  const referralLink = `${window.location.origin}?ref=${userReferralCode?.referralCode}`;

  const copyToClipboard = async (text: string, type: "code" | "link") => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "code") {
        setCopiedCode(true);
        showSuccessToast("Copied!", "Referral code copied to clipboard");
        setTimeout(() => setCopiedCode(false), 2000);
      } else {
        setCopiedLink(true);
        showSuccessToast("Copied!", "Referral link copied to clipboard");
        setTimeout(() => setCopiedLink(false), 2000);
      }
    } catch (err) {
      console.error("Failed to copy: ", err);
      showErrorToast("Failed to copy", "Could not copy to clipboard");
    }
  };

  const isSmallScreen = isMobile || isTablet;

  // Updated quick amount options with new values
  const depositQuickAmounts = [0.01, 0.025, 0.05, 0.1, 0.5, 1];
  const withdrawQuickAmounts = [0.05, 0.1, 0.25, 0.5, 1, 2];

  // Set up portal element when component mounts
  useEffect(() => {
    setPortalElement(document.body);
  }, []);

  // Auto-fill and auto-apply referral code from pending storage
  useEffect(() => {
    const pendingRefCode = localStorage.getItem('pendingReferralCode');
    if (pendingRefCode && !referralStats?.usedReferralCode) {
      setReferralCode(pendingRefCode);
      // Don't clear the pending code here - let auto-apply handle it
      
      // Show notification that referral code was auto-filled
      showSuccessToast(
        "Referral Code Ready",
        `Referral code ${pendingRefCode} will be automatically applied!`
      );
    }
  }, [referralStats?.usedReferralCode]);

  // Auto-apply referral code when user is authenticated
  useEffect(() => {
    const pendingRefCode = localStorage.getItem('pendingReferralCode');
    if (
      pendingRefCode && 
      referralStats && 
      !referralStats.usedReferralCode &&
      referralCode === pendingRefCode
    ) {
      // Show loading notification
      const toastId = showLoadingToast(
        "Auto-Applying Referral Code",
        `Applying referral code ${pendingRefCode}...`
      );

      // Auto-apply the referral code
      applyReferralCode(pendingRefCode.trim())
        .then(() => {
          showSuccessToast(
            "Referral Code Applied",
            `Referral code ${pendingRefCode} has been automatically applied!`
          );
          refreshReferralStats();
          setReferralCode("");
          // Clear from localStorage after successful application
          localStorage.removeItem('pendingReferralCode');
        })
        .catch((error) => {
          showErrorToast(
            "Auto-Apply Failed",
            error instanceof Error ? error.message : "Failed to apply referral code automatically"
          );
          console.error("Auto-apply referral code failed:", error);
        })
        .finally(() => {
          toast.dismiss(toastId);
        });
    }
  }, [referralStats, referralCode, applyReferralCode, refreshReferralStats]);

  // Update the display balance when solBalance changes, but only when not spinning and after transaction completes
  useEffect(() => {
    if (
      !isLoading &&
      solBalance?.availableBalance &&
      !isSpinning &&
      spinCompleted
    ) {
      // Only update display balance when not in loading state (after transaction completes)
      // And not during slot spinning
      setDisplayBalance(solBalance.availableBalance);
    }
  }, [solBalance?.availableBalance, isLoading, isSpinning, spinCompleted]);

  const handleDeposit = async () => {
    if (isLoading) return;

    const toastId = showLoadingToast(
      "Processing Deposit",
      "Please wait while we process your deposit..."
    );

    try {
      setIsLoading(true);
      setTransactionError(null);
      await depositSol(parseFloat(depositAmount));
      setTransactionSuccess(true);
      setTimeout(() => setTransactionSuccess(false), 3000);
      showSuccessToast(
        "Deposit Successful",
        `Successfully deposited ${depositAmount} SOL`
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Transaction failed";
      setTransactionError(errorMessage);
      showErrorToast("Deposit Failed", errorMessage);
    } finally {
      setIsLoading(false);
      toast.dismiss(toastId);
    }
  };

  const handleWithdraw = async () => {
    if (isLoading) return;

    // Validate minimum withdraw amount
    if (parseFloat(withdrawAmount) < 0.05) {
      showErrorToast(
        "Withdraw Failed",
        "Minimum withdrawal amount is 0.05 SOL"
      );
      return;
    }

    const toastId = showLoadingToast(
      "Processing Withdrawal",
      "Please wait while we process your withdrawal..."
    );

    try {
      setIsLoading(true);
      setTransactionError(null);
      await withdrawSol(parseFloat(withdrawAmount));
      setTransactionSuccess(true);
      setTimeout(() => setTransactionSuccess(false), 3000);
      showSuccessToast(
        "Withdrawal Successful",
        `Successfully withdrawn ${withdrawAmount} SOL`
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Transaction failed";
      setTransactionError(errorMessage);
      showErrorToast("Withdrawal Failed", errorMessage);
    } finally {
      setIsLoading(false);
      toast.dismiss(toastId);
    }
  };

  const incrementAmount = (type: "deposit" | "withdraw") => {
    const currentAmount = parseFloat(
      type === "deposit" ? depositAmount : withdrawAmount
    );
    const newAmount = Math.max(
      type === "deposit" ? 0.01 : 0.05,
      currentAmount + 0.01
    );
    if (type === "deposit") {
      setDepositAmount(newAmount.toFixed(2));
    } else {
      setWithdrawAmount(newAmount.toFixed(2));
    }
  };

  const decrementAmount = (type: "deposit" | "withdraw") => {
    const currentAmount = parseFloat(
      type === "deposit" ? depositAmount : withdrawAmount
    );
    const minAmount = type === "deposit" ? 0.01 : 0.05;
    const newAmount = Math.max(minAmount, currentAmount - 0.01);
    if (type === "deposit") {
      setDepositAmount(newAmount.toFixed(2));
    } else {
      setWithdrawAmount(newAmount.toFixed(2));
    }
  };

  const setQuickAmount = (amount: number, type: "deposit" | "withdraw") => {
    if (type === "deposit") {
      setDepositAmount(amount.toString());
    } else {
      setWithdrawAmount(amount.toString());
    }
  };

  const maxWithdrawAmount = parseFloat(displayBalance || "0");
  const isWithdrawDisabled =
    parseFloat(withdrawAmount) > maxWithdrawAmount ||
    parseFloat(withdrawAmount) < 0.05;
  const isDepositDisabled = parseFloat(depositAmount) < 0.01;

  if (isMobile && !isOpen) {
    return null;
  }

  const panelContent = (
    <motion.div
      className={`w-full h-full bg-[#262626] font-pixel flex flex-col gap-2 sm:gap-3 md:gap-4 
        ${
          isMobile
            ? "rounded-lg shadow-xl p-3 sm:p-4"
            : "border-r-[2px] border-b-[2px] border-border p-2 sm:p-3 md:p-4"
        }`}
      initial={{ opacity: 0, x: isMobile ? 20 : 0, y: isMobile ? 50 : 0 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, x: isMobile ? 20 : 0, y: isMobile ? 50 : 0 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
    >
      {/* Mobile Close Button */}
      {isMobile && onClose && (
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-white text-lg sm:text-xl font-bold">Balance</h3>
          <button
            onClick={onClose}
            className="text-white p-1 rounded-full hover:bg-white/10 touch-manipulation"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
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

      {/* Balance Display - Updated to use displayBalance */}
      <div className="bg-[#171717]/50 rounded-md p-2 sm:p-3 backdrop-blur-sm text-white">
        <h3 className="text-xs sm:text-sm uppercase mb-1 text-[#a0c380] leading-tight">
          Available Balance
        </h3>
        <motion.div
          className="text-lg sm:text-xl md:text-2xl font-bold"
          animate={{
            textShadow: [
              "0px 0px 0px rgba(255,255,255,0)",
              "0px 0px 10px rgba(160,195,128,0.8)",
              "0px 0px 0px rgba(255,255,255,0)",
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {parseFloat(displayBalance).toLocaleString(undefined, {
            maximumFractionDigits: 3,
            minimumFractionDigits: 0,
          })}{" "}
          SOL
        </motion.div>
      </div>

      {/* Tab Buttons */}
      <div className="flex gap-1 bg-[#171717]/30 rounded-md p-1">
        <button
          className={`flex-1 py-2 text-xs sm:text-sm rounded transition-all flex items-center justify-center gap-1 touch-manipulation ${
            activeTab === "deposit"
              ? "bg-[#a0c380] text-black font-bold"
              : "text-white hover:bg-[#333]"
          }`}
          onClick={() => setActiveTab("deposit")}
        >
          <TrendingUp size={isSmallScreen ? 12 : 14} />
          <span>Deposit</span>
        </button>
        <button
          className={`flex-1 py-2 text-xs sm:text-sm rounded transition-all flex items-center justify-center gap-1 touch-manipulation ${
            activeTab === "withdraw"
              ? "bg-[#a0c380] text-black font-bold"
              : "text-white hover:bg-[#333]"
          }`}
          onClick={() => setActiveTab("withdraw")}
        >
          <TrendingDown size={isSmallScreen ? 12 : 14} />
          <span>Withdraw</span>
        </button>
      </div>

      {/* Transaction Form */}
      <div className="bg-[#171717]/30 rounded-md p-2 sm:p-3 space-y-2 sm:space-y-3">
        <h4 className="text-white text-xs sm:text-sm uppercase leading-tight">
          {activeTab === "deposit" ? "Deposit Amount" : "Withdraw Amount"}
        </h4>

        {/* Custom Amount Input */}
        <div className="relative">
          {activeTab === "withdraw" && isWithdrawDisabled && (
            <div className="absolute -top-4 sm:-top-5 left-0 text-[#FF0018] text-[9px] sm:text-[10px]">
              {parseFloat(withdrawAmount) < 0.05
                ? "MINIMUM AMOUNT: 0.05 SOL"
                : "INSUFFICIENT BALANCE"}
            </div>
          )}
          {activeTab === "deposit" && isDepositDisabled && (
            <div className="absolute -top-4 sm:-top-5 left-0 text-[#FF0018] text-[9px] sm:text-[10px]">
              MINIMUM AMOUNT: 0.01 SOL
            </div>
          )}
          <input
            className="w-full bg-[#171717] text-white px-3 py-2 rounded border border-[#979797] text-xs sm:text-sm pr-10 sm:pr-12 touch-manipulation"
            type="number"
            step="0.01"
            min={activeTab === "deposit" ? "0.01" : "0.05"}
            value={activeTab === "deposit" ? depositAmount : withdrawAmount}
            onChange={(e) => {
              const value = e.target.value;
              if (activeTab === "deposit") {
                setDepositAmount(value);
              } else {
                setWithdrawAmount(value);
              }
            }}
            placeholder="Enter amount"
          />
          <div className="flex flex-col absolute top-0 right-2 sm:right-3 h-full justify-center gap-1">
            <div
              className="cursor-pointer hover:opacity-70 touch-manipulation p-1"
              onClick={() => incrementAmount(activeTab)}
            >
              <ArrowUpIcon
                width={isSmallScreen ? 10 : 12}
                height={isSmallScreen ? 5 : 6}
              />
            </div>
            <div
              className="cursor-pointer hover:opacity-70 touch-manipulation p-1"
              onClick={() => decrementAmount(activeTab)}
            >
              <ArrowDownIcon
                width={isSmallScreen ? 10 : 12}
                height={isSmallScreen ? 5 : 6}
              />
            </div>
          </div>
        </div>

        {/* Enhanced Quick Amount Buttons */}
        <div className="space-y-2">
          <div className="text-[#a0c380] text-[9px] sm:text-[10px] uppercase leading-tight">
            Quick Amounts
          </div>
          <div
            className={`grid gap-1 ${
              isSmallScreen ? "grid-cols-3" : "grid-cols-3"
            }`}
          >
            {(activeTab === "deposit"
              ? depositQuickAmounts
              : withdrawQuickAmounts
            ).map((amount) => (
              <button
                key={amount}
                className={`py-1 sm:py-1.5 text-[8px] sm:text-[9px] md:text-[10px] rounded transition-all touch-manipulation ${
                  parseFloat(
                    activeTab === "deposit" ? depositAmount : withdrawAmount
                  ) === amount
                    ? "bg-[#a0c380] text-black font-bold"
                    : "bg-[#333] text-white hover:bg-[#444]"
                } ${
                  activeTab === "withdraw" && amount > maxWithdrawAmount
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                onClick={() => setQuickAmount(amount, activeTab)}
                disabled={
                  activeTab === "withdraw" && amount > maxWithdrawAmount
                }
              >
                {amount < 1 ? amount.toFixed(2) : amount}
              </button>
            ))}
          </div>
        </div>

        {/* Max Button for Withdraw */}
        {activeTab === "withdraw" && maxWithdrawAmount > 0 && (
          <button
            className="w-full py-1 sm:py-1.5 text-[9px] sm:text-[10px] rounded bg-[#555] text-white hover:bg-[#666] transition-all touch-manipulation"
            onClick={() => setWithdrawAmount(maxWithdrawAmount.toString())}
          >
            MAX ({maxWithdrawAmount.toFixed(2)} SOL)
          </button>
        )}

        {/* Action Button */}
        <SlotButton
          className="w-full py-2 sm:py-2.5 text-xs sm:text-sm touch-manipulation"
          onClick={activeTab === "deposit" ? handleDeposit : handleWithdraw}
          disabled={
            isLoading ||
            (activeTab === "withdraw" && isWithdrawDisabled) ||
            (activeTab === "deposit" && isDepositDisabled)
          }
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-3 h-3 border-2 border-t-white border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              <span>Processing...</span>
            </div>
          ) : (
            `${activeTab === "deposit" ? "Deposit" : "Withdraw"} ${
              activeTab === "deposit" ? depositAmount : withdrawAmount
            } SOL`
          )}
        </SlotButton>
      </div>

      {/* Transaction Result */}
      <AnimatePresence>
        {(transactionSuccess || transactionError) && (
          <motion.div
            className={`text-[9px] sm:text-[10px] p-2 rounded ${
              transactionSuccess
                ? "bg-green-500/20 text-green-400"
                : "bg-red-500/20 text-red-400"
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {transactionSuccess
              ? "Transaction completed successfully!"
              : transactionError}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Referral Code Section */}
      <div className="bg-[#171717]/30 rounded-md p-2 sm:p-3 space-y-2">
        <div className="flex items-center gap-1 sm:gap-2">
          <Users size={isSmallScreen ? 16 : 18} className="text-[#a0c380]" />
          <h5 className="text-[#a0c380] text-xs sm:text-sm uppercase font-semibold">
            Referral Code
          </h5>
        </div>
        <div className="space-y-2">
          <input
            className="w-full bg-[#171717] text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded border border-[#979797] text-sm sm:text-base placeholder-white/50 touch-manipulation disabled:opacity-30"
            type="text"
            placeholder={
              referralStats?.usedReferralCode
                ? referralStats.usedReferralCode
                : "Enter referral code"
            }
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value)}
            disabled={!!referralStats?.usedReferralCode}
          />
          <button
            className="w-full py-1 sm:py-1.5 text-xs sm:text-sm rounded bg-[#a0c380] text-black hover:bg-[#8db170] transition-all disabled:opacity-50 font-semibold touch-manipulation"
            disabled={!referralCode.trim()}
            onClick={() => {
              const toastId = showLoadingToast(
                "Applying Referral Code",
                "Please wait..."
              );
              try {
                applyReferralCode(referralCode.trim());
                showSuccessToast(
                  "Referral Code Applied",
                  "Your referral code has been successfully applied"
                );
                refreshReferralStats();
                setReferralCode("");
              } catch (error) {
                showErrorToast(
                  "Failed to Apply Code",
                  error instanceof Error ? error.message : "Unknown error"
                );
              } finally {
                toast.dismiss(toastId);
              }
            }}
          >
            {referralStats?.usedReferralCode
              ? "Referral Code Applied"
              : "Apply Referral Code"}
          </button>
        </div>
        <div className="text-xs sm:text-sm text-white/60 leading-relaxed">
          Get bonuses by using a friend&apos;s referral code
        </div>
      </div>

      {/* Share Referral Section - Replace Stats Section */}
      <div className="bg-[#171717]/30 rounded-md p-2 sm:p-3 space-y-2">
        <div className="flex items-center gap-1 sm:gap-2">
          <Gift size={isSmallScreen ? 16 : 18} className="text-[#a0c380]" />
          <h5 className="text-[#a0c380] text-xs sm:text-sm uppercase font-semibold">
            Share & Earn
          </h5>
        </div>

        <div className="space-y-2">
          {/* Your Referral Code */}
          <div className="space-y-1">
            <div className="text-[9px] sm:text-[10px] text-white/60 uppercase">
              Your Referral Code
            </div>
            <div className="flex gap-1 sm:gap-2">
              <div className="flex-1 bg-[#171717] text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded border border-[#979797] text-xs sm:text-sm font-mono">
                {userReferralCode?.referralCode}
              </div>
              <button
                className={`px-2 sm:px-3 py-1.5 sm:py-2 text-[9px] sm:text-[10px] rounded transition-all font-semibold touch-manipulation ${
                  copiedCode
                    ? "bg-green-500 text-white"
                    : "bg-[#a0c380] text-black hover:bg-[#8db170]"
                }`}
                onClick={() =>
                  copyToClipboard(userReferralCode?.referralCode || "", "code")
                }
              >
                {copiedCode ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          {/* Your Referral Link */}
          <div className="space-y-1">
            <div className="text-[9px] sm:text-[10px] text-white/60 uppercase">
              Your Referral Link
            </div>
            <div className="flex gap-1 sm:gap-2">
              <div className="flex-1 bg-[#171717] text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded border border-[#979797] text-xs sm:text-sm overflow-hidden">
                <div className="truncate font-mono text-[10px] sm:text-xs">
                  {referralLink}
                </div>
              </div>
              <button
                className={`px-2 sm:px-3 py-1.5 sm:py-2 text-[9px] sm:text-[10px] rounded transition-all font-semibold touch-manipulation ${
                  copiedLink
                    ? "bg-green-500 text-white"
                    : "bg-[#a0c380] text-black hover:bg-[#8db170]"
                }`}
                onClick={() => copyToClipboard(referralLink, "link")}
              >
                {copiedLink ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        </div>

        <div className="text-xs sm:text-sm text-white/60 leading-relaxed">
          Share your code and earn bonuses when friends join!
        </div>
      </div>

      {/* Logo */}
      <div className="mt-auto pt-2 flex justify-center">
        <Image
          src="/images/bet/afel-logo.png"
          alt="AFEL Logo"
          width={isSmallScreen ? 32 : 40}
          height={isSmallScreen ? 32 : 40}
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
          className="fixed inset-0 z-50 bg-black/80 flex items-start justify-center overflow-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose} // Close when clicking backdrop
        >
          <motion.div
            className="w-full max-w-[400px] mx-auto mt-10 sm:mt-20 p-3 sm:p-4 pb-10"
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
