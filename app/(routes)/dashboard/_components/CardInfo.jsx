import formatNumber from "@/utils";
import React, { useEffect, useState } from "react";
import {
  PiggyBank,
  ReceiptText,
  CircleDollarSign,
  Sparkles,
} from "lucide-react";

function CardInfo({ budgetList, incomeList }) {
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalSpend, setTotalSpend] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);

  useEffect(() => {
    if (budgetList.length > 0 || incomeList.length > 0) {
      CalculateCardInfo();
    }
  }, [budgetList, incomeList]);

  const CalculateCardInfo = () => {
    let totalBudget_ = 0;
    let totalSpend_ = 0;
    let totalIncome_ = 0;

    budgetList.forEach((element) => {
      totalBudget_ += Number(element.amount);
      totalSpend_ += element.totalSpend;
    });

    incomeList.forEach((element) => {
      totalIncome_ += element.totalAmount;
    });

    setTotalIncome(totalIncome_);
    setTotalBudget(totalBudget_);
    setTotalSpend(totalSpend_);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-blue-200">Total Budget</p>
            <p className="text-xl font-semibold text-white">
              ${formatNumber(totalBudget)}
            </p>
          </div>
          <PiggyBank className="h-8 w-8 text-blue-300" />
        </div>
      </div>

      <div className="bg-gray-800  rounded-lg p-4 border border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-blue-200">Total Spend</p>
            <p className="text-xl font-semibold text-white">
              ${formatNumber(totalSpend)}
            </p>
          </div>
          <ReceiptText className="h-8 w-8 text-blue-300" />
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-blue-200">Total Income</p>
            <p className="text-xl font-semibold text-white">
              ${formatNumber(totalIncome)}
            </p>
          </div>
          <CircleDollarSign className="h-8 w-8 text-blue-300" />
        </div>
      </div>
    </div>
  );
}

export default CardInfo;
