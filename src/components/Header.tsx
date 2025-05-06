
import React from 'react';
import { Search } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="py-4 px-6 flex items-center justify-between">
      <div className="flex items-center">
        <div className="w-10 h-10 bg-accentPurple bg-opacity-20 rounded-lg flex items-center justify-center mr-3">
          <Search className="w-5 h-5 text-accentPurple" />
        </div>
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accentPurple to-accentPink">
            DocDetective
          </h1>
          <p className="text-xs text-muted-foreground">
          Pemindai Kesamaan</p>
        </div>
      </div>
      
      <div className="hidden md:flex items-center space-x-4">
        <div className="text-xs text-muted-foreground px-3 py-1 rounded-full border border-muted animate-pulse-glow">
          Corner Plagiarism
        </div>
      </div>
    </header>
  );
};

export default Header;
