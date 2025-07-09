import React from 'react';
import { Shield, Zap, Download, Smartphone, Globe, Cpu } from 'lucide-react';

export function Features() {
  const features = [
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'All processing happens in your browser. Your files never leave your device.',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Compress multiple images and PDFs simultaneously with our optimized algorithms.',
    },
    {
      icon: Download,
      title: 'No Limits',
      description: 'Compress as many files as you want, completely free forever.',
    },
    {
      icon: Smartphone,
      title: 'Works Everywhere',
      description: 'Fully responsive design that works perfectly on all devices.',
    },
    {
      icon: Globe,
      title: 'Multiple Formats',
      description: 'Support for JPEG, PNG, WebP, PDF and other popular file formats.',
    },
    {
      icon: Cpu,
      title: 'Smart Compression',
      description: 'Advanced algorithms that maintain quality while reducing file size.',
    },
  ];

  return (
    <section id="features" className="py-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose CompressIt?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We've built the most advanced file compression tool that prioritizes your privacy, 
            speed, and quality for both images and PDFs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200 hover:border-gray-300 transition-all hover:shadow-lg"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}