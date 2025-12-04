package com.prescription.health;

import javax.persistence.*;

@Entity
@Table(name = "health_data")
public class HealthData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "record_id")
    private Long recordId;

    @Column(name = "user_id")
    private Long userId;
    private Double bmi;
    @Column(name = "sugar_fasting")
    private Double sugarFasting;
    @Column(name = "sugar_post")
    private Double sugarPost;
    @Column(name = "blood_pressure")
    private String bloodPressure;
    @Column(name = "activity_level")
    private String activityLevel;
    @Column(name = "family_history")
    private String familyHistory;

    // Getters and setters
    public Long getRecordId() { return recordId; }
    public void setRecordId(Long recordId) { this.recordId = recordId; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public Double getBmi() { return bmi; }
    public void setBmi(Double bmi) { this.bmi = bmi; }
    public Double getSugarFasting() { return sugarFasting; }
    public void setSugarFasting(Double sugarFasting) { this.sugarFasting = sugarFasting; }
    public Double getSugarPost() { return sugarPost; }
    public void setSugarPost(Double sugarPost) { this.sugarPost = sugarPost; }
    public String getBloodPressure() { return bloodPressure; }
    public void setBloodPressure(String bloodPressure) { this.bloodPressure = bloodPressure; }
    public String getActivityLevel() { return activityLevel; }
    public void setActivityLevel(String activityLevel) { this.activityLevel = activityLevel; }
    public String getFamilyHistory() { return familyHistory; }
    public void setFamilyHistory(String familyHistory) { this.familyHistory = familyHistory; }
}
