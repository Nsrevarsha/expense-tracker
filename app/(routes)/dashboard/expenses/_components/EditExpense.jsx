"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/utils/dbConfig";
import { Expenses } from "@/utils/schema";
import { PenBox, Loader } from "lucide-react";
import { toast } from "sonner";
import { eq } from "drizzle-orm";

function EditExpense({ expense, budgets, refreshData }) {
  const [name, setName] = useState(expense.name);
  const [category, setCategory] = useState(expense.category);
  const [amount, setAmount] = useState(expense.amount);
  const [loading, setLoading] = useState(false);

  const updateExpense = async () => {
    setLoading(true);
    try {
      const selectedBudget = budgets.find(
        (budget) => budget.category === category
      );

      if (!selectedBudget) {
        toast.error("Please select a valid category");
        return;
      }

      const result = await db
        .update(Expenses)
        .set({
          name,
          category,
          amount,
          budgetId: selectedBudget.id,
        })
        .where(eq(Expenses.id, expense.id))
        .returning();

      if (result) {
        toast.success("Expense Updated!");
        refreshData();
      }
    } catch (error) {
      console.error("Error updating expense:", error);
      toast.error("Error updating expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="p-2 hover:bg-gray-600 rounded-full group transition-colors">
          <PenBox className="w-4 h-4 text-blue-400 group-hover:text-blue-300" />
        </button>
      </DialogTrigger>

      <DialogContent className="bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">Edit Expense</DialogTitle>
          <DialogDescription className="text-gray-400">
            Update your expense details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <label className="text-sm font-medium text-gray-300">
              Expense Name
            </label>
            <Input
              placeholder="e.g. Grocery Shopping"
              value={name}
              className="bg-gray-700 border-gray-600 text-white"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300">Category</label>
            <select
              className="w-full p-2 mt-1 bg-gray-700 border border-gray-600 rounded-md text-white"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              {budgets?.map((budget) => (
                <option key={budget.id} value={budget.category}>
                  {budget.category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300">Amount</label>
            <Input
              type="number"
              placeholder="e.g. 1000"
              value={amount}
              className="bg-gray-700 border-gray-600 text-white"
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              disabled={!(name && category && amount) || loading}
              onClick={updateExpense}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader className="animate-spin h-4 w-4" />
                  Updating...
                </div>
              ) : (
                "Update Expense"
              )}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EditExpense;