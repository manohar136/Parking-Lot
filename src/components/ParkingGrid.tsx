import React, { useState } from 'react';
import { 
  ParkingSlot, 
  ParkedVehicle, 
  VehicleSize, 
  SIZE_CONFIGS, 
  VEHICLE_TYPE_CONFIGS,
  SlotStatus
} from '../types/parking';
import { 
  Zap, 
  Car, 
  CarFront, 
  Truck, 
  Bus, 
  Bike, 
  Gauge, 
  SlidersHorizontal,
  Plus,
  ArrowRight,
  Accessibility,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Sparkles,
  Info
} from 'lucide-react';

interface ParkingGridProps {
  slots: ParkingSlot[];
  vehicles: ParkedVehicle[];
  onSelectSlot: (slot: ParkingSlot) => void;
  onParkInSlot: (slot: ParkingSlot) => void;
  onEditVehicle: (vehicle: ParkedVehicle) => void;
  onCheckoutVehicle: (vehicle: ParkedVehicle) => void;
}

export const ParkingGrid: React.FC<ParkingGridProps> = ({
  slots,
  vehicles,
  onSelectSlot,
  onParkInSlot,
  onEditVehicle,
  onCheckoutVehicle,
}) => {
  // Extract unique floors
  const floors = Array.from(new Set(slots.map((s) => s.floor)));
  const [selectedFloor, setSelectedFloor] = useState<string>(floors[0] || 'Level 1 (Ground)');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'occupied' | 'ev'>('all');
  const [sizeFilter, setSizeFilter] = useState<'all' | VehicleSize>('all');

  // Filter slots for the active floor
  const floorSlots = slots.filter((slot) => slot.floor === selectedFloor);

  // Apply filters
  const filteredSlots = floorSlots.filter((slot) => {
    if (statusFilter === 'available' && slot.status !== 'available') return false;
    if (statusFilter === 'occupied' && slot.status !== 'occupied') return false;
    if (statusFilter === 'ev' && !slot.hasEvCharger) return false;
    if (sizeFilter !== 'all' && slot.allowedSize !== sizeFilter) return false;
    return true;
  });

  // Calculate floor stats
  const totalInFloor = floorSlots.length;
  const occupiedInFloor = floorSlots.filter((s) => s.status === 'occupied').length;
  const availableInFloor = floorSlots.filter((s) => s.status === 'available').length;
  const evSlotsInFloor = floorSlots.filter((s) => s.hasEvCharger).length;

  const getVehicleForSlot = (slot: ParkingSlot): ParkedVehicle | undefined => {
    return vehicles.find((v) => v.slotId === slot.id);
  };

  const renderVehicleIcon = (type: string) => {
    switch (type) {
      case 'electric':
        return <Zap className="h-4 w-4 text-emerald-400" />;
      case 'suv':
        return <CarFront className="h-4 w-4 text-amber-400" />;
      case 'truck':
        return <Truck className="h-4 w-4 text-orange-400" />;
      case 'van':
        return <Bus className="h-4 w-4 text-rose-400" />;
      case 'motorcycle':
        return <Bike className="h-4 w-4 text-purple-400" />;
      case 'coupe':
        return <Gauge className="h-4 w-4 text-cyan-400" />;
      default:
        return <Car className="h-4 w-4 text-sky-400" />;
    }
  };

  const formatDuration = (entryIso: string) => {
    const diffMs = Math.max(0, Date.now() - new Date(entryIso).getTime());
    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours === 0) return `${minutes}m`;
    return `${hours}h ${minutes}m`;
  };

  // Split slots into North (Top Row) and South (Bottom Row) with a driving lane in between
  const halfLength = Math.ceil(floorSlots.length / 2);
  const northSlots = floorSlots.slice(0, halfLength);
  const southSlots = floorSlots.slice(halfLength);

  return (
    <div className="space-y-6">
      {/* Floor & Filter Toolbar */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-slate-800 pb-5">
        
        {/* Floor Selection Segmented Control */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg">
          {floors.map((floor) => {
            const count = slots.filter((s) => s.floor === floor && s.status === 'occupied').length;
            const total = slots.filter((s) => s.floor === floor).length;
            const isSelected = selectedFloor === floor;

            return (
              <button
                key={floor}
                onClick={() => setSelectedFloor(floor)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-md transition-all ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <span>{floor}</span>
                <span className={`text-[11px] font-mono px-1.5 py-0.5 rounded ${
                  isSelected ? 'bg-slate-950/20 text-slate-900' : 'bg-slate-800 text-slate-400'
                }`}>
                  {count}/{total}
                </span>
              </button>
            );
          })}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status filter */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded transition-colors ${
                statusFilter === 'all' ? 'bg-slate-800 text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Bays
            </button>
            <button
              onClick={() => setStatusFilter('available')}
              className={`px-2.5 py-1 rounded transition-colors ${
                statusFilter === 'available' ? 'bg-slate-800 text-emerald-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Available ({availableInFloor})
            </button>
            <button
              onClick={() => setStatusFilter('occupied')}
              className={`px-2.5 py-1 rounded transition-colors ${
                statusFilter === 'occupied' ? 'bg-slate-800 text-amber-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Occupied ({occupiedInFloor})
            </button>
            <button
              onClick={() => setStatusFilter('ev')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors ${
                statusFilter === 'ev' ? 'bg-slate-800 text-emerald-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="h-3 w-3 text-emerald-400" />
              <span>EV Only</span>
            </button>
          </div>

          {/* Size Filter Dropdown */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>Size:</span>
            <select
              value={sizeFilter}
              onChange={(e) => setSizeFilter(e.target.value as any)}
              className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Sizes</option>
              <option value="compact">Compact (S)</option>
              <option value="standard">Standard (M)</option>
              <option value="large">Large / SUV (L)</option>
              <option value="oversized">Oversized (XL)</option>
              <option value="motorcycle">Motorcycle</option>
            </select>
          </div>
        </div>

      </div>

      {/* Floor Overview Header Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5">
        <div>
          <div className="text-xs text-slate-400">Total Bays</div>
          <div className="text-lg font-bold font-mono text-white tabular-nums">{totalInFloor}</div>
        </div>
        <div>
          <div className="text-xs text-slate-400">Occupied</div>
          <div className="text-lg font-bold font-mono text-amber-400 tabular-nums">
            {occupiedInFloor} <span className="text-xs font-normal text-slate-500">({Math.round((occupiedInFloor / totalInFloor) * 100)}%)</span>
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-400">Available</div>
          <div className="text-lg font-bold font-mono text-emerald-400 tabular-nums">{availableInFloor}</div>
        </div>
        <div>
          <div className="text-xs text-slate-400">EV Chargers</div>
          <div className="text-lg font-bold font-mono text-cyan-400 tabular-nums">{evSlotsInFloor} Bays</div>
        </div>
      </div>

      {/* Interactive 2D Parking Lot Map View */}
      <div className="relative rounded-2xl border border-slate-800 bg-slate-950 p-4 sm:p-6 shadow-2xl overflow-hidden">
        
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

        {/* Section Title */}
        <div className="relative mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <h3 className="text-sm font-semibold tracking-wide text-slate-200 uppercase font-mono">
              Bay Layout · {selectedFloor}
            </h3>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-sm bg-emerald-500/20 border border-emerald-500/60" />
              <span>Available</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-sm bg-amber-500/20 border border-amber-500/60" />
              <span>Occupied</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-sm bg-slate-800 border border-slate-700" />
              <span>Reserved/Maint</span>
            </div>
          </div>
        </div>

        {/* North Bay Row (Bay 1 to N/2) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3.5 relative z-10">
          {northSlots.map((slot) => {
            const vehicle = getVehicleForSlot(slot);
            const isMatch = filteredSlots.some((s) => s.id === slot.id);
            return (
              <SlotCard
                key={slot.id}
                slot={slot}
                vehicle={vehicle}
                isDimmed={!isMatch}
                onSelect={() => onSelectSlot(slot)}
                onPark={() => onParkInSlot(slot)}
                onEdit={() => vehicle && onEditVehicle(vehicle)}
                onCheckout={() => vehicle && onCheckoutVehicle(vehicle)}
                formatDuration={formatDuration}
                renderVehicleIcon={renderVehicleIcon}
              />
            );
          })}
        </div>

        {/* Central Driveway Lane / Asphalt Roadway */}
        <div className="relative my-7 rounded-xl bg-slate-900/90 border-y border-dashed border-slate-700/80 py-4 px-6 flex items-center justify-between text-slate-400 font-mono text-xs select-none">
          <div className="flex items-center gap-2">
            <span className="text-cyan-400 font-bold">◄ ENTRY / INBOUND</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-400">SPEED LIMIT 5 MPH</span>
          </div>

          {/* Road center dash marks */}
          <div className="hidden md:flex items-center gap-3 font-semibold text-slate-600 tracking-widest text-[11px]">
            <span>- - - - - -</span>
            <span className="text-cyan-400 font-bold">DRIVING AISLE 01</span>
            <span>- - - - - -</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">ONE WAY AISLE</span>
            <span className="text-slate-600">·</span>
            <span className="text-amber-400 font-bold">OUTBOUND / EXIT ►</span>
          </div>
        </div>

        {/* South Bay Row ((N/2 + 1) to N) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3.5 relative z-10">
          {southSlots.map((slot) => {
            const vehicle = getVehicleForSlot(slot);
            const isMatch = filteredSlots.some((s) => s.id === slot.id);
            return (
              <SlotCard
                key={slot.id}
                slot={slot}
                vehicle={vehicle}
                isDimmed={!isMatch}
                onSelect={() => onSelectSlot(slot)}
                onPark={() => onParkInSlot(slot)}
                onEdit={() => vehicle && onEditVehicle(vehicle)}
                onCheckout={() => vehicle && onCheckoutVehicle(vehicle)}
                formatDuration={formatDuration}
                renderVehicleIcon={renderVehicleIcon}
              />
            );
          })}
        </div>

      </div>

      {/* Sizing & Legend Helper Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-cyan-400 shrink-0" />
          <span>
            Bays are size-calibrated. A vehicle can park in any slot that is <strong>equal or larger</strong> than its size classification.
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-3 font-mono text-[11px]">
          <span className="text-purple-400">Motorcycle (&lt;2.2m)</span>
          <span>·</span>
          <span className="text-emerald-400">Compact (&lt;4.2m)</span>
          <span>·</span>
          <span className="text-cyan-400">Standard (&lt;4.9m)</span>
          <span>·</span>
          <span className="text-amber-400">Large SUV (&gt;5.0m)</span>
          <span>·</span>
          <span className="text-rose-400">Oversized (&gt;6.0m)</span>
        </div>
      </div>

    </div>
  );
};

interface SlotCardProps {
  slot: ParkingSlot;
  vehicle?: ParkedVehicle;
  isDimmed: boolean;
  onSelect: () => void;
  onPark: () => void;
  onEdit: () => void;
  onCheckout: () => void;
  formatDuration: (iso: string) => string;
  renderVehicleIcon: (type: string) => React.ReactNode;
}

const SlotCard: React.FC<SlotCardProps> = ({
  slot,
  vehicle,
  isDimmed,
  onSelect,
  onPark,
  onEdit,
  onCheckout,
  formatDuration,
  renderVehicleIcon,
}) => {
  const sizeConfig = SIZE_CONFIGS[slot.allowedSize];

  // Visual state styling
  const isOccupied = slot.status === 'occupied' && vehicle;
  const isAvailable = slot.status === 'available';
  const isReserved = slot.status === 'reserved';
  const isMaintenance = slot.status === 'maintenance';

  return (
    <div
      onClick={onSelect}
      className={`group relative rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between p-3 min-h-[160px] ${
        isDimmed ? 'opacity-30 pointer-events-none' : 'opacity-100'
      } ${
        isOccupied
          ? 'bg-slate-900/95 border-amber-500/40 hover:border-amber-400 shadow-lg shadow-amber-950/20'
          : isAvailable
          ? 'bg-slate-900/60 border-slate-700/60 hover:border-emerald-500/60 hover:bg-slate-850'
          : 'bg-slate-900/30 border-slate-800 cursor-default'
      }`}
    >
      {/* Top Slot Header: ID + Sizing Badge + Facilities */}
      <div className="flex items-start justify-between gap-1">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-sm font-bold text-white tracking-tight">
              {slot.id}
            </span>
            {slot.hasEvCharger && (
              <span title="Level 2 EV Charger Installed" className="text-emerald-400">
                <Zap className="h-3.5 w-3.5" />
              </span>
            )}
            {slot.isHandicap && (
              <span title="Accessible Handicap Bay" className="text-sky-400">
                <Accessibility className="h-3.5 w-3.5" />
              </span>
            )}
          </div>
          <span className="text-[10px] text-slate-400 font-mono capitalize">
            {slot.allowedSize}
          </span>
        </div>

        {/* Status indicator badge */}
        <div>
          {isOccupied && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Occupied
            </span>
          )}
          {isAvailable && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Free
            </span>
          )}
          {isReserved && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-400 border border-slate-700">
              Reserved
            </span>
          )}
          {isMaintenance && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
              Maint
            </span>
          )}
        </div>
      </div>

      {/* Middle Content: Vehicle Profile OR Free Slot Affordance */}
      <div className="my-2">
        {isOccupied && vehicle ? (
          <div className="space-y-1.5">
            {/* License Plate Banner */}
            <div className="flex items-center justify-between bg-slate-950/80 px-2 py-1 rounded border border-slate-800 font-mono">
              <span className="text-xs font-bold text-slate-100 tracking-wider">
                {vehicle.plateNumber}
              </span>
              <div 
                className="h-2.5 w-2.5 rounded-full border border-slate-700" 
                style={{ backgroundColor: vehicle.color }} 
                title={`Vehicle color: ${vehicle.color}`}
              />
            </div>

            {/* Make / Model & Vehicle Type */}
            <div className="flex items-center gap-1.5 text-xs text-slate-200 truncate">
              {renderVehicleIcon(vehicle.vehicleType)}
              <span className="truncate font-medium text-[11px]">{vehicle.makeModel}</span>
            </div>

            {/* Vehicle Type & Size Details */}
            <div className="flex items-center gap-1 text-[10px] text-slate-400">
              <span className="capitalize">{vehicle.vehicleType}</span>
              <span>·</span>
              <span className="capitalize font-mono text-cyan-400">{vehicle.vehicleSize}</span>
              {vehicle.isCharging && (
                <>
                  <span>·</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
                    <Zap className="h-2.5 w-2.5" /> Charging
                  </span>
                </>
              )}
            </div>
          </div>
        ) : isAvailable ? (
          <div className="flex flex-col items-center justify-center py-2 text-center text-slate-500">
            <span className="text-[11px] text-slate-400">
              Fits ≤ {slot.allowedSize}
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              ${sizeConfig.baseHourlyRate.toFixed(2)}/hr
            </span>
          </div>
        ) : (
          <div className="py-2 text-center text-xs text-slate-500">
            {isReserved ? 'Reserved Space' : 'Under Maintenance'}
          </div>
        )}
      </div>

      {/* Bottom Action Footer */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
        {isOccupied && vehicle ? (
          <>
            <div className="flex items-center gap-1 text-slate-400 font-mono text-[10px]">
              <Clock className="h-3 w-3" />
              <span>{formatDuration(vehicle.entryTime)}</span>
            </div>
            
            {/* Quick Actions */}
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="px-1.5 py-0.5 rounded text-[10px] font-medium text-cyan-400 hover:bg-cyan-500/10 transition-colors"
                title="Edit vehicle details, type, size or slot"
              >
                Update
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCheckout();
                }}
                className="px-1.5 py-0.5 rounded text-[10px] font-medium text-amber-400 hover:bg-amber-500/10 transition-colors"
                title="Check out and pay"
              >
                Exit
              </button>
            </div>
          </>
        ) : isAvailable ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPark();
            }}
            className="w-full py-1 text-center font-medium text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 rounded transition-colors flex items-center justify-center gap-1 text-[11px]"
          >
            <Plus className="h-3 w-3" />
            <span>Park Here</span>
          </button>
        ) : (
          <span className="text-[10px] text-slate-600 font-mono">Restricted</span>
        )}
      </div>

    </div>
  );
};
