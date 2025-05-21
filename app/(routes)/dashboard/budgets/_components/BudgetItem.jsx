"use client";
import React, { useEffect, useState } from "react";
import { db } from "@/utils/dbConfig";
import { Expenses } from "@/utils/schema";
import { eq } from "drizzle-orm";
import EditBudget from "./EditBudget";
import Link from "next/link";

function BudgetItem({ budget, refreshData }) {
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    getExpensesByCategory();
  }, [budget]);

  const getExpensesByCategory = async () => {
    try {
      const result = await db
        .select({
          amount: Expenses.amount,
          category: Expenses.category,
        })
        .from(Expenses)
        .where(eq(Expenses.category, budget.category));

      const total = result.reduce(
        (sum, expense) => sum + parseFloat(expense.amount),
        0
      );

      setTotalExpenses(total);
      const calculatedPercentage = (total / parseFloat(budget.amount)) * 100;
      setPercentage(Math.min(calculatedPercentage, 100));
    } catch (error) {
      console.error("Error fetching category expenses:", error);
    }
  };

  return (
    <Link href={`/dashboard/expenses?budget=${budget.id}`}>
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 cursor-pointer hover:border-gray-600 transition-all">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{budget.icon}</span>
            <div>
              <h3 className="font-semibold text-white">{budget.name}</h3>
              <p className="text-sm text-gray-400">{budget.category}</p>
            </div>
          </div>
          <div onClick={(e) => e.preventDefault()}>
            <EditBudget budgetInfo={budget} refreshData={refreshData} />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-400">Amount</span>
            <span className="font-medium text-white">
              ${parseFloat(budget.amount).toLocaleString()}
            </span>
          </div>

          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className={`h-full rounded-full transition-all ${
                percentage > 75 ? "bg-red-500" : "bg-blue-500"
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Spent</span>
            <span className="text-white">
              ${totalExpenses.toLocaleString()} ({percentage.toFixed(0)}%)
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default BudgetItem;
