"use client";
import React, { useEffect, useState } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import CardInfo from "./_components/CardInfo";
import { db } from "@/utils/dbConfig";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import { Budgets, Expenses, Incomes } from "@/utils/schema";
import BarChartDashboard from "./_components/BarChartDashboard";
import BudgetItem from "./budgets/_components/BudgetItem";
import ExpenseListTable from "./expenses/_components/ExpenseListTable";
import { toast } from "sonner";

function Dashboard() {
  const { user, isLoaded } = useUser();
  const [budgetList, setBudgetList] = useState([]);
  const [incomeList, setIncomeList] = useState([]);
  const [expensesList, setExpensesList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && user) {
      getBudgetList();
    }
  }, [user, isLoaded]);

  const getBudgetList = async () => {
    try {
      setIsLoading(true);
      const result = await db
        .select({
          ...getTableColumns(Budgets),
          totalSpend: sql`COALESCE(sum(${Expenses.amount}), 0)`.mapWith(Number),
          totalItem: sql`COALESCE(count(${Expenses.id}), 0)`.mapWith(Number),
        })
        .from(Budgets)
        .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
        .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
        .groupBy(Budgets.id)
        .orderBy(desc(Budgets.id));

      setBudgetList(result || []);
      await Promise.all([getAllExpenses(), getIncomeList()]);
    } catch (error) {
      console.error("Error fetching budgets:", error);
      toast.error("Error fetching budgets");
      setBudgetList([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getIncomeList = async () => {
    try {
      const result = await db
        .select({
          ...getTableColumns(Incomes),
          totalAmount: sql`COALESCE(SUM(CAST(${Incomes.amount} AS NUMERIC)), 0)`.mapWith(Number),
        })
        .from(Incomes)
        .where(eq(Incomes.createdBy, user?.primaryEmailAddress?.emailAddress))
        .groupBy(Incomes.id);

      setIncomeList(result || []);
    } catch (error) {
      console.error("Error fetching income list:", error);
      toast.error("Error fetching income data");
      setIncomeList([]);
    }
  };

  const getAllExpenses = async () => {
    try {
      const result = await db
        .select({
          id: Expenses.id,
          name: Expenses.name,
          amount: Expenses.amount,
          category: Expenses.category,
          budgetId: Expenses.budgetId,
          createdAt: Expenses.createdAt,
        })
        .from(Expenses)
        .innerJoin(Budgets, eq(Budgets.id, Expenses.budgetId))
        .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
        .orderBy(desc(Expenses.id));

      // Format the date before setting state
      const formattedResult = result?.map(expense => ({
        ...expense,
        createdAt: new Date(expense.createdAt).toLocaleDateString()
      })) || [];

      setExpensesList(formattedResult);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      toast.error("Error fetching expenses");
      setExpensesList([]);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-blue-100 ">
          Hi, {user?.fullName} 👋
        </h2>
        <p className="text-sm text-gray-300 mt-1">
          Here's what's happening with your finances
        </p>
      </div>

      <CardInfo budgetList={budgetList} incomeList={incomeList} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <BarChartDashboard budgetList={budgetList} />
          <ExpenseListTable
            expensesList={expensesList}
            refreshData={getBudgetList}
          />
        </div>

        <div>
          <h2 className="text-sm font-semibold mb-3 text-gray-200">Latest Budgets</h2>
          <div className="grid gap-3">
            {budgetList?.map((budget) => (
              <BudgetItem 
                key={budget.id} 
                budget={budget}
                refreshData={getBudgetList}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
