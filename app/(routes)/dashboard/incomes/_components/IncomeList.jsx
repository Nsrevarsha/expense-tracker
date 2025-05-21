"use client";
import React from "react";
import { db } from "@/utils/dbConfig";
import { eq } from "drizzle-orm";
import { Incomes } from "@/utils/schema";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import EditIncome from "./EditIncome";

function IncomeList({ incomesList, refreshData }) {
  const deleteIncome = async (income) => {
    try {
      const result = await db
        .delete(Incomes)
        .where(eq(Incomes.id, income.id))
        .returning();

      if (result) {
        toast.success("Income Deleted!");
        refreshData();
      }
    } catch (error) {
      console.error("Error deleting income:", error);
      toast.error("Error deleting income");
    }
  };

  return (
    <div className="mt-3">
      <h2 className="font-bold text-lg mb-4 text-white">Latest Incomes</h2>
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-3 bg-gray-900/50 p-4 border-b border-gray-700">
          <h2 className="font-semibold text-gray-300">Name</h2>
          <h2 className="font-semibold text-gray-300">Amount</h2>
          <h2 className="font-semibold text-gray-300 text-center">Actions</h2>
        </div>

        {/* Table Body */}
        {incomesList?.length ? (
          incomesList.map((income) => (
            <div
              key={income.id}
              className="grid grid-cols-3 p-4 border-b border-gray-700 hover:bg-gray-700/50 transition-colors"
            >
              <h2 className="text-gray-200">{income.name}</h2>
              <h2 className="text-gray-200">
                ${parseFloat(income.amount).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </h2>

              <div className="flex justify-center gap-2">
                <EditIncome income={income} refreshData={refreshData} />
                <button
                  onClick={() => deleteIncome(income)}
                  className="p-2 hover:bg-gray-600 rounded-full group transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-400 group-hover:text-red-300" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-gray-400">
            No incomes found
          </div>
        )}
      </div>
    </div>
  );
}

export default IncomeList;
