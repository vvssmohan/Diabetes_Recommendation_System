package com.prescription.health;

public class HealthAnalysisRequest {
    private Long user_id;
    private Double height;
    private Double weight;
    private Double sugar_fasting;
    private Double sugar_post;
    private String blood_pressure;
    private String activity_level;
    private String family_history;

    // Getters and setters
    public Long getUser_id() { return user_id; }
    public void setUser_id(Long user_id) { this.user_id = user_id; }
    public Double getHeight() { return height; }
    public void setHeight(Double height) { this.height = height; }
    public Double getWeight() { return weight; }
    public void setWeight(Double weight) { this.weight = weight; }
    public Double getSugar_fasting() { return sugar_fasting; }
    public void setSugar_fasting(Double sugar_fasting) { this.sugar_fasting = sugar_fasting; }
    public Double getSugar_post() { return sugar_post; }
    public void setSugar_post(Double sugar_post) { this.sugar_post = sugar_post; }
    public String getBlood_pressure() { return blood_pressure; }
    public void setBlood_pressure(String blood_pressure) { this.blood_pressure = blood_pressure; }
    public String getActivity_level() { return activity_level; }
    public void setActivity_level(String activity_level) { this.activity_level = activity_level; }
    public String getFamily_history() { return family_history; }
    public void setFamily_history(String family_history) { this.family_history = family_history; }
}
