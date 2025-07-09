import React from 'react';
import { Image, Zap } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b border-white/20 bg-white/10 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
              <Image className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">CompressIt</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">
              How it Works
            </a>
            <button className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all">
              <Zap className="w-4 h-4" />
              <span>Go Pro</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}