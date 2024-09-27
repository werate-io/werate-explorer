'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { AlertCircle, ChevronDown, Settings, LogOut } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { checkMfa, login, register } from '@/services/auth';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [error, setError] = useState('');
  const [needsMfa, setNeedsMfa] = useState(false);
  const [preAuthToken, setPreAuthToken] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInitials, setUserInitials] = useState('');

  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    if (storedEmail) {
      setIsLoggedIn(true);
      setUserInitials(getInitials(storedEmail));
    }
  }, []);

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
        if (data.preAuthToken) {
          setPreAuthToken(data.preAuthToken);
          setNeedsMfa(true);
        } else if (data.accessToken) {
          handleSuccessfulLogin(email);
        } else {
          setError(data.error || 'Login failed');
        }
      }
    } catch (err) {
      setError(`An error occurred: ${err instanceof Error ? err.message : 'Please try again.'}`);
    }
  };

  const handleMfaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const data = await checkMfa(preAuthToken, mfaCode);
      if (data.accessToken) {
        handleSuccessfulLogin(email);
      } else {
        setError(data.error || 'MFA verification failed');
      }
    } catch (err) {
      setError(`An error occurred: ${err instanceof Error ? err.message : 'Please try again.'}`);
    }
  };

  const handleSuccessfulLogin = (email: string) => {
    localStorage.setItem('email', email);
    setIsLoggedIn(true);
    setUserInitials(getInitials(email));
    setIsOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    setIsLoggedIn(false);
    setUserInitials('');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="relative top-0 left-0 right-0 bg-white text-white p-4 flex justify-between items-center z-50">
      <div className="flex-1">
        <Input
          type="search"
          placeholder="Search for venue, location, bohemian, date?"
          className="max-w-sm bg-gray-800 text-white placeholder-gray-400 border-gray-700"
        />
      </div>
      <div className="flex items-center space-x-4">
        {isLoggedIn ? (
          <>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="bg-primary hover:bg-primary/55 text-white">
                  {userInitials} <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-36 bg-gray-800 text-white border-gray-700">
                <div className="grid gap-2">
                  <Button variant="ghost" className="w-full justify-start">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </>
        ) : (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="secondary" className="bg-purple-600 hover:bg-purple-700 text-white">
                Login
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-gray-800 text-white z-50">
              <DialogHeader>
                <DialogTitle>{needsMfa ? '2FA Verification' : 'Login / Register'}</DialogTitle>
              </DialogHeader>
              {needsMfa ? (
                <form onSubmit={handleMfaSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="mfaCode">2FA Code</Label>
                    <Input
                      id="mfaCode"
                      type="text"
                      value={mfaCode}
                      onChange={(e) => setMfaCode(e.target.value)}
                      className="bg-gray-700 text-white border-gray-600"
                    />
                  </div>
                  {error && (
                    <div className="text-red-500 flex items-center">
                      <AlertCircle className="mr-2" size={16} />
                      {error}
                    </div>
                  )}
                  <Button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Verify
                  </Button>
                </form>
              ) : (
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger
                      value="login"
                      className={`${activeTab === 'login' ? '!bg-primary !text-white' : ''}`}
                    >
                      Login
                    </TabsTrigger>
                    <TabsTrigger
                      value="register"
                      className={`${activeTab === 'register' ? '!bg-primary !text-white' : ''}`}
                    >
                      Register
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="login">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="bg-gray-700 text-white border-gray-600"
                        />
                      </div>
                      <div>
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="bg-gray-700 text-white border-gray-600"
                        />
                      </div>
                      {error && (
                        <div className="text-red-500 flex items-center">
                          <AlertCircle className="mr-2" size={16} />
                          {error}
                        </div>
                      )}
                      <Button
                        type="submit"
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        Login
                      </Button>
                    </form>
                  </TabsContent>
                  <TabsContent value="register">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="reg-email">Email</Label>
                        <Input
                          id="reg-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="bg-gray-700 text-white border-gray-600"
                        />
                      </div>
                      <div>
                        <Label htmlFor="reg-password">Password</Label>
                        <Input
                          id="reg-password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="bg-gray-700 text-white border-gray-600"
                        />
                      </div>
                      {error && (
                        <div className="text-red-500 flex items-center">
                          <AlertCircle className="mr-2" size={16} />
                          {error}
                        </div>
                      )}
                      <Button
                        type="submit"
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        Register
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              )}
            </DialogContent>
          </Dialog>
        )}
      </div>
    </nav>
  );
}
