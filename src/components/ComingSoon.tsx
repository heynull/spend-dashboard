import React from 'react';

/**
 * Props for the ComingSoon component
 */
interface ComingSoonProps {
  /** Name of the page to display */
  pageName: string;
}

/**
 * ComingSoon component - renders a centered placeholder for pages under construction
 * Features a subtle animated pulse effect and matches the dashboard aesthetic
 */
export const ComingSoon: React.FC<ComingSoonProps> = ({ pageName }) => {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="text-center space-y-6">
        {/* Pulse animation container */}
        <div className="flex justify-center mb-8">
          <div className="relative w-24 h-24">
            {/* Outer pulse circle */}
            <div
              className="absolute inset-0 bg-blue-100 rounded-full opacity-0"
              style={{
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              }}
            />
            {/* Inner circle */}
            <div className="absolute inset-2 bg-blue-50 rounded-full border-2 border-blue-200 flex items-center justify-center">
              <span className="text-2xl">🚀</span>
            </div>
          </div>
        </div>

        {/* Heading */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">{pageName}</h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            This section is under construction. Check back soon for updates!
          </p>
        </div>

        {/* Decorative dots */}
        <div className="flex justify-center gap-1 pt-4">
          <div className="w-2 h-2 bg-gray-300 rounded-full" />
          <div
            className="w-2 h-2 bg-blue-300 rounded-full"
            style={{
              animation: 'pulse 1.5s infinite 0.2s',
            }}
          />
          <div
            className="w-2 h-2 bg-gray-300 rounded-full"
            style={{
              animation: 'pulse 1.5s infinite 0.4s',
            }}
          />
        </div>
      </div>

      {/* Inject CSS animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default ComingSoon;
