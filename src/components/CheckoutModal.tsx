import React, { useState } from 'react';
import { 
  ParkedVehicle, 
  ParkingSlot, 
  SIZE_CONFIGS 
} from '../types/parking';
import { 
  X, 
  Receipt, 
  CreditCard, 
  Smartphone, 
  Banknote, 
  CheckCircle2, 
  Clock, 
  Printer, 
  Zap,
  ArrowRight
} from 'lucide-react';

interface CheckoutModalProps {
  vehicle: ParkedVehicle | null;
  slot?: ParkingSlot;
  onClose: () => void;
  onConfirmCheckout: (vehicle: ParkedVehicle, totalPaid: number) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  vehicle,
  slot,
  onClose,
  onConfirmCheckout,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mobile' | 'cash' | 'pass'>('card');
  const [isReceiptPrinted, setIsReceiptPrinted] = useState(false);

  if (!vehicle) return null;

  const entryDate = new Date(vehicle.entryTime);
  const now = new Date();
  const diffMinutes = Math.max(15, Math.floor((now.getTime() - entryDate.getTime()) / (1000 * 60)));
  const billedHours = Math.max(1, Math.ceil(diffMinutes / 60));

  const sizeConfig = SIZE_CONFIGS[vehicle.vehicleSize];
  const baseRate = sizeConfig ? sizeConfig.baseHourlyRate : 5.00;
  const parkingCharge = billedHours * baseRate;
  const evCharge = vehicle.isCharging ? billedHours * 2.50 : 0.00;
  const subtotal = parkingCharge + evCharge;
  const tax = subtotal * 0.08;
  const grandTotal = subtotal + tax;

  const handleComplete = () => {
    onConfirmCheckout(vehicle, grandTotal);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div 
        className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">Parking Exit & Billing</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Vehicle info card */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <div>
              <div className="font-mono text-base font-bold text-white tracking-wider">
                {vehicle.plateNumber}
              </div>
              <div className="text-xs text-slate-400">
                {vehicle.makeModel} · <span className="capitalize">{vehicle.vehicleSize}</span>
              </div>
            </div>
            <div className="text-right font-mono">
              <span className="text-xs text-slate-400">BAY</span>
              <div className="text-sm font-bold text-cyan-400">{vehicle.slotId}</div>
            </div>
          </div>

          {/* Time & Duration Breakdown */}
          <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950/50 p-3 rounded-xl border border-slate-800/80">
            <div>
              <span className="text-slate-500 font-mono text-[10px] block">ENTRY TIME</span>
              <span className="text-slate-300 font-mono">
                {entryDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div>
              <span className="text-slate-500 font-mono text-[10px] block">EXIT TIME</span>
              <span className="text-slate-300 font-mono">
                {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div>
              <span className="text-slate-500 font-mono text-[10px] block">TOTAL DURATION</span>
              <span className="font-mono font-semibold text-white">
                {Math.floor(diffMinutes / 60)}h {diffMinutes % 60}m
              </span>
            </div>
            <div>
              <span className="text-slate-500 font-mono text-[10px] block">BILLED UNITS</span>
              <span className="font-mono font-semibold text-cyan-400">
                {billedHours} {billedHours === 1 ? 'Hour' : 'Hours'}
              </span>
            </div>
          </div>

          {/* Itemized Invoice Ledger */}
          <div className="space-y-2 border-y border-slate-800 py-3 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>
                Parking ({billedHours}h × ${baseRate.toFixed(2)} [{vehicle.vehicleSize}])
              </span>
              <span className="font-mono tabular-nums">${parkingCharge.toFixed(2)}</span>
            </div>

            {vehicle.isCharging && (
              <div className="flex justify-between text-emerald-400">
                <span className="flex items-center gap-1">
                  <Zap className="h-3 w-3" /> EV Charging ({billedHours}h × $2.50)
                </span>
                <span className="font-mono tabular-nums">${evCharge.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-400 pt-1 border-t border-slate-850">
              <span>Municipal Parking Tax (8%)</span>
              <span className="font-mono tabular-nums">${tax.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-800">
              <span>Total Payable</span>
              <span className="font-mono text-emerald-400 text-base tabular-nums">
                ${grandTotal.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase font-mono text-slate-400 mb-2">
              Payment Method
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-2.5 rounded-lg border text-xs font-medium flex flex-col items-center gap-1.5 transition-all ${
                  paymentMethod === 'card'
                    ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <CreditCard className="h-4 w-4" />
                <span>Credit Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('mobile')}
                className={`p-2.5 rounded-lg border text-xs font-medium flex flex-col items-center gap-1.5 transition-all ${
                  paymentMethod === 'mobile'
                    ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Smartphone className="h-4 w-4" />
                <span>Mobile Pay</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`p-2.5 rounded-lg border text-xs font-medium flex flex-col items-center gap-1.5 transition-all ${
                  paymentMethod === 'cash'
                    ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Banknote className="h-4 w-4" />
                <span>Cash / Gate</span>
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                setIsReceiptPrinted(true);
                setTimeout(() => setIsReceiptPrinted(false), 3000);
              }}
              className="px-3 py-2.5 rounded-xl border border-slate-800 text-xs font-medium text-slate-300 hover:bg-slate-800 flex items-center gap-1.5"
            >
              <Printer className="h-3.5 w-3.5 text-slate-400" />
              <span>{isReceiptPrinted ? 'Printed!' : 'Receipt'}</span>
            </button>

            <button
              type="button"
              onClick={handleComplete}
              className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-amber-400 hover:bg-amber-300 text-slate-950 transition-colors flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Collect ${grandTotal.toFixed(2)} & Release Bay</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
