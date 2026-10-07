import React from 'react';
import { 
  SquarePlus, 
  MapPin, 
  Car, 
  BarChart3, 
  Layers, 
  RotateCcw, 
  Sparkles,
  Zap
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'map' | 'vehicles' | 'analytics' | 'tech';
  setActiveTab: (tab: 'map' | 'vehicles' | 'analytics' | 'tech') => void;
  onOpenParkModal: () => void;
  onQuickSimulate: () => void;
  onResetLot: () => void;
  totalOccupied: number;
  totalSlots: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenParkModal,
  onQuickSimulate,
  onResetLot,
  totalOccupied,
  totalSlots,
}) => {
  const occupancyPercent = Math.round((totalOccupied / totalSlots) * 100);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveTab('map')}
            className="group flex items-center gap-2.5 text-left focus:outline-none"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 group-hover:border-cyan-400 transition-colors">
              <span className="font-mono text-base font-black tracking-tighter">P</span>
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                ParkGrid
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs text-slate-400 font-mono">
                v2.4
              </span>
            </div>
          </button>

          {/* Live capacity status badge */}
          <div className="hidden md:flex items-center gap-2 pl-4 border-l border-slate-800 text-xs">
            <span className="text-slate-400">Lot Capacity:</span>
            <span className="font-mono font-semibold text-cyan-300 tabular-nums">
              {totalOccupied} / {totalSlots}
            </span>
            <span className="text-slate-500">·</span>
            <span className={`font-mono text-xs ${occupancyPercent > 85 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {occupancyPercent}% Occupied
            </span>
          </div>
        </div>

        {/* Zone 2: 4 Clean text navigation links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('map')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${
              activeTab === 'map'
                ? 'bg-slate-800 text-cyan-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <MapPin className="h-4 w-4" />
            <span>Floor Map</span>
          </button>

          <button
            onClick={() => setActiveTab('vehicles')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${
              activeTab === 'vehicles'
                ? 'bg-slate-800 text-cyan-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Car className="h-4 w-4" />
            <span>Parked Vehicles</span>
            <span className="ml-1 rounded bg-slate-700/60 px-1.5 py-0.2 text-[10px] font-mono text-slate-300">
              {totalOccupied}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${
              activeTab === 'analytics'
                ? 'bg-slate-800 text-cyan-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Lot Analytics</span>
            <span className="sm:hidden">Stats</span>
          </button>

          <button
            onClick={() => setActiveTab('tech')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${
              activeTab === 'tech'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Layers className="h-4 w-4 text-cyan-400" />
            <span>Tech & Tools</span>
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2">
          {/* Quick random vehicle entry simulation */}
          <button
            onClick={onQuickSimulate}
            title="Simulate a new vehicle entry randomly"
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-300 bg-slate-900 border border-slate-700/60 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Simulate Entry</span>
          </button>

          {/* Reset button */}
          <button
            onClick={onResetLot}
            title="Reset lot to initial sample dataset"
            className="hidden xl:flex items-center gap-1 px-2 py-1.5 rounded-md text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>

          {/* Park Vehicle Button */}
          <button
            onClick={onOpenParkModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-md transition-colors shadow-sm shadow-cyan-500/20 whitespace-nowrap"
          >
            <SquarePlus className="h-4 w-4" />
            <span>Park Vehicle</span>
          </button>
        </div>

      </div>
    </header>
  );
};
