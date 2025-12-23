'use client';

import { UserButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { FiMenu } from 'react-icons/fi';

interface DashboardHeaderProps {
  onOpenSidebar: () => void;
}

export default function DashboardHeader({ onOpenSidebar }: DashboardHeaderProps) {
  const { user } = useUser();

  return (
    <header className="flex justify-between items-center p-4 border-b border-gray-200 bg-white sticky top-0 z-30">
      
      {/* Mobile menu button */}
      <button
        className="md:hidden text-2xl text-red-600 mr-2"
        onClick={onOpenSidebar}
      >
        <FiMenu />
      </button>

      {/* Title */}
      <h1 className="hidden md:block md:text-2xl font-bold text-gray-800">
        Banking Dashboard
      </h1>

      {/* Search and user */}
      <div className="flex flex-1 items-center gap-3 md:gap-6">
        <input
          type="text"
          placeholder="Search..."
          className="flex-1 border px-3 py-1 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
        />

        {!user ? (
          <Link href="/sign-in">
            <button className="w-24 transform rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition hover:bg-red-700 md:w-32">
              Login
            </button>
          </Link>
        ) : (
          <div className="flex items-center gap-3 md:gap-5">
            <UserButton />
            <span className="hidden md:block text-sm font-semibold text-gray-700">
              {user?.firstName} {user?.lastName}
            </span>
          </div>
        )}
      </div>
    </header>
  );
}
