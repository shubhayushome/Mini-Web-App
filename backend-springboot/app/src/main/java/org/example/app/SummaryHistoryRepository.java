package org.example.app;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SummaryHistoryRepository extends JpaRepository<SummaryHistory, Long> {
}
