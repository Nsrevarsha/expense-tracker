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
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { Plus } from "lucide-react";

function CreateIncomes({ refreshData }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const { user } = useUser();

  const onCreateIncome = async () => {
    try {
      setIsCreating(true);
      if (!user?.primaryEmailAddress?.emailAddress) {
        toast.error("User email not found");
        return;
      }

      const result = await db
        .insert(Incomes)
        .values({
          name: name,
          amount: amount,
          createdBy: user.primaryEmailAddress.emailAddress,
          createdAt: new Date(),
        })
        .returning();

      if (result) {
        toast.success("New Income Added!");
        refreshData();
        setName("");
        setAmount("");
      }
    } catch (error) {
      console.error("Error creating income:", error);
      toast.error("Error creating income");
    } finally {
      setIsCreating(false);
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
              Add New Income
            </h3>
          </div>
        </div>
      </DialogTrigger>

      <DialogContent className="bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">Add New Income</DialogTitle>
          <DialogDescription className="text-gray-400">
            Add a new income source to track your earnings
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <label className="text-sm font-medium text-gray-300">
              Income Name
            </label>
            <Input
              value={name}
              placeholder="e.g. Salary"
              className="bg-gray-700 border-gray-600 text-white"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300">Amount</label>
            <Input
              type="number"
              value={amount}
              placeholder="e.g. 5000"
              className="bg-gray-700 border-gray-600 text-white"
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              disabled={!(name && amount) || isCreating}
              onClick={onCreateIncome}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isCreating ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Adding...
                </div>
              ) : (
                "Add Income"
              )}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateIncomes;
