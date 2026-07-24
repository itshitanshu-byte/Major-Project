/**
 * Simple machine learning heuristic parser for student performance prediction.
 * Projects incoming B.Tech CGPA based on pre-admission scores.
 */

function parseMarkPercentage(markText) {
  if (!markText) return 75;
  const lower = markText.toLowerCase().trim();
  
  if (lower.includes('cgpa')) {
    const gpa = parseFloat(lower);
    if (!isNaN(gpa)) return gpa * 9.5; // convert 10-point CGPA to percentage
  }
  
  const val = parseFloat(lower);
  if (!isNaN(val)) return val;
  
  if (lower.includes('a+')) return 95;
  if (lower.includes('a grade') || lower.includes('a')) return 90;
  if (lower.includes('b+')) return 85;
  if (lower.includes('b grade') || lower.includes('b')) return 75;
  
  return 75;
}

export function predictBtechPerformance(educationHistory) {
  if (!educationHistory || educationHistory.length === 0) {
    return { predictedCgpa: 7.5, confidence: 80 };
  }

  // Extract Std 10 marks
  const std10Record = educationHistory.find(eh => eh.phase.includes('10'));
  const std10Mark = std10Record ? parseMarkPercentage(std10Record.marks) : 75;

  // Extract Std 12 marks
  const std12Record = educationHistory.find(eh => eh.phase.includes('12'));
  const std12Mark = std12Record ? parseMarkPercentage(std12Record.marks) : null;

  // Extract Diploma marks
  const diplomaRecords = educationHistory.filter(eh => eh.phase.toLowerCase().includes('diploma'));
  let diplomaAvg = null;
  if (diplomaRecords.length > 0) {
    const sum = diplomaRecords.reduce((acc, curr) => acc + parseMarkPercentage(curr.marks), 0);
    diplomaAvg = sum / diplomaRecords.length;
  }

  // Calculate prediction weighted value
  let predictionPct = 75;
  let consistency = 10;

  if (diplomaAvg !== null) {
    // Diploma pathway: 20% 10th Standard + 80% Diploma average
    predictionPct = (std10Mark * 0.2) + (diplomaAvg * 0.8);
    consistency = Math.abs(std10Mark - diplomaAvg);
  } else if (std12Mark !== null) {
    // 12th pathway: 30% 10th Standard + 70% 12th Standard
    predictionPct = (std10Mark * 0.3) + (std12Mark * 0.7);
    consistency = Math.abs(std10Mark - std12Mark);
  } else {
    // Default fallback
    predictionPct = std10Mark;
  }

  // Convert to 10-point scale CGPA
  let predictedCgpa = predictionPct / 9.5;
  
  // Bound B.Tech CGPA between 4.0 and 10.0
  predictedCgpa = Math.min(10, Math.max(4, predictedCgpa));
  predictedCgpa = Math.round(predictedCgpa * 100) / 100;

  // Calculate prediction confidence (higher consistency = higher confidence)
  let confidence = 95 - Math.min(20, consistency);
  confidence = Math.round(confidence);

  return {
    predictedCgpa,
    confidence
  };
}
