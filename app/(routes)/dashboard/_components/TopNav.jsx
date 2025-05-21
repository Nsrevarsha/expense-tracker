import { UserButton } from '@clerk/nextjs';
import { CircleDollarSign, LayoutGrid, PiggyBank, ReceiptText, FileText } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function TopNav() {
  const pathname = usePathname();
  
  const menuList = [
    {
      name: "Dashboard",
      icon: LayoutGrid,
      path: "/dashboard",
    },
    {
      name: "Incomes",
      icon: CircleDollarSign,
      path: "/dashboard/incomes",
    },
    {
      name: "Budgets",
      icon: PiggyBank,
      path: "/dashboard/budgets",
    },
    {
      name: "Expenses",
      icon: ReceiptText,
      path: "/dashboard/expenses",
    },
    {
    name: "Reports",
    icon: FileText,
    path: "/dashboard/reports",
  }

  ];

  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center space-x-2">
            <CircleDollarSign className="h-6 w-6 text-blue-500" />
            <span className="text-lg font-semibold text-white">FinanSmart</span>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            {menuList.map((menu) => (
              <Link 
                key={menu.path} 
                href={menu.path}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm font-medium
                  ${pathname === menu.path 
                    ? 'bg-gray-700 text-white' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
              >
                <menu.icon className="h-4 w-4" />
                <span>{menu.name}</span>
              </Link>
            ))}
          </div>

          <div className="flex items-center">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default TopNav;