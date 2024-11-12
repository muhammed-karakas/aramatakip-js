package com.aramatakip.service;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.aramatakip.entity.CallRecord;
import com.aramatakip.repository.CallRecordRepository;

@Service
public class CallReportService {

    private final CallRecordRepository repository;
    private final ExcelReportService excelReportService;

    public CallReportService(CallRecordRepository repository, ExcelReportService excelReportService) {
        this.repository = repository;
        this.excelReportService = excelReportService;
    }

    public void saveCallRecord(CallRecord callRecord) {
        repository.save(callRecord);
    }

    public List<CallRecord> getAllRecords() {
        return repository.findAll();
    }

    public List<CallRecord> getTodayRecords() {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(23, 59, 59);
        return repository.findRecordsInRange(startOfDay, endOfDay);
    }

    public List<CallRecord> getUserRecords(String name) {
        if (name == null || name.isBlank()) {
            return Collections.emptyList();
        }
        return repository.findByFullName(name);
    }

    public List<CallRecord> getRecordsInRange(String startDate, String endDate) {
        if (startDate == null || startDate.isBlank() || endDate == null || endDate.isBlank()) {
            return Collections.emptyList();
        }
        LocalDateTime start = parseDate(startDate);
        LocalDateTime end = parseDate(endDate);
        if (start.isAfter(end)) {
            throw new IllegalArgumentException("Başlangıç tarihi bitiş tarihinden sonra olamaz.");
        }
        return repository.findRecordsInRange(start, end);
    }

    public List<CallRecord> getRecordsForReport(String reportType, String name, String startDate, String endDate) {
        return switch (reportType) {
            case "all" ->
                getAllRecords();
            case "today" ->
                getTodayRecords();
            case "user" ->
                getUserRecords(name);
            case "range" ->
                getRecordsInRange(startDate, endDate);
            default ->
                throw new IllegalArgumentException("Geçersiz rapor tipi.");
        };
    }

    public ResponseEntity<byte[]> prepareExcelReport(String reportType, String name, String startDate, String endDate) {
        try {
            List<CallRecord> records = getRecordsForReport(reportType, name, startDate, endDate);
            if (records.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            ByteArrayInputStream excelStream = excelReportService.generateReport(records);
            HttpHeaders headers = new HttpHeaders();
            headers.add("Content-Disposition", "attachment; filename=" + generateFileName(reportType, name, startDate, endDate) + ".xlsx");
            return ResponseEntity.ok()
                    .headers(headers)
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(excelStream.readAllBytes());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(("Hatalı istek: " + e.getMessage()).getBytes());
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Sunucu hatası: Dosya oluşturulamadı.".getBytes());
        }
    }

    private String generateFileName(String reportType, String name, String startDate, String endDate) {
        if ("today".equals(reportType)) {
            return LocalDate.now().toString();
        } else if ("user".equals(reportType) && name != null) {
            return name;
        } else if ("range".equals(reportType) && startDate != null && endDate != null) {
            return startDate + "_to_" + endDate;
        } else {
            return "all";
        }
    }

    private LocalDateTime parseDate(String date) {
        return LocalDateTime.parse(date);
    }
}
