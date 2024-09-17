'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
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
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const API_BASE_URL = 'https://mobile.werate.io/api';

async function register(username: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/v1/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  return response.json();
}

async function login(username: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/v2/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  return response.json();
}

async function checkMfa(preAuthToken: string, mfaCode: string) {
  const response = await fetch(`${API_BASE_URL}/v1/check-mfa`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${preAuthToken}`
    },
    body: JSON.stringify({ code: mfaCode })
  });
  return response.json();
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [error, setError] = useState('');
  const [needsMfa, setNeedsMfa] = useState(false);
  const [preAuthToken, setPreAuthToken] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (activeTab === 'register') {
        const data = await register(username, password);
        if (data.error) {
          setError(data.error);
        } else {
          setError('Registration successful. Please log in.');
          setActiveTab('login');
        }
      } else {
        const data = await login(username, password);
        if (data.preAuthToken) {
          setPreAuthToken(data.preAuthToken);
          setNeedsMfa(true);
        } else if (data.accessToken) {
          // Handle successful login
          console.log('Logged in successfully', data.accessToken);
          setIsOpen(false);
        } else {
          setError(data.error || 'Login failed');
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  const handleMfaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const data = await checkMfa(preAuthToken, mfaCode);
      if (data.accessToken) {
        // Handle successful login with MFA
        console.log('Logged in successfully with MFA', data.accessToken);
        setIsOpen(false);
      } else {
        setError(data.error || 'MFA verification failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-transparent text-white p-4 flex items-center z-10">
      <div className="flex-1">
        <div className="flex-1 flex justify-center">
          <Input
            type="search"
            placeholder="Search for venue, location, bohemian, date?"
            className="w-full max-w-md bg-gray-800 text-white placeholder-gray-400 border-gray-700"
          />
        </div>
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="secondary" className="bg-purple-600 hover:bg-purple-700 text-white">
            Login
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-gray-800 text-white">
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
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                Verify
              </Button>
            </form>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-700">
                <TabsTrigger
                  value="login"
                  className={cn(
                    'data-[state=active]:bg-purple-600 data-[state=active]:text-white',
                    'data-[state=inactive]:bg-gray-700 data-[state=inactive]:text-gray-300'
                  )}>
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  className={cn(
                    'data-[state=active]:bg-purple-600 data-[state=active]:text-white',
                    'data-[state=inactive]:bg-gray-700 data-[state=inactive]:text-gray-300'
                  )}>
                  Register
                </TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
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
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                    Login
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="register">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="reg-username">Username</Label>
                    <Input
                      id="reg-username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
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
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                    Register
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </nav>
  );
}
