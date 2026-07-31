import React, { useState } from 'react';
import { X, Sparkles, LogIn, UserPlus, CheckCircle, ShieldCheck, User } from 'lucide-react';
import { User as UserType } from '../types';

interface LoginModalProps {
  onClose: () => void;
  onLoginSuccess: (user: UserType) => void;
}

const DEMO_ACCOUNTS = [
  {
    name: "Aarya Deshpande",
    email: "aarya.deshpande231@vit.edu",
    role: "Senior AI Researcher",
    password: "demo-password-123"
  },
  {
    name: "Dr. Elena Rostova",
    email: "e.rostova@lab-mit.edu",
    role: "Research Lab Lead",
    password: "demo-password-123"
  },
  {
    name: "Student Sandbox",
    email: "student@insights.ai",
    role: "Undergraduate Fellow",
    password: "demo-password-123"
  }
];

export const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLoginSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('Research Student');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    const user: UserType = {
      id: 'user-' + Date.now(),
      name: name.trim() || email.split('@')[0],
      email: email.trim(),
      role: role || 'Student Researcher'
    };

    onLoginSuccess(user);
    onClose();
  };

  const handleSelectDemo = (account: typeof DEMO_ACCOUNTS[0]) => {
    setEmail(account.email);
    setPassword(account.password);
    setName(account.name);
    setRole(account.role);

    const user: UserType = {
      id: 'user-' + account.email.replace(/[^a-zA-Z0-9]/g, '-'),
      name: account.name,
      email: account.email,
      role: account.role
    };

    setTimeout(() => {
      onLoginSuccess(user);
      onClose();
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1A1A1A]/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FAF9F5] dark:bg-[#1A1A1A] border-2 border-[#1A1A1A] dark:border-[#333] rounded-sm p-6 sm:p-8 max-w-lg w-full shadow-[8px_8px_0px_0px_#1A1A1A] dark:shadow-[8px_8px_0px_0px_#000] animate-in fade-in zoom-in duration-150">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#E7E2D8] dark:border-[#2E2E2E]">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-sm bg-[#1A1A1A] dark:bg-[#C85A17] text-[#FAF9F5] flex items-center justify-center font-serif font-bold text-sm">
              i
            </div>
            <div>
              <h2 className="font-serif font-bold text-xl text-[#1A1A1A] dark:text-[#E6E2D8]">
                {isSignUp ? 'Create Research Account' : 'Welcome to iNSIGHTS'}
              </h2>
              <p className="text-[11px] font-mono text-[#706B63] dark:text-[#A09A8E]">
                AI Research & Innovation Copilot
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-[#706B63] hover:text-[#1A1A1A] dark:hover:text-[#FAF9F5] rounded-xs cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Example Credentials Quick Login Section */}
        <div className="mb-6 bg-[#F4F1EA] dark:bg-[#242422] border border-[#E7E2D8] dark:border-[#333] p-3.5 rounded-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase font-bold text-[#C85A17] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>One-Click Demo Accounts</span>
            </span>
            <span className="text-[10px] font-mono text-[#706B63] dark:text-[#A09A8E]">Click to auto-login</span>
          </div>

          <div className="space-y-1.5">
            {DEMO_ACCOUNTS.map((acc, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectDemo(acc)}
                className="w-full text-left p-2 bg-[#FAF9F5] dark:bg-[#1A1A1A] hover:bg-[#EFECE6] dark:hover:bg-[#2A2A28] border border-[#E7E2D8] dark:border-[#383834] rounded-xs flex items-center justify-between transition-colors cursor-pointer group"
              >
                <div>
                  <div className="text-xs font-serif font-bold text-[#1A1A1A] dark:text-[#E6E2D8] group-hover:text-[#C85A17]">
                    {acc.name}
                  </div>
                  <div className="text-[10px] font-mono text-[#706B63] dark:text-[#A09A8E]">
                    {acc.email} • {acc.role}
                  </div>
                </div>
                <LogIn className="w-3.5 h-3.5 text-[#C85A17] opacity-80 group-hover:opacity-100" />
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="relative my-4 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#E7E2D8] dark:border-[#333]"></div>
          </div>
          <span className="relative bg-[#FAF9F5] dark:bg-[#1A1A1A] px-3 font-mono text-[10px] uppercase tracking-wider text-[#706B63] dark:text-[#A09A8E]">
            Or enter credentials
          </span>
        </div>

        {/* Login / Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-xs font-mono uppercase text-[#706B63] dark:text-[#A09A8E] font-bold mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Alex Morgan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#FAF9F5] dark:bg-[#242422] border border-[#E7E2D8] dark:border-[#383834] focus:border-[#C85A17] p-2.5 text-xs text-[#1A1A1A] dark:text-[#E6E2D8] rounded-sm focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-mono uppercase text-[#706B63] dark:text-[#A09A8E] font-bold mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="e.g. researcher@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#FAF9F5] dark:bg-[#242422] border border-[#E7E2D8] dark:border-[#383834] focus:border-[#C85A17] p-2.5 text-xs text-[#1A1A1A] dark:text-[#E6E2D8] rounded-sm focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-[#706B63] dark:text-[#A09A8E] font-bold mb-1">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#FAF9F5] dark:bg-[#242422] border border-[#E7E2D8] dark:border-[#383834] focus:border-[#C85A17] p-2.5 text-xs text-[#1A1A1A] dark:text-[#E6E2D8] rounded-sm focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-xs font-mono text-[#C85A17] hover:underline cursor-pointer"
            >
              {isSignUp ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
            </button>

            <button
              type="submit"
              className="px-6 py-2 bg-[#C85A17] hover:bg-[#A6470F] text-[#FAF9F5] text-xs font-mono font-medium rounded-sm transition-colors cursor-pointer shadow-xs"
            >
              {isSignUp ? 'Create Account' : 'Sign In'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
