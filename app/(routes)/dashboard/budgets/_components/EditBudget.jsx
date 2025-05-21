"use client";
import { Button } from "@/components/ui/button";
import { PenBox, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { db } from "@/utils/dbConfig";
import { Budgets } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { toast } from "sonner";
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
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function EditBudget({ budgetInfo, refreshData }) {
  const [emojiIcon, setEmojiIcon] = useState(budgetInfo?.icon);
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [name, setName] = useState();
  const [amount, setAmount] = useState();
  const [category, setCategory] = useState(budgetInfo?.category);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  useEffect(() => {
    if (budgetInfo) {
      setEmojiIcon(budgetInfo?.icon);
      setAmount(budgetInfo.amount);
      setName(budgetInfo.name);
      setCategory(budgetInfo.category);
    }
  }, [budgetInfo]);

  const onUpdateBudget = async () => {
    try {
      setIsUpdating(true);
      const result = await db
        .update(Budgets)
        .set({
          name: name,
          amount: amount,
          icon: emojiIcon,
          category: category,
        })
        .where(eq(Budgets.id, budgetInfo.id))
        .returning();

      if (result && result.length > 0) {
        toast.success("Budget Updated!");
        setOpenEmojiPicker(false);
        // Check if refreshData is a function before calling
        if (typeof refreshData === "function") {
          await refreshData();
        }
      } else {
        toast.error("Failed to update budget");
      }
    } catch (error) {
      console.error("Error updating budget:", error);
      toast.error("Error updating budget");
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteBudget = async () => {
    try {
      setIsDeleting(true);
      const result = await db
        .delete(Budgets)
        .where(eq(Budgets.id, budgetInfo.id))
        .returning();

      if (result && result.length > 0) {
        toast.success("Budget Deleted!");
        // Check if refreshData is a function before calling
        if (typeof refreshData === "function") {
          await refreshData();
        }
      } else {
        toast.error("Failed to delete budget");
      }
    } catch (error) {
      console.error("Error deleting budget:", error);
      toast.error("Error deleting budget");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex gap-1.5">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="bg-gray-700 hover:bg-gray-600 transition-colors"
          >
            <PenBox className="w-4 h-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-gray-800 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Update Budget</DialogTitle>
            <DialogDescription className="text-gray-400">
              <div className="mt-5">
                {/* Emoji Picker */}
                <Button
                  variant="outline"
                  className="text-lg bg-gray-700 border-gray-600 hover:bg-gray-600"
                  onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
                >
                  {emojiIcon}
                </Button>
                {openEmojiPicker && (
                  <div className="absolute z-50 mt-1">
                    <EmojiPicker
                      theme="dark"
                      onEmojiClick={(e) => {
                        setEmojiIcon(e.emoji);
                        setOpenEmojiPicker(false);
                      }}
                    />
                  </div>
                )}

                {/* Name Input */}
                <div className="mt-2">
                  <h2 className="text-gray-200 font-medium my-1">Budget Name</h2>
                  <Input
                    placeholder="e.g. Home Decor"
                    defaultValue={budgetInfo?.name}
                    className="bg-gray-700 border-gray-600 text-white"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                {/* Category Select */}
                <div className="mt-2">
                  <h2 className="text-gray-200 font-medium my-1">Category</h2>
                  <select
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                    value={category}
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

                {/* Amount Input */}
                <div className="mt-2">
                  <h2 className="text-gray-200 font-medium my-1">Budget Amount</h2>
                  <Input
                    type="number"
                    defaultValue={budgetInfo?.amount}
                    placeholder="e.g. 5000$"
                    className="bg-gray-700 border-gray-600 text-white"
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button
                disabled={!(name && amount && category) || isUpdating}
                onClick={() => onUpdateBudget()}
                className="mt-5 w-full rounded-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isUpdating ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Updating...
                  </div>
                ) : (
                  "Update Budget"
                )}
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="bg-gray-700 hover:bg-gray-600 hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-gray-800 border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Delete Budget
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to delete this budget? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
              disabled={isDeleting}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteBudget}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Deleting...
                </div>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default EditBudget;
