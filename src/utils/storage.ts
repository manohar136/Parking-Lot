import { ParkingSlot, ParkedVehicle, CompletedSession, VehicleSize, VehicleType } from '../types/parking';

const SLOTS_STORAGE_KEY = 'parkgrid_slots_v1';
const VEHICLES_STORAGE_KEY = 'parkgrid_vehicles_v1';
const HISTORY_STORAGE_KEY = 'parkgrid_history_v1';

export const INITIAL_SLOTS: ParkingSlot[] = [
  // LEVEL 1: Compact & Standard + EV Chargers
  { id: 'L1-01', floor: 'Level 1 (Ground)', number: 1, allowedSize: 'compact', hasEvCharger: true, isHandicap: true, status: 'occupied', currentVehicleId: 'v-1' },
  { id: 'L1-02', floor: 'Level 1 (Ground)', number: 2, allowedSize: 'compact', hasEvCharger: true, isHandicap: false, status: 'occupied', currentVehicleId: 'v-2' },
  { id: 'L1-03', floor: 'Level 1 (Ground)', number: 3, allowedSize: 'compact', hasEvCharger: false, isHandicap: false, status: 'available' },
  { id: 'L1-04', floor: 'Level 1 (Ground)', number: 4, allowedSize: 'standard', hasEvCharger: true, isHandicap: false, status: 'occupied', currentVehicleId: 'v-3' },
  { id: 'L1-05', floor: 'Level 1 (Ground)', number: 5, allowedSize: 'standard', hasEvCharger: false, isHandicap: false, status: 'occupied', currentVehicleId: 'v-4' },
  { id: 'L1-06', floor: 'Level 1 (Ground)', number: 6, allowedSize: 'standard', hasEvCharger: false, isHandicap: false, status: 'available' },
  { id: 'L1-07', floor: 'Level 1 (Ground)', number: 7, allowedSize: 'standard', hasEvCharger: false, isHandicap: true, status: 'reserved' },
  { id: 'L1-08', floor: 'Level 1 (Ground)', number: 8, allowedSize: 'compact', hasEvCharger: false, isHandicap: false, status: 'occupied', currentVehicleId: 'v-5' },
  { id: 'L1-09', floor: 'Level 1 (Ground)', number: 9, allowedSize: 'motorcycle', hasEvCharger: false, isHandicap: false, status: 'occupied', currentVehicleId: 'v-6' },
  { id: 'L1-10', floor: 'Level 1 (Ground)', number: 10, allowedSize: 'motorcycle', hasEvCharger: false, isHandicap: false, status: 'available' },
  { id: 'L1-11', floor: 'Level 1 (Ground)', number: 11, allowedSize: 'motorcycle', hasEvCharger: false, isHandicap: false, status: 'available' },
  { id: 'L1-12', floor: 'Level 1 (Ground)', number: 12, allowedSize: 'standard', hasEvCharger: true, isHandicap: false, status: 'available' },

  // LEVEL 2: Standard & Large (SUVs / Pickups)
  { id: 'L2-01', floor: 'Level 2 (Mid)', number: 1, allowedSize: 'standard', hasEvCharger: true, isHandicap: false, status: 'occupied', currentVehicleId: 'v-7' },
  { id: 'L2-02', floor: 'Level 2 (Mid)', number: 2, allowedSize: 'standard', hasEvCharger: false, isHandicap: false, status: 'occupied', currentVehicleId: 'v-8' },
  { id: 'L2-03', floor: 'Level 2 (Mid)', number: 3, allowedSize: 'standard', hasEvCharger: false, isHandicap: false, status: 'available' },
  { id: 'L2-04', floor: 'Level 2 (Mid)', number: 4, allowedSize: 'large', hasEvCharger: true, isHandicap: false, status: 'occupied', currentVehicleId: 'v-9' },
  { id: 'L2-05', floor: 'Level 2 (Mid)', number: 5, allowedSize: 'large', hasEvCharger: false, isHandicap: false, status: 'occupied', currentVehicleId: 'v-10' },
  { id: 'L2-06', floor: 'Level 2 (Mid)', number: 6, allowedSize: 'large', hasEvCharger: false, isHandicap: true, status: 'available' },
  { id: 'L2-07', floor: 'Level 2 (Mid)', number: 7, allowedSize: 'large', hasEvCharger: false, isHandicap: false, status: 'occupied', currentVehicleId: 'v-11' },
  { id: 'L2-08', floor: 'Level 2 (Mid)', number: 8, allowedSize: 'large', hasEvCharger: false, isHandicap: false, status: 'maintenance' },
  { id: 'L2-09', floor: 'Level 2 (Mid)', number: 9, allowedSize: 'standard', hasEvCharger: false, isHandicap: false, status: 'available' },
  { id: 'L2-10', floor: 'Level 2 (Mid)', number: 10, allowedSize: 'standard', hasEvCharger: false, isHandicap: false, status: 'available' },

  // LEVEL 3: Large, Oversized & Commercial Logistics
  { id: 'L3-01', floor: 'Level 3 (Rooftop & Heavy)', number: 1, allowedSize: 'large', hasEvCharger: false, isHandicap: false, status: 'occupied', currentVehicleId: 'v-12' },
  { id: 'L3-02', floor: 'Level 3 (Rooftop & Heavy)', number: 2, allowedSize: 'large', hasEvCharger: false, isHandicap: false, status: 'available' },
  { id: 'L3-03', floor: 'Level 3 (Rooftop & Heavy)', number: 3, allowedSize: 'oversized', hasEvCharger: false, isHandicap: false, status: 'occupied', currentVehicleId: 'v-13' },
  { id: 'L3-04', floor: 'Level 3 (Rooftop & Heavy)', number: 4, allowedSize: 'oversized', hasEvCharger: true, isHandicap: false, status: 'occupied', currentVehicleId: 'v-14' },
  { id: 'L3-05', floor: 'Level 3 (Rooftop & Heavy)', number: 5, allowedSize: 'oversized', hasEvCharger: false, isHandicap: false, status: 'available' },
  { id: 'L3-06', floor: 'Level 3 (Rooftop & Heavy)', number: 6, allowedSize: 'oversized', hasEvCharger: false, isHandicap: false, status: 'available' },
  { id: 'L3-07', floor: 'Level 3 (Rooftop & Heavy)', number: 7, allowedSize: 'large', hasEvCharger: false, isHandicap: false, status: 'available' },
  { id: 'L3-08', floor: 'Level 3 (Rooftop & Heavy)', number: 8, allowedSize: 'large', hasEvCharger: false, isHandicap: false, status: 'reserved' },
];

export const INITIAL_VEHICLES: ParkedVehicle[] = [
  {
    id: 'v-1',
    plateNumber: '7XKP492',
    driverName: 'Sophia Miller',
    driverPhone: '+1 (555) 234-8901',
    makeModel: 'Nissan Leaf',
    color: '#0284c7', // Sky Blue
    vehicleType: 'electric',
    vehicleSize: 'compact',
    slotId: 'L1-01',
    entryTime: new Date(Date.now() - 1000 * 60 * 145).toISOString(), // ~2.4 hrs ago
    isCharging: true,
    hourlyRate: 6.50, // 4.00 base + 2.50 EV
    notes: 'Handicap badge displayed on mirror',
  },
  {
    id: 'v-2',
    plateNumber: '3TRV819',
    driverName: 'Marcus Chen',
    driverPhone: '+1 (555) 872-1144',
    makeModel: 'Mini Cooper SE',
    color: '#dc2626', // Red
    vehicleType: 'hatchback',
    vehicleSize: 'compact',
    slotId: 'L1-02',
    entryTime: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hr ago
    isCharging: true,
    hourlyRate: 6.50,
    notes: 'Requested full 80% charge',
  },
  {
    id: 'v-3',
    plateNumber: '9XYZ501',
    driverName: 'Elena Rostova',
    driverPhone: '+1 (555) 441-9032',
    makeModel: 'Tesla Model 3',
    color: '#f8fafc', // White
    vehicleType: 'electric',
    vehicleSize: 'standard',
    slotId: 'L1-04',
    entryTime: new Date(Date.now() - 1000 * 60 * 210).toISOString(), // 3.5 hrs ago
    isCharging: true,
    hourlyRate: 8.50,
  },
  {
    id: 'v-4',
    plateNumber: '4KMN667',
    driverName: 'David Kim',
    driverPhone: '+1 (555) 319-5822',
    makeModel: 'Toyota Camry Hybrid',
    color: '#475569', // Slate Gray
    vehicleType: 'sedan',
    vehicleSize: 'standard',
    slotId: 'L1-05',
    entryTime: new Date(Date.now() - 1000 * 60 * 85).toISOString(),
    isCharging: false,
    hourlyRate: 6.00,
  },
  {
    id: 'v-5',
    plateNumber: '6BGH220',
    driverName: 'Chloe Bennett',
    driverPhone: '+1 (555) 629-3310',
    makeModel: 'Volkswagen Golf R',
    color: '#2563eb', // Royal Blue
    vehicleType: 'hatchback',
    vehicleSize: 'compact',
    slotId: 'L1-08',
    entryTime: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
    isCharging: false,
    hourlyRate: 4.00,
  },
  {
    id: 'v-6',
    plateNumber: 'M-5529A',
    driverName: 'Alex Rivera',
    driverPhone: '+1 (555) 902-3841',
    makeModel: 'Yamaha MT-07',
    color: '#0f172a', // Midnight Black
    vehicleType: 'motorcycle',
    vehicleSize: 'motorcycle',
    slotId: 'L1-09',
    entryTime: new Date(Date.now() - 1000 * 60 * 300).toISOString(), // 5 hrs ago
    isCharging: false,
    hourlyRate: 2.50,
  },
  {
    id: 'v-7',
    plateNumber: '5YTR498',
    driverName: 'Sarah Jenkins',
    driverPhone: '+1 (555) 781-9923',
    makeModel: 'Polestar 2',
    color: '#64748b', // Thunder Gray
    vehicleType: 'electric',
    vehicleSize: 'standard',
    slotId: 'L2-01',
    entryTime: new Date(Date.now() - 1000 * 60 * 115).toISOString(),
    isCharging: true,
    hourlyRate: 8.50,
  },
  {
    id: 'v-8',
    plateNumber: '8PLM129',
    driverName: 'Lucas Thorne',
    driverPhone: '+1 (555) 541-2098',
    makeModel: 'BMW 330i xDrive',
    color: '#1e293b', // Dark Sapphire
    vehicleType: 'sedan',
    vehicleSize: 'standard',
    slotId: 'L2-02',
    entryTime: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    isCharging: false,
    hourlyRate: 6.00,
  },
  {
    id: 'v-9',
    plateNumber: '2FST900',
    driverName: 'Jackson Vance',
    driverPhone: '+1 (555) 388-7712',
    makeModel: 'Rivian R1T Electric Truck',
    color: '#059669', // Forest Green
    vehicleType: 'truck',
    vehicleSize: 'large',
    slotId: 'L2-04',
    entryTime: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
    isCharging: true,
    hourlyRate: 11.00, // 8.50 + 2.50
    notes: 'Oversize bed cargo locked',
  },
  {
    id: 'v-10',
    plateNumber: '7HJL413',
    driverName: 'Rachel Green',
    driverPhone: '+1 (555) 431-7722',
    makeModel: 'Toyota RAV4 AWD',
    color: '#e2e8f0', // Pearl Silver
    vehicleType: 'suv',
    vehicleSize: 'large',
    slotId: 'L2-05',
    entryTime: new Date(Date.now() - 1000 * 60 * 70).toISOString(),
    isCharging: false,
    hourlyRate: 8.50,
  },
  {
    id: 'v-11',
    plateNumber: '1WQX884',
    driverName: 'Carlos Mendoza',
    driverPhone: '+1 (555) 674-0992',
    makeModel: 'Ford F-150 Lariat',
    color: '#b45309', // Amber Bronze
    vehicleType: 'truck',
    vehicleSize: 'large',
    slotId: 'L2-07',
    entryTime: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    isCharging: false,
    hourlyRate: 8.50,
  },
  {
    id: 'v-12',
    plateNumber: '9BVT318',
    driverName: 'Tanya Morales',
    driverPhone: '+1 (555) 819-3320',
    makeModel: 'Chevrolet Tahoe High Country',
    color: '#000000', // Onyx Black
    vehicleType: 'suv',
    vehicleSize: 'large',
    slotId: 'L3-01',
    entryTime: new Date(Date.now() - 1000 * 60 * 160).toISOString(),
    isCharging: false,
    hourlyRate: 8.50,
  },
  {
    id: 'v-13',
    plateNumber: 'COMM-8821',
    driverName: 'FedEx Delivery (Sam K.)',
    driverPhone: '+1 (555) 700-1200',
    makeModel: 'Mercedes-Benz Sprinter 3500',
    color: '#ffffff', // Commercial White
    vehicleType: 'van',
    vehicleSize: 'oversized',
    slotId: 'L3-03',
    entryTime: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
    isCharging: false,
    hourlyRate: 12.00,
    notes: 'Express courier staging loading bay access',
  },
  {
    id: 'v-14',
    plateNumber: 'LOG-4490',
    driverName: 'EcoHaul Shuttles',
    driverPhone: '+1 (555) 662-8991',
    makeModel: 'BrightDrop Zevo 600 Electric Van',
    color: '#0ea5e9', // Ocean Blue
    vehicleType: 'van',
    vehicleSize: 'oversized',
    slotId: 'L3-04',
    entryTime: new Date(Date.now() - 1000 * 60 * 190).toISOString(),
    isCharging: true,
    hourlyRate: 14.50, // 12.00 + 2.50
    notes: 'Fleet commercial account auto-billed',
  },
];

export const INITIAL_HISTORY: CompletedSession[] = [
  {
    id: 'hist-1',
    plateNumber: '4ABC102',
    driverName: 'Robert Vance',
    makeModel: 'Honda Civic Sport',
    vehicleType: 'sedan',
    vehicleSize: 'standard',
    slotId: 'L1-06',
    entryTime: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    exitTime: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    durationMinutes: 300,
    totalPaid: 30.00,
  },
  {
    id: 'hist-2',
    plateNumber: '8EVT991',
    driverName: 'Jessica Wu',
    makeModel: 'Hyundai Ioniq 5',
    vehicleType: 'electric',
    vehicleSize: 'standard',
    slotId: 'L1-12',
    entryTime: new Date(Date.now() - 1000 * 60 * 200).toISOString(),
    exitTime: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    durationMinutes: 180,
    totalPaid: 25.50,
  },
];

export function getStoredSlots(): ParkingSlot[] {
  try {
    const raw = localStorage.getItem(SLOTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(SLOTS_STORAGE_KEY, JSON.stringify(INITIAL_SLOTS));
      return INITIAL_SLOTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load slots from storage', e);
    return INITIAL_SLOTS;
  }
}

export function saveSlots(slots: ParkingSlot[]) {
  try {
    localStorage.setItem(SLOTS_STORAGE_KEY, JSON.stringify(slots));
  } catch (e) {
    console.error('Failed to save slots', e);
  }
}

export function getStoredVehicles(): ParkedVehicle[] {
  try {
    const raw = localStorage.getItem(VEHICLES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(VEHICLES_STORAGE_KEY, JSON.stringify(INITIAL_VEHICLES));
      return INITIAL_VEHICLES;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load vehicles from storage', e);
    return INITIAL_VEHICLES;
  }
}

export function saveVehicles(vehicles: ParkedVehicle[]) {
  try {
    localStorage.setItem(VEHICLES_STORAGE_KEY, JSON.stringify(vehicles));
  } catch (e) {
    console.error('Failed to save vehicles', e);
  }
}

export function getStoredHistory(): CompletedSession[] {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(INITIAL_HISTORY));
      return INITIAL_HISTORY;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load history from storage', e);
    return INITIAL_HISTORY;
  }
}

export function saveHistory(history: CompletedSession[]) {
  try {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
  } catch (e) {
    console.error('Failed to save history', e);
  }
}

export function resetToDefaults(): { slots: ParkingSlot[]; vehicles: ParkedVehicle[]; history: CompletedSession[] } {
  localStorage.setItem(SLOTS_STORAGE_KEY, JSON.stringify(INITIAL_SLOTS));
  localStorage.setItem(VEHICLES_STORAGE_KEY, JSON.stringify(INITIAL_VEHICLES));
  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(INITIAL_HISTORY));
  return {
    slots: INITIAL_SLOTS,
    vehicles: INITIAL_VEHICLES,
    history: INITIAL_HISTORY,
  };
}

export function isSizeCompatible(vehicleSize: VehicleSize, slotSize: VehicleSize): boolean {
  const sizeOrder: Record<VehicleSize, number> = {
    motorcycle: 1,
    compact: 2,
    standard: 3,
    large: 4,
    oversized: 5,
  };
  // A slot can accommodate a vehicle if slot size >= vehicle size
  return sizeOrder[slotSize] >= sizeOrder[vehicleSize];
}
