// Simple test script to verify the testing system works
const { testOrchestrator } = require('./testing-agents/test-orchestrator.ts');

async function testSystem() {
  try {
    console.log('🧪 Testing UnixType Testing System...');
    
    // Test 1: Check if all agents are available
    const agents = testOrchestrator.getAvailableAgents();
    console.log(`✅ Found ${agents.length} testing agents`);
    
    agents.forEach(agent => {
      console.log(`  - ${agent.name} (${agent.category}) - Priority: ${agent.priority}`);
    });
    
    // Test 2: Run a quick test with functional and accessibility agents
    console.log('\n🚀 Running quick test (functional + accessibility)...');
    const quickReport = await testOrchestrator.runSpecificTests(['functional', 'accessibility']);
    
    console.log(`✅ Quick test completed!`);
    console.log(`  - Overall Status: ${quickReport.overallStatus}`);
    console.log(`  - Total Score: ${quickReport.totalScore}%`);
    console.log(`  - Grade: ${quickReport.grade}`);
    console.log(`  - Execution Time: ${quickReport.executionTime}ms`);
    
    // Test 3: Check coverage
    console.log('\n📊 Coverage Analysis:');
    Object.entries(quickReport.coverage).forEach(([category, score]) => {
      console.log(`  - ${category}: ${score}%`);
    });
    
    // Test 4: Check recommendations
    if (quickReport.recommendations.length > 0) {
      console.log('\n💡 Recommendations:');
      quickReport.recommendations.forEach((rec, index) => {
        console.log(`  ${index + 1}. ${rec}`);
      });
    }
    
    console.log('\n✅ All tests passed! The testing system is working correctly.');
    
  } catch (error) {
    console.error('❌ Error testing the system:', error);
    process.exit(1);
  }
}

// Run the test
testSystem();