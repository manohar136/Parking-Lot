export type VehicleSize = 'motorcycle' | 'compact' | 'standard' | 'large' | 'oversized';

export type VehicleType = 
  | 'sedan' 
  | 'suv' 
  | 'hatchback' 
  | 'electric' 
  | 'motorcycle' 
  | 'truck' 
  | 'van' 
  | 'coupe';

export type SlotStatus = 'available' | 'occupied' | 'reserved' | 'maintenance';

export interface ParkingSlot {
  id: string;
  floor: string;
  number: number;
  allowedSize: VehicleSize;
  hasEvCharger: boolean;
  isHandicap: boolean;
  status: SlotStatus;
  currentVehicleId?: string;
}

export interface ParkedVehicle {
  id: string;
  plateNumber: string;
  driverName: string;
  driverPhone: string;
  makeModel: string;
  color: string;
  vehicleType: VehicleType;
  vehicleSize: VehicleSize;
  slotId: string;
  entryTime: string; // ISO String
  isCharging?: boolean;
  notes?: string;
  hourlyRate: number;
}

export interface CompletedSession {
  id: string;
  plateNumber: string;
  driverName: string;
  makeModel: string;
  vehicleType: VehicleType;
  vehicleSize: VehicleSize;
  slotId: string;
  entryTime: string;
  exitTime: string;
  durationMinutes: number;
  totalPaid: number;
}

export interface SizeConfig {
  label: string;
  badgeColor: string;
  description: string;
  baseHourlyRate: number;
  dimensions: string;
}

export const SIZE_CONFIGS: Record<VehicleSize, SizeConfig> = {
  motorcycle: {
    label: 'Motorcycle / Two-Wheeler',
    badgeColor: 'border-purple-500/30 text-purple-400 bg-purple-500/10',
    description: 'Bikes, scooters, moped vehicles (< 2.2m)',
    baseHourlyRate: 2.50,
    dimensions: '1.2m x 2.5m',
  },
  compact: {
    label: 'Compact (Small)',
    badgeColor: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
    description: 'Hatchbacks, city cars, mini EVs (< 4.2m)',
    baseHourlyRate: 4.00,
    dimensions: '2.3m x 4.5m',
  },
  standard: {
    label: 'Standard (Medium)',
    badgeColor: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10',
    description: 'Sedans, crossovers, mid-size wagons (4.2m - 4.9m)',
    baseHourlyRate: 6.00,
    dimensions: '2.5m x 5.0m',
  },
  large: {
    label: 'Large (SUV / Full-Size)',
    badgeColor: 'border-amber-500/30 text-amber-400 bg-amber-500/10',
    description: 'Full-size SUVs, pickup trucks, minivans (> 5.0m)',
    baseHourlyRate: 8.50,
    dimensions: '2.8m x 5.5m',
  },
  oversized: {
    label: 'Oversized (Commercial / Bus)',
    badgeColor: 'border-rose-500/30 text-rose-400 bg-rose-500/10',
    description: 'Cargo vans, commercial trucks, passenger shuttles (> 6.0m)',
    baseHourlyRate: 12.00,
    dimensions: '3.2m x 7.0m',
  },
};

export const VEHICLE_TYPE_CONFIGS: Record<VehicleType, { label: string; defaultSize: VehicleSize; iconName: string }> = {
  sedan: { label: 'Sedan', defaultSize: 'standard', iconName: 'Car' },
  suv: { label: 'SUV', defaultSize: 'large', iconName: 'CarFront' },
  hatchback: { label: 'Hatchback', defaultSize: 'compact', iconName: 'Car' },
  electric: { label: 'Electric (EV)', defaultSize: 'standard', iconName: 'Zap' },
  motorcycle: { label: 'Motorcycle', defaultSize: 'motorcycle', iconName: 'Bike' },
  truck: { label: 'Pickup / Truck', defaultSize: 'large', iconName: 'Truck' },
  van: { label: 'Van / Shuttle', defaultSize: 'oversized', iconName: 'Bus' },
  coupe: { label: 'Coupe / Sports', defaultSize: 'compact', iconName: 'Gauge' },
};
