"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import TopNav from "./_components/TopNav"; // We'll create this
import { db } from "@/utils/dbConfig";
import { Budgets } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function DashboardLayout({ children }) {
  const { user, isLoaded, isChecking } = useUser();
  const router = useRouter();
  const [checkingBudgets, setCheckingBudgets] = useState(true);

  useEffect(() => {
    if (isLoaded && user) {
      checkUserBudgets();
    }
  }, [user, isLoaded]);

  const checkUserBudgets = async () => {
    try {
      setCheckingBudgets(true);
      const userEmail = user?.primaryEmailAddress?.emailAddress;

      if (!userEmail) {
        router.replace("/");
        return;
      }

      const result = await db
        .select()
        .from(Budgets)
        .where(eq(Budgets.createdBy, userEmail));

      if (!result || result.length === 0) {
        toast.info("Please create a budget first");
        router.replace("/dashboard/budgets");
      }
    } catch (error) {
      console.error("Error checking budgets:", error);
      toast.error("Error checking budgets");
    } finally {
      setCheckingBudgets(false);
    }
  };

  // Show loading state while checking budgets
  if (!isLoaded || checkingBudgets) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <TopNav />
      <main className="container mx-auto max-w-7xl px-4 py-4">
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;
