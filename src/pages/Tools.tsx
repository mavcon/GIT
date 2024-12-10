import React, { useState } from 'react';
import Timer from '../components/tools/Timer';

const Tools: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState<string | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <h1 className="text-xl font-bold mb-4">BJJ Tools</h1>

      {/* Tool Selection Buttons */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveComponent('timer')}
          className={`px-6 py-2 rounded-lg font-semibold ${
            activeComponent === 'timer'
              ? 'bg-blue-600 text-white'
              : 'bg-blue-100 hover:bg-blue-200 text-blue-800'
          }`}
        >
          Tournament Timer
        </button>
        <button
          onClick={() => setActiveComponent('scoring')}
          className={`px-6 py-2 rounded-lg font-semibold ${
            activeComponent === 'scoring'
              ? 'bg-blue-600 text-white'
              : 'bg-blue-100 hover:bg-blue-200 text-blue-800'
          }`}
        >
          Scoring System
        </button>
      </div>

      {/* Active Component Display */}
      <div className="bg-base-200 rounded-lg p-6">
        {activeComponent === 'timer' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Tournament Timer</h2>
            <Timer />
          </div>
        )}
        {activeComponent === 'scoring' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Scoring System</h2>
            <p>Scoring system coming soon...</p>
          </div>
        )}
        {!activeComponent && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Select a Tool</h2>
            <p>Please select one of the tools above to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tools;
