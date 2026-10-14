/**
 * IdentityLens — Clean Data Fixtures & Schema Definitions
 * ALL legacy mock personas ("Alex Morgan") have been permanently purged.
 * Initial baseline is clean (Zero Exposures, Unindexed State).
 * Real data is populated dynamically by IdentityScanContext.
 */

import { generateFindingsForPersona } from '../utils/findingsGenerator';

export { generateFindingsForPersona };

// Clean User Reference
export const mockUser = null;

// Clean Zero-Footprint Baseline Score
export const exposureScore = {
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
};

// Clean Dashboard Stats
export const dashboardStats = {
  totalExposures: { value: 0, change: 0, direction: 'neutral' },
  breachesDetected: { value: 0, change: 0, direction: 'neutral' },
  deletionsSent: { value: 0, change: 0, direction: 'neutral' },
  activeMonitors: { value: 0, change: 0, direction: 'neutral' },
};

// Clean Arrays for Initial State
export const scanResults = [];
export const breachData = [];
export const darkWebFindings = [];
export const usernameResults = [];
export const deletionQueue = [];
export const generatedReports = [];
export const activityLog = [];

// Clean Sentiment Baseline
export const sentimentData = {
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
};

// Privacy-First System Settings (Manual Deletion Inspection Defaulted)
export const systemSettings = {
  zeroKnowledgeEnabled: true,
  clientSalt: 'a9f8e43c9120bc71',
  keyDerivationRounds: 100000,
  autoScanFrequency: 'weekly',
  autoRemediateBrokers: false, // Manual inspection first!
  retentionDays: 0,            // Zero-knowledge storage on central server
  notifications: {
    email: true,
    slack: false,
    discord: false,
    webhookUrl: '',
  },
  apiKeys: {
    haveIBeenPwned: 'configured',
    deHashed: 'configured',
    spiderFoot: 'active',
    capSolver: 'active',
    perspective: 'configured',
  },
};
