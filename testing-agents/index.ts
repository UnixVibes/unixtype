// Main export file for all testing agents
// Provides a unified interface to access all testing functionality

// Individual testing agents
export { runFunctionalTests } from './functional-testing-agent';
export { runAccessibilityTests } from './accessibility-testing-agent';
export { runMobileTests } from './mobile-testing-agent';
export { runNavigationTests } from './navigation-testing-agent';
export { runPerformanceTests } from './performance-testing-agent';
export { runUsabilityTests } from './usability-testing-agent';
export { runSecurityTests } from './security-testing-agent';
export { runCrossBrowserTests } from './cross-browser-testing-agent';

// Types for individual agents
export type { 
  FunctionalTestResult, 
  FunctionalTestReport 
} from './functional-testing-agent';

export type { 
  AccessibilityTestResult, 
  AccessibilityTestReport 
} from './accessibility-testing-agent';

export type { 
  MobileTestResult, 
  MobileTestReport 
} from './mobile-testing-agent';

export type { 
  NavigationTestResult, 
  NavigationTestReport 
} from './navigation-testing-agent';

export type { 
  PerformanceTestResult, 
  PerformanceTestReport 
} from './performance-testing-agent';

export type { 
  UsabilityTestResult, 
  UsabilityTestReport 
} from './usability-testing-agent';

export type { 
  SecurityTestResult, 
  SecurityTestReport 
} from './security-testing-agent';

export type { 
  CrossBrowserTestResult, 
  CrossBrowserTestReport 
} from './cross-browser-testing-agent';

// Orchestrator and report generator
export { 
  testOrchestrator, 
  TestOrchestrator,
  type TestAgent,
  type OrchestratedTestResult,
  type ComprehensiveTestReport 
} from './test-orchestrator';

export { 
  testReportGenerator,
  TestReportGenerator,
  type ReportOptions,
  type GeneratedReport 
} from './test-report-generator';

// Utility functions for quick testing
export const runQuickTests = async () => {
  const { testOrchestrator } = await import('./test-orchestrator');
  return testOrchestrator.runSpecificTests(['functional', 'accessibility']);
};

export const runFullTestSuite = async () => {
  const { testOrchestrator } = await import('./test-orchestrator');
  return testOrchestrator.runAllTests();
};

export const generateQuickReport = async (report: any) => {
  const { testReportGenerator } = await import('./test-report-generator');
  return testReportGenerator.generateReport(report, {
    format: 'html',
    includeDetails: true,
    includeRecommendations: true,
    includeCharts: false
  });
};

// Test categories configuration
export const TEST_CATEGORIES = {
  FUNCTIONAL: 'functional',
  ACCESSIBILITY: 'accessibility',
  MOBILE: 'mobile',
  NAVIGATION: 'navigation',
  PERFORMANCE: 'performance',
  USABILITY: 'usability',
  SECURITY: 'security',
  CROSS_BROWSER: 'cross-browser'
} as const;

// Test priorities configuration
export const TEST_PRIORITIES = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
} as const;

// Default test configurations
export const DEFAULT_TEST_CONFIGS = {
  QUICK: {
    categories: ['functional', 'accessibility'],
    name: 'Quick Test Suite',
    description: 'Essential functionality and accessibility tests'
  },
  STANDARD: {
    categories: ['functional', 'accessibility', 'performance', 'usability'],
    name: 'Standard Test Suite',
    description: 'Core functionality with performance and usability testing'
  },
  COMPREHENSIVE: {
    categories: Object.values(TEST_CATEGORIES),
    name: 'Comprehensive Test Suite',
    description: 'Complete testing coverage across all categories'
  },
  MOBILE_FOCUS: {
    categories: ['mobile', 'accessibility', 'usability'],
    name: 'Mobile Focus Test Suite',
    description: 'Mobile-specific testing with accessibility and usability'
  },
  SECURITY_FOCUS: {
    categories: ['security', 'functional', 'accessibility'],
    name: 'Security Focus Test Suite',
    description: 'Security testing with core functionality validation'
  }
} as const;

// Test result status utilities
export const getStatusColor = (status: string) => {
  switch (status) {
    case 'pass': return '#10b981';
    case 'warning': return '#f59e0b';
    case 'fail': return '#ef4444';
    default: return '#6b7280';
  }
};

export const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pass': return '✅';
    case 'warning': return '⚠️';
    case 'fail': return '❌';
    default: return '❓';
  }
};

// Score utilities
export const getGradeFromScore = (score: number): 'A+' | 'A' | 'B' | 'C' | 'D' | 'F' => {
  if (score >= 95) return 'A+';
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
};

export const getGradeColor = (grade: string) => {
  if (grade.startsWith('A')) return '#10b981';
  if (grade === 'B') return '#3b82f6';
  if (grade === 'C') return '#f59e0b';
  return '#ef4444';
};

// Export everything as a unified testing suite
export const UnixTypeTestSuite = {
  // Individual agents
  functional: { runTests: () => import('./functional-testing-agent').then(m => m.runFunctionalTests()) },
  accessibility: { runTests: () => import('./accessibility-testing-agent').then(m => m.runAccessibilityTests()) },
  mobile: { runTests: () => import('./mobile-testing-agent').then(m => m.runMobileTests()) },
  navigation: { runTests: () => import('./navigation-testing-agent').then(m => m.runNavigationTests()) },
  performance: { runTests: () => import('./performance-testing-agent').then(m => m.runPerformanceTests()) },
  usability: { runTests: () => import('./usability-testing-agent').then(m => m.runUsabilityTests()) },
  security: { runTests: () => import('./security-testing-agent').then(m => m.runSecurityTests()) },
  crossBrowser: { runTests: () => import('./cross-browser-testing-agent').then(m => m.runCrossBrowserTests()) },
  
  // Orchestrator and utilities
  orchestrator: () => import('./test-orchestrator').then(m => m.testOrchestrator),
  reportGenerator: () => import('./test-report-generator').then(m => m.testReportGenerator),
  
  // Configurations
  categories: TEST_CATEGORIES,
  priorities: TEST_PRIORITIES,
  configs: DEFAULT_TEST_CONFIGS,
  
  // Utilities
  utils: {
    getStatusColor,
    getStatusIcon,
    getGradeFromScore,
    getGradeColor
  }
};

// Default export
export default UnixTypeTestSuite;