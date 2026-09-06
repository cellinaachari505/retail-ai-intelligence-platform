import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  StoreZone,
  ShelfItem,
  CheckoutCounter,
  RetailAlert,
  RetailKPIs,
  TrafficHourlyPoint,
  StaffMember,
  StaffingRecommendation,
  DailyReportData,
} from '../types/retail';
import {
  INITIAL_ZONES,
  INITIAL_SHELVES,
  INITIAL_COUNTERS,
  INITIAL_ALERTS,
  INITIAL_HOURLY_TRAFFIC,
  INITIAL_STAFF,
  INITIAL_RECOMMENDATIONS,
  INITIAL_DAILY_REPORTS,
  INITIAL_WEEKLY_REPORTS,
  generateOperationalRecommendations,
} from '../services/retailDataService';

interface RetailContextType {
  zones: StoreZone[];
  shelves: ShelfItem[];
  counters: CheckoutCounter[];
  alerts: RetailAlert[];
  kpis: RetailKPIs;
  hourlyTraffic: TrafficHourlyPoint[];
  staff: StaffMember[];
  recommendations: StaffingRecommendation[];
  reports: DailyReportData[];
  isSimulating: boolean;
  selectedZone: StoreZone | null;
  setSelectedZone: (zone: StoreZone | null) => void;
  toggleSimulation: () => void;
  acknowledgeAlert: (alertId: string, staffName?: string) => void;
  resolveAlert: (alertId: string) => void;
  toggleCounter: (counterId: string) => void;
  applyRecommendation: (recId: string) => void;
  refreshRecommendations: () => void;
  triggerDemoAlert: (type: 'queue' | 'stock' | 'crowd' | 'low_stock' | 'shelf_availability') => void;
  exportCSV: (type?: 'daily' | 'weekly' | 'inventory' | 'alerts') => void;
  restockShelf: (shelfId: string) => void;
}

const RetailContext = createContext<RetailContextType | undefined>(undefined);

export const RetailProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [zones, setZones] = useState<StoreZone[]>(INITIAL_ZONES);
  const [shelves, setShelves] = useState<ShelfItem[]>(INITIAL_SHELVES);
  const [counters, setCounters] = useState<CheckoutCounter[]>(INITIAL_COUNTERS);
  const [alerts, setAlerts] = useState<RetailAlert[]>(INITIAL_ALERTS);
  const [hourlyTraffic] = useState<TrafficHourlyPoint[]>(INITIAL_HOURLY_TRAFFIC);
  const [staff, setStaff] = useState<StaffMember[]>(INITIAL_STAFF);
  const [recommendations, setRecommendations] = useState<StaffingRecommendation[]>(INITIAL_RECOMMENDATIONS);
  const [reports] = useState<DailyReportData[]>(INITIAL_DAILY_REPORTS);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [selectedZone, setSelectedZone] = useState<StoreZone | null>(null);
  const [refreshCount, setRefreshCount] = useState<number>(1);

  // Derive dynamic KPIs
  const customersInside = zones.reduce((acc, z) => acc + z.currentShoppers, 0);
  const activeAlerts = alerts.filter(a => !a.resolved);
  const criticalAlertsCount = activeAlerts.filter(a => a.severity === 'critical').length;

  const totalCapacity = shelves.reduce((sum, s) => sum + s.capacityUnits, 0);
  const totalUnits = shelves.reduce((sum, s) => sum + s.currentUnits, 0);
  const stockAvailabilityPct = Math.round((totalUnits / (totalCapacity || 1)) * 100);

  const openCounters = counters.filter(c => c.status === 'open' || c.status === 'express');
  const avgWaitTime = openCounters.length > 0
    ? Number((openCounters.reduce((acc, c) => acc + c.estimatedWaitMinutes, 0) / openCounters.length).toFixed(1))
    : 0;

  const kpis: RetailKPIs = {
    footfallToday: 2480 + Math.floor(customersInside * 1.8),
    footfallChangePct: 14.2,
    customersInside,
    maxCapacity: 220,
    conversionRatePct: 78.4,
    conversionChangePct: 3.1,
    avgQueueTimeMinutes: avgWaitTime,
    queueTimeChangePct: -12.5,
    staffEfficiencyPct: 91.2,
    staffEfficiencyChangePct: 4.8,
    stockAvailabilityPct,
    stockAvailabilityChangePct: -2.4,
    activeAlertsCount: activeAlerts.length,
    criticalAlertsCount,
  };

  // Real-time edge simulation ticker
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      // Modulate shopper positions slightly across zones
      setZones(prev =>
        prev.map(z => {
          const delta = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
          const updatedShoppers = Math.max(2, Math.min(z.capacity + 5, z.currentShoppers + delta));
          let density: 'low' | 'moderate' | 'high' | 'congested' = 'low';
          const ratio = updatedShoppers / z.capacity;
          if (ratio > 0.85) density = 'congested';
          else if (ratio > 0.65) density = 'high';
          else if (ratio > 0.35) density = 'moderate';

          return {
            ...z,
            currentShoppers: updatedShoppers,
            density,
          };
        })
      );

      // Modulate queues slightly
      setCounters(prev =>
        prev.map(c => {
          if (c.status === 'closed') return c;
          const delta = Math.floor(Math.random() * 3) - 1;
          const newQueue = Math.max(0, Math.min(14, c.queueLength + delta));
          const waitTime = Number((newQueue * 0.8 + 0.5).toFixed(1));
          return {
            ...c,
            queueLength: newQueue,
            estimatedWaitMinutes: waitTime,
          };
        })
      );
    }, 4500);

    return () => clearInterval(interval);
  }, [isSimulating]);

  const toggleSimulation = useCallback(() => {
    setIsSimulating(prev => !prev);
  }, []);

  const acknowledgeAlert = useCallback((alertId: string, staffName: string = 'Store Associate') => {
    setAlerts(prev =>
      prev.map(a => {
        if (a.id === alertId) {
          return {
            ...a,
            acknowledged: true,
            acknowledgedBy: staffName,
            acknowledgedAt: 'Just now',
          };
        }
        return a;
      })
    );
  }, []);

  const resolveAlert = useCallback((alertId: string) => {
    setAlerts(prev =>
      prev.map(a => {
        if (a.id === alertId) {
          return {
            ...a,
            acknowledged: true,
            resolved: true,
          };
        }
        return a;
      })
    );
  }, []);

  const toggleCounter = useCallback((counterId: string) => {
    setCounters(prev =>
      prev.map(c => {
        if (c.id === counterId) {
          const newStatus = c.status === 'closed' ? 'open' : 'closed';
          return {
            ...c,
            status: newStatus,
            queueLength: newStatus === 'open' ? 2 : 0,
            estimatedWaitMinutes: newStatus === 'open' ? 1.5 : 0,
            cashierName: newStatus === 'open' ? 'Associate Reassigned' : 'Unassigned',
            throughputPerMinute: newStatus === 'open' ? 2.4 : 0,
          };
        }
        // Balance queue from other open counters if opening a new one
        if (c.status === 'open' && c.queueLength > 3) {
          return {
            ...c,
            queueLength: Math.max(2, c.queueLength - 2),
            estimatedWaitMinutes: Math.max(1.8, Number((c.estimatedWaitMinutes * 0.7).toFixed(1))),
          };
        }
        return c;
      })
    );
  }, []);

  const restockShelf = useCallback((shelfId: string) => {
    setShelves(prev =>
      prev.map(s => {
        if (s.id === shelfId) {
          return {
            ...s,
            currentUnits: s.capacityUnits,
            stockPercentage: 100,
            status: 'in_stock',
            lastScannedTime: 'Just now',
            facingIssues: false,
          };
        }
        return s;
      })
    );

    // Also auto-resolve matching alerts
    setAlerts(prev =>
      prev.map(a => {
        if (a.shelfId === shelfId) {
          return { ...a, acknowledged: true, resolved: true };
        }
        return a;
      })
    );
  }, []);

  const applyRecommendation = useCallback((recId: string) => {
    let targetRec: StaffingRecommendation | undefined;
    setRecommendations(prev => {
      targetRec = prev.find(r => r.id === recId);
      return prev.map(r => (r.id === recId ? { ...r, applied: true } : r));
    });

    if (!targetRec) return;

    const actionText = (targetRec as StaffingRecommendation).action.toLowerCase();
    const meta = (targetRec as StaffingRecommendation).metadata || {};

    // 1. Open / Deploy Associate to Counter 4
    if (actionText.includes('counter 4') || meta.counterId === 'counter-4') {
      setCounters(prev =>
        prev.map(c => {
          if (c.id === 'counter-4') {
            return {
              ...c,
              status: 'open',
              queueLength: 1,
              estimatedWaitMinutes: 1.2,
              cashierName: 'Rajesh Kumar (Reassigned)',
              throughputPerMinute: 2.6,
            };
          }
          if (c.status === 'open' && c.queueLength > 3) {
            return {
              ...c,
              queueLength: Math.max(2, c.queueLength - 2),
              estimatedWaitMinutes: Math.max(1.8, Number((c.estimatedWaitMinutes * 0.7).toFixed(1))),
            };
          }
          return c;
        })
      );
      setStaff(prev =>
        prev.map(s =>
          s.id === 'st-4'
            ? { ...s, assignedZone: 'Billing Counters & Queue Area', status: 'active', tasksCompleted: s.tasksCompleted + 1 }
            : s
        )
      );
    }
    // 2. Prepare / Open Counter 5
    else if (actionText.includes('counter 5') || meta.counterId === 'counter-5') {
      setCounters(prev =>
        prev.map(c => {
          if (c.id === 'counter-5') {
            return {
              ...c,
              status: 'open',
              queueLength: 1,
              estimatedWaitMinutes: 0.9,
              cashierName: 'Self-Service Assist (Ready)',
              throughputPerMinute: 3.8,
            };
          }
          return c;
        })
      );
      setStaff(prev =>
        prev.map(s =>
          s.id === 'st-5'
            ? { ...s, tasksCompleted: s.tasksCompleted + 1 }
            : s
        )
      );
    }
    // 3. Replenish Amul Taaza Milk 1L
    else if (actionText.includes('milk') || actionText.includes('amul') || meta.shelfId === 'shelf-a1') {
      restockShelf('shelf-a1');
      setStaff(prev =>
        prev.map(s =>
          s.id === 'st-6'
            ? { ...s, tasksCompleted: s.tasksCompleted + 1 }
            : s
        )
      );
    }
    // 4. Replenish Atta
    else if (actionText.includes('atta') || meta.shelfId === 'shelf-a2') {
      restockShelf('shelf-a2');
      setStaff(prev =>
        prev.map(s =>
          s.id === 'st-4'
            ? { ...s, tasksCompleted: s.tasksCompleted + 1 }
            : s
        )
      );
    }
    // 5. Replenish Oil
    else if (actionText.includes('oil') || meta.shelfId === 'shelf-a3') {
      restockShelf('shelf-a3');
      setStaff(prev =>
        prev.map(s =>
          s.id === 'st-5'
            ? { ...s, tasksCompleted: s.tasksCompleted + 1 }
            : s
        )
      );
    }
    // 6. Assign Associate to Dairy
    else if (actionText.includes('dairy') || meta.targetRole === 'Dairy') {
      setStaff(prev =>
        prev.map(s =>
          s.id === 'st-6'
            ? { ...s, assignedZone: 'Fresh Produce & Dairy', status: 'active', tasksCompleted: s.tasksCompleted + 1 }
            : s
        )
      );
      setZones(prev =>
        prev.map(z =>
          z.id === 'zone-2'
            ? {
                ...z,
                density: 'moderate',
                currentShoppers: Math.max(8, z.currentShoppers - 4),
                avgDwellMinutes: Math.max(2.4, Number((z.avgDwellMinutes * 0.8).toFixed(1))),
              }
            : z
        )
      );
    }
    // 7. Assign Associate to Fresh Produce
    else if (actionText.includes('fresh produce') || meta.targetRole === 'Produce') {
      setStaff(prev =>
        prev.map(s =>
          s.id === 'st-4'
            ? { ...s, assignedZone: 'Fresh Produce & Dairy', status: 'active', tasksCompleted: s.tasksCompleted + 1 }
            : s
        )
      );
      setZones(prev =>
        prev.map(z =>
          z.id === 'zone-2'
            ? {
                ...z,
                density: 'moderate',
                avgDwellMinutes: Math.max(2.1, Number((z.avgDwellMinutes * 0.75).toFixed(1))),
              }
            : z
        )
      );
    }
    // 8. General / Planogram / Facing fallback
    else {
      if (meta.shelfId) {
        restockShelf(meta.shelfId);
      }
      setStaff(prev =>
        prev.map((s, idx) =>
          idx === 0 ? { ...s, tasksCompleted: s.tasksCompleted + 1 } : s
        )
      );
    }
  }, [restockShelf]);

  const refreshRecommendations = useCallback(() => {
    setRefreshCount(prevCount => {
      const nextIteration = prevCount + 1;
      const newRecs = generateOperationalRecommendations(
        {
          counters,
          shelves,
          zones,
          staff,
        },
        nextIteration
      );
      setRecommendations(newRecs);
      return nextIteration;
    });
  }, [counters, shelves, zones, staff]);

  const triggerDemoAlert = useCallback((type: 'queue' | 'stock' | 'crowd' | 'low_stock' | 'shelf_availability') => {
    const newId = `alt-${Date.now().toString().slice(-4)}`;
    let newAlert: RetailAlert;

    if (type === 'queue') {
      newAlert = {
        id: newId,
        type: 'long_queue',
        severity: 'critical',
        title: 'Rapid Queue Surge Detected at Billing',
        description: 'Edge camera CAM-EDGE-07 detected 9 customers arriving simultaneously. Average wait spiked to 7.8 mins.',
        zone: 'Billing Counters & Queue Area',
        counterId: 'counter-3',
        timestamp: 'Just now',
        acknowledged: false,
        resolved: false,
        edgeConfidence: 0.97,
      };
      // Increase queue length
      setCounters(prev =>
        prev.map(c => (c.id === 'counter-3' ? { ...c, queueLength: c.queueLength + 5 } : c))
      );
    } else if (type === 'stock') {
      newAlert = {
        id: newId,
        type: 'out_of_stock',
        severity: 'critical',
        title: 'Critical Out of Stock: Fortune Sunflower Oil 5L',
        description: 'Shelf A3 empty facing detected by CAM-EDGE-03. Customer reached for missing SKU.',
        zone: 'Packaged Grocery & Staples',
        shelfId: 'shelf-a3',
        timestamp: 'Just now',
        acknowledged: false,
        resolved: false,
        edgeConfidence: 0.99,
      };
      setShelves(prev =>
        prev.map(s =>
          s.id === 'shelf-a3'
            ? { ...s, currentUnits: 0, stockPercentage: 0, status: 'out_of_stock', facingIssues: true }
            : s
        )
      );
    } else if (type === 'low_stock') {
      newAlert = {
        id: newId,
        type: 'low_stock',
        severity: 'high',
        title: 'Low Stock Alert: Aashirvaad Atta 10kg',
        description: 'Facing count below replenishment threshold (4 units remaining). Reorder recommendation dispatched.',
        zone: 'Packaged Grocery & Staples',
        shelfId: 'shelf-a2',
        timestamp: 'Just now',
        acknowledged: false,
        resolved: false,
        edgeConfidence: 0.95,
      };
      setShelves(prev =>
        prev.map(s =>
          s.id === 'shelf-a2'
            ? { ...s, currentUnits: 4, stockPercentage: 16, status: 'low_stock', facingIssues: true }
            : s
        )
      );
    } else if (type === 'shelf_availability') {
      newAlert = {
        id: newId,
        type: 'shelf_anomaly',
        severity: 'medium',
        title: 'Shelf Availability: Planogram Void & Disarrangement',
        description: 'CAM-EDGE-05 detected empty facing gap and misplaced SKUs on Personal Care display aisle.',
        zone: 'Personal Care & Home Essentials',
        shelfId: 'shelf-a7',
        timestamp: 'Just now',
        acknowledged: false,
        resolved: false,
        edgeConfidence: 0.92,
      };
      setShelves(prev =>
        prev.map(s =>
          s.id === 'shelf-a7'
            ? { ...s, facingIssues: true }
            : s
        )
      );
    } else {
      newAlert = {
        id: newId,
        type: 'crowd_congestion',
        severity: 'high',
        title: 'Sudden Congestion: Entrance & Deals',
        description: 'High cluster density (>30 shoppers) detected near promo display. Social distancing/flow impeded.',
        zone: 'Entrance & Daily Deals',
        timestamp: 'Just now',
        acknowledged: false,
        resolved: false,
        edgeConfidence: 0.94,
      };
      setZones(prev =>
        prev.map(z => (z.id === 'zone-1' ? { ...z, currentShoppers: 34, density: 'congested' } : z))
      );
    }

    setAlerts(prev => [newAlert, ...prev]);
  }, []);

  const exportCSV = useCallback((type: 'daily' | 'weekly' | 'inventory' | 'alerts' = 'daily') => {
    let csvContent = '';
    let fileName = `retail-intelligence-${type}-${new Date().toISOString().slice(0, 10)}.csv`;

    if (type === 'daily') {
      csvContent = 'Date,Total Footfall,Peak Hour,Conversion Rate (%),Total Transactions,Avg Queue Wait Time (min),Shelf Availability (%),Stockout Incidents,Staff Hours,Efficiency Index (%)\n';
      reports.forEach(r => {
        csvContent += `"${r.date}",${r.totalFootfall},"${r.peakHour}",${r.conversionRate},${r.totalTransactions},${r.avgQueueWaitTime},${r.shelfAvailability},${r.stockoutIncidents},${r.staffHoursScheduled},${r.efficiencyIndex}\n`;
      });
    } else if (type === 'weekly') {
      csvContent = 'Week,Total Footfall,Peak Hour,Conversion Rate (%),Total Transactions,Avg Queue Wait Time (min),Shelf Availability (%),Stockout Incidents,Staff Hours,Efficiency Index (%),CSAT\n';
      INITIAL_WEEKLY_REPORTS.forEach(r => {
        csvContent += `"${r.date}",${r.totalFootfall},"${r.peakHour}",${r.conversionRate},${r.totalTransactions},${r.avgQueueWaitTime},${r.shelfAvailability},${r.stockoutIncidents},${r.staffHoursScheduled},${r.efficiencyIndex},${r.customerSatisfactionScore}\n`;
      });
    } else if (type === 'inventory') {
      csvContent = 'SKU,Product Name,Category,Zone,Capacity,Current Units,Stock Percentage (%),Status,Facing Issue,Camera Confidence\n';
      shelves.forEach(s => {
        csvContent += `"${s.sku}","${s.productName}","${s.category}","${s.zoneId}",${s.capacityUnits},${s.currentUnits},${s.stockPercentage},"${s.status}",${s.facingIssues},${s.cameraConfidence}\n`;
      });
    } else {
      csvContent = 'Alert ID,Severity,Type,Title,Zone,Timestamp,Status,Acknowledged By,Confidence\n';
      alerts.forEach(a => {
        csvContent += `"${a.id}","${a.severity}","${a.type}","${a.title}","${a.zone}","${a.timestamp}","${a.resolved ? 'Resolved' : a.acknowledged ? 'Acknowledged' : 'Active'}","${a.acknowledgedBy || 'None'}",${a.edgeConfidence}\n`;
      });
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [reports, shelves, alerts]);

  return (
    <RetailContext.Provider
      value={{
        zones,
        shelves,
        counters,
        alerts,
        kpis,
        hourlyTraffic,
        staff,
        recommendations,
        reports,
        isSimulating,
        selectedZone,
        setSelectedZone,
        toggleSimulation,
        acknowledgeAlert,
        resolveAlert,
        toggleCounter,
        applyRecommendation,
        refreshRecommendations,
        triggerDemoAlert,
        exportCSV,
        restockShelf,
      }}
    >
      {children}
    </RetailContext.Provider>
  );
};

export const useRetail = () => {
  const context = useContext(RetailContext);
  if (!context) {
    throw new Error('useRetail must be used within a RetailProvider');
  }
  return context;
};
