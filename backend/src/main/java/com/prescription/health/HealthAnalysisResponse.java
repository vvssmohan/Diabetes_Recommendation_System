package com.prescription.health;

import java.util.List;

public class HealthAnalysisResponse {
    private Double bmi;
    private String diabetesStage;
    private String obesityStage;
    private String riskScore;
    private List<String> warnings;

    public HealthAnalysisResponse(Double bmi, String diabetesStage, String obesityStage, String riskScore, List<String> warnings) {
        this.bmi = bmi;
        this.diabetesStage = diabetesStage;
        this.obesityStage = obesityStage;
        this.riskScore = riskScore;
        this.warnings = warnings;
    }

    // Getters and setters
    public Double getBmi() { return bmi; }
    public void setBmi(Double bmi) { this.bmi = bmi; }
    public String getDiabetesStage() { return diabetesStage; }
    public void setDiabetesStage(String diabetesStage) { this.diabetesStage = diabetesStage; }
    public String getObesityStage() { return obesityStage; }
    public void setObesityStage(String obesityStage) { this.obesityStage = obesityStage; }
    public String getRiskScore() { return riskScore; }
    public void setRiskScore(String riskScore) { this.riskScore = riskScore; }
    public List<String> getWarnings() { return warnings; }
    public void setWarnings(List<String> warnings) { this.warnings = warnings; }
}
