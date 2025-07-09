import React from 'react';
import { Image, Heart, Github, Twitter, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white/20 backdrop-blur-sm border-t border-gray-200 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <Image className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">CompressIt</span>
            </div>
            <p className="text-gray-600 mb-4 max-w-md">
              The most advanced image compression tool that works entirely in your browser. 
              Fast, secure, and free forever.
            </p>
            <div className="flex items-center text-sm text-gray-500">
              <span>Made with</span>
              <Heart className="w-4 h-4 mx-1 text-red-500" />
              <span>by developers, for developers</span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Features</h4>
            <ul className="space-y-2 text-gray-600">
              <li><a href="#" className="hover:text-gray-900 transition-colors">Batch Processing</a></li>
              <li><a href="#" className="hover:text-gray-900 transition-colors">Quality Control</a></li>
              <li><a href="#" className="hover:text-gray-900 transition-colors">Format Support</a></li>
              <li><a href="#" className="hover:text-gray-900 transition-colors">Privacy First</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Connect</h4>
            <div className="flex space-x-4">
              <a href="#" className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 mt-8 text-center text-gray-600">
          <p>&copy; 2025 CompressIt. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}