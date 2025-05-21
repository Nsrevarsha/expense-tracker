"use client";
import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { db } from "@/utils/dbConfig";
import { Expenses, Incomes } from "@/utils/schema";
import { eq, desc, and, between } from "drizzle-orm";
import { Download, FileText, Calendar } from "lucide-react";
import { toast } from "sonner";

function ReportsScreen() {
  const { user, isLoaded } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState(() => ({
    startDate: getLastMonthDate(),
    endDate: new Date(),
  }));
  const [data, setData] = useState({
    expenses: [],
    incomes: [],
  });

  // Get date from last month
  function getLastMonthDate() {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date;
  }

  async function generateReport() {
    if (!user?.primaryEmailAddress?.emailAddress) {
      toast.error("User not authenticated");
      return;
    }

    setIsLoading(true);
    try {
      // Create new Date objects and validate them
      const start = new Date(filters.startDate);
      const end = new Date(filters.endDate);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new Error("Invalid date range");
      }

      // Set times to start and end of day
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);

      // Debug log
      console.log("Query dates:", {
        start: start.toISOString(),
        end: end.toISOString()
      });

      // Fetch expenses with try-catch
      let expenses = [];
      try {
        // Convert dates to timestamps for SQLite
        const startTimestamp = Math.floor(start.getTime() / 1000);
        const endTimestamp = Math.floor(end.getTime() / 1000);

        console.log("Using timestamps:", { startTimestamp, endTimestamp });

        expenses = await db
          .select()
          .from(Expenses)
          .where(
            and(
              eq(Expenses.createdBy, user.primaryEmailAddress.emailAddress),
              between(Expenses.createdAt, startTimestamp, endTimestamp)
            )
          )
          .orderBy(desc(Expenses.createdAt));

        console.log("Expenses fetched:", expenses);
      } catch (expError) {
        console.error("Error fetching expenses:", expError);
      }

      // Fetch incomes with try-catch
      let incomes = [];
      try {
        const startTimestamp = Math.floor(start.getTime() / 1000);
        const endTimestamp = Math.floor(end.getTime() / 1000);

        incomes = await db
          .select()
          .from(Incomes)
          .where(
            and(
              eq(Incomes.createdBy, user.primaryEmailAddress.emailAddress),
              between(Incomes.createdAt, startTimestamp, endTimestamp)
            )
          )
          .orderBy(desc(Incomes.createdAt));

        console.log("Incomes fetched:", incomes);
      } catch (incError) {
        console.error("Error fetching incomes:", incError);
      }

      // Update state even if one query fails
      setData({
        expenses: expenses || [],
        incomes: incomes || [],
      });

      // Show success only if we got some data
      if (expenses.length > 0 || incomes.length > 0) {
        toast.success("Report generated successfully");
      } else {
        toast.info("No data found for selected date range");
      }
    } catch (error) {
      console.error("Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
      toast.error(error.message || "Failed to generate report");
    } finally {
      setIsLoading(false);
    }
  }

  function downloadCSV() {
    try {
      // Prepare expenses data
      const expenseRows = data.expenses.map((e) => [
        e.name,
        e.category,
        e.amount,
        new Date(e.createdAt).toLocaleDateString(),
      ]);

      // Prepare incomes data
      const incomeRows = data.incomes.map((i) => [
        i.name,
        i.amount,
        new Date(i.createdAt).toLocaleDateString(),
      ]);

      // Create CSV content
      const csvContent = [
        ["Expenses"],
        ["Name", "Category", "Amount", "Date"],
        ...expenseRows,
        [], // Empty row for spacing
        ["Incomes"],
        ["Name", "Amount", "Date"],
        ...incomeRows,
      ]
        .map((row) => row.join(","))
        .join("\n");

      // Download file
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `financial-report-${filters.startDate.toLocaleDateString()}-${filters.endDate.toLocaleDateString()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("Failed to download report");
    }
  }

  // Fix the date input handling
  function formatDateForInput(date) {
    try {
      return date instanceof Date && !isNaN(date)
        ? date.toISOString().split('T')[0]
        : '';
    } catch (error) {
      console.error('Date formatting error:', error);
      return '';
    }
  }

  // Add effect to generate report when filters change
  useEffect(() => {
    if (isLoaded && user) {
      generateReport();
    }
  }, [isLoaded, user, filters.startDate, filters.endDate]);

  if (!isLoaded || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  const totalExpenses = data.expenses.reduce(
    (sum, exp) => sum + Number(exp.amount),
    0
  );
  const totalIncome = data.incomes.reduce(
    (sum, inc) => sum + Number(inc.amount),
    0
  );

  return (
    <div className="p-10 space-y-8">
      {/* Header */}
      <div>
        <h2 className="font-bold text-3xl text-white flex items-center gap-2">
          <FileText className="w-8 h-8" />
          Financial Reports
        </h2>
        <p className="text-gray-400 mt-2">
          Generate and download your financial reports
        </p>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Date Range
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              type="date"
              value={formatDateForInput(filters.startDate)}
              onChange={(e) => {
                setFilters((prev) => ({
                  ...prev,
                  startDate: new Date(e.target.value)
                }));
              }}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
            />
          </div>
          <div>
            <input
              type="date"
              value={formatDateForInput(filters.endDate)}
              onChange={(e) => {
                setFilters((prev) => ({
                  ...prev,
                  endDate: new Date(e.target.value)
                }));
              }}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
            />
          </div>
        </div>
        <button
          onClick={generateReport}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Generate Report
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h3 className="text-gray-400 text-sm">Total Expenses</h3>
          <p className="text-2xl font-bold text-white mt-2">
            ${totalExpenses.toLocaleString()}
          </p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h3 className="text-gray-400 text-sm">Total Income</h3>
          <p className="text-2xl font-bold text-white mt-2">
            ${totalIncome.toLocaleString()}
          </p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h3 className="text-gray-400 text-sm">Net Balance</h3>
          <p className="text-2xl font-bold text-white mt-2">
            ${(totalIncome - totalExpenses).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Download Button */}
      <button
        onClick={downloadCSV}
        disabled={!data.expenses.length && !data.incomes.length}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Download className="w-4 h-4" />
        Download Report
      </button>

      {/* Transactions */}
      <div className="space-y-6">
        {data.expenses.length > 0 && (
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-700">
              <h3 className="font-semibold text-white">Expenses</h3>
            </div>
            <div className="divide-y divide-gray-700">
              {data.expenses.map((expense) => (
                <div
                  key={expense.id}
                  className="grid grid-cols-4 p-4 hover:bg-gray-700/50 transition-colors"
                >
                  <span className="text-gray-200">{expense.name}</span>
                  <span className="text-gray-200">{expense.category}</span>
                  <span className="text-gray-200">
                    ${Number(expense.amount).toLocaleString()}
                  </span>
                  <span className="text-gray-400">
                    {new Date(expense.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.incomes.length > 0 && (
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-700">
              <h3 className="font-semibold text-white">Incomes</h3>
            </div>
            <div className="divide-y divide-gray-700">
              {data.incomes.map((income) => (
                <div
                  key={income.id}
                  className="grid grid-cols-3 p-4 hover:bg-gray-700/50 transition-colors"
                >
                  <span className="text-gray-200">{income.name}</span>
                  <span className="text-gray-200">
                    ${Number(income.amount).toLocaleString()}
                  </span>
                  <span className="text-gray-400">
                    {new Date(income.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReportsScreen;