"use client"
import { db } from '@/utils/dbConfig';
import { Budgets, Expenses } from '@/utils/schema';
import { desc, eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react'
import ExpenseListTable from './_components/ExpenseListTable';
import { useUser } from '@clerk/nextjs';
import AddExpenseButton from './_components/AddExpenseButton';
import { toast } from 'sonner';

function ExpensesScreen() {
  const [expensesList, setExpensesList] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      await Promise.all([getAllExpenses(), getBudgets()]);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error fetching data");
    } finally {
      setIsLoading(false);
    }
  };

  const getBudgets = async () => {
    if (!user?.primaryEmailAddress?.emailAddress) {
      toast.error("User email not found");
      return;
    }

    try {
      const result = await db
        .select({
          id: Budgets.id,
          name: Budgets.name,
          amount: Budgets.amount,
          icon: Budgets.icon,
          category: Budgets.category,
          createdBy: Budgets.createdBy,
          created_at: Budgets.createdAt
        })
        .from(Budgets)
        .where(eq(Budgets.createdBy, user.primaryEmailAddress.emailAddress));

      if (!result) {
        setBudgets([]);
        return;
      }

      // Validate budget data against schema
      const validBudgets = result.filter(budget => 
        budget.id &&
        budget.name &&
        budget.amount &&
        budget.category &&
        budget.createdBy
      );

      setBudgets(validBudgets);
    } catch (error) {
      console.error("Error fetching budgets:", error);
      setBudgets([]);
      toast.error("Error fetching budgets");
    }
  };

  const getAllExpenses = async () => {
    if (!user?.primaryEmailAddress?.emailAddress) {
      toast.error("User email not found");
      return;
    }

    try {
      const result = await db
        .select({
          id: Expenses.id,
          name: Expenses.name,  // Changed from merchant to name
          category: Expenses.category,
          amount: Expenses.amount,
          createdAt: Expenses.createdAt,
          budgetId: Expenses.budgetId,
          budget: {
            id: Budgets.id,
            name: Budgets.name,
            category: Budgets.category
          }
        })
        .from(Expenses)
        .leftJoin(Budgets, eq(Expenses.budgetId, Budgets.id))
        .where(eq(Budgets.createdBy, user.primaryEmailAddress.emailAddress))
        .orderBy(desc(Expenses.id));

      const validExpenses = result?.filter(expense => 
        expense.id && 
        expense.name && 
        expense.amount && 
        expense.category
      ) || [];

      setExpensesList(validExpenses);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      setExpensesList([]);
      toast.error("Error fetching expenses");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!budgets.length) {
    return (
      <div className='p-10'>
        <h2 className='font-bold text-3xl'>My Expenses</h2>
        <div className='mt-7 text-center'>
          <p className='text-gray-500'>No budgets found. Please create a budget first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-10">
      <h2 className="font-bold text-3xl text-white">My Expenses</h2>
      <p className="text-gray-400 mt-2">
        Track and manage your daily expenses
      </p>
      <div className="mt-7">
        <AddExpenseButton
          refreshData={fetchData}
          budgets={budgets}
        />
      </div>
      <div className="mt-10">
        <ExpenseListTable 
          refreshData={fetchData}
          expensesList={expensesList}
          budgets={budgets}
        />
      </div>
    </div>
  );
}

export default ExpensesScreen;