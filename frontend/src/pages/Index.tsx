import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';
import LoginPage from '@/components/LoginPage';
import SignupPage from '@/components/SignupPage';

const Index = () => {
  const { isAuthenticated } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  if (!isAuthenticated) {
    return authMode === 'login' ? (
      <LoginPage onSwitchToSignup={() => setAuthMode('signup')} />
    ) : (
      <SignupPage onSwitchToLogin={() => setAuthMode('login')} />
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <Dashboard />
    </div>
  );
};

export default Index;
