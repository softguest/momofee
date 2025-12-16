"use client";
import { Button } from "@/components/ui/button";
import { LogIn, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "#" },
    { name: "About", href: "#about" },
    { name: "Services", href: "#services" },
    { name: "Blog", href: "#blog" },
    { name: "Portfolio", href: "#portfolio" },
    { name: "Contact", href: "#contact" }
  ];

  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex justify-center items-center space-x-2">
              <span className="w-8 h-8 bg-[#ff9245] rounded-full"></span>
              <span className="text-2xl text-[#005f59] font-bold">Decotrin</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-foreground hover:text-primary transition-colors duration-200 px-3 py-2 text-sm font-medium"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>

          {/* Dashboard Button */}
          <div className="hidden md:block">
            <Link href="/dashboard" className="cursor-pointer">
              <Button variant="default"
               size="sm">
                <LogIn className="w-4 h-4 mr-1" />
                  Start Therapy
              </Button>
            </Link>
          </div>
          {/* {!user ?
            <Link href="/sign-in">
                <button className="w-24 transform rounded-lg bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 md:w-32 dark:bg-white dark:text-black dark:hover:bg-gray-200">
                    Login
                </button></Link> :
                <div className="hidden md:block">
                    <div className="flex items-center gap-5">
                      <UserButton />
                      <Link href="/dashboard">
                          <Button variant="therapeutic2">Dashboard</Button>
                      </Link>
                  </div>
                </div>
            } */}

          {/* Mobile menu button */}
          <div className="md:hidden cursor-pointer">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-card rounded-lg mt-2 mb-6 shadow-soft">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-foreground hover:text-primary hover:bg-secondary block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <div className="px-3 py-2">
                <Link href="/dashboard" className="w-full">
                  <Button variant="secondary" size="sm" className="w-full">
                    Start Therapy
                  </Button>
                </Link>
              </div>
                  {/* {!user ?
                    <Link href="/sign-in">
                        <button className="w-24 transform rounded-lg bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 md:w-32 dark:bg-white dark:text-black dark:hover:bg-gray-200">
                            Login
                        </button></Link> :
                        <div className="flex items-center justify-center gap-5">
                            <UserButton />
                            <Link href="/dashboard" className="cursor-pointer">
                              <Button variant="therapeutic2">Dashboard</Button>
                          </Link>
                        </div>
                    } */}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;