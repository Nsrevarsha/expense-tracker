import Link from "next/link";
import React from "react";

function IncomeItem({ income, refreshData }) {
  return (
    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{income.icon}</span>
          <div>
            <h3 className="font-semibold text-white">{income.name}</h3>
            <p className="text-sm text-gray-400">{income.category}</p>
          </div>
        </div>
        <EditIncome incomeInfo={income} refreshData={refreshData} />
      </div>

      <div className="flex justify-between mt-4">
        <span className="text-gray-400">Amount</span>
        <span className="font-medium text-white">
          ${parseFloat(income.amount).toLocaleString()}
        </span>
      </div>
    </div>
  );
}

export default IncomeItem;
