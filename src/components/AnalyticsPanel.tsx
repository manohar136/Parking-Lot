import React from 'react';
import { 
  ParkingSlot, 
  ParkedVehicle, 
  CompletedSession, 
  SIZE_CONFIGS, 
  VehicleSize,
  VEHICLE_TYPE_CONFIGS
} from '../types/parking';
import { 
  BarChart3, 
  DollarSign, 
  Car, 
  Zap, 
  Clock, 
  TrendingUp, 
  ShieldCheck, 
  CheckCircle2,
  Calendar,
  Layers
} from 'lucide-react';

interface AnalyticsPanelProps {
  slots: ParkingSlot[];
  vehicles: ParkedVehicle[];
  history: CompletedSession[];
}

export const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({
  slots,
  vehicles,
  history,
}) => {
  const totalSlots = slots.length;
  const totalOccupied = vehicles.length;
  const occupancyRate = Math.round((totalOccupied / totalSlots) * 100);

  // Revenue calculation
  const totalCollectedToday = history.reduce((sum, item) => sum + item.totalPaid, 0);
  
  const estimatedActiveAccrued = vehicles.reduce((sum, v) => {
    const hours = Math.max(1, (Date.now() - new Date(v.entryTime).getTime()) / (1000 * 60 * 60));
    return sum + (hours * v.hourlyRate);
  }, 0);

  // Sizing breakdown of parked vehicles
  const sizeCounts: Record<VehicleSize, number> = {
    motorcycle: vehicles.filter((v) => v.vehicleSize === 'motorcycle').length,
    compact: vehicles.filter((v) => v.vehicleSize === 'compact').length,
    standard: vehicles.filter((v) => v.vehicleSize === 'standard').length,
    large: vehicles.filter((v) => v.vehicleSize === 'large').length,
    oversized: vehicles.filter((v) => v.vehicleSize === 'oversized').length,
  };

  // EV charging count
  const activeEvCharging = vehicles.filter((v) => v.isCharging).length;
  const totalEvSlots = slots.filter((s) => s.hasEvCharger).length;

  return (
    <div className="space-y-6">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Occupancy Card */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Overall Occupancy</span>
            <Car className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white tabular-nums">
              {occupancyRate}%
            </span>
            <span className="text-xs font-mono text-slate-400">
              ({totalOccupied}/{totalSlots} Bays)
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
            <div 
              className="bg-cyan-400 h-1.5 rounded-full transition-all duration-500" 
              style={{ width: `${occupancyRate}%` }}
            />
          </div>
        </div>

        {/* Revenue Today */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Collected Today</span>
            <DollarSign className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
            ${totalCollectedToday.toFixed(2)}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            From <span className="font-mono text-slate-200">{history.length}</span> checked out sessions
          </div>
        </div>

        {/* Active Accrual */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Active Accrued Value</span>
            <TrendingUp className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400 tabular-nums">
            ${estimatedActiveAccrued.toFixed(2)}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Accruing from currently parked cars
          </div>
        </div>

        {/* EV Stations Utilization */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>EV Charging Bays</span>
            <Zap className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white tabular-nums">
              {activeEvCharging} / {totalEvSlots}
            </span>
            <span className="text-xs text-emerald-400 font-mono">Active</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
            <div 
              className="bg-emerald-400 h-1.5 rounded-full transition-all duration-500" 
              style={{ width: `${totalEvSlots > 0 ? (activeEvCharging / totalEvSlots) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Grid: Vehicle Size Breakdown & Parking Rates Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Breakdown by Vehicle Size */}
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white uppercase font-mono tracking-wider flex items-center gap-2">
              <Layers className="h-4 w-4 text-cyan-400" />
              <span>Vehicles Parked by Size Class</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">{totalOccupied} Total</span>
          </div>

          <div className="space-y-3 pt-2">
            {(Object.keys(sizeCounts) as VehicleSize[]).map((size) => {
              const count = sizeCounts[size];
              const pct = totalOccupied > 0 ? Math.round((count / totalOccupied) * 100) : 0;
              const config = SIZE_CONFIGS[size];

              return (
                <div key={size} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium capitalize">
                      {size} ({config.dimensions})
                    </span>
                    <span className="font-mono text-slate-400">
                      <strong className="text-white font-bold">{count}</strong> vehicles ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800/80">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        size === 'motorcycle' ? 'bg-purple-500' :
                        size === 'compact' ? 'bg-emerald-500' :
                        size === 'standard' ? 'bg-cyan-500' :
                        size === 'large' ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pricing & Sizing Rules Matrix */}
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white uppercase font-mono tracking-wider flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-emerald-400" />
              <span>Lot Pricing & Sizing Matrix</span>
            </h3>
            <span className="text-xs text-slate-400">Hourly Rates</span>
          </div>

          <div className="overflow-x-auto pt-1">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <tr>
                  <th className="pb-2">Size Class</th>
                  <th className="pb-2">Dimensions</th>
                  <th className="pb-2">Examples</th>
                  <th className="pb-2 text-right">Base Hourly</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                <tr>
                  <td className="py-2.5 font-semibold text-purple-400">Motorcycle</td>
                  <td className="py-2.5 text-slate-400">1.2m x 2.5m</td>
                  <td className="py-2.5 text-slate-300 font-sans">Bikes, mopeds, scooters</td>
                  <td className="py-2.5 text-right font-bold text-white">$2.50 / hr</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-semibold text-emerald-400">Compact (S)</td>
                  <td className="py-2.5 text-slate-400">2.3m x 4.5m</td>
                  <td className="py-2.5 text-slate-300 font-sans">Hatchbacks, mini EVs</td>
                  <td className="py-2.5 text-right font-bold text-white">$4.00 / hr</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-semibold text-cyan-400">Standard (M)</td>
                  <td className="py-2.5 text-slate-400">2.5m x 5.0m</td>
                  <td className="py-2.5 text-slate-300 font-sans">Sedans, compact crossovers</td>
                  <td className="py-2.5 text-right font-bold text-white">$6.00 / hr</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-semibold text-amber-400">Large (L)</td>
                  <td className="py-2.5 text-slate-400">2.8m x 5.5m</td>
                  <td className="py-2.5 text-slate-300 font-sans">SUVs, full-size trucks</td>
                  <td className="py-2.5 text-right font-bold text-white">$8.50 / hr</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-semibold text-rose-400">Oversized (XL)</td>
                  <td className="py-2.5 text-slate-400">3.2m x 7.0m</td>
                  <td className="py-2.5 text-slate-300 font-sans">Delivery vans, shuttles</td>
                  <td className="py-2.5 text-right font-bold text-white">$12.00 / hr</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-sans">
              <Zap className="h-3.5 w-3.5" /> Level 2 Electric Vehicle Charging Addon
            </span>
            <span className="font-mono font-bold">+$2.50 / hr</span>
          </div>
        </div>

      </div>

      {/* Exit History Log */}
      <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white uppercase font-mono tracking-wider flex items-center gap-2">
            <Clock className="h-4 w-4 text-cyan-400" />
            <span>Recent Completed Sessions Log</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">{history.length} Exited Records</span>
        </div>

        {history.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            No completed parking sessions yet today. Checked-out vehicles will appear here.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <tr>
                  <th className="pb-2">Plate</th>
                  <th className="pb-2">Vehicle</th>
                  <th className="pb-2">Size</th>
                  <th className="pb-2">Bay</th>
                  <th className="pb-2">Parked Duration</th>
                  <th className="pb-2 text-right">Fee Paid</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {history.slice(0, 10).map((hist) => (
                  <tr key={hist.id} className="hover:bg-slate-850">
                    <td className="py-2.5 font-mono font-bold text-white">{hist.plateNumber}</td>
                    <td className="py-2.5 text-slate-300">{hist.makeModel}</td>
                    <td className="py-2.5 capitalize font-mono text-cyan-400">{hist.vehicleSize}</td>
                    <td className="py-2.5 font-mono text-slate-400">{hist.slotId}</td>
                    <td className="py-2.5 font-mono text-slate-300">
                      {Math.floor(hist.durationMinutes / 60)}h {hist.durationMinutes % 60}m
                    </td>
                    <td className="py-2.5 text-right font-mono font-bold text-emerald-400">
                      ${hist.totalPaid.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
