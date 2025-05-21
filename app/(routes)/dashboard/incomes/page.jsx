"use client";
import { db } from "@/utils/dbConfig";
import { Incomes } from "@/utils/schema";
import { desc, eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import CreateIncomes from "./_components/CreateIncomes";
import IncomeList from "./_components/IncomeList";

function IncomesScreen() {
  const [incomesList, setIncomesList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && user) {
      fetchIncomes();
    }
  }, [user, isLoaded]);

  const fetchIncomes = async () => {
    try {
      const result = await db
        .select()
        .from(Incomes)
        .where(eq(Incomes.createdBy, user.primaryEmailAddress.emailAddress))
        .orderBy(desc(Incomes.createdAt));

      setIncomesList(result);
    } catch (error) {
      console.error("Error fetching incomes:", error);
      toast.error("Error fetching incomes");
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading spinner while user data is loading
  if (!isLoaded || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-10">
      <h2 className="font-bold text-3xl text-white">My Income</h2>
      <p className="text-gray-400 mt-2">
        Track your income sources and manage your earnings
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-7">
        <CreateIncomes refreshData={fetchIncomes} />
      </div>

      <div className="mt-10">
        <IncomeList refreshData={fetchIncomes} incomesList={incomesList} />
      </div>
    </div>
  );
}

export default IncomesScreen;
