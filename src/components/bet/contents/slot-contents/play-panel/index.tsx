import React from "react";
import DisplayValue from "./credit-and-payout-display/DisplayValue";
import SlotButton from "@/components/UI/SlotButton";
import BetChoosePanel from "./bet-choose/BetChoosePanel";
import BetInput from "./bet-input/BetInput";
import StartButton from "./start-button/StartButton";
import { useSlotMachine } from "@/contexts/SlotMachineContext";
import { useGame } from "@/hooks/bet/useGame";

const PlayPanel = () => {
  const { winResult, isSpinning } = useSlotMachine();

  // Show animated payout when there's a win
  const showWinAnimation = winResult?.isWin && !isSpinning;

  const { solBalance, depositSol, withdrawSol } = useGame("slotmachine");

  return (
    <div className="p-5 bg-[#22560F] w-1/3">
      <div className="py-6 px-4 slot-gradient-to-bottom border-[2.5px] border-black rounded-[19.31px] flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <DisplayValue
            heading="Credit"
            value={solBalance?.availableBalance || "0.00"}
          />
        </div>
        <SlotButton
          className="w-full"
          disabled={isSpinning}
          onClick={() => withdrawSol(0.1)}
        >
          Cashout
        </SlotButton>
        <SlotButton
          className="w-full"
          disabled={isSpinning}
          onClick={() => depositSol(0.5)}
        >
          DEPOSIT
        </SlotButton>
        <div className="bg-[#D2D2D2] h-[1px]"></div>
        <BetChoosePanel />
        <BetInput />
        <StartButton />
      </div>
    </div>
  );
};

export default PlayPanel;
