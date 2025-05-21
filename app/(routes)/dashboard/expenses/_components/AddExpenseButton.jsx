"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/utils/dbConfig";
import { Expenses } from "@/utils/schema";
import { Loader, Plus } from "lucide-react";
import { toast } from "sonner";

function AddExpenseButton({ budgets, refreshData }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const addNewExpense = async () => {
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
        .insert(Expenses)
        .values({
          name,
          category,
          amount,
          budgetId: selectedBudget.id,
          createdAt: new Date(),
          createdBy: user.primaryEmailAddress.emailAddress,

        })
        .returning({ insertedId: Expenses.id });

      if (result) {
        refreshData();
        toast.success("New Expense Added!");
        setName("");
        setCategory("");
        setAmount("");
      }
    } catch (error) {
      console.error("Error adding expense:", error);
      toast.error("Error adding expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="bg-gray-800 border border-gray-700 hover:border-gray-600 rounded-xl p-6 cursor-pointer transition-colors group">
          <div className="flex flex-col items-center justify-center h-full space-y-3">
            <div className="p-3 rounded-full bg-gray-700 group-hover:bg-gray-600">
              <Plus className="w-6 h-6 text-gray-400 group-hover:text-white" />
            </div>
            <h3 className="font-medium text-gray-400 group-hover:text-white">
              Add New Expense
            </h3>
          </div>
        </div>
      </DialogTrigger>

      <DialogContent className="bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">Add New Expense</DialogTitle>
          <DialogDescription className="text-gray-400">
            Add a new expense to track your spending
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <label className="text-sm font-medium text-gray-300">
              Expense Name
            </label>
            <Input
              placeholder="e.g. Grocery Shopping, Coffee"
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
              onClick={addNewExpense}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader className="animate-spin h-4 w-4" />
                  Adding...
                </div>
              ) : (
                "Add Expense"
              )}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddExpenseButton;
