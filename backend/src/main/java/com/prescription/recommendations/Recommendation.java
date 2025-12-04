package com.prescription.recommendations;

import javax.persistence.*;

@Entity
@Table(name = "recommendations")
public class Recommendation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rec_id")
    private Long recId;

    @Column(name = "user_id")
    private Long userId;
    @Column(name = "diet_plan")
    private String dietPlan;
    @Column(name = "exercise_plan")
    private String exercisePlan;
    @Column(name = "lifestyle_tips")
    private String lifestyleTips;
    @Column(name = "risk_score")
    private String riskScore;

    // Getters and setters
    public Long getRecId() { return recId; }
    public void setRecId(Long recId) { this.recId = recId; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getDietPlan() { return dietPlan; }
    public void setDietPlan(String dietPlan) { this.dietPlan = dietPlan; }
    public String getExercisePlan() { return exercisePlan; }
    public void setExercisePlan(String exercisePlan) { this.exercisePlan = exercisePlan; }
    public String getLifestyleTips() { return lifestyleTips; }
    public void setLifestyleTips(String lifestyleTips) { this.lifestyleTips = lifestyleTips; }
    public String getRiskScore() { return riskScore; }
    public void setRiskScore(String riskScore) { this.riskScore = riskScore; }
}
