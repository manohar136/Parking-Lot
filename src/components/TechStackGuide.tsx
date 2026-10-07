import React, { useState } from 'react';
import { 
  Code2, 
  Cpu, 
  Terminal, 
  Layers, 
  Package, 
  Server, 
  CheckCircle2, 
  ExternalLink,
  Zap,
  ShieldCheck,
  Sparkles,
  Database,
  Palette,
  FileCode2,
  Workflow
} from 'lucide-react';

interface TechItem {
  id: string;
  name: string;
  category: 'Framework & Language' | 'Styling & Design' | 'Animation & UI' | 'Build & Runtime' | 'Storage & State';
  version: string;
  role: string;
  description: string;
  features: string[];
  codeSnippet: string;
}

const TECHNOLOGIES: TechItem[] = [
  {
    id: 'react',
    name: 'React',
    category: 'Framework & Language',
    version: 'v19.0.1',
    role: 'Core Frontend UI Framework',
    description: 'Powers the reactive component hierarchy, interactive parking bay map, vehicle registration forms, and live occupancy calculation.',
    features: [
      'Concurrent rendering with React 19 architecture',
      'Reactive state management via useState, useEffect, and useMemo',
      'Modular component separation (Floor Map, Slot Inspector, Table, Billing)',
      'Zero-delay optimistic UI updates for instant parking slot toggling'
    ],
    codeSnippet: `// React 19 State & Slot Allocation Flow
const [slots, setSlots] = useState<ParkingSlot[]>(getStoredSlots);
const [vehicles, setVehicles] = useState<ParkedVehicle[]>(getStoredVehicles);

const handleParkVehicle = (newVehicle: ParkedVehicle, slotId: string) => {
  setSlots(prev => prev.map(s => s.id === slotId ? { ...s, status: 'occupied' } : s));
  setVehicles(prev => [newVehicle, ...prev]);
};`
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    category: 'Framework & Language',
    version: 'v7.0.2',
    role: 'Static Type Checking & Domain Modeling',
    description: 'Enforces strict data contracts for vehicles, sizing tiers (Compact, Standard, Large, Oversized), slot states, and pricing matrices.',
    features: [
      'Strict union types for VehicleSize and VehicleType',
      'Exhaustive pattern matching and type narrowing',
      'Interface contracts for ParkingSlot and ParkedVehicle',
      'Compile-time safety eliminating runtime undefined bugs'
    ],
    codeSnippet: `export type VehicleSize = 'motorcycle' | 'compact' | 'standard' | 'large' | 'oversized';
export type VehicleType = 'sedan' | 'suv' | 'hatchback' | 'electric' | 'motorcycle' | 'truck' | 'van' | 'coupe';

export interface ParkedVehicle {
  id: string;
  plateNumber: string;
  driverName: string;
  vehicleType: VehicleType;
  vehicleSize: VehicleSize;
  slotId: string;
  entryTime: string;
  hourlyRate: number;
}`
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    category: 'Styling & Design',
    version: 'v4.3.3 (@tailwindcss/vite)',
    role: 'Modern Utility-First Design Engine',
    description: 'Provides high-contrast dark industrial palette, custom parking bay grid layouts, tabular typography, and responsive breakpoints.',
    features: [
      'Tailwind CSS v4 native CSS-first engine with lightning compilation',
      'Tabular figures formatting (tabular-nums) for monetary and duration alignment',
      'Custom parking lot asphalt and boundary markings with CSS grids',
      'WCAG AA accessible contrast for all bay status states'
    ],
    codeSnippet: `// Tailwind CSS v4 Parking Stall Grid & Asphalt Lane
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3.5">
  {slots.map(slot => (
    <div className="rounded-xl border border-slate-700/60 bg-slate-900/95 p-3">
      <span className="font-mono text-sm font-bold text-white tabular-nums">
        {slot.id}
      </span>
    </div>
  ))}
</div>`
  },
  {
    id: 'lucide',
    name: 'Lucide React',
    category: 'Animation & UI',
    version: 'v0.546.0',
    role: 'High-Resolution Vector Iconography',
    description: 'Provides domain-specific vehicle icons (Sedan, SUV, Pickup, Van, Motorcycle), charging status badges, and parking action glyphs.',
    features: [
      'Pixel-crisp 24px/16px SVG glyphs tailored for automotive operations',
      'Zero layout shift tree-shaken SVG icon components',
      'Consistent stroke width and visual harmony across controls'
    ],
    codeSnippet: `import { Car, Zap, Truck, Bus, Bike, Gauge, MapPin, Receipt } from 'lucide-react';

const renderIcon = (type: VehicleType) => {
  switch (type) {
    case 'electric': return <Zap className="h-4 w-4 text-emerald-400" />;
    case 'suv': return <CarFront className="h-4 w-4 text-amber-400" />;
    case 'truck': return <Truck className="h-4 w-4 text-orange-400" />;
    case 'van': return <Bus className="h-4 w-4 text-rose-400" />;
  }
};`
  },
  {
    id: 'motion',
    name: 'Motion (motion/react)',
    category: 'Animation & UI',
    version: 'v12.23.24',
    role: 'Fluid Micro-Interactions & Transitions',
    description: 'Supplies hardware-accelerated transforms for modal dialogs, bay status changes, and filter transitions.',
    features: [
      'Spring physics and cubic-bezier easing for natural feel',
      'GPU compositor-only animations (opacity, transform) preventing layout thrashing',
      'Reduced-motion awareness'
    ],
    codeSnippet: `// Smooth spring transition for slot inspection and checkout modals
<div className="transition-all duration-200 cubic-bezier(0.16, 1, 0.3, 1)">
  {/* Modal dialog with backdrop blur & scale enter */}
</div>`
  },
  {
    id: 'localstorage',
    name: 'Browser LocalStorage Engine',
    category: 'Storage & State',
    version: 'Web Standard',
    role: 'Client-Authoritative Persistence Layer',
    description: 'Ensures that all parked vehicles, customized slots, pricing parameters, and checkout history persist seamlessly across browser sessions.',
    features: [
      'Synchronous fault-tolerant serialization with fallback defaults',
      'Seed dataset with realistic sample vehicles across 3 levels',
      'One-click factory reset utility'
    ],
    codeSnippet: `export function saveVehicles(vehicles: ParkedVehicle[]) {
  localStorage.setItem('parkgrid_vehicles_v1', JSON.stringify(vehicles));
}

export function getStoredVehicles(): ParkedVehicle[] {
  const data = localStorage.getItem('parkgrid_vehicles_v1');
  return data ? JSON.parse(data) : INITIAL_VEHICLES;
}`
  },
  {
    id: 'vite',
    name: 'Vite 8',
    category: 'Build & Runtime',
    version: 'v8.3.0',
    role: 'Next-Generation Build & Dev Tooling',
    description: 'Instant dev server startup using native ES modules and Rollup-based tree-shaking production bundler.',
    features: [
      'Sub-millisecond ES modules resolution in development',
      'Integrated @tailwindcss/vite plugin for instantaneous style compilation',
      'Optimized chunk splitting and minification for production deployment'
    ],
    codeSnippet: `// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
});`
  },
  {
    id: 'express-node',
    name: 'Node.js & Express / tsx',
    category: 'Build & Runtime',
    version: 'Node 22 LTS / Express 4.21.2',
    role: 'Server Runtime & Execution Environment',
    description: 'Powers full-stack deployment capability, API proxy routes, and continuous Cloud Run container hosting on Port 3000.',
    features: [
      'Modern TypeScript execution using tsx runner',
      'Environment variable abstraction via dotenv',
      'Production HTTP static asset serving'
    ],
    codeSnippet: `// package.json runtime & scripts
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "start": "node server.ts"
}`
  }
];

const TOOLS_LIST = [
  {
    name: 'Vite Bundler & Dev Server',
    type: 'Build Tool',
    purpose: 'Compiles TypeScript, JSX, and CSS at lightning speed with native ES module imports.',
  },
  {
    name: 'tsx (TypeScript Execute)',
    type: 'Runtime Tool',
    purpose: 'Executes TypeScript files directly in Node.js without ahead-of-time manual transpilation.',
  },
  {
    name: 'Tailwind CSS v4 Engine',
    type: 'Styling Tool',
    purpose: 'Processes high-performance utility classes and variables directly inside Vite pipeline.',
  },
  {
    name: 'npm Package Manager',
    type: 'Dependency Management',
    purpose: 'Manages strict semantic versioning for all production and development dependencies.',
  },
  {
    name: 'Google AI Studio Cloud Container',
    type: 'Hosting & Platform',
    purpose: 'Sandboxed Linux container platform running Node.js runtime and dev server on Port 3000.',
  },
  {
    name: 'Chrome / Modern Browser DevTools',
    type: 'Inspection & Debugging',
    purpose: 'Validates responsive breakpoints, local storage states, and WCAG AA contrast ratios.',
  }
];

export const TechStackGuide: React.FC = () => {
  const [selectedTech, setSelectedTech] = useState<TechItem>(TECHNOLOGIES[0]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 h-64 w-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
            <Cpu className="h-3.5 w-3.5" />
            <span>Architecture & Technology Stack</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Technologies & Tools Powering ParkGrid
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            A comprehensive overview of the modern web technologies, libraries, build tools, and architectural patterns engineered to build this interactive parking lot management application.
          </p>
        </div>
      </div>

      {/* Grid: Interactive Technology Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Tech List */}
        <div className="lg:col-span-5 space-y-2.5">
          <h3 className="text-xs font-bold uppercase font-mono tracking-wider text-slate-400 mb-3 flex items-center gap-2">
            <Layers className="h-4 w-4 text-cyan-400" />
            <span>Technologies Used ({TECHNOLOGIES.length})</span>
          </h3>

          <div className="space-y-2">
            {TECHNOLOGIES.map((tech) => {
              const isSelected = selectedTech.id === tech.id;
              return (
                <button
                  key={tech.id}
                  onClick={() => setSelectedTech(tech)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'bg-cyan-500/10 border-cyan-400 shadow-md ring-1 ring-cyan-500/20'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{tech.name}</span>
                      <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded">
                        {tech.version}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1 line-clamp-1">
                      {tech.role}
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 shrink-0">
                    {tech.category}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Deep-Dive for Selected Tech */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-5 shadow-xl sticky top-24">
            
            {/* Header of selected tech */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <h4 className="text-xl font-bold text-white">{selectedTech.name}</h4>
                  <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-500/15 border border-cyan-500/30 px-2 py-0.5 rounded">
                    {selectedTech.version}
                  </span>
                </div>
                <div className="text-xs font-semibold text-slate-400 mt-1">
                  {selectedTech.role} · <span className="text-cyan-400">{selectedTech.category}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-slate-300 leading-relaxed">
              {selectedTech.description}
            </p>

            {/* Key Architectural Features */}
            <div className="space-y-2">
              <h5 className="text-xs font-bold uppercase font-mono tracking-wider text-slate-400">
                Key Implementation Highlights:
              </h5>
              <div className="space-y-2">
                {selectedTech.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Source Code Example */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1.5">
                  <FileCode2 className="h-3.5 w-3.5 text-cyan-400" />
                  Code Implementation Snippet
                </span>
                <span className="text-[11px] text-slate-500">TypeScript / React</span>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-cyan-300/90 overflow-x-auto leading-relaxed shadow-inner">
                <pre>{selectedTech.codeSnippet}</pre>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Tools & Developer Environment Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase font-mono tracking-wider text-slate-400 flex items-center gap-2">
          <Terminal className="h-4 w-4 text-cyan-400" />
          <span>Tools & Runtime Environment Used</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOOLS_LIST.map((tool, idx) => (
            <div 
              key={idx}
              className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-white">{tool.name}</span>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                  {tool.type}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {tool.purpose}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Domain Logic & Compatibility Architecture */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
        <div className="flex items-center gap-2">
          <Workflow className="h-5 w-5 text-cyan-400" />
          <h3 className="text-base font-bold text-white">System Architecture & Slot Allocation Logic</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-1">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
            <div className="font-bold text-cyan-300 font-mono text-xs">
              1. Sizing Classification Rule
            </div>
            <p className="text-slate-400 leading-relaxed">
              Every bay enforces an allowed maximum size (<code className="text-white font-mono">motorcycle &lt; compact &lt; standard &lt; large &lt; oversized</code>). Vehicles can park in any slot that is equal or larger than their body profile.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
            <div className="font-bold text-cyan-300 font-mono text-xs">
              2. Real-Time Billing & Duration
            </div>
            <p className="text-slate-400 leading-relaxed">
              Durations are calculated dynamically against the vehicle entry timestamp ISO string. Base hourly rate is determined by vehicle size, plus an optional Level 2 EV charging surcharge (+$2.50/hr).
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
            <div className="font-bold text-cyan-300 font-mono text-xs">
              3. Relocation & Instant State Sync
            </div>
            <p className="text-slate-400 leading-relaxed">
              Parked vehicles can be modified at any point: updating classification (type & size), moving to another compatible bay, or checking out with itemized municipal tax calculation.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
