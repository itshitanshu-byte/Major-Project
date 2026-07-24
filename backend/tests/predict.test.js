import { predictPerformance } from '../utils/predict.js';

function runTests() {
  console.log('--- STARTING PREDICTION ALGORITHM TESTS ---');

  // Test Case 1: Excellent Student
  const student1 = {
    attendance: 100,
    studyTime: 20,
    sleepHours: 7.5,
    extracurriculars: true,
    previousGrade: 100
  };
  const result1 = predictPerformance(student1);
  console.log('\nTest Case 1 (Excellent Student):');
  console.log(result1);
  if (result1.predictedGrade !== 'A' || result1.riskLevel !== 'Low' || result1.predictedScore !== 100) {
    throw new Error('Test Case 1 Failed: Expected Grade A, Low Risk, and Score 100');
  }
  console.log('✓ Test Case 1 Passed!');

  // Test Case 2: At-Risk Student
  const student2 = {
    attendance: 50,
    studyTime: 2,
    sleepHours: 4.5,
    extracurriculars: false,
    previousGrade: 40
  };
  const result2 = predictPerformance(student2);
  console.log('\nTest Case 2 (At-Risk Student):');
  console.log(result2);
  if (result2.predictedGrade !== 'F' && result2.predictedGrade !== 'D') {
    throw new Error('Test Case 2 Failed: Expected Grade D or F');
  }
  if (result2.riskLevel !== 'High') {
    throw new Error('Test Case 2 Failed: Expected High Risk');
  }
  if (result2.recommendations.length < 4) {
    throw new Error('Test Case 2 Failed: Expected multiple warnings in recommendations');
  }
  console.log('✓ Test Case 2 Passed!');

  // Test Case 3: Moderate Student
  const student3 = {
    attendance: 80,
    studyTime: 10,
    sleepHours: 7.0,
    extracurriculars: true,
    previousGrade: 75
  };
  const result3 = predictPerformance(student3);
  console.log('\nTest Case 3 (Moderate Student):');
  console.log(result3);
  if (result3.predictedGrade !== 'B' && result3.predictedGrade !== 'C') {
    throw new Error('Test Case 3 Failed: Expected Grade B or C');
  }
  console.log('✓ Test Case 3 Passed!');

  console.log('\n--- ALL PREDICTION ALGORITHM TESTS PASSED SUCCESSFULLY! ---');
}

try {
  runTests();
} catch (error) {
  console.error('\n❌ TEST SUITE FAILED:', error.message);
  process.exit(1);
}
