import React, { useState, useEffect } from 'react';
import { 
  ParkingSlot, 
  ParkedVehicle, 
  VehicleSize, 
  VehicleType, 
  SIZE_CONFIGS, 
  VEHICLE_TYPE_CONFIGS 
} from '../types/parking';
import { isSizeCompatible } from '../utils/storage';
import { 
  X, 
  Car, 
  CarFront, 
  Truck, 
  Bus, 
  Bike, 
  Zap, 
  Gauge, 
  AlertTriangle, 
  Check, 
  MapPin,
  Clock,
  Sparkles
} from 'lucide-react';

interface VehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (vehicleData: Partial<ParkedVehicle>, targetSlotId: string) => void;
  initialVehicle?: ParkedVehicle | null; // If provided, we are UPDATING this vehicle!
  initialSlot?: ParkingSlot | null;     // If provided, slot pre-selected
  slots: ParkingSlot[];
  vehicles: ParkedVehicle[];
}

const COLOR_PRESETS = [
  { name: 'Onyx Black', hex: '#0f172a' },
  { name: 'Pure White', hex: '#f8fafc' },
  { name: 'Steel Gray', hex: '#64748b' },
  { name: 'Royal Blue', hex: '#2563eb' },
  { name: 'Crimson Red', hex: '#dc2626' },
  { name: 'Forest Green', hex: '#059669' },
  { name: 'Bronze Amber', hex: '#d97706' },
  { name: 'Cyan Modern', hex: '#06b6d4' },
];

export const VehicleModal: React.FC<VehicleModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialVehicle,
  initialSlot,
  slots,
  vehicles,
}) => {
  const isEditing = Boolean(initialVehicle);

  // Form State
  const [plateNumber, setPlateNumber] = useState('');
  const [driverName, setDriverName] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [makeModel, setMakeModel] = useState('');
  const [color, setColor] = useState('#0f172a');
  const [vehicleType, setVehicleType] = useState<VehicleType>('sedan');
  const [vehicleSize, setVehicleSize] = useState<VehicleSize>('standard');
  const [slotId, setSlotId] = useState('');
  const [isCharging, setIsCharging] = useState(false);
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Reset or populate form when modal opens
  useEffect(() => {
    if (initialVehicle) {
      setPlateNumber(initialVehicle.plateNumber);
      setDriverName(initialVehicle.driverName);
      setDriverPhone(initialVehicle.driverPhone || '');
      setMakeModel(initialVehicle.makeModel);
      setColor(initialVehicle.color || '#0f172a');
      setVehicleType(initialVehicle.vehicleType);
      setVehicleSize(initialVehicle.vehicleSize);
      setSlotId(initialVehicle.slotId);
      setIsCharging(Boolean(initialVehicle.isCharging));
      setNotes(initialVehicle.notes || '');
      setErrorMsg('');
    } else {
      // New Vehicle Entry
      setPlateNumber('');
      setDriverName('');
      setDriverPhone('');
      setMakeModel('');
      setColor('#0f172a');
      setVehicleType('sedan');
      setVehicleSize('standard');
      setIsCharging(false);
      setNotes('');
      setErrorMsg('');

      if (initialSlot && initialSlot.status === 'available') {
        setSlotId(initialSlot.id);
        setVehicleSize(initialSlot.allowedSize);
      } else {
        // Find first available standard slot
        const firstAvailable = slots.find((s) => s.status === 'available');
        setSlotId(firstAvailable ? firstAvailable.id : '');
      }
    }
  }, [initialVehicle, initialSlot, isOpen, slots]);

  if (!isOpen) return null;

  // When vehicle type changes, optionally suggest default vehicle size if user hasn't explicitly set it
  const handleTypeSelect = (type: VehicleType) => {
    setVehicleType(type);
    const suggestedSize = VEHICLE_TYPE_CONFIGS[type]?.defaultSize;
    if (suggestedSize) {
      setVehicleSize(suggestedSize);
    }
  };

  // Find candidate slots
  // For editing, include the slot currently occupied by this vehicle plus all available slots
  const eligibleSlots = slots.filter((slot) => {
    if (isEditing && initialVehicle && slot.id === initialVehicle.slotId) {
      return true;
    }
    return slot.status === 'available';
  });

  // Current selected slot
  const currentSlot = slots.find((s) => s.id === slotId);
  const isCompatible = currentSlot ? isSizeCompatible(vehicleSize, currentSlot.allowedSize) : true;

  // Calculate hourly rate preview
  const baseRate = SIZE_CONFIGS[vehicleSize]?.baseHourlyRate || 5.00;
  const evSurcharge = isCharging ? 2.50 : 0.00;
  const calculatedHourlyRate = baseRate + evSurcharge;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!plateNumber.trim()) {
      setErrorMsg('License plate number is required.');
      return;
    }

    if (!makeModel.trim()) {
      setErrorMsg('Vehicle make and model are required (e.g. Honda Civic, Tesla Model 3).');
      return;
    }

    if (!slotId) {
      setErrorMsg('Please select a parking slot for this vehicle.');
      return;
    }

    // Check size compatibility
    if (currentSlot && !isSizeCompatible(vehicleSize, currentSlot.allowedSize)) {
      setErrorMsg(
        `Selected slot ${currentSlot.id} (${currentSlot.allowedSize}) cannot fit a ${vehicleSize} vehicle!`
      );
      return;
    }

    // Check EV charger requirement
    if (isCharging && currentSlot && !currentSlot.hasEvCharger) {
      setErrorMsg(`Slot ${currentSlot.id} does not have an EV charger. Please select an EV-equipped slot or disable charging.`);
      return;
    }

    // Plate duplicate check (excluding current vehicle if editing)
    const duplicate = vehicles.find(
      (v) => v.plateNumber.toUpperCase() === plateNumber.trim().toUpperCase() &&
             (!isEditing || v.id !== initialVehicle?.id)
    );
    if (duplicate) {
      setErrorMsg(`Vehicle with plate ${plateNumber} is already parked in slot ${duplicate.slotId}.`);
      return;
    }

    const vehicleData: Partial<ParkedVehicle> = {
      plateNumber: plateNumber.trim().toUpperCase(),
      driverName: driverName.trim() || 'Guest Driver',
      driverPhone: driverPhone.trim(),
      makeModel: makeModel.trim(),
      color,
      vehicleType,
      vehicleSize,
      slotId,
      isCharging,
      notes: notes.trim(),
      hourlyRate: calculatedHourlyRate,
    };

    onSave(vehicleData, slotId);
    onClose();
  };

  const handleQuickPreset = (model: string, type: VehicleType, size: VehicleSize, clr: string) => {
    setMakeModel(model);
    setVehicleType(type);
    setVehicleSize(size);
    setColor(clr);
    if (type === 'electric') {
      setIsCharging(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/50">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              {isEditing ? (
                <>
                  <span>Update Parked Vehicle</span>
                  <span className="text-xs font-mono font-normal text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded">
                    Slot {initialVehicle?.slotId}
                  </span>
                </>
              ) : (
                <>
                  <span>Park New Vehicle</span>
                  <span className="text-xs font-normal text-slate-400">· Entry Registration</span>
                </>
              )}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {isEditing 
                ? 'Update vehicle classification, dimensions, assigned bay, or driver information.'
                : 'Assign vehicle dimensions, select compatible bay, and initiate parking session.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Quick Presets for Demo / Testing */}
        {!isEditing && (
          <div className="px-6 pt-3 pb-1 border-b border-slate-800/60 bg-slate-950/30 flex items-center gap-2 overflow-x-auto text-xs">
            <span className="text-[11px] font-mono text-slate-400 shrink-0 flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-amber-400" />
              Quick Fill:
            </span>
            <button
              type="button"
              onClick={() => handleQuickPreset('Tesla Model Y AWD', 'electric', 'standard', '#f8fafc')}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] whitespace-nowrap"
            >
              Tesla Model Y (EV)
            </button>
            <button
              type="button"
              onClick={() => handleQuickPreset('Ford F-150 Lightning', 'truck', 'large', '#64748b')}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] whitespace-nowrap"
            >
              Ford F-150 (Large)
            </button>
            <button
              type="button"
              onClick={() => handleQuickPreset('Fiat 500e Compact', 'hatchback', 'compact', '#06b6d4')}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] whitespace-nowrap"
            >
              Fiat 500 (Compact)
            </button>
            <button
              type="button"
              onClick={() => handleQuickPreset('Ducati Panigale V2', 'motorcycle', 'motorcycle', '#dc2626')}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] whitespace-nowrap"
            >
              Ducati (Motorcycle)
            </button>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Section 1: Vehicle Type Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2 font-mono">
              1. Vehicle Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(Object.keys(VEHICLE_TYPE_CONFIGS) as VehicleType[]).map((type) => {
                const config = VEHICLE_TYPE_CONFIGS[type];
                const isSelected = vehicleType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleTypeSelect(type)}
                    className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300 shadow-sm'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <span className="capitalize">{config.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Vehicle Size Classification */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono">
                2. Vehicle Size Classification
              </label>
              <span className="text-[11px] text-slate-400">
                Determines bay sizing compatibility & base rate
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
              {(Object.keys(SIZE_CONFIGS) as VehicleSize[]).map((size) => {
                const config = SIZE_CONFIGS[size];
                const isSelected = vehicleSize === size;
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setVehicleSize(size)}
                    className={`p-2.5 rounded-lg border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-cyan-500/15 border-cyan-400 text-white'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-xs capitalize text-slate-200">
                        {size}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {config.dimensions}
                      </div>
                    </div>
                    <div className="mt-2 text-[11px] font-mono font-bold text-cyan-400">
                      ${config.baseHourlyRate.toFixed(2)}/hr
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Vehicle Specs (Plate, Model, Color) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                License Plate <span className="text-cyan-400">*</span>
              </label>
              <input
                type="text"
                value={plateNumber}
                onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
                placeholder="e.g. 7XYZ890"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm font-mono font-bold text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 uppercase"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Make & Model <span className="text-cyan-400">*</span>
              </label>
              <input
                type="text"
                value={makeModel}
                onChange={(e) => setMakeModel(e.target.value)}
                placeholder="e.g. Tesla Model 3"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Color
              </label>
              <div className="flex items-center gap-1.5 pt-1">
                {COLOR_PRESETS.map((p) => (
                  <button
                    key={p.hex}
                    type="button"
                    onClick={() => setColor(p.hex)}
                    style={{ backgroundColor: p.hex }}
                    title={p.name}
                    className={`h-7 w-7 rounded-full border transition-transform ${
                      color === p.hex
                        ? 'border-cyan-400 scale-110 shadow-md ring-2 ring-cyan-500/40'
                        : 'border-slate-700 hover:scale-105'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Section 4: Parking Bay Assignment & EV Charging */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800/80">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Assigned Parking Bay <span className="text-cyan-400">*</span>
              </label>
              <select
                value={slotId}
                onChange={(e) => setSlotId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 font-mono focus:outline-none focus:border-cyan-400"
              >
                <option value="">-- Choose Parking Slot --</option>
                {eligibleSlots.map((slot) => {
                  const fits = isSizeCompatible(vehicleSize, slot.allowedSize);
                  return (
                    <option key={slot.id} value={slot.id}>
                      {slot.id} ({slot.floor}) - Size: {slot.allowedSize.toUpperCase()} 
                      {slot.hasEvCharger ? ' [⚡ EV Charger]' : ''} 
                      {fits ? '' : ' ⚠️ Too Small!'}
                    </option>
                  );
                })}
              </select>

              {/* Bay Compatibility Feedback */}
              {currentSlot && (
                <div className="mt-1.5 flex items-center gap-1.5 text-xs">
                  {isCompatible ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <Check className="h-3 w-3" /> Compatible with {vehicleSize}
                    </span>
                  ) : (
                    <span className="text-rose-400 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" /> Bay {currentSlot.id} is {currentSlot.allowedSize}; needs ≥ {vehicleSize}
                    </span>
                  )}
                  {currentSlot.hasEvCharger && (
                    <span className="text-cyan-400 font-mono">· EV Port Available</span>
                  )}
                </div>
              )}
            </div>

            {/* EV Charging Addon Toggle */}
            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-800 bg-slate-950/60 cursor-pointer hover:border-slate-700">
                <input
                  type="checkbox"
                  checked={isCharging}
                  onChange={(e) => setIsCharging(e.target.checked)}
                  className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-500 h-4 w-4 bg-slate-900"
                />
                <div>
                  <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                    <Zap className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Connect to EV Charging Station</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    +$2.50/hr flat charging rate
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Section 5: Driver Information & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800/80">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Driver Name
              </label>
              <input
                type="text"
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                placeholder="e.g. Johnathan Smith"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Driver Phone / Contact
              </label>
              <input
                type="tel"
                value={driverPhone}
                onChange={(e) => setDriverPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Operational Notes (VIP, Delivery, Special Instructions)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Handicapped permit #4092, monthly corporate billing"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Pricing Summary Bar */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <div className="text-slate-400">
              Computed Rate: <span className="font-semibold text-slate-200 capitalize">{vehicleSize}</span> (${baseRate.toFixed(2)}) 
              {isCharging && <span className="text-emerald-400"> + EV Charge ($2.50)</span>}
            </div>
            <div className="font-mono text-sm font-bold text-cyan-400 tabular-nums">
              ${calculatedHourlyRate.toFixed(2)} / hr
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors shadow-sm shadow-cyan-500/20"
            >
              {isEditing ? 'Save Vehicle Updates' : 'Park Vehicle'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
