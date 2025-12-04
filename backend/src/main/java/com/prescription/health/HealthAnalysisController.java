package com.prescription.health;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/health")
public class HealthAnalysisController {
    @Autowired
    private HealthAnalysisService healthAnalysisService;

    @PostMapping("/analyze")
    public ResponseEntity<?> analyzeHealth(@RequestBody HealthAnalysisRequest request) {
        try {
            HealthAnalysisResponse response = healthAnalysisService.analyzeHealth(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Error analyzing health data: " + e.getMessage());
        }
    }
}
