import React, { useState } from 'react';
import { 
  ParkedVehicle, 
  ParkingSlot, 
  VehicleSize, 
  VehicleType, 
  SIZE_CONFIGS, 
  VEHICLE_TYPE_CONFIGS 
} from '../types/parking';
import { 
  Search, 
  Filter, 
  Car, 
  Zap, 
  Clock, 
  Edit3, 
  LogOut, 
  Download, 
  ArrowUpDown,
  CarFront,
  Truck,
  Bus,
  Bike,
  Gauge,
  Phone,
  User,
  ExternalLink
} from 'lucide-react';

interface VehicleTableProps {
  vehicles: ParkedVehicle[];
  slots: ParkingSlot[];
  onEditVehicle: (vehicle: ParkedVehicle) => void;
  onCheckoutVehicle: (vehicle: ParkedVehicle) => void;
  onSelectSlot: (slot: ParkingSlot) => void;
}

export const VehicleTable: React.FC<VehicleTableProps> = ({
  vehicles,
  slots,
  onEditVehicle,
  onCheckoutVehicle,
  onSelectSlot,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sizeFilter, setSizeFilter] = useState<'all' | VehicleSize>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | VehicleType>('all');
  const [chargingFilter, setChargingFilter] = useState<'all' | 'charging' | 'idle'>('all');
  const [sortField, setSortField] = useState<'entryTime' | 'plate' | 'size' | 'rate'>('entryTime');
  const [sortAsc, setSortAsc] = useState(false);

  // Filter logic
  const filteredVehicles = vehicles.filter((v) => {
    // Search
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      v.plateNumber.toLowerCase().includes(term) ||
      v.driverName.toLowerCase().includes(term) ||
      v.makeModel.toLowerCase().includes(term) ||
      v.slotId.toLowerCase().includes(term);

    if (!matchesSearch) return false;

    // Size filter
    if (sizeFilter !== 'all' && v.vehicleSize !== sizeFilter) return false;

    // Type filter
    if (typeFilter !== 'all' && v.vehicleType !== typeFilter) return false;

    // Charging filter
    if (chargingFilter === 'charging' && !v.isCharging) return false;
    if (chargingFilter === 'idle' && v.isCharging) return false;

    return true;
  });

  // Sort logic
  const sortedVehicles = [...filteredVehicles].sort((a, b) => {
    let comp = 0;
    if (sortField === 'entryTime') {
      comp = new Date(a.entryTime).getTime() - new Date(b.entryTime).getTime();
    } else if (sortField === 'plate') {
      comp = a.plateNumber.localeCompare(b.plateNumber);
    } else if (sortField === 'size') {
      comp = a.vehicleSize.localeCompare(b.vehicleSize);
    } else if (sortField === 'rate') {
      comp = a.hourlyRate - b.hourlyRate;
    }
    return sortAsc ? comp : -comp;
  });

  const formatDuration = (entryIso: string) => {
    const diffMs = Math.max(0, Date.now() - new Date(entryIso).getTime());
    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours === 0) return `${minutes}m`;
    return `${hours}h ${minutes}m`;
  };

  const calculateAccruedCost = (vehicle: ParkedVehicle) => {
    const diffHours = Math.max(1, (Date.now() - new Date(vehicle.entryTime).getTime()) / (1000 * 60 * 60));
    return (diffHours * vehicle.hourlyRate).toFixed(2);
  };

  const renderVehicleIcon = (type: string) => {
    switch (type) {
      case 'electric': return <Zap className="h-4 w-4 text-emerald-400" />;
      case 'suv': return <CarFront className="h-4 w-4 text-amber-400" />;
      case 'truck': return <Truck className="h-4 w-4 text-orange-400" />;
      case 'van': return <Bus className="h-4 w-4 text-rose-400" />;
      case 'motorcycle': return <Bike className="h-4 w-4 text-purple-400" />;
      case 'coupe': return <Gauge className="h-4 w-4 text-cyan-400" />;
      default: return <Car className="h-4 w-4 text-sky-400" />;
    }
  };

  const handleExportCSV = () => {
    const headers = ['Plate', 'Model', 'Type', 'Size', 'Slot', 'Driver', 'Phone', 'EntryTime', 'HourlyRate', 'Charging', 'Notes'];
    const rows = vehicles.map(v => [
      v.plateNumber,
      `"${v.makeModel}"`,
      v.vehicleType,
      v.vehicleSize,
      v.slotId,
      `"${v.driverName}"`,
      v.driverPhone,
      v.entryTime,
      v.hourlyRate,
      v.isCharging ? 'YES' : 'NO',
      `"${v.notes || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `parkgrid_vehicles_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5">
      {/* Search and Filters Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-slate-800 pb-5">
        
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search license plate, model, driver, or slot..."
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
          />
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Size Filter */}
          <select
            value={sizeFilter}
            onChange={(e) => setSizeFilter(e.target.value as any)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-400"
          >
            <option value="all">All Sizes</option>
            <option value="compact">Compact (S)</option>
            <option value="standard">Standard (M)</option>
            <option value="large">Large / SUV (L)</option>
            <option value="oversized">Oversized (XL)</option>
            <option value="motorcycle">Motorcycle</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-400"
          >
            <option value="all">All Vehicle Types</option>
            <option value="sedan">Sedan</option>
            <option value="suv">SUV</option>
            <option value="electric">Electric (EV)</option>
            <option value="truck">Pickup / Truck</option>
            <option value="van">Van / Shuttle</option>
            <option value="hatchback">Hatchback</option>
            <option value="motorcycle">Motorcycle</option>
            <option value="coupe">Coupe</option>
          </select>

          {/* EV Charging Filter */}
          <select
            value={chargingFilter}
            onChange={(e) => setChargingFilter(e.target.value as any)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-400"
          >
            <option value="all">All Charging Status</option>
            <option value="charging">⚡ Actively Charging</option>
            <option value="idle">Non-charging</option>
          </select>

          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Download className="h-3.5 w-3.5 text-cyan-400" />
            <span>Export CSV</span>
          </button>
        </div>

      </div>

      {/* Results Header Count */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <div>
          Showing <span className="font-mono font-semibold text-white">{sortedVehicles.length}</span> of{' '}
          <span className="font-mono text-slate-300">{vehicles.length}</span> parked vehicles
        </div>
        <div className="flex items-center gap-2">
          <span>Sort by:</span>
          <button
            onClick={() => {
              if (sortField === 'entryTime') setSortAsc(!sortAsc);
              else { setSortField('entryTime'); setSortAsc(false); }
            }}
            className={`font-mono px-2 py-1 rounded transition-colors ${
              sortField === 'entryTime' ? 'bg-slate-800 text-cyan-400' : 'hover:text-slate-200'
            }`}
          >
            Entry Time {sortField === 'entryTime' && (sortAsc ? '↑' : '↓')}
          </button>
          <button
            onClick={() => {
              if (sortField === 'size') setSortAsc(!sortAsc);
              else { setSortField('size'); setSortAsc(true); }
            }}
            className={`font-mono px-2 py-1 rounded transition-colors ${
              sortField === 'size' ? 'bg-slate-800 text-cyan-400' : 'hover:text-slate-200'
            }`}
          >
            Size {sortField === 'size' && (sortAsc ? '↑' : '↓')}
          </button>
          <button
            onClick={() => {
              if (sortField === 'rate') setSortAsc(!sortAsc);
              else { setSortField('rate'); setSortAsc(false); }
            }}
            className={`font-mono px-2 py-1 rounded transition-colors ${
              sortField === 'rate' ? 'bg-slate-800 text-cyan-400' : 'hover:text-slate-200'
            }`}
          >
            Rate {sortField === 'rate' && (sortAsc ? '↑' : '↓')}
          </button>
        </div>
      </div>

      {/* High Density Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/80 text-xs uppercase font-mono tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-4 py-3.5">Vehicle & Plate</th>
                <th className="px-4 py-3.5">Type & Size</th>
                <th className="px-4 py-3.5">Assigned Bay</th>
                <th className="px-4 py-3.5">Driver Contact</th>
                <th className="px-4 py-3.5">Duration</th>
                <th className="px-4 py-3.5 text-right">Rate & Accrued</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {sortedVehicles.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-500">
                    <Car className="h-8 w-8 mx-auto mb-2 text-slate-600" />
                    <div>No vehicles match the selected criteria.</div>
                  </td>
                </tr>
              ) : (
                sortedVehicles.map((vehicle) => {
                  const sizeConfig = SIZE_CONFIGS[vehicle.vehicleSize];
                  const slot = slots.find((s) => s.id === vehicle.slotId);

                  return (
                    <tr 
                      key={vehicle.id}
                      className="hover:bg-slate-850 transition-colors group"
                    >
                      {/* Vehicle & Plate */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div 
                            className="h-3.5 w-3.5 rounded-full border border-slate-700 shrink-0 shadow-sm"
                            style={{ backgroundColor: vehicle.color }}
                            title={`Color code: ${vehicle.color}`}
                          />
                          <div>
                            <div className="font-mono font-bold text-white text-sm tracking-wider">
                              {vehicle.plateNumber}
                            </div>
                            <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                              {renderVehicleIcon(vehicle.vehicleType)}
                              <span>{vehicle.makeModel}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Type & Size */}
                      <td className="px-4 py-3.5">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium border ${sizeConfig?.badgeColor}`}>
                              {vehicle.vehicleSize.toUpperCase()}
                            </span>
                            {vehicle.isCharging && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                                <Zap className="h-3 w-3" /> EV Plug
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-400 capitalize">
                            {vehicle.vehicleType} · {sizeConfig?.dimensions}
                          </div>
                        </div>
                      </td>

                      {/* Assigned Bay */}
                      <td className="px-4 py-3.5">
                        <button
                          onClick={() => slot && onSelectSlot(slot)}
                          className="group/bay flex items-center gap-2 text-left hover:text-cyan-400 transition-colors"
                        >
                          <span className="font-mono font-bold text-sm text-cyan-300 group-hover/bay:underline">
                            {vehicle.slotId}
                          </span>
                          <span className="text-xs text-slate-400 font-sans">
                            ({slot?.floor.split(' ')[0]})
                          </span>
                        </button>
                        {vehicle.notes && (
                          <div className="text-[11px] text-slate-500 truncate max-w-[180px]" title={vehicle.notes}>
                            Note: {vehicle.notes}
                          </div>
                        )}
                      </td>

                      {/* Driver Contact */}
                      <td className="px-4 py-3.5">
                        <div className="text-xs">
                          <div className="font-medium text-slate-200 flex items-center gap-1">
                            <User className="h-3 w-3 text-slate-500" />
                            <span>{vehicle.driverName}</span>
                          </div>
                          {vehicle.driverPhone && (
                            <div className="text-slate-400 font-mono text-[11px] flex items-center gap-1 mt-0.5">
                              <Phone className="h-3 w-3 text-slate-500" />
                              <span>{vehicle.driverPhone}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Duration */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5 font-mono text-xs text-slate-300 tabular-nums">
                          <Clock className="h-3.5 w-3.5 text-slate-400" />
                          <span>{formatDuration(vehicle.entryTime)}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                          Since {new Date(vehicle.entryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>

                      {/* Rate & Accrued */}
                      <td className="px-4 py-3.5 text-right font-mono tabular-nums">
                        <div className="text-sm font-bold text-emerald-400">
                          ${calculateAccruedCost(vehicle)}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          ${vehicle.hourlyRate.toFixed(2)}/hr
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Update Vehicle Button */}
                          <button
                            onClick={() => onEditVehicle(vehicle)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 hover:bg-cyan-500/20 transition-colors"
                            title="Update vehicle type, size, bay, or driver info"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                            <span>Update</span>
                          </button>

                          {/* Checkout Button */}
                          <button
                            onClick={() => onCheckoutVehicle(vehicle)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-colors"
                            title="Check out vehicle & release bay"
                          >
                            <LogOut className="h-3.5 w-3.5" />
                            <span>Exit</span>
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
