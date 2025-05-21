import { db } from "@/utils/dbConfig";
import { Expenses } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { Trash2 } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import EditExpense from "./EditExpense";

function ExpenseListTable({ expensesList, refreshData, budgets }) {
  const deleteExpense = async (expense) => {
    try {
      const result = await db
        .delete(Expenses)
        .where(eq(Expenses.id, expense.id))
        .returning();

      if (result) {
        toast.success("Expense Deleted!");
        refreshData();
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error("Error deleting expense");
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-sm font-semibold text-gray-200">Latest Expenses</h2>
      </div>

      <div className="grid grid-cols-4 bg-gray-900/50 p-4 border-b border-gray-700">
        <h2 className="font-semibold text-gray-300">Name</h2>
        <h2 className="font-semibold text-gray-300">Category</h2>
        <h2 className="font-semibold text-gray-300">Amount</h2>
        <h2 className="font-semibold text-gray-300 text-center">Action</h2>
      </div>

      {expensesList?.length ? (
        expensesList.map((expense) => (
          <div
            key={expense.id}
            className="grid grid-cols-4 p-4 border-b border-gray-700 hover:bg-gray-700/50 transition-colors"
          >
            <h2 className="text-gray-200">{expense.name}</h2>
            <h2 className="text-gray-200">{expense.category}</h2>
            <h2 className="text-gray-200">
              ${parseFloat(expense.amount).toLocaleString()}
            </h2>
            <div className="flex justify-center gap-2">
              <EditExpense
                expense={expense}
                budgets={budgets}
                refreshData={refreshData}
              />
              <button
                onClick={() => deleteExpense(expense)}
                className="p-2 hover:bg-gray-600 rounded-full group transition-colors"
              >
                <Trash2 className="w-4 h-4 text-red-400 group-hover:text-red-300" />
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="p-8 text-center text-gray-400">No expenses found</div>
      )}
    </div>
  );
}

export default ExpenseListTable;

// Update column references from merchant to name
const columns = [
  {
    accessorKey: "name", // Changed from merchant to name
    header: "Name",
  },
  // ...other columns
];
