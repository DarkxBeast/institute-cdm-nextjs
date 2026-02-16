"use client";
import Link from "next/link";
import { signout } from "@/app/login/actions";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  BarChart3,
  Shield,
  Building2,
  Menu,
  X,
  LogOutIcon
} from "lucide-react";
import { useState } from "react";
import { Button } from '@/components/ui/button';
import Image from "next/image";

type NavItem = {
  title: string
  href: string
  icon: React.ElementType
  hasNotification?: boolean
}

const navItems: NavItem[] = [
  { title: "Overview", href: "/overview", icon: LayoutDashboard },
  { title: "Batches", href: "/batches", icon: Users },
  { title: "Proposals", href: "/proposals", icon: FileText },
  { title: "Analytics", href: "/analytics", icon: BarChart3 },
  { title: "Audit Log", href: "/audit-log", icon: Shield },
  { title: "Institute Profile", href: "/institute-profile", icon: Building2 },
];

const Navbar = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className='bg-[#0a0a0a] border-b border-[#2a2a2a] sticky top-0 z-50'>
      <div className='mx-auto flex max-w-[1600px] items-center justify-between px-4 py-4 sm:px-6'>
        {/* Mobile menu button */}
        <button
          className="md:hidden text-gray-400 hover:text-white mr-4"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        <div className='flex items-center gap-8'>
          <Link href='/overview'>
            <Image
              src="/images/logo.png"
              alt="Institute Logo"
              width={160}
              height={40}
              className="h-10 w-auto object-contain"
              priority
            />
          </Link>
        </div>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-1 mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors relative ${isActive
                  ? "text-orange-500"
                  : "text-gray-400 hover:text-white hover:bg-[#1a1a1a]"
                  }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.title}</span>
                {item.hasNotification && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full" />
                )}
              </Link>
            );
          })}
        </div>

        <div className='flex items-center gap-6'>
          <Button
            variant='ghost'
            size='icon'
            className="text-gray-400 hover:text-white hover:bg-orange-500"
            type="button"
            onClick={() => signout()}
          >
            <LogOutIcon className="w-5 h-5" />
            <span className='sr-only'>Logout</span>
          </Button>
        </div>
      </div>

      {/* Mobile navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-[#2a2a2a] bg-[#0a0a0a]">
          <div className="flex flex-col p-4 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors relative ${isActive
                    ? "text-orange-500 bg-[#1a1a1a]"
                    : "text-gray-400 hover:text-white hover:bg-[#1a1a1a]"
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.title}</span>
                  {item.hasNotification && (
                    <span className="w-2 h-2 bg-orange-500 rounded-full ml-auto" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
