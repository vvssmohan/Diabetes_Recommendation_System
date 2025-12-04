package com.prescription.recommendations;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {
    @Autowired
    private RecommendationService recommendationService;

    @PostMapping("/generate")
    public ResponseEntity<?> generateRecommendations(@RequestParam Long userId, @RequestParam String riskScore) {
        try {
            Recommendation recommendation = recommendationService.generateRecommendations(userId, riskScore);
            return ResponseEntity.ok(recommendation);
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Error generating recommendations: " + e.getMessage());
        }
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getRecommendations(@PathVariable Long userId) {
        try {
            Recommendation recommendation = recommendationService.getRecommendations(userId);
            if (recommendation == null) {
                return ResponseEntity.status(404).body("No recommendations found for this user");
            }
            return ResponseEntity.ok(recommendation);
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Error retrieving recommendations: " + e.getMessage());
        }
    }
}
