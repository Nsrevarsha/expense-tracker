"use client";
import React from 'react'
import BudgetList from './_components/BudgetList'
import CreateBudget from './_components/CreateBudget'

function Budget() {
  const [isLoading, setIsLoading] = React.useState(true)
  const [budgetList, setBudgetList] = React.useState([])

  const fetchData = async () => {
    setIsLoading(true)
    // Fetch budget data logic here
    setIsLoading(false)
  }

  React.useEffect(() => {
    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className='p-10'>
      <h2 className='font-bold text-3xl text-white'>My Budgets</h2>
      <p className='text-gray-400 mt-2'>
        Create and manage your budgets to track spending
      </p>
      <div className='mt-10'>
        <BudgetList refreshData={fetchData} budgetList={budgetList} />
      </div>
    </div>
  )
}

export default Budget