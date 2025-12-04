package com.prescription.recommendations;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RecommendationService {
    @Autowired
    private RecommendationRepository recommendationRepository;

    public Recommendation generateRecommendations(Long userId, String riskScore) {
        Recommendation recommendation = new Recommendation();
        recommendation.setUserId(userId);
        recommendation.setRiskScore(riskScore);
        recommendation.setDietPlan(generateDietPlan(riskScore));
        recommendation.setExercisePlan(generateExercisePlan(riskScore));
        recommendation.setLifestyleTips(generateLifestyleTips(riskScore));
        return recommendationRepository.save(recommendation);
    }

    public Recommendation getRecommendations(Long userId) {
        return recommendationRepository.findByUserId(userId);
    }

    private String generateDietPlan(String riskScore) {
        if (riskScore.equals("High")) {
            return "1. Eat fiber-rich breakfast. 2. Avoid sugary foods. 3. Prefer whole grains. 4. Add green leafy vegetables. 5. Drink cinnamon water. 6. Avoid fried food.";
        } else if (riskScore.equals("Medium")) {
            return "1. Include more fruits and vegetables. 2. Reduce salt intake. 3. Choose lean proteins. 4. Limit sugary drinks. 5. Eat small frequent meals.";
        }
        return "1. Maintain a balanced diet. 2. Include all food groups. 3. Stay hydrated. 4. Limit processed foods.";
    }

    private String generateExercisePlan(String riskScore) {
        if (riskScore.equals("High")) {
            return "1. 30-minute walk daily. 2. Yoga for flexibility. 3. Reduce stress through meditation. 4. Sleep 7-8 hours. 5. Track daily sugar readings.";
        } else if (riskScore.equals("Medium")) {
            return "1. 20-30 minute moderate exercise. 2. Brisk walking. 3. Swimming or cycling. 4. Gentle stretching. 5. Regular physical activity.";
        }
        return "1. Regular physical activity. 2. At least 150 minutes per week. 3. Strength training 2x per week.";
    }

    private String generateLifestyleTips(String riskScore) {
        if (riskScore.equals("High")) {
            return "1. Monitor blood sugar regularly. 2. Consult endocrinologist. 3. Manage stress effectively. 4. Avoid smoking and alcohol. 5. Stay consistent with medication.";
        } else if (riskScore.equals("Medium")) {
            return "1. Regular health checkups. 2. Maintain ideal weight. 3. Reduce stress. 4. Adequate sleep. 5. Social engagement.";
        }
        return "1. Annual health screening. 2. Maintain healthy weight. 3. Healthy work-life balance.";
    }
}
