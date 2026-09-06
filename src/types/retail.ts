export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low';

export type AlertType =
  | 'low_stock'
  | 'out_of_stock'
  | 'long_queue'
  | 'crowd_congestion'
  | 'shelf_anomaly';

export interface RetailAlert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  description: string;
  zone: string;
  shelfId?: string;
  counterId?: string;
  timestamp: string;
  acknowledged: boolean;
  resolved: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  edgeConfidence: number; // e.g. 0.94
}

export interface StoreZone {
  id: string;
  name: string;
  category: string;
  currentShoppers: number;
  capacity: number;
  density: 'low' | 'moderate' | 'high' | 'congested';
  avgDwellMinutes: number;
  activeCameraId: string;
  topProduct: string;
  stockHealthPct: number;
  coordinates: { x: number; y: number; width: number; height: number }; // Percentage for SVG map
}

export interface ShelfItem {
  id: string;
  sku: string;
  productName: string;
  category: string;
  zoneId: string;
  capacityUnits: number;
  currentUnits: number;
  stockPercentage: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  lastScannedTime: string;
  facingIssues: boolean;
  cameraConfidence: number;
  imageUrl?: string;
}

export interface CheckoutCounter {
  id: string;
  name: string;
  status: 'open' | 'closed' | 'express';
  queueLength: number;
  estimatedWaitMinutes: number;
  cashierName?: string;
  throughputPerMinute: number;
  lastAssistanceCall?: string;
}

export interface RetailKPIs {
  footfallToday: number;
  footfallChangePct: number;
  customersInside: number;
  maxCapacity: number;
  conversionRatePct: number;
  conversionChangePct: number;
  avgQueueTimeMinutes: number;
  queueTimeChangePct: number;
  staffEfficiencyPct: number;
  staffEfficiencyChangePct: number;
  stockAvailabilityPct: number;
  stockAvailabilityChangePct: number;
  activeAlertsCount: number;
  criticalAlertsCount: number;
}

export interface TrafficHourlyPoint {
  hour: string;
  footfall: number;
  occupancy: number;
  convertedShoppers: number;
  avgWaitSec: number;
}

export interface StaffMember {
  id: string;
  name: string;
  role: 'Store Associate' | 'Cashier' | 'Inventory Lead' | 'Floor Supervisor';
  assignedZone: string;
  status: 'active' | 'on_break' | 'assisting';
  efficiencyScore: number;
  tasksCompleted: number;
}

export interface StaffingRecommendation {
  id: string;
  action: string;
  urgency: 'high' | 'medium' | 'low';
  sourceZone: string;
  targetZone: string;
  reason: string;
  timestamp: string;
  applied: boolean;
  type?: 'open_counter' | 'assign_staff' | 'replenish_shelf' | 'crowd_management' | 'general_ops' | 'realign_planogram';
  metadata?: {
    counterId?: string;
    shelfId?: string;
    zoneId?: string;
    staffId?: string;
    targetRole?: string;
  };
}

export interface DailyReportData {
  date: string;
  totalFootfall: number;
  peakHour: string;
  conversionRate: number;
  totalTransactions: number;
  avgQueueWaitTime: number;
  shelfAvailability: number;
  stockoutIncidents: number;
  staffHoursScheduled: number;
  efficiencyIndex: number;
  customerSatisfactionScore: number;
}
