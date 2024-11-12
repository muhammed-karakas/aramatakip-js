package com.aramatakip.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.aramatakip.entity.CallRecord;

public interface CallRecordRepository extends JpaRepository<CallRecord, Long> {

    @Query("SELECT c FROM CallRecord c WHERE "
            + "LOWER(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(c.fullName, 'ç', 'c'), 'ğ', 'g'), 'ı', 'i'), 'ö', 'o'), 'ş', 's'), 'ü', 'u')) = "
            + "LOWER(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(:name, 'ç', 'c'), 'ğ', 'g'), 'ı', 'i'), 'ö', 'o'), 'ş', 's'), 'ü', 'u'))")
    List<CallRecord> findByFullName(@Param("name") String name);

    @Query("SELECT c FROM CallRecord c WHERE c.callDateTime BETWEEN :startDate AND :endDate")
    List<CallRecord> findRecordsInRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}
