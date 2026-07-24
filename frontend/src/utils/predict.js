// Client-side prediction helper matching the backend scoring model exactly
export function predictPerformance({ attendance, studyTime, sleepHours, extracurriculars, previousGrade }) {
  const att = Math.max(0, Math.min(100, parseFloat(attendance) || 0));
  const study = Math.max(0, parseFloat(studyTime) || 0);
  const sleep = Math.max(0, parseFloat(sleepHours) || 0);
  const extra = !!extracurriculars;
  const prev = Math.max(0, Math.min(100, parseFloat(previousGrade) || 0));

  const attendanceScore = att;
  const studyScore = Math.min(study, 20) / 20 * 100;
  const sleepDiff = Math.abs(sleep - 7.5);
  const sleepScore = Math.max(10, 100 - (sleepDiff * 20));
  const prevGradeScore = prev;
  const extraScore = extra ? 100 : 60;

  const rawScore = (attendanceScore * 0.30) + 
                    (studyScore * 0.25) + 
                    (sleepScore * 0.15) + 
                    (prevGradeScore * 0.20) + 
                    (extraScore * 0.10);
  
  const predictedScore = Math.round(rawScore * 10) / 10;

  let predictedGrade = 'F';
  let riskLevel = 'High';

  if (predictedScore >= 85) {
    predictedGrade = 'A';
    riskLevel = 'Low';
  } else if (predictedScore >= 70) {
    predictedGrade = 'B';
    riskLevel = 'Low';
  } else if (predictedScore >= 50) {
    predictedGrade = 'C';
    riskLevel = 'Medium';
  } else if (predictedScore >= 35) {
    predictedGrade = 'D';
    riskLevel = 'High';
  } else {
    predictedGrade = 'F';
    riskLevel = 'High';
  }

  const recommendations = [];
  
  if (att < 85) {
    recommendations.push(`Attendance rate is low (${att}%). Regular class attendance is critical for understanding curriculum and performing well in assessments.`);
  }
  if (study < 10) {
    recommendations.push(`Study time is below average (${study} hours/week). Dedicating at least 10-15 hours weekly to active revision is recommended.`);
  }
  if (sleep < 6.5) {
    recommendations.push(`Insufficient sleep (${sleep} hours) detected. Lack of rest severely reduces cognitive performance, memory retention, and test focus.`);
  } else if (sleep > 9.5) {
    recommendations.push(`High sleep duration (${sleep} hours) observed. Maintain a consistent sleep-wake schedule to optimize energy and attention during classes.`);
  }
  if (prev < 60) {
    recommendations.push(`Previous grade is low (${prev}%). Prioritize building foundation knowledge, requesting extra tutoring, or working on past homework sets.`);
  }
  if (!extra) {
    recommendations.push("Consider participating in extracurricular activities to develop soft skills and decrease academic burnout.");
  }
  
  if (recommendations.length === 0) {
    recommendations.push("Excellent work! All metrics meet or exceed success thresholds. Keep up the consistent schedule and mentor peers if possible.");
  }

  return {
    predictedScore,
    predictedGrade,
    riskLevel,
    recommendations
  };
}
