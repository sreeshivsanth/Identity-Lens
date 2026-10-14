import { createContext, useContext, useState, useEffect } from 'react';
import { generateFindingsForPersona } from '../utils/findingsGenerator';
import { useAuth } from './AuthContext';

const IdentityScanContext = createContext(null);

const CLEAN_BASELINE = {
  activePersona: null,
  hasCompletedInitialScan: false,
  exposureScore: {
    current: 0,
    previous: 0,
    trend: 'neutral',
    breakdown: {
      breachExposure: 0,
      dataBrokerPresence: 0,
      negativeSentiment: 0,
      shadowAccounts: 0,
      darkWebMentions: 0,
    },
    history: [],
  },
  dashboardStats: {
    totalExposures: { value: 0, change: 0, direction: 'neutral' },
    breachesDetected: { value: 0, change: 0, direction: 'neutral' },
    deletionsSent: { value: 0, change: 0, direction: 'neutral' },
    activeMonitors: { value: 0, change: 0, direction: 'neutral' },
  },
  scanResults: [],
  breachData: [],
  darkWebFindings: [],
  shadowAccounts: [],
  sentimentData: {
    overallScore: 0,
    sentimentDistribution: { positive: 0, neutral: 0, negative: 0 },
    aspectScores: [
      { aspect: 'Code Quality', score: 0, status: 'neutral' },
      { aspect: 'Technical Reputation', score: 0, status: 'neutral' },
      { aspect: 'Responsiveness', score: 0, status: 'neutral' },
      { aspect: 'Content Quality', score: 0, status: 'neutral' },
    ],
    timeline: [],
    mentions: [],
  },
  deletionQueue: [],
  generatedReports: [],
  activityLog: [],
};

export function IdentityScanProvider({ children }) {
  const { currentUser } = useAuth();
  const storageKey = currentUser ? `identitylens_scan_data_${currentUser.id || 'anonymous'}` : 'identitylens_scan_data_anon';

  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure no legacy Alex Morgan in saved persona
        if (parsed.activePersona?.fullName?.includes('Alex Morgan') || parsed.activePersona?.email?.includes('alex.morgan')) {
          localStorage.removeItem(storageKey);
          return CLEAN_BASELINE;
        }
        return parsed;
      }
    } catch (e) {
      // fallback
    }
    return CLEAN_BASELINE;
  });

  // Sync to localStorage
  useEffect(() => {
    if (state.hasCompletedInitialScan) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(state));
      } catch (e) {
        // ignore
      }
    }
  }, [state, storageKey]);

  // Execute new scan and propagate to all views
  const executeScan = (targetParams, customFindings = null) => {
    const findings = customFindings || generateFindingsForPersona(targetParams);
    const newState = {
      activePersona: findings.targetPersona,
      hasCompletedInitialScan: true,
      exposureScore: findings.exposureScore,
      dashboardStats: findings.dashboardStats,
      scanResults: findings.scanResults || findings.dataBrokers || [],
      breachData: findings.breachData || [],
      darkWebFindings: findings.darkWebFindings || [],
      shadowAccounts: findings.shadowAccounts || [],
      sentimentData: findings.sentimentData || CLEAN_BASELINE.sentimentData,
      deletionQueue: findings.deletionQueue || [],
      generatedReports: findings.generatedReports || [],
      activityLog: findings.activityLog || [],
    };
    setState(newState);
    try {
      localStorage.setItem(storageKey, JSON.stringify(newState));
    } catch (e) {
      // ignore
    }
    return newState;
  };

  // Compile on-demand report dynamically for the current persona
  const generateReport = (type = 'Executive Dossier') => {
    const persona = state.activePersona || {
      fullName: currentUser?.name || 'Verified Identity',
      email: currentUser?.email || 'target@identitylens.io',
    };
    const reportId = `rep-00${state.generatedReports.length + 1}`;
    const newReport = {
      id: reportId,
      title: `${type} — ${persona.fullName}`,
      type: type,
      date: new Date().toISOString().slice(0, 10),
      format: 'PDF / JSON',
      riskScore: state.exposureScore.current || 25,
      findingsCount: state.scanResults.length + state.breachData.length + state.shadowAccounts.length,
      status: 'Ready',
      targetName: persona.fullName,
      targetEmail: persona.email,
      summary: `Certified digital footprint audit generated dynamically for ${persona.fullName}. Includes ${state.scanResults.length} data broker records, ${state.breachData.length} credential exposures, and ${state.shadowAccounts.length} platform footprints.`,
    };

    setState((prev) => {
      const updatedReports = [newReport, ...prev.generatedReports];
      const updatedActivity = [
        {
          id: `act-${Date.now()}`,
          type: 'report',
          title: `Generated ${type}`,
          detail: `Compiled official statutory audit report for ${persona.fullName}.`,
          timestamp: new Date().toISOString(),
          icon: 'FileText',
          severity: 'info',
        },
        ...prev.activityLog,
      ];
      return {
        ...prev,
        generatedReports: updatedReports,
        activityLog: updatedActivity,
      };
    });

    return newReport;
  };

  // Delete / Remediate selected footprints
  const deleteFootprints = (footprintIds) => {
    const idSet = new Set(footprintIds);
    setState((prev) => {
      const updatedBrokers = prev.scanResults.map((item) =>
        idSet.has(item.id)
          ? { ...item, status: 'deletion-sent', estimatedRemoval: '14-21 days (Statutory Demand)' }
          : item
      );
      const updatedQueue = prev.deletionQueue.map((task) =>
        idSet.has(task.id) || idSet.has(`sr-${task.id.replace('del-', '')}`)
          ? { ...task, status: 'statutory-in-flight', dispatchedDate: new Date().toISOString().slice(0, 10) }
          : task
      );
      const updatedActivity = [
        {
          id: `act-${Date.now()}`,
          type: 'remediation',
          title: `Dispatched Removal Protocol`,
          detail: `Executed statutory deletion demand for ${footprintIds.length} exposed records.`,
          timestamp: new Date().toISOString(),
          icon: 'CheckCircle2',
          severity: 'success',
        },
        ...prev.activityLog,
      ];
      return {
        ...prev,
        scanResults: updatedBrokers,
        deletionQueue: updatedQueue,
        dashboardStats: {
          ...prev.dashboardStats,
          deletionsSent: {
            ...prev.dashboardStats.deletionsSent,
            value: prev.dashboardStats.deletionsSent.value + footprintIds.length,
          },
        },
        activityLog: updatedActivity,
      };
    });
  };

  // Keep / Whitelist selected footprints
  const keepFootprints = (footprintIds) => {
    const idSet = new Set(footprintIds);
    setState((prev) => {
      const updatedBrokers = prev.scanResults.map((item) =>
        idSet.has(item.id) ? { ...item, status: 'retained-by-choice' } : item
      );
      return {
        ...prev,
        scanResults: updatedBrokers,
      };
    });
  };

  // Reset to pristine zero-footprint state
  const clearScan = () => {
    setState(CLEAN_BASELINE);
    try {
      localStorage.removeItem(storageKey);
    } catch (e) {
      // ignore
    }
  };

  return (
    <IdentityScanContext.Provider
      value={{
        activePersona: state.activePersona,
        hasCompletedInitialScan: state.hasCompletedInitialScan,
        exposureScore: state.exposureScore,
        dashboardStats: state.dashboardStats,
        scanResults: state.scanResults,
        breachData: state.breachData,
        darkWebFindings: state.darkWebFindings,
        shadowAccounts: state.shadowAccounts,
        sentimentData: state.sentimentData,
        deletionQueue: state.deletionQueue,
        generatedReports: state.generatedReports,
        activityLog: state.activityLog,
        executeScan,
        generateReport,
        deleteFootprints,
        keepFootprints,
        clearScan,
      }}
    >
      {children}
    </IdentityScanContext.Provider>
  );
}

export function useIdentityScan() {
  const context = useContext(IdentityScanContext);
  if (!context) {
    throw new Error('useIdentityScan must be used within an IdentityScanProvider');
  }
  return context;
}
