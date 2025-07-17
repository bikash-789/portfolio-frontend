'use client';

import React from 'react';
import DynamicImage from './DynamicImage';
import FallbackAvatar from './FallbackAvatar';

const ExampleFallback: React.FC = () => {
  return (
    <div className="p-8 space-y-8">
      <h2 className="text-2xl font-bold mb-4">SVG Fallback Examples</h2>
      
      {/* Row 1: Profile Images */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Profile Images (Circle)</h3>
        <div className="flex gap-4">
          <DynamicImage
            src="https://invalid-url.com/nonexistent.jpg"
            alt="John Doe"
            width={80}
            height={80}
            className="rounded-full"
            fallbackName="John Doe"
            fallbackShape="circle"
            fallbackSize={80}
          />
          <DynamicImage
            src="https://invalid-url.com/nonexistent.jpg"
            alt="Jane Smith"
            width={80}
            height={80}
            className="rounded-full"
            fallbackName="Jane Smith"
            fallbackShape="circle"
            fallbackSize={80}
          />
          <DynamicImage
            src="https://invalid-url.com/nonexistent.jpg"
            alt="Bob Wilson"
            width={80}
            height={80}
            className="rounded-full"
            fallbackName="Bob Wilson"
            fallbackShape="circle"
            fallbackSize={80}
          />
        </div>
      </div>

      {/* Row 2: Skill Icons */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Skill Icons (Square)</h3>
        <div className="flex gap-4">
          <DynamicImage
            src="https://invalid-url.com/react.svg"
            alt="React"
            width={60}
            height={60}
            className="rounded-lg"
            fallbackName="React"
            fallbackShape="square"
            fallbackSize={60}
          />
          <DynamicImage
            src="https://invalid-url.com/vue.svg"
            alt="Vue"
            width={60}
            height={60}
            className="rounded-lg"
            fallbackName="Vue"
            fallbackShape="square"
            fallbackSize={60}
          />
          <DynamicImage
            src="https://invalid-url.com/angular.svg"
            alt="Angular"
            width={60}
            height={60}
            className="rounded-lg"
            fallbackName="Angular"
            fallbackShape="square"
            fallbackSize={60}
          />
        </div>
      </div>

      {/* Row 3: Standalone FallbackAvatar Component */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Standalone SVG Avatars</h3>
        <div className="flex gap-4">
          <FallbackAvatar name="Portfolio" size={100} shape="circle" />
          <FallbackAvatar name="Skills" size={100} shape="square" />
          <FallbackAvatar name="Projects" size={100} shape="circle" />
          <FallbackAvatar name="About" size={100} shape="square" />
        </div>
      </div>

      {/* Row 4: Different sizes */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Different Sizes</h3>
        <div className="flex gap-4 items-center">
          <DynamicImage
            src="https://invalid-url.com/small.jpg"
            alt="Small"
            width={40}
            height={40}
            className="rounded-full"
            fallbackName="Small"
            fallbackShape="circle"
            fallbackSize={40}
          />
          <DynamicImage
            src="https://invalid-url.com/medium.jpg"
            alt="Medium"
            width={60}
            height={60}
            className="rounded-full"
            fallbackName="Medium"
            fallbackShape="circle"
            fallbackSize={60}
          />
          <DynamicImage
            src="https://invalid-url.com/large.jpg"
            alt="Large"
            width={100}
            height={100}
            className="rounded-full"
            fallbackName="Large"
            fallbackShape="circle"
            fallbackSize={100}
          />
        </div>
      </div>
    </div>
  );
};

export default ExampleFallback; 