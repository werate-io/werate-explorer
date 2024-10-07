'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/DialogShad';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Label } from '@/components/ui/Label';
import { AlertCircle, ChevronDown, Settings, LogOut } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/PopoverShad';
import { useAuth } from '@/context/AuthContext';
import { login, register, checkMfa } from '@/services/auth';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/Alert';
import { User, Wallet } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
export default function Navbar() {
  const { signOut, isLoggedIn, signIn } = useAuth();
  const { disconnect } = useWallet();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [error, setError] = useState('');
  const [needsMfa, setNeedsMfa] = useState(false);
  const [preAuthToken, setPreAuthToken] = useState('');

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (activeTab === 'register') {
        const data = await register(email, password);
        if (data && data?.error) {
          setError(data?.error?.message || 'Registration failed');
        } else {
          setActiveTab('login');
        }
      } else {
        const data = await login(email, password);
        if (data?.preAuthToken) {
          setPreAuthToken(data?.preAuthToken);
          setNeedsMfa(true);
        } else if (data?.accessToken) {
          handleSuccessfulLogin(); // This will now update the logged-in state
        } else {
          setEmail('');
          setPassword('');
          setError(data?.error?.message || 'Login failed');
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
      if (data) {
        handleSuccessfulLogin();
      } else {
        setError('MFA verification failed');
      }
    } catch (err) {
      setError(`An error occurred: ${err instanceof Error ? err.message : 'Please try again.'}`);
    }
  };

  const handleSuccessfulLogin = () => {
    signIn(email, password); // Ensure this updates the context state
    setIsOpen(false);
    setNeedsMfa(false);
    setEmail('');
    setPassword('');
    setMfaCode('');
  };

  const handleLogout = () => {
    signOut();
    setEmail('');
    setPassword('');
    setMfaCode('');
    setError('');
    setPreAuthToken('');
    setNeedsMfa(false);
    setActiveTab('login');
    setIsOpen(false);
  };

  return (
    <div className="absollute top-0 left-0 right-0 w-full text-white p-4 bg-transparent flex justify-end items-end z-50">
      {/* Right section - Login/User Info */}
      <div className="flex-1 flex justify-end">
        {isLoggedIn ? (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="bg-primary hover:bg-primary/55 text-white">
                {/* I neeed icon of user */}
                <User className="mr-2 h-4 w-4" />
                <ChevronDown className="ml-2 h-4 w-4" />
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
                {/* include disconnect wallet  */}
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    disconnect();
                    signOut();
                  }}>
                  <Wallet className="mr-2 h-4 w-4" />
                  Disconnect
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        ) : (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="secondary" className="bg-purple-600 hover:bg-purple-700 text-white">
                Login
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-primary to-slate-200 text-white z-50">
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
                      className="bg-slate-300 text-white shadow-xl"
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
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                    Verify
                  </Button>
                </form>
              ) : (
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger
                      value="login"
                      className={`${activeTab === 'login' ? '!bg-primary !text-white' : ''}`}>
                      Login
                    </TabsTrigger>
                    <TabsTrigger
                      value="register"
                      className={`${activeTab === 'register' ? '!bg-primary !text-white' : ''}`}>
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
                          className="bg-slate-300 text-slate-700 shadow-xl"
                        />
                      </div>
                      <div>
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="bg-slate-300 text-slate-700 shadow-xl"
                        />
                      </div>
                      {error && (
                        <Alert variant="destructive">
                          <AlertTitle>Error</AlertTitle>
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      )}
                      <Button
                        type="submit"
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white">
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
                          className="bg-slate-300 text-slate-700 shadow-xl"
                        />
                      </div>
                      <div>
                        <Label htmlFor="reg-password">Password</Label>
                        <Input
                          id="reg-password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="bg-slate-300 text-slate-700 shadow-xl"
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
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white">
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
    </div>
  );
}
