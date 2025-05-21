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
import EmojiPicker from "emoji-picker-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/utils/dbConfig";
import { Budgets } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { Plus } from "lucide-react";

function CreateBudget({ refreshData }) {
  const [emojiIcon, setEmojiIcon] = useState("😀");
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [payee, setPayee] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");

  const categories = [
    "Food & Dining",
    "Shopping",
    "Transport",
    "Bills & Utilities",
    "Entertainment",
    "Health",
    "Travel",
    "Others",
  ];

  const { user } = useUser();

  /**
   * Used to Create New Budget
   */
  const onCreateBudget = async () => {
    try {
      if (!user?.primaryEmailAddress?.emailAddress) {
        toast.error("User email not found");
        return;
      }

      const result = await db
        .insert(Budgets)
        .values({
          name: payee,
          category: category,
          amount: amount,
          icon: emojiIcon,
          createdBy: user.primaryEmailAddress.emailAddress,
          createdAt: new Date(), // Explicitly set creation time
        })
        .returning({ insertedId: Budgets.id });

      if (result) {
        refreshData();
        toast.success("New Budget Created!");
        setPayee("");
        setCategory("");
        setAmount("");
        setOpenEmojiPicker(false);
      }
    } catch (error) {
      console.error("Error creating budget:", error);
      toast.error("Error creating budget");
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
              Create New Budget
            </h3>
          </div>
        </div>
      </DialogTrigger>

      <DialogContent className="bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">Create New Budget</DialogTitle>
          <DialogDescription className="text-gray-400">
            Add a new budget to track your spending
          </DialogDescription>
        </DialogHeader>

        {/* Form Content */}
        <div className="space-y-4 mt-4">
          <div>
            <Button
              type="button"
              variant="outline"
              className="text-lg bg-gray-700 border-gray-600 hover:bg-gray-600"
              onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
            >
              {emojiIcon}
            </Button>
            <div className="absolute z-20">
              <EmojiPicker
                open={openEmojiPicker}
                onEmojiClick={(e) => {
                  setEmojiIcon(e.emoji);
                  setOpenEmojiPicker(false);
                }}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300">
              Budget Name
            </label>
            <Input
              placeholder="e.g. Groceries"
              className="bg-gray-700 border-gray-600 text-white"
              onChange={(e) => setPayee(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300">Category</label>
            <select
              className="w-full p-2 mt-1 bg-gray-700 border border-gray-600 rounded-md text-white"
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300">Amount</label>
            <Input
              type="number"
              placeholder="e.g. 500"
              className="bg-gray-700 border-gray-600 text-white"
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            disabled={!(payee && amount && category)}
            onClick={onCreateBudget}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            Create Budget
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateBudget;
