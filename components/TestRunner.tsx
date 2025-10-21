"use client";

import { useState, useEffect } from "react";
import { testOrchestrator, TestAgent } from "@/testing-agents/test-orchestrator";
import { testReportGenerator, GeneratedReport } from "@/testing-agents/test-report-generator";
import { ComprehensiveTestReport } from "@/testing-agents/test-orchestrator";

interface TestRunnerProps {
  onTestComplete?: (report: ComprehensiveTestReport) => void;
}

export default function TestRunner({ onTestComplete }: TestRunnerProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTest, setCurrentTest] = useState<string>("");
  const [results, setResults] = useState<ComprehensiveTestReport | null>(null);
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>([]);

  const availableAgents = testOrchestrator.getAvailableAgents();

  useEffect(() => {
    // Select all agents by default
    setSelectedAgents(availableAgents.map(agent => agent.category));
  }, []);

  const runTests = async () => {
    setIsRunning(true);
    setProgress(0);
    setCurrentTest("Initializing test suite...");
    setResults(null);
    setShowResults(false);

    try {
      let report: ComprehensiveTestReport;
      
      if (selectedAgents.length === availableAgents.length) {
        // Run all tests
        report = await testOrchestrator.runAllTests();
      } else {
        // Run specific tests
        report = await testOrchestrator.runSpecificTests(selectedAgents);
      }

      setResults(report);
      setShowResults(true);
      setProgress(100);
      setCurrentTest("All tests completed!");
      
      if (onTestComplete) {
        onTestComplete(report);
      }
    } catch (error) {
      console.error("Test execution failed:", error);
      setCurrentTest(`Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsRunning(false);
    }
  };

  const generateReports = async () => {
    if (!results) return;

    try {
      const reports = testReportGenerator.generateReport(results, {
        format: 'both',
        includeDetails: true,
        includeRecommendations: true,
        includeCharts: true
      });

      setGeneratedReports(reports);

      // Download reports automatically
      reports.forEach(report => {
        testReportGenerator.downloadReport(report);
      });
    } catch (error) {
      console.error("Report generation failed:", error);
    }
  };

  const toggleAgent = (category: string) => {
    setSelectedAgents(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const selectAllAgents = () => {
    setSelectedAgents(availableAgents.map(agent => agent.category));
  };

  const deselectAllAgents = () => {
    setSelectedAgents([]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': return 'text-green-600 bg-green-50 border-green-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'fail': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-green-600';
    if (grade === 'B') return 'text-blue-600';
    if (grade === 'C') return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-unix-main to-unix-accent bg-clip-text text-transparent">
          UnixType Test Suite
        </h1>
        <p className="text-unix-sub text-lg">
          Comprehensive testing platform for all application features
        </p>
      </div>

      {/* Test Configuration */}
      <div className="glass-effect rounded-2xl p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-unix-text">Test Configuration</h2>
          <div className="flex gap-3">
            <button
              onClick={selectAllAgents}
              className="px-4 py-2 text-sm bg-unix-main text-white rounded-lg hover:bg-unix-main/90 transition-colors"
              disabled={isRunning}
            >
              Select All
            </button>
            <button
              onClick={deselectAllAgents}
              className="px-4 py-2 text-sm bg-unix-sub text-white rounded-lg hover:bg-unix-sub/90 transition-colors"
              disabled={isRunning}
            >
              Deselect All
            </button>
          </div>
        </div>

        {/* Agent Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableAgents.map((agent) => (
            <div
              key={agent.category}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                selectedAgents.includes(agent.category)
                  ? 'border-unix-main bg-unix-main/10'
                  : 'border-unix-border/50 hover:border-unix-sub/50'
              } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => !isRunning && toggleAgent(agent.category)}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-unix-text">{agent.name}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  agent.priority === 'high' ? 'bg-red-100 text-red-600' :
                  agent.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-green-100 text-green-600'
                }`}>
                  {agent.priority}
                </span>
              </div>
              <p className="text-sm text-unix-sub mb-2">{agent.description}</p>
              <div className="text-xs text-unix-accent">
                ~{agent.estimatedDuration}s estimated
              </div>
            </div>
          ))}
        </div>

        {/* Run Tests Button */}
        <div className="flex justify-center">
          <button
            onClick={runTests}
            disabled={isRunning || selectedAgents.length === 0}
            className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all ${
              isRunning || selectedAgents.length === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-unix-main to-unix-accent text-white hover:shadow-tech-lg transform hover:scale-105'
            }`}
          >
            {isRunning ? (
              <span className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Running Tests...
              </span>
            ) : (
              `Run ${selectedAgents.length} Test${selectedAgents.length !== 1 ? 's' : ''}`
            )}
          </button>
        </div>

        {/* Progress */}
        {isRunning && (
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-unix-sub">Progress</span>
              <span className="text-unix-main font-medium">{currentTest}</span>
            </div>
            <div className="w-full bg-unix-border/30 rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-unix-main to-unix-accent transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Test Results */}
      {showResults && results && (
        <div className="glass-effect rounded-2xl p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-unix-text">Test Results</h2>
            <button
              onClick={generateReports}
              className="px-6 py-3 bg-unix-accent text-white rounded-lg hover:bg-unix-accent/90 transition-colors flex items-center gap-2"
            >
              📊 Generate Reports
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
              <div className={`text-3xl font-bold ${getGradeColor(results.grade)}`}>
                {results.grade}
              </div>
              <div className="text-sm text-green-600 mt-1">Overall Grade</div>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
              <div className="text-3xl font-bold text-blue-600">
                {results.totalScore}%
              </div>
              <div className="text-sm text-blue-600 mt-1">Total Score</div>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
              <div className={`text-3xl font-bold ${getStatusColor(results.overallStatus).split(' ')[0]}`}>
                {results.overallStatus.toUpperCase()}
              </div>
              <div className="text-sm text-purple-600 mt-1">Status</div>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200">
              <div className="text-3xl font-bold text-orange-600">
                {(results.executionTime / 1000).toFixed(1)}s
              </div>
              <div className="text-sm text-orange-600 mt-1">Duration</div>
            </div>
          </div>

          {/* Individual Test Results */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-unix-text">Individual Test Results</h3>
            <div className="grid gap-4">
              {results.testResults.map((result) => (
                <div
                  key={result.agentName}
                  className={`p-6 rounded-xl border-2 ${getStatusColor(result.status)}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-lg">{result.agentName}</h4>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(result.status)}`}>
                        {result.status.toUpperCase()}
                      </span>
                      <span className="px-3 py-1 bg-unix-bg rounded-full text-sm font-medium text-unix-text">
                        {result.score}%
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-unix-sub mb-2">{result.report.summary}</p>
                  <div className="text-xs text-unix-accent">
                    Executed in {(result.duration / 1000).toFixed(2)}s
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Coverage Overview */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-unix-text">Coverage Overview</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(results.coverage).map(([category, score]) => (
                <div key={category} className="text-center p-4 bg-unix-bg/50 rounded-lg">
                  <div className="text-lg font-bold text-unix-main capitalize">
                    {category.replace('-', ' ')}
                  </div>
                  <div className="text-2xl font-bold text-unix-accent mt-1">
                    {score}%
                  </div>
                  <div className="w-full bg-unix-border/30 rounded-full h-2 mt-2">
                    <div 
                      className="h-full bg-gradient-to-r from-unix-main to-unix-accent rounded-full"
                      style={{ width: `${score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          {results.recommendations.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-unix-text">Recommendations</h3>
              <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
                <ul className="space-y-2">
                  {results.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-yellow-600 mt-1">→</span>
                      <span className="text-sm text-yellow-800">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Generated Reports */}
      {generatedReports.length > 0 && (
        <div className="glass-effect rounded-2xl p-8 space-y-4">
          <h2 className="text-2xl font-bold text-unix-text">Generated Reports</h2>
          <div className="grid gap-4">
            {generatedReports.map((report, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-unix-bg/50 rounded-lg">
                <div>
                  <div className="font-medium text-unix-text">{report.filename}</div>
                  <div className="text-sm text-unix-sub">
                    {report.format.toUpperCase()} format • Generated at {report.generatedAt.toLocaleTimeString()}
                  </div>
                </div>
                <button
                  onClick={() => testReportGenerator.downloadReport(report)}
                  className="px-4 py-2 bg-unix-main text-white rounded-lg hover:bg-unix-main/90 transition-colors text-sm"
                >
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}