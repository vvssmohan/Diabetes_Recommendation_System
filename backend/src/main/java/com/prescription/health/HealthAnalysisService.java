package com.prescription.health;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
public class HealthAnalysisService {
    @Autowired
    private HealthDataRepository healthDataRepository;

    public HealthAnalysisResponse analyzeHealth(HealthAnalysisRequest request) {
        Double bmi = calculateBMI(request.getHeight(), request.getWeight());
        String diabetesStage = analyzeDiabetesRisk(request.getSugar_fasting(), request.getSugar_post());
        String obesityStage = analyzeObesityRisk(bmi);
        String riskScore = calculateRiskLevel(diabetesStage, obesityStage, request.getBlood_pressure());
        List<String> warnings = generateWarnings(request, bmi, diabetesStage, obesityStage);

        // Save to database
        HealthData healthData = new HealthData();
        healthData.setUserId(request.getUser_id());
        healthData.setBmi(bmi);
        healthData.setSugarFasting(request.getSugar_fasting());
        healthData.setSugarPost(request.getSugar_post());
        healthData.setBloodPressure(request.getBlood_pressure());
        healthData.setActivityLevel(request.getActivity_level());
        healthData.setFamilyHistory(request.getFamily_history());
        healthDataRepository.save(healthData);

        return new HealthAnalysisResponse(bmi, diabetesStage, obesityStage, riskScore, warnings);
    }

    private Double calculateBMI(Double height, Double weight) {
        // height in meters, weight in kg
        return weight / (height * height);
    }

    private String analyzeDiabetesRisk(Double sugarFasting, Double sugarPost) {
        // More accurate diabetes classification based on medical standards
        // Fasting: Normal <100, Pre-diabetic 100-125, Diabetic ≥126
        // Post-meal: Normal <140, Pre-diabetic 140-199, Diabetic ≥200
        
        boolean fastingDiabetic = sugarFasting >= 126;
        boolean fastingPreDiabetic = sugarFasting >= 100 && sugarFasting < 126;
        boolean postDiabetic = sugarPost >= 200;
        boolean postPreDiabetic = sugarPost >= 140 && sugarPost < 200;
        
        // If either fasting or post-meal is diabetic range = Diabetic
        if (fastingDiabetic || postDiabetic) {
            return "Diabetic";
        }
        // If either is pre-diabetic range = Pre-Diabetic
        if (fastingPreDiabetic || postPreDiabetic) {
            return "Pre-Diabetic";
        }
        // Otherwise normal
        return "Normal";
    }

    private String analyzeObesityRisk(Double bmi) {
        // WHO BMI Classification
        if (bmi < 18.5) {
            return "Underweight";
        } else if (bmi >= 18.5 && bmi < 25.0) {
            return "Normal Weight";
        } else if (bmi >= 25.0 && bmi < 30.0) {
            return "Overweight";
        } else if (bmi >= 30.0 && bmi < 35.0) {
            return "Obesity Class I";
        } else if (bmi >= 35.0 && bmi < 40.0) {
            return "Obesity Class II";
        } else {
            return "Obesity Class III";
        }
    }

    private String calculateRiskLevel(String diabetesStage, String obesityStage, String bloodPressure) {
        int riskPoints = 0;
        
        // Diabetes risk scoring (0-3 points)
        if (diabetesStage.equals("Pre-Diabetic")) {
            riskPoints += 2;
        } else if (diabetesStage.equals("Diabetic")) {
            riskPoints += 3;
        }
        
        // Obesity risk scoring (0-2 points)
        if (obesityStage.equals("Overweight")) {
            riskPoints += 1;
        } else if (obesityStage.equals("Obesity")) {
            riskPoints += 2;
        }
        
        // Blood pressure risk scoring (0-3 points)
        if (bloodPressure != null && bloodPressure.contains("/")) {
            try {
                String[] bpParts = bloodPressure.split("/");
                int systolic = Integer.parseInt(bpParts[0].trim());
                int diastolic = Integer.parseInt(bpParts[1].trim());
                
                // Normal: <120/80, Elevated: 120-129/<80, High: ≥130/80
                if (systolic >= 130 || diastolic >= 80) {
                    riskPoints += 2;
                } else if (systolic >= 120) {
                    riskPoints += 1;
                }
            } catch (Exception e) {
                // If parsing fails, skip BP analysis
            }
        }
        
        // Comprehensive risk determination with weight
        // Max points = 3 + 2 + 2 = 7
        if (riskPoints >= 5) {
            return "High";
        } else if (riskPoints >= 3) {
            return "Medium";
        } else {
            return "Low";
        }
    }

    private List<String> generateWarnings(HealthAnalysisRequest request, Double bmi, String diabetesStage, String obesityStage) {
        List<String> warnings = new ArrayList<>();
        
        // Blood Sugar Warnings
        if (request.getSugar_fasting() >= 126) {
            warnings.add("🔴 CRITICAL: Fasting blood sugar (" + request.getSugar_fasting() + " mg/dL) indicates diabetic range. Immediate medical consultation recommended.");
        } else if (request.getSugar_fasting() >= 100 && request.getSugar_fasting() < 126) {
            warnings.add("🟡 WARNING: Fasting blood sugar (" + request.getSugar_fasting() + " mg/dL) indicates pre-diabetic condition. Lifestyle changes needed.");
        }
        
        if (request.getSugar_post() >= 200) {
            warnings.add("🔴 CRITICAL: Post-meal blood sugar (" + request.getSugar_post() + " mg/dL) is in diabetic range. Immediate medical consultation recommended.");
        } else if (request.getSugar_post() >= 140 && request.getSugar_post() < 200) {
            warnings.add("🟡 WARNING: Post-meal blood sugar (" + request.getSugar_post() + " mg/dL) indicates pre-diabetic range.");
        }
        
        // BMI Warnings
        if (bmi >= 40) {
            warnings.add("🔴 CRITICAL: BMI (" + String.format("%.1f", bmi) + ") indicates severe obesity. Medical intervention advised.");
        } else if (bmi >= 35) {
            warnings.add("🟠 URGENT: BMI (" + String.format("%.1f", bmi) + ") indicates Class II obesity. Please consult healthcare provider.");
        } else if (bmi >= 30) {
            warnings.add("🟡 WARNING: BMI (" + String.format("%.1f", bmi) + ") indicates Class I obesity. Lifestyle modifications recommended.");
        } else if (bmi >= 25) {
            warnings.add("ℹ️ INFO: BMI (" + String.format("%.1f", bmi) + ") indicates overweight. Monitor diet and exercise.");
        }
        
        // Blood Pressure Warnings
        if (request.getBlood_pressure() != null && request.getBlood_pressure().contains("/")) {
            try {
                String[] bpParts = request.getBlood_pressure().split("/");
                int systolic = Integer.parseInt(bpParts[0].trim());
                int diastolic = Integer.parseInt(bpParts[1].trim());
                
                if (systolic >= 180 || diastolic >= 120) {
                    warnings.add("🔴 CRITICAL: Blood pressure (" + request.getBlood_pressure() + " mmHg) is in hypertensive crisis range. Seek immediate medical attention.");
                } else if (systolic >= 140 || diastolic >= 90) {
                    warnings.add("🟠 URGENT: Blood pressure (" + request.getBlood_pressure() + " mmHg) indicates Stage 2 hypertension. Medical consultation needed.");
                } else if (systolic >= 130 || diastolic >= 80) {
                    warnings.add("🟡 WARNING: Blood pressure (" + request.getBlood_pressure() + " mmHg) indicates Stage 1 hypertension or elevated. Monitor regularly.");
                }
            } catch (Exception e) {
                // If parsing fails, skip BP warnings
            }
        }
        
        return warnings;
    }
}
