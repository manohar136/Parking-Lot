import React, { useState } from 'react';
import { 
  ParkingSlot, 
  ParkedVehicle, 
  SIZE_CONFIGS, 
  VEHICLE_TYPE_CONFIGS 
} from '../types/parking';
import { isSizeCompatible } from '../utils/storage';
import { 
  X, 
  Zap, 
  Accessibility, 
  Car, 
  Clock, 
  DollarSign, 
  Edit3, 
  LogOut, 
  ArrowRightLeft, 
  Plus, 
  ShieldAlert,
  User,
  Phone,
  FileText
} from 'lucide-react';

interface SlotDetailModalProps {
  slot: ParkingSlot | null;
  vehicle?: ParkedVehicle;
  allSlots: ParkingSlot[];
  onClose: () => void;
  onEditVehicle: (vehicle: ParkedVehicle) => void;
  onCheckoutVehicle: (vehicle: ParkedVehicle) => void;
  onParkInSlot: (slot: ParkingSlot) => void;
  onRelocateVehicle: (vehicleId: string, targetSlotId: string) => void;
  onToggleMaintenance: (slotId: string) => void;
}

export const SlotDetailModal: React.FC<SlotDetailModalProps> = ({
  slot,
  vehicle,
  allSlots,
  onClose,
  onEditVehicle,
  onCheckoutVehicle,
  onParkInSlot,
  onRelocateVehicle,
  onToggleMaintenance,
}) => {
  const [isRelocating, setIsRelocating] = useState(false);
  const [targetSlotId, setTargetSlotId] = useState('');

  if (!slot) return null;

  const sizeConfig = SIZE_CONFIGS[slot.allowedSize];
  const isOccupied = slot.status === 'occupied' && vehicle;
  const isAvailable = slot.status === 'available';

  const formatDuration = (entryIso: string) => {
    const diffMs = Math.max(0, Date.now() - new Date(entryIso).getTime());
    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours} hrs ${minutes} mins`;
  };

  const calculateAccrued = (veh: ParkedVehicle) => {
    const diffHours = Math.max(0.2, (Date.now() - new Date(veh.entryTime).getTime()) / (1000 * 60 * 60));
    return (diffHours * veh.hourlyRate).toFixed(2);
  };

  // Eligible relocate slots
  const availableSlotsForRelocate = allSlots.filter((s) => {
    if (s.id === slot.id || s.status !== 'available') return false;
    if (vehicle && !isSizeCompatible(vehicle.vehicleSize, s.allowedSize)) return false;
    return true;
  });

  const handleConfirmRelocate = () => {
    if (vehicle && targetSlotId) {
      onRelocateVehicle(vehicle.id, targetSlotId);
      setIsRelocating(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div 
        className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono font-black text-lg">
              {slot.id}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Bay Inspection</h3>
                <span className={`text-[11px] font-mono px-2 py-0.5 rounded font-semibold border ${
                  isOccupied
                    ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                    : isAvailable
                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}>
                  {slot.status.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-400">{slot.floor} · Max Size: {slot.allowedSize.toUpperCase()}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5">
          {/* Bay Features & Specs */}
          <div className="grid grid-cols-3 gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-mono">Dimensions</span>
              <span className="font-mono font-semibold text-slate-200">{sizeConfig.dimensions}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-mono">EV Ready</span>
              <span className="font-semibold text-slate-200 flex items-center gap-1">
                {slot.hasEvCharger ? (
                  <span className="text-emerald-400 flex items-center gap-0.5"><Zap className="h-3 w-3" /> Yes (Level 2)</span>
                ) : (
                  <span className="text-slate-400">Standard</span>
                )}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-mono">Accessibility</span>
              <span className="font-semibold text-slate-200">
                {slot.isHandicap ? (
                  <span className="text-sky-400 flex items-center gap-0.5"><Accessibility className="h-3 w-3" /> Designated</span>
                ) : (
                  <span className="text-slate-400">General</span>
                )}
              </span>
            </div>
          </div>

          {/* If Occupied: Show Vehicle Card */}
          {isOccupied && vehicle && (
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="h-4 w-4 rounded-full border border-slate-600 shadow-sm"
                      style={{ backgroundColor: vehicle.color }}
                    />
                    <div>
                      <div className="text-base font-bold font-mono text-white tracking-wide">
                        {vehicle.plateNumber}
                      </div>
                      <div className="text-xs text-slate-400 font-medium">
                        {vehicle.makeModel}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-mono font-semibold border ${sizeConfig.badgeColor}`}>
                      {vehicle.vehicleSize.toUpperCase()} · {vehicle.vehicleType.toUpperCase()}
                    </span>
                    {vehicle.isCharging && (
                      <div className="text-[11px] text-emerald-400 font-semibold flex items-center justify-end gap-1 mt-1">
                        <Zap className="h-3 w-3" /> Charging Active
                      </div>
                    )}
                  </div>
                </div>

                {/* Driver Info */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px] flex items-center gap-1 font-mono">
                      <User className="h-3 w-3" /> DRIVER
                    </span>
                    <span className="text-slate-200 font-medium">{vehicle.driverName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] flex items-center gap-1 font-mono">
                      <Phone className="h-3 w-3" /> CONTACT
                    </span>
                    <span className="text-slate-300 font-mono">{vehicle.driverPhone || 'Not provided'}</span>
                  </div>
                </div>

                {/* Session Duration & Tally */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px] flex items-center gap-1 font-mono">
                      <Clock className="h-3 w-3" /> ELAPSED TIME
                    </span>
                    <span className="font-mono text-slate-200">{formatDuration(vehicle.entryTime)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] flex items-center gap-1 font-mono">
                      <DollarSign className="h-3 w-3" /> CURRENT BILL
                    </span>
                    <span className="font-mono text-emerald-400 font-bold text-sm">
                      ${calculateAccrued(vehicle)}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono ml-1">
                      (${vehicle.hourlyRate.toFixed(2)}/h)
                    </span>
                  </div>
                </div>

                {vehicle.notes && (
                  <div className="pt-2 border-t border-slate-800/80 text-xs text-slate-400 flex items-start gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-slate-500 shrink-0 mt-0.5" />
                    <span>{vehicle.notes}</span>
                  </div>
                )}
              </div>

              {/* Relocation Drawer */}
              {isRelocating ? (
                <div className="p-3.5 rounded-xl border border-cyan-500/40 bg-cyan-950/20 space-y-3">
                  <div className="text-xs font-semibold text-cyan-300 flex items-center gap-1.5">
                    <ArrowRightLeft className="h-4 w-4" />
                    <span>Relocate Vehicle to Another Compatible Bay</span>
                  </div>
                  <select
                    value={targetSlotId}
                    onChange={(e) => setTargetSlotId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                  >
                    <option value="">-- Select Destination Bay --</option>
                    {availableSlotsForRelocate.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.id} ({s.floor}) - Allowed: {s.allowedSize.toUpperCase()} {s.hasEvCharger ? '⚡' : ''}
                      </option>
                    ))}
                  </select>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsRelocating(false)}
                      className="px-2.5 py-1 text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={!targetSlotId}
                      onClick={handleConfirmRelocate}
                      className="px-3 py-1 text-xs font-semibold rounded bg-cyan-400 text-slate-950 disabled:opacity-40"
                    >
                      Confirm Move
                    </button>
                  </div>
                </div>
              ) : (
                /* Primary Actions on Occupied Vehicle */
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => {
                      onEditVehicle(vehicle);
                      onClose();
                    }}
                    className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-slate-800 bg-slate-950 hover:border-cyan-500/50 hover:bg-slate-850 transition-all text-xs text-cyan-300 font-semibold gap-1"
                  >
                    <Edit3 className="h-4 w-4" />
                    <span>Update Info</span>
                  </button>

                  <button
                    onClick={() => setIsRelocating(true)}
                    className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-slate-800 bg-slate-950 hover:border-cyan-500/50 hover:bg-slate-850 transition-all text-xs text-slate-300 font-semibold gap-1"
                  >
                    <ArrowRightLeft className="h-4 w-4 text-cyan-400" />
                    <span>Relocate Bay</span>
                  </button>

                  <button
                    onClick={() => {
                      onCheckoutVehicle(vehicle);
                      onClose();
                    }}
                    className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 transition-all text-xs text-amber-300 font-semibold gap-1"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Exit & Pay</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* If Available: Show Park Button */}
          {isAvailable && (
            <div className="space-y-4">
              <div className="rounded-xl border border-dashed border-emerald-500/30 bg-emerald-500/5 p-4 text-center space-y-2">
                <div className="h-10 w-10 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Car className="h-5 w-5" />
                </div>
                <h4 className="text-sm font-bold text-white">This Bay is Free</h4>
                <p className="text-xs text-slate-400">
                  Ready to accept vehicles with size classification up to <strong>{slot.allowedSize.toUpperCase()}</strong>.
                </p>
                <div className="font-mono text-xs font-semibold text-cyan-400 pt-1">
                  Base rate: ${sizeConfig.baseHourlyRate.toFixed(2)} / hr
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onParkInSlot(slot);
                    onClose();
                  }}
                  className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-cyan-400 text-slate-950 hover:bg-cyan-300 transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/20"
                >
                  <Plus className="h-4 w-4" />
                  <span>Park a Vehicle Here</span>
                </button>

                <button
                  onClick={() => {
                    onToggleMaintenance(slot.id);
                    onClose();
                  }}
                  className="px-3 py-2.5 rounded-xl border border-slate-800 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-850"
                  title="Mark slot for maintenance / cleaning"
                >
                  Set Maint
                </button>
              </div>
            </div>
          )}

          {/* If Maintenance / Reserved */}
          {!isOccupied && !isAvailable && (
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 text-center space-y-3">
              <ShieldAlert className="h-8 w-8 mx-auto text-amber-400" />
              <div className="text-sm font-semibold text-white">
                Bay Status: {slot.status.toUpperCase()}
              </div>
              <p className="text-xs text-slate-400">
                This space is currently cordoned off from general parking.
              </p>
              <button
                onClick={() => {
                  onToggleMaintenance(slot.id);
                  onClose();
                }}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200"
              >
                Mark as Available
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
