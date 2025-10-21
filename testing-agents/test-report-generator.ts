// Test Report Generator for UnixType
// Generates comprehensive HTML and JSON reports from test results

import { ComprehensiveTestReport, OrchestratedTestResult } from './test-orchestrator';

export interface ReportOptions {
  format: 'html' | 'json' | 'both';
  includeDetails: boolean;
  includeRecommendations: boolean;
  includeCharts: boolean;
  outputPath?: string;
}

export interface GeneratedReport {
  format: string;
  content: string;
  filename: string;
  generatedAt: Date;
}

export class TestReportGenerator {
  generateReport(report: ComprehensiveTestReport, options: ReportOptions = {
    format: 'both',
    includeDetails: true,
    includeRecommendations: true,
    includeCharts: true
  }): GeneratedReport[] {
    const generatedReports: GeneratedReport[] = [];
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

    if (options.format === 'html' || options.format === 'both') {
      const htmlReport = this.generateHTMLReport(report, options);
      generatedReports.push({
        format: 'html',
        content: htmlReport,
        filename: `unixtype-test-report-${timestamp}.html`,
        generatedAt: new Date()
      });
    }

    if (options.format === 'json' || options.format === 'both') {
      const jsonReport = this.generateJSONReport(report, options);
      generatedReports.push({
        format: 'json',
        content: jsonReport,
        filename: `unixtype-test-report-${timestamp}.json`,
        generatedAt: new Date()
      });
    }

    return generatedReports;
  }

  private generateHTMLReport(report: ComprehensiveTestReport, options: ReportOptions): string {
    const { overallStatus, totalScore, grade, testResults, summary, recommendations, executionTime, coverage } = report;

    const statusColor = overallStatus === 'pass' ? '#10b981' : overallStatus === 'warning' ? '#f59e0b' : '#ef4444';
    const gradeColor = grade.startsWith('A') ? '#10b981' : grade === 'B' ? '#3b82f6' : grade === 'C' ? '#f59e0b' : '#ef4444';

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>UnixType Test Report - ${grade} (${totalScore}%)</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
            font-weight: 700;
        }
        
        .header .subtitle {
            font-size: 1.2rem;
            opacity: 0.9;
        }
        
        .summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            padding: 40px;
            background: #f8fafc;
        }
        
        .summary-card {
            background: white;
            padding: 30px;
            border-radius: 15px;
            text-align: center;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
        }
        
        .summary-card:hover {
            transform: translateY(-5px);
        }
        
        .summary-card h3 {
            font-size: 0.9rem;
            text-transform: uppercase;
            color: #64748b;
            margin-bottom: 10px;
            font-weight: 600;
        }
        
        .summary-card .value {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 5px;
        }
        
        .summary-card .label {
            font-size: 0.9rem;
            color: #64748b;
        }
        
        .content {
            padding: 40px;
        }
        
        .section {
            margin-bottom: 40px;
        }
        
        .section h2 {
            font-size: 1.8rem;
            margin-bottom: 20px;
            color: #1e293b;
            border-bottom: 3px solid #667eea;
            padding-bottom: 10px;
        }
        
        .test-results {
            display: grid;
            gap: 20px;
        }
        
        .test-result {
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 25px;
            transition: all 0.3s ease;
        }
        
        .test-result:hover {
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            transform: translateY(-2px);
        }
        
        .test-result-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }
        
        .test-result h3 {
            font-size: 1.3rem;
            color: #1e293b;
        }
        
        .test-result-meta {
            display: flex;
            gap: 15px;
            align-items: center;
        }
        
        .status-badge {
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
            text-transform: uppercase;
        }
        
        .status-pass {
            background: #dcfce7;
            color: #16a34a;
        }
        
        .status-warning {
            background: #fef3c7;
            color: #d97706;
        }
        
        .status-fail {
            background: #fee2e2;
            color: #dc2626;
        }
        
        .score-badge {
            background: #f1f5f9;
            color: #475569;
            padding: 6px 12px;
            border-radius: 20px;
            font-weight: 600;
        }
        
        .test-details {
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid #e2e8f0;
        }
        
        .test-details p {
            color: #64748b;
            margin-bottom: 10px;
            white-space: pre-line;
        }
        
        .coverage-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            margin-top: 20px;
        }
        
        .coverage-item {
            text-align: center;
            padding: 20px;
            background: #f8fafc;
            border-radius: 10px;
        }
        
        .coverage-item .category {
            font-size: 0.9rem;
            color: #64748b;
            margin-bottom: 5px;
            text-transform: capitalize;
        }
        
        .coverage-item .score {
            font-size: 1.5rem;
            font-weight: 700;
            color: #1e293b;
        }
        
        .recommendations {
            background: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 12px;
            padding: 25px;
        }
        
        .recommendations h3 {
            color: #92400e;
            margin-bottom: 15px;
        }
        
        .recommendations ul {
            list-style: none;
            padding: 0;
        }
        
        .recommendations li {
            padding: 10px 0;
            padding-left: 25px;
            position: relative;
            color: #92400e;
        }
        
        .recommendations li:before {
            content: "→";
            position: absolute;
            left: 0;
            color: #f59e0b;
            font-weight: bold;
        }
        
        .footer {
            background: #f8fafc;
            padding: 30px;
            text-align: center;
            color: #64748b;
            border-top: 1px solid #e2e8f0;
        }
        
        .progress-bar {
            width: 100%;
            height: 8px;
            background: #e2e8f0;
            border-radius: 4px;
            overflow: hidden;
            margin: 10px 0;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
            transition: width 0.3s ease;
        }
        
        ${options.includeCharts ? this.getChartStyles() : ''}
    </style>
    ${options.includeCharts ? this.getChartScripts() : ''}
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>UnixType Test Report</h1>
            <div class="subtitle">Comprehensive Testing Suite Results</div>
        </div>
        
        <div class="summary">
            <div class="summary-card">
                <h3>Overall Grade</h3>
                <div class="value" style="color: ${gradeColor}">${grade}</div>
                <div class="label">${totalScore}% Score</div>
            </div>
            
            <div class="summary-card">
                <h3>Status</h3>
                <div class="value" style="color: ${statusColor}">${overallStatus.toUpperCase()}</div>
                <div class="label">Test Result</div>
            </div>
            
            <div class="summary-card">
                <h3>Execution Time</h3>
                <div class="value">${(executionTime / 1000).toFixed(1)}s</div>
                <div class="label">Duration</div>
            </div>
            
            <div class="summary-card">
                <h3>Test Categories</h3>
                <div class="value">${testResults.length}</div>
                <div class="label">Completed</div>
            </div>
        </div>
        
        <div class="content">
            <div class="section">
                <h2>Summary</h2>
                <p style="font-size: 1.1rem; color: #64748b; line-height: 1.8;">${summary}</p>
            </div>
            
            ${options.includeCharts ? `
            <div class="section">
                <h2>Coverage Overview</h2>
                <div class="coverage-grid">
                    ${Object.entries(coverage).map(([category, score]) => `
                        <div class="coverage-item">
                            <div class="category">${category.replace('-', ' ')}</div>
                            <div class="score">${score}%</div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${score}%"></div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}
            
            <div class="section">
                <h2>Test Results</h2>
                <div class="test-results">
                    ${testResults.map(result => `
                        <div class="test-result">
                            <div class="test-result-header">
                                <h3>${result.agentName}</h3>
                                <div class="test-result-meta">
                                    <span class="status-badge status-${result.status}">${result.status}</span>
                                    <span class="score-badge">${result.score}%</span>
                                </div>
                            </div>
                            <div class="test-details">
                                <p>${result.report.summary}</p>
                                ${options.includeDetails && result.report.testResults ? `
                                    <div style="margin-top: 15px;">
                                        <strong>Test Details:</strong>
                                        <ul style="margin-top: 10px; padding-left: 20px;">
                                            ${result.report.testResults.slice(0, 3).map((test: any) => `
                                                <li style="margin-bottom: 5px; color: #64748b;">
                                                    ${test.testName}: <span style="color: ${test.status === 'pass' ? '#10b981' : test.status === 'warning' ? '#f59e0b' : '#ef4444'}">${test.status}</span>
                                                </li>
                                            `).join('')}
                                            ${result.report.testResults.length > 3 ? `<li style="color: #64748b;">... and ${result.report.testResults.length - 3} more tests</li>` : ''}
                                        </ul>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            ${options.includeRecommendations && recommendations.length > 0 ? `
            <div class="section">
                <h2>Recommendations</h2>
                <div class="recommendations">
                    <h3>🔧 Improvement Suggestions</h3>
                    <ul>
                        ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
                    </ul>
                </div>
            </div>
            ` : ''}
        </div>
        
        <div class="footer">
            <p>Report generated on ${new Date().toLocaleString()} by UnixType Test Suite</p>
        </div>
    </div>
    
    ${options.includeCharts ? this.getChartInitializationScript(coverage) : ''}
</body>
</html>`;
  }

  private generateJSONReport(report: ComprehensiveTestReport, options: ReportOptions): string {
    const reportData = {
      metadata: {
        generatedAt: new Date().toISOString(),
        version: '1.0.0',
        testSuite: 'UnixType Comprehensive Testing Suite'
      },
      results: report,
      options: options
    };

    return JSON.stringify(reportData, null, 2);
  }

  private getChartStyles(): string {
    return `
        .chart-container {
            margin: 20px 0;
            padding: 20px;
            background: #f8fafc;
            border-radius: 12px;
        }
        
        .chart-canvas {
            max-width: 100%;
            height: 300px;
        }
    `;
  }

  private getChartScripts(): string {
    return `
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    `;
  }

  private getChartInitializationScript(coverage: any): string {
    return `
        <script>
            document.addEventListener('DOMContentLoaded', function() {
                const ctx = document.createElement('canvas');
                ctx.className = 'chart-canvas';
                
                const chartContainer = document.createElement('div');
                chartContainer.className = 'chart-container';
                chartContainer.appendChild(ctx);
                
                const coverageSection = document.querySelector('.section h2');
                coverageSection.parentNode.insertBefore(chartContainer, coverageSection.nextSibling);
                
                new Chart(ctx, {
                    type: 'radar',
                    data: {
                        labels: ${JSON.stringify(Object.keys(coverage).map(k => k.replace('-', ' ')))},
                        datasets: [{
                            label: 'Test Coverage',
                            data: ${JSON.stringify(Object.values(coverage))},
                            backgroundColor: 'rgba(102, 126, 234, 0.2)',
                            borderColor: 'rgba(102, 126, 234, 1)',
                            borderWidth: 2,
                            pointBackgroundColor: 'rgba(102, 126, 234, 1)',
                            pointBorderColor: '#fff',
                            pointHoverBackgroundColor: '#fff',
                            pointHoverBorderColor: 'rgba(102, 126, 234, 1)'
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            r: {
                                beginAtZero: true,
                                max: 100,
                                ticks: {
                                    stepSize: 20
                                }
                            }
                        },
                        plugins: {
                            legend: {
                                display: false
                            }
                        }
                    }
                });
            });
        </script>
    `;
  }

  downloadReport(report: GeneratedReport): void {
    const blob = new Blob([report.content], { type: report.format === 'json' ? 'application/json' : 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = report.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  async saveReportToFile(report: GeneratedReport, outputPath?: string): Promise<void> {
    if (typeof window === 'undefined') {
      // Node.js environment
      const fs = await import('fs');
      const path = await import('path');
      const filePath = outputPath || path.join(process.cwd(), report.filename);
      fs.writeFileSync(filePath, report.content, 'utf8');
    } else {
      // Browser environment
      this.downloadReport(report);
    }
  }
}

// Export singleton instance
export const testReportGenerator = new TestReportGenerator();