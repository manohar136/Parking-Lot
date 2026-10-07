import React, { useState, useEffect } from 'react';
import { 
  ParkingSlot, 
  ParkedVehicle, 
  CompletedSession,
  VehicleSize,
  VehicleType
} from './types/parking';
import { 
  getStoredSlots, 
  saveSlots, 
  getStoredVehicles, 
  saveVehicles, 
  getStoredHistory, 
  saveHistory, 
  resetToDefaults 
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { ParkingGrid } from './components/ParkingGrid';
import { VehicleTable } from './components/VehicleTable';
import { SlotDetailModal } from './components/SlotDetailModal';
import { VehicleModal } from './components/VehicleModal';
import { CheckoutModal } from './components/CheckoutModal';
import { AnalyticsPanel } from './components/AnalyticsPanel';
import { TechStackGuide } from './components/TechStackGuide';
import { CheckCircle2, AlertCircle, Info, Sparkles } from 'lucide-react';

export default function App() {
  const [slots, setSlots] = useState<ParkingSlot[]>(getStoredSlots);
  const [vehicles, setVehicles] = useState<ParkedVehicle[]>(getStoredVehicles);
  const [history, setHistory] = useState<CompletedSession[]>(getStoredHistory);

  // Active navigation tab: 'map' | 'vehicles' | 'analytics' | 'tech'
  const [activeTab, setActiveTab] = useState<'map' | 'vehicles' | 'analytics' | 'tech'>('map');

  // Modal states
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<ParkedVehicle | null>(null);
  const [preSelectedSlot, setPreSelectedSlot] = useState<ParkingSlot | null>(null);
  const [selectedSlotForInspection, setSelectedSlotForInspection] = useState<ParkingSlot | null>(null);
  const [checkoutTargetVehicle, setCheckoutTargetVehicle] = useState<ParkedVehicle | null>(null);

  // Toast notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'warn' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'warn' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3800);
  };

  // Sync state to local storage whenever they change
  useEffect(() => {
    saveSlots(slots);
  }, [slots]);

  useEffect(() => {
    saveVehicles(vehicles);
  }, [vehicles]);

  useEffect(() => {
    saveHistory(history);
  }, [history]);

  // Open modal to park a new vehicle
  const handleOpenParkNew = (slot?: ParkingSlot) => {
    setEditingVehicle(null);
    setPreSelectedSlot(slot || null);
    setIsVehicleModalOpen(true);
  };

  // Open modal to update an existing vehicle
  const handleOpenEditVehicle = (vehicle: ParkedVehicle) => {
    setEditingVehicle(vehicle);
    const vehicleSlot = slots.find((s) => s.id === vehicle.slotId) || null;
    setPreSelectedSlot(vehicleSlot);
    setIsVehicleModalOpen(true);
  };

  // Save or update vehicle
  const handleSaveVehicle = (vehicleData: Partial<ParkedVehicle>, targetSlotId: string) => {
    if (editingVehicle) {
      // UPDATE EXISTING VEHICLE
      const oldSlotId = editingVehicle.slotId;
      const isSlotChanged = oldSlotId !== targetSlotId;

      const updatedVehicle: ParkedVehicle = {
        ...editingVehicle,
        ...vehicleData,
        slotId: targetSlotId,
      } as ParkedVehicle;

      // Update vehicles list
      const updatedVehicles = vehicles.map((v) =>
        v.id === editingVehicle.id ? updatedVehicle : v
      );
      setVehicles(updatedVehicles);

      // Update slots if slot was changed
      if (isSlotChanged) {
        setSlots((prev) =>
          prev.map((slot) => {
            if (slot.id === oldSlotId) {
              return { ...slot, status: 'available', currentVehicleId: undefined };
            }
            if (slot.id === targetSlotId) {
              return { ...slot, status: 'occupied', currentVehicleId: updatedVehicle.id };
            }
            return slot;
          })
        );
      }

      showToast(`Updated vehicle ${updatedVehicle.plateNumber} (${updatedVehicle.vehicleSize.toUpperCase()} / ${updatedVehicle.vehicleType.toUpperCase()})`);
    } else {
      // CREATE NEW PARKED VEHICLE
      const newId = `v-${Date.now()}`;
      const newVehicle: ParkedVehicle = {
        id: newId,
        plateNumber: vehicleData.plateNumber || 'UNKNOWN',
        driverName: vehicleData.driverName || 'Guest Driver',
        driverPhone: vehicleData.driverPhone || '',
        makeModel: vehicleData.makeModel || 'Vehicle',
        color: vehicleData.color || '#0f172a',
        vehicleType: vehicleData.vehicleType || 'sedan',
        vehicleSize: vehicleData.vehicleSize || 'standard',
        slotId: targetSlotId,
        entryTime: new Date().toISOString(),
        isCharging: Boolean(vehicleData.isCharging),
        notes: vehicleData.notes || '',
        hourlyRate: vehicleData.hourlyRate || 5.00,
      };

      setVehicles((prev) => [newVehicle, ...prev]);

      // Mark target slot as occupied
      setSlots((prev) =>
        prev.map((slot) =>
          slot.id === targetSlotId
            ? { ...slot, status: 'occupied', currentVehicleId: newId }
            : slot
        )
      );

      showToast(`Vehicle ${newVehicle.plateNumber} parked in Bay ${targetSlotId}`);
    }
  };

  // Check out vehicle
  const handleConfirmCheckout = (vehicle: ParkedVehicle, totalPaid: number) => {
    const entryDate = new Date(vehicle.entryTime);
    const now = new Date();
    const durationMinutes = Math.max(15, Math.floor((now.getTime() - entryDate.getTime()) / (1000 * 60)));

    // Create completed session record
    const record: CompletedSession = {
      id: `hist-${Date.now()}`,
      plateNumber: vehicle.plateNumber,
      driverName: vehicle.driverName,
      makeModel: vehicle.makeModel,
      vehicleType: vehicle.vehicleType,
      vehicleSize: vehicle.vehicleSize,
      slotId: vehicle.slotId,
      entryTime: vehicle.entryTime,
      exitTime: now.toISOString(),
      durationMinutes,
      totalPaid,
    };

    setHistory((prev) => [record, ...prev]);

    // Remove vehicle from parked list
    setVehicles((prev) => prev.filter((v) => v.id !== vehicle.id));

    // Release parking slot
    setSlots((prev) =>
      prev.map((slot) =>
        slot.id === vehicle.slotId
          ? { ...slot, status: 'available', currentVehicleId: undefined }
          : slot
      )
    );

    showToast(`Vehicle ${vehicle.plateNumber} checked out. Bay ${vehicle.slotId} is now available.`);
  };

  // Relocate vehicle from one slot to another
  const handleRelocateVehicle = (vehicleId: string, newSlotId: string) => {
    const vehicle = vehicles.find((v) => v.id === vehicleId);
    if (!vehicle) return;

    const oldSlotId = vehicle.slotId;

    // Update vehicle
    setVehicles((prev) =>
      prev.map((v) => (v.id === vehicleId ? { ...v, slotId: newSlotId } : v))
    );

    // Update slots
    setSlots((prev) =>
      prev.map((slot) => {
        if (slot.id === oldSlotId) {
          return { ...slot, status: 'available', currentVehicleId: undefined };
        }
        if (slot.id === newSlotId) {
          return { ...slot, status: 'occupied', currentVehicleId: vehicleId };
        }
        return slot;
      })
    );

    showToast(`Relocated ${vehicle.plateNumber} from ${oldSlotId} to ${newSlotId}`);
  };

  // Toggle slot maintenance
  const handleToggleMaintenance = (slotId: string) => {
    setSlots((prev) =>
      prev.map((slot) => {
        if (slot.id === slotId) {
          const newStatus = slot.status === 'maintenance' ? 'available' : 'maintenance';
          showToast(`Bay ${slotId} status changed to ${newStatus}`);
          return { ...slot, status: newStatus };
        }
        return slot;
      })
    );
  };

  // Quick Simulation: park a random realistic vehicle in an available bay
  const handleQuickSimulate = () => {
    const availableSlots = slots.filter((s) => s.status === 'available');
    if (availableSlots.length === 0) {
      showToast('All parking bays are currently occupied!', 'warn');
      return;
    }

    const randomSlot = availableSlots[Math.floor(Math.random() * availableSlots.length)];
    const size = randomSlot.allowedSize;

    const samplePool: Array<{
      model: string;
      type: VehicleType;
      driver: string;
      color: string;
      isEv: boolean;
    }> = [
      { model: 'Lucid Air Grand Touring', type: 'electric', driver: 'Julian Hayes', color: '#64748b', isEv: true },
      { model: 'Porsche Taycan 4S', type: 'electric', driver: 'Natasha Roman', color: '#2563eb', isEv: true },
      { model: 'Subaru Outback Limited', type: 'suv', driver: 'Daniel Brody', color: '#059669', isEv: false },
      { model: 'GMC Sierra 1500 Denali', type: 'truck', driver: 'Wyatt Morgan', color: '#d97706', isEv: false },
      { model: 'BMW i4 M50 Gran Coupe', type: 'electric', driver: 'Claire Redfield', color: '#06b6d4', isEv: true },
      { model: 'Honda Civic Si', type: 'sedan', driver: 'Leon Kennedy', color: '#dc2626', isEv: false },
      { model: 'Harley-Davidson LiveWire', type: 'motorcycle', driver: 'Dante Sparda', color: '#0f172a', isEv: true },
      { model: 'Mercedes Metris Passenger', type: 'van', driver: 'Airport Shuttle #4', color: '#f8fafc', isEv: false },
    ];

    const pick = samplePool[Math.floor(Math.random() * samplePool.length)];
    const randomPlate = `${Math.floor(100 + Math.random() * 900)}-${['KLR', 'VTR', 'XPQ', 'BLZ', 'NDX'][Math.floor(Math.random() * 5)]}`;

    const newVehicle: ParkedVehicle = {
      id: `v-${Date.now()}`,
      plateNumber: randomPlate,
      driverName: pick.driver,
      driverPhone: `+1 (555) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
      makeModel: pick.model,
      color: pick.color,
      vehicleType: pick.type,
      vehicleSize: size,
      slotId: randomSlot.id,
      entryTime: new Date().toISOString(),
      isCharging: pick.isEv && randomSlot.hasEvCharger,
      hourlyRate: 6.00 + (pick.isEv && randomSlot.hasEvCharger ? 2.50 : 0),
    };

    setVehicles((prev) => [newVehicle, ...prev]);
    setSlots((prev) =>
      prev.map((s) => (s.id === randomSlot.id ? { ...s, status: 'occupied', currentVehicleId: newVehicle.id } : s))
    );

    showToast(`Simulated arrival: ${pick.model} parked in ${randomSlot.id}`);
  };

  // Reset lot to default seed
  const handleResetLot = () => {
    if (window.confirm('Reset parking lot and vehicles back to default sample dataset?')) {
      const resetData = resetToDefaults();
      setSlots(resetData.slots);
      setVehicles(resetData.vehicles);
      setHistory(resetData.history);
      showToast('Parking lot reset to initial defaults.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Toast Notification Banner */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl border border-cyan-500/40 bg-slate-900/95 shadow-2xl text-xs font-medium text-white backdrop-blur-md animate-fade-in">
          {toast.type === 'warn' ? (
            <AlertCircle className="h-4 w-4 text-amber-400 shrink-0" />
          ) : (
            <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Bar Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenParkModal={() => handleOpenParkNew()}
        onQuickSimulate={handleQuickSimulate}
        onResetLot={handleResetLot}
        totalOccupied={vehicles.length}
        totalSlots={slots.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* TAB 1: 2D Interactive Parking Floor Map */}
        {activeTab === 'map' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  Parking Lot Operations Map
                </h1>
                <p className="text-xs sm:text-sm text-slate-400">
                  Real-time bay status, size-calibrated bays, EV charging points, and rapid vehicle updates.
                </p>
              </div>
            </div>

            <ParkingGrid
              slots={slots}
              vehicles={vehicles}
              onSelectSlot={(slot) => setSelectedSlotForInspection(slot)}
              onParkInSlot={(slot) => handleOpenParkNew(slot)}
              onEditVehicle={(vehicle) => handleOpenEditVehicle(vehicle)}
              onCheckoutVehicle={(vehicle) => setCheckoutTargetVehicle(vehicle)}
            />
          </div>
        )}

        {/* TAB 2: Tabular List of Parked Vehicles */}
        {activeTab === 'vehicles' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  Parked Vehicles Directory
                </h1>
                <p className="text-xs sm:text-sm text-slate-400">
                  Update vehicle specifications, modify classification (type & size), relocate bays, and process checkouts.
                </p>
              </div>
            </div>

            <VehicleTable
              vehicles={vehicles}
              slots={slots}
              onEditVehicle={(vehicle) => handleOpenEditVehicle(vehicle)}
              onCheckoutVehicle={(vehicle) => setCheckoutTargetVehicle(vehicle)}
              onSelectSlot={(slot) => {
                setActiveTab('map');
                setSelectedSlotForInspection(slot);
              }}
            />
          </div>
        )}

        {/* TAB 3: Lot Occupancy & Rates Analytics */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Lot Capacity & Billing Analytics
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Occupancy trends, size distribution metrics, pricing matrices, and completed transaction logs.
              </p>
            </div>

            <AnalyticsPanel
              slots={slots}
              vehicles={vehicles}
              history={history}
            />
          </div>
        )}

        {/* TAB 4: Technologies & Tools Used (Explicitly requested by user) */}
        {activeTab === 'tech' && (
          <div className="space-y-6">
            <TechStackGuide />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300 font-mono">ParkGrid</span>
            <span>·</span>
            <span>Smart Parking Lot Management & Telemetry System</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <button onClick={() => setActiveTab('tech')} className="hover:text-cyan-400 transition-colors">
              Technologies & Tools
            </button>
            <button onClick={() => setActiveTab('analytics')} className="hover:text-cyan-400 transition-colors">
              Rates & Rules
            </button>
            <button onClick={handleResetLot} className="hover:text-slate-200 transition-colors">
              Reset Sample Data
            </button>
          </div>
        </div>
      </footer>

      {/* MODAL: Slot Inspector */}
      {selectedSlotForInspection && (
        <SlotDetailModal
          slot={selectedSlotForInspection}
          vehicle={vehicles.find((v) => v.slotId === selectedSlotForInspection.id)}
          allSlots={slots}
          onClose={() => setSelectedSlotForInspection(null)}
          onEditVehicle={(v) => handleOpenEditVehicle(v)}
          onCheckoutVehicle={(v) => setCheckoutTargetVehicle(v)}
          onParkInSlot={(s) => handleOpenParkNew(s)}
          onRelocateVehicle={handleRelocateVehicle}
          onToggleMaintenance={handleToggleMaintenance}
        />
      )}

      {/* MODAL: Park New or Update Vehicle */}
      <VehicleModal
        isOpen={isVehicleModalOpen}
        onClose={() => {
          setIsVehicleModalOpen(false);
          setEditingVehicle(null);
          setPreSelectedSlot(null);
        }}
        onSave={handleSaveVehicle}
        initialVehicle={editingVehicle}
        initialSlot={preSelectedSlot}
        slots={slots}
        vehicles={vehicles}
      />

      {/* MODAL: Checkout & Invoice Receipt */}
      {checkoutTargetVehicle && (
        <CheckoutModal
          vehicle={checkoutTargetVehicle}
          slot={slots.find((s) => s.id === checkoutTargetVehicle.slotId)}
          onClose={() => setCheckoutTargetVehicle(null)}
          onConfirmCheckout={handleConfirmCheckout}
        />
      )}

    </div>
  );
}
