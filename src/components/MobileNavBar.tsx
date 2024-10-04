'use client';

import React, { useState, useEffect } from 'react';
import { Menu, Search, X } from 'lucide-react';
import LeftSidebar from './LeftSidebar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Sheet, SheetContent } from '@/components/ui/Sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { login, logout, register } from '@/services/auth';
import { getCookie, deleteCookie } from 'cookies-next';
import RightSidebar from './RightSidebar';

interface MobileNavBarProps {
  isLeftSidebarOpen: boolean;
  isRightSidebarOpen: boolean;
  setIsLeftSidebarOpen: (isOpen: boolean) => void;
  setIsRightSidebarOpen: (isOpen: boolean) => void;
  toggleWallet: () => void;
}

export default function MobileNavBar({
  isLeftSidebarOpen,
  isRightSidebarOpen,
  setIsLeftSidebarOpen,
  setIsRightSidebarOpen
}: MobileNavBarProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('login');
  const [userInitials, setUserInitials] = useState('');

  useEffect(() => {
    const storedEmail = getCookie('email');
    if (storedEmail) {
      setIsLoggedIn(true);
      setUserInitials(getInitials(String(storedEmail)));
    }
  }, [isLoggedIn]);

  const getInitials = (name: string) => {
    return name
      .split('@')[0]
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (activeTab === 'register') {
        const data = await register(email, password);
        if (data.error) {
          setError(data.error);
        } else {
          setError('Registration successful. Please log in.');
          setActiveTab('login');
        }
      } else {
        const data = await login(email, password);
        if (data.accessToken) {
          handleSuccessfulLogin();
        } else {
          setError(data.error || 'Login failed');
        }
      }
    } catch (err) {
      setError(`An error occurred: ${err instanceof Error ? err.message : 'Please try again.'}`);
    }
  };

  const handleSuccessfulLogin = () => {
    const storedEmail = getCookie('email');
    setIsLoggedIn(true);
    setUserInitials(getInitials(String(storedEmail)));
    setShowLoginForm(false);
    setEmail('');
    setPassword('');
  };

  const handleLogout = () => {
    logout();
    deleteCookie('email');
    setIsLoggedIn(false);
    setUserInitials('');
  };

  return (
    <>
      <Sheet open={isLeftSidebarOpen} onOpenChange={setIsLeftSidebarOpen}>
        <SheetContent side="left" className="w-[300px] sm:w-[400px] text-white p-0">
          <LeftSidebar isOpen={true} setIsOpen={() => {}} side="left" />
        </SheetContent>
      </Sheet>

      {/* Mobile header */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 flex justify-between items-center h-16 px-4 md:hidden z-50">
        <Button variant="ghost" size="icon" onClick={() => setIsLeftSidebarOpen(true)}>
          <Menu className="h-6 w-6" />
        </Button>
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for venue, location, bohemian, date?"
            className="pl-8 bg-gray-800 text-white placeholder-gray-400"
          />
        </div>
        {isLoggedIn ? (
          <Button
            variant="ghost"
            size="sm"
            className="ml-2 bg-purple-600 text-white hover:bg-purple-700"
            onClick={() => setIsRightSidebarOpen(true)}>
            {userInitials}
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="ml-2 bg-purple-600 text-white hover:bg-purple-700"
            onClick={() => setShowLoginForm(true)}>
            Login
          </Button>
        )}
      </div>

      {/* Login form and right sidebar code remains unchanged */}
      {showLoginForm && !isLoggedIn && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 md:hidden">
          <div className="fixed inset-x-0 bottom-0 p-6 bg-gray-900 text-white shadow-lg rounded-t-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Login / Register</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowLoginForm(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="login" className="data-[state=active]:bg-purple-600">
                  Login
                </TabsTrigger>
                <TabsTrigger value="register" className="data-[state=active]:bg-purple-600">
                  Register
                </TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="email"
                      placeholder="Enter your email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium">
                      Password
                    </label>
                    <Input
                      id="password"
                      placeholder="Enter your password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>
                  {error && <p className="text-red-500">{error}</p>}
                  <Button className="w-full bg-purple-600 hover:bg-purple-700" type="submit">
                    Login
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="register">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="reg-email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="reg-email"
                      placeholder="Enter your email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="reg-password" className="text-sm font-medium">
                      Password
                    </label>
                    <Input
                      id="reg-password"
                      placeholder="Enter your password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>
                  {error && <p className="text-red-500">{error}</p>}
                  <Button className="w-full bg-purple-600 hover:bg-purple-700" type="submit">
                    Register
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
      {isLoggedIn && (
        <Sheet open={isRightSidebarOpen} onOpenChange={setIsRightSidebarOpen}>
          <SheetContent side="right" className="w-[300px] sm:w-[400px] text-white p-0">
            <RightSidebar
              isOpen={true}
              setIsOpen={() => {}}
              side="right"
              handleLogout={handleLogout}
            />
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
