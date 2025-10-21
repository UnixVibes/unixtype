// Test Orchestrator for UnixType
// Coordinates and manages all testing agents

import { runFunctionalTests, FunctionalTestReport } from './functional-testing-agent';
import { runAccessibilityTests, AccessibilityTestReport } from './accessibility-testing-agent';
import { runMobileTests, MobileTestReport } from './mobile-testing-agent';
import { runNavigationTests, NavigationTestReport } from './navigation-testing-agent';
import { runPerformanceTests, PerformanceTestReport } from './performance-testing-agent';
import { runUsabilityTests, UsabilityTestReport } from './usability-testing-agent';
import { runSecurityTests, SecurityTestReport } from './security-testing-agent';
import { runCrossBrowserTests, CrossBrowserTestReport } from './cross-browser-testing-agent';

export interface TestAgent {
  name: string;
  description: string;
  category: 'functional' | 'accessibility' | 'mobile' | 'navigation' | 'performance' | 'usability' | 'security' | 'cross-browser';
  runTests: () => any;
  priority: 'high' | 'medium' | 'low';
  estimatedDuration: number; // in seconds
}

export interface OrchestratedTestResult {
  agentName: string;
  category: string;
  status: 'pass' | 'fail' | 'warning';
  score: number;
  report: any;
  duration: number;
  executedAt: Date;
}

export interface ComprehensiveTestReport {
  overallStatus: 'pass' | 'fail' | 'warning';
  totalScore: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  testResults: OrchestratedTestResult[];
  summary: string;
  recommendations: string[];
  executionTime: number;
  executedAt: Date;
  coverage: {
    functional: number;
    accessibility: number;
    mobile: number;
    navigation: number;
    performance: number;
    usability: number;
    security: number;
    crossBrowser: number;
  };
}

class TestOrchestrator {
  private agents: TestAgent[] = [
    {
      name: 'Functional Testing Agent',
      description: 'Tests core typing functionality and features',
      category: 'functional',
      runTests: runFunctionalTests,
      priority: 'high',
      estimatedDuration: 30
    },
    {
      name: 'Accessibility Testing Agent',
      description: 'Tests accessibility features and WCAG compliance',
      category: 'accessibility',
      runTests: runAccessibilityTests,
      priority: 'high',
      estimatedDuration: 45
    },
    {
      name: 'Mobile Testing Agent',
      description: 'Tests mobile interactions and responsive design',
      category: 'mobile',
      runTests: runMobileTests,
      priority: 'medium',
      estimatedDuration: 40
    },
    {
      name: 'Navigation Testing Agent',
      description: 'Tests routing, links, and navigation features',
      category: 'navigation',
      runTests: runNavigationTests,
      priority: 'medium',
      estimatedDuration: 25
    },
    {
      name: 'Performance Testing Agent',
      description: 'Tests application performance and resource usage',
      category: 'performance',
      runTests: runPerformanceTests,
      priority: 'high',
      estimatedDuration: 60
    },
    {
      name: 'Usability Testing Agent',
      description: 'Tests user experience and ease of use',
      category: 'usability',
      runTests: runUsabilityTests,
      priority: 'medium',
      estimatedDuration: 35
    },
    {
      name: 'Security Testing Agent',
      description: 'Tests security vulnerabilities and data protection',
      category: 'security',
      runTests: runSecurityTests,
      priority: 'high',
      estimatedDuration: 50
    },
    {
      name: 'Cross-Browser Testing Agent',
      description: 'Tests compatibility across different browsers',
      category: 'cross-browser',
      runTests: runCrossBrowserTests,
      priority: 'medium',
      estimatedDuration: 55
    }
  ];

  async runAllTests(): Promise<ComprehensiveTestReport> {
    const startTime = Date.now();
    const testResults: OrchestratedTestResult[] = [];

    console.log('🚀 Starting comprehensive test suite...');
    console.log(`Running ${this.agents.length} test agents...`);

    // Sort agents by priority and estimated duration
    const sortedAgents = [...this.agents].sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority] || a.estimatedDuration - b.estimatedDuration;
    });

    // Execute tests in parallel where possible, respecting priorities
    const highPriorityAgents = sortedAgents.filter(a => a.priority === 'high');
    const mediumPriorityAgents = sortedAgents.filter(a => a.priority === 'medium');
    const lowPriorityAgents = sortedAgents.filter(a => a.priority === 'low');

    // Run high priority tests first
    console.log('🔥 Running high priority tests...');
    const highPriorityResults = await this.executeAgents(highPriorityAgents);
    testResults.push(...highPriorityResults);

    // Run medium priority tests
    console.log('⚡ Running medium priority tests...');
    const mediumPriorityResults = await this.executeAgents(mediumPriorityAgents);
    testResults.push(...mediumPriorityResults);

    // Run low priority tests
    console.log('🔍 Running low priority tests...');
    const lowPriorityResults = await this.executeAgents(lowPriorityAgents);
    testResults.push(...lowPriorityResults);

    const endTime = Date.now();
    const executionTime = endTime - startTime;

    // Calculate comprehensive results
    const report = this.generateComprehensiveReport(testResults, executionTime);
    
    console.log('✅ All tests completed!');
    console.log(`Overall score: ${report.totalScore}% (${report.grade})`);
    console.log(`Execution time: ${executionTime}ms`);

    return report;
  }

  private async executeAgents(agents: TestAgent[]): Promise<OrchestratedTestResult[]> {
    const results: OrchestratedTestResult[] = [];

    // Execute agents in parallel
    const promises = agents.map(async (agent) => {
      const startTime = Date.now();
      console.log(`🧪 Running ${agent.name}...`);

      try {
        const report = agent.runTests();
        const duration = Date.now() - startTime;

        const result: OrchestratedTestResult = {
          agentName: agent.name,
          category: agent.category,
          status: report.overallStatus,
          score: report.score,
          report,
          duration,
          executedAt: new Date()
        };

        console.log(`✅ ${agent.name} completed: ${report.score}% (${report.overallStatus})`);
        return result;
      } catch (error) {
        const duration = Date.now() - startTime;
        console.error(`❌ ${agent.name} failed:`, error);

        return {
          agentName: agent.name,
          category: agent.category,
          status: 'fail' as const,
          score: 0,
          report: { error: error instanceof Error ? error.message : 'Unknown error' },
          duration,
          executedAt: new Date()
        };
      }
    });

    const agentResults = await Promise.all(promises);
    results.push(...agentResults);

    return results;
  }

  private generateComprehensiveReport(testResults: OrchestratedTestResult[], executionTime: number): ComprehensiveTestReport {
    // Calculate overall score
    const totalScore = Math.round(
      testResults.reduce((sum, result) => sum + result.score, 0) / testResults.length
    );

    // Determine overall status
    const failedTests = testResults.filter(r => r.status === 'fail').length;
    const warningTests = testResults.filter(r => r.status === 'warning').length;
    
    let overallStatus: 'pass' | 'fail' | 'warning';
    if (failedTests > 0) {
      overallStatus = 'fail';
    } else if (warningTests > 2) {
      overallStatus = 'warning';
    } else {
      overallStatus = 'pass';
    }

    // Determine grade
    let grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
    if (totalScore >= 95) grade = 'A+';
    else if (totalScore >= 90) grade = 'A';
    else if (totalScore >= 80) grade = 'B';
    else if (totalScore >= 70) grade = 'C';
    else if (totalScore >= 60) grade = 'D';
    else grade = 'F';

    // Calculate coverage by category
    const coverage = {
      functional: this.getCategoryScore(testResults, 'functional'),
      accessibility: this.getCategoryScore(testResults, 'accessibility'),
      mobile: this.getCategoryScore(testResults, 'mobile'),
      navigation: this.getCategoryScore(testResults, 'navigation'),
      performance: this.getCategoryScore(testResults, 'performance'),
      usability: this.getCategoryScore(testResults, 'usability'),
      security: this.getCategoryScore(testResults, 'security'),
      crossBrowser: this.getCategoryScore(testResults, 'cross-browser')
    };

    // Generate recommendations
    const recommendations = this.generateRecommendations(testResults);

    // Generate summary
    const summary = this.generateSummary(testResults, totalScore, executionTime);

    return {
      overallStatus,
      totalScore,
      grade,
      testResults,
      summary,
      recommendations,
      executionTime,
      executedAt: new Date(),
      coverage
    };
  }

  private getCategoryScore(testResults: OrchestratedTestResult[], category: string): number {
    const categoryResults = testResults.filter(r => r.category === category);
    if (categoryResults.length === 0) return 0;
    return Math.round(
      categoryResults.reduce((sum, result) => sum + result.score, 0) / categoryResults.length
    );
  }

  private generateRecommendations(testResults: OrchestratedTestResult[]): string[] {
    const recommendations: string[] = [];
    
    // Collect recommendations from all test reports
    testResults.forEach(result => {
      if (result.report.recommendations) {
        recommendations.push(...result.report.recommendations);
      }
    });

    // Add high-level recommendations based on overall results
    const failedCategories = testResults
      .filter(r => r.status === 'fail')
      .map(r => r.category);
    
    if (failedCategories.length > 0) {
      recommendations.push(`Priority attention needed for: ${failedCategories.join(', ')}`);
    }

    const lowScoreCategories = testResults
      .filter(r => r.score < 70)
      .map(r => r.category);
    
    if (lowScoreCategories.length > 0) {
      recommendations.push(`Consider improvements in: ${lowScoreCategories.join(', ')}`);
    }

    return recommendations;
  }

  private generateSummary(testResults: OrchestratedTestResult[], totalScore: number, executionTime: number): string {
    const passedTests = testResults.filter(r => r.status === 'pass').length;
    const warningTests = testResults.filter(r => r.status === 'warning').length;
    const failedTests = testResults.filter(r => r.status === 'fail').length;

    const highestScoring = testResults.reduce((prev, current) => 
      prev.score > current.score ? prev : current
    );
    const lowestScoring = testResults.reduce((prev, current) => 
      prev.score < current.score ? prev : current
    );

    return `Comprehensive testing completed with an overall score of ${totalScore}%. ` +
      `${passedTests} test categories passed, ${warningTests} showed warnings, and ${failedTests} failed. ` +
      `Strongest performance in ${highestScoring.category} (${highestScoring.score}%), ` +
      `while ${lowestScoring.category} needs attention (${lowestScoring.score}%). ` +
      `Test suite executed in ${executionTime}ms.`;
  }

  async runSpecificTests(categories: string[]): Promise<ComprehensiveTestReport> {
    const startTime = Date.now();
    const selectedAgents = this.agents.filter(agent => categories.includes(agent.category));
    
    if (selectedAgents.length === 0) {
      throw new Error(`No agents found for categories: ${categories.join(', ')}`);
    }

    console.log(`🎯 Running specific tests for: ${categories.join(', ')}`);
    
    const results = await this.executeAgents(selectedAgents);
    const executionTime = Date.now() - startTime;
    
    return this.generateComprehensiveReport(results, executionTime);
  }

  getAvailableAgents(): TestAgent[] {
    return this.agents;
  }

  getEstimatedTime(categories?: string[]): number {
    const agentsToRun = categories 
      ? this.agents.filter(a => categories.includes(a.category))
      : this.agents;
    
    return agentsToRun.reduce((total, agent) => total + agent.estimatedDuration, 0);
  }
}

// Export singleton instance
export const testOrchestrator = new TestOrchestrator();

// Export types and functions
export { TestOrchestrator };