package com.prescription.health;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface HealthDataRepository extends JpaRepository<HealthData, Long> {
    List<HealthData> findByUserId(Long userId);
}
