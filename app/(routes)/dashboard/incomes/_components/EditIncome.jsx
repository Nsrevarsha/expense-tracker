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
import { Incomes } from "@/utils/schema";
import { PenBox, Loader } from "lucide-react";
import { toast } from "sonner";
import { eq } from "drizzle-orm";

function EditIncome({ income, refreshData }) {
  const [name, setName] = useState(income.name);
  const [amount, setAmount] = useState(income.amount);
  const [loading, setLoading] = useState(false);

  const updateIncome = async () => {
    if (!name || !amount) return;

    setLoading(true);
    try {
      const result = await db
        .update(Incomes)
        .set({
          name,
          amount,
        })
        .where(eq(Incomes.id, income.id))
        .returning();

      if (result) {
        toast.success("Income Updated!");
        refreshData();
      }
    } catch (error) {
      console.error("Error updating income:", error);
      toast.error("Error updating income");
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
          <DialogTitle className="text-white">Edit Income</DialogTitle>
          <DialogDescription className="text-gray-400">
            Update your income details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <label className="text-sm font-medium text-gray-300">
              Income Name
            </label>
            <Input
              placeholder="e.g. Salary"
              value={name}
              className="bg-gray-700 border-gray-600 text-white"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300">Amount</label>
            <Input
              type="number"
              placeholder="e.g. 5000"
              value={amount}
              className="bg-gray-700 border-gray-600 text-white"
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              disabled={!(name && amount) || loading}
              onClick={updateIncome}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader className="animate-spin h-4 w-4" />
                  Updating...
                </div>
              ) : (
                "Update Income"
              )}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EditIncome;