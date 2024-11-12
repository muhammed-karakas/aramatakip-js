package com.aramatakip.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aramatakip.entity.CallRecord;
import com.aramatakip.service.CallReportService;

@RestController
@RequestMapping("/call-record")
public class CallRecordController {

    private final CallReportService reportService;

    public CallRecordController(CallReportService reportService) {
        this.reportService = reportService;
    }

    @PostMapping("/create")
    public ResponseEntity<String> createCallRecord(@RequestBody CallRecord callRecord) {
        reportService.saveCallRecord(callRecord);
        return ResponseEntity.ok("Yeni arama kaydı başarıyla eklendi.");
    }

    @GetMapping("/all")
    public List<CallRecord> getAllRecords() {
        return reportService.getAllRecords();
    }

    @GetMapping("/today")
    public List<CallRecord> getTodayRecords() {
        return reportService.getTodayRecords();
    }

    @GetMapping("/user")
    public List<CallRecord> getUserRecords(@RequestParam String name) {
        return reportService.getUserRecords(name);
    }

    @GetMapping("/range")
    public List<CallRecord> getRecordsInRange(@RequestParam String startDate, @RequestParam String endDate) {
        return reportService.getRecordsInRange(startDate, endDate);
    }

    @GetMapping("/excel")
    public ResponseEntity<byte[]> downloadExcelReport(@RequestParam String reportType, @RequestParam(required = false) String name,
            @RequestParam(required = false) String startDate, @RequestParam(required = false) String endDate) {
        return reportService.prepareExcelReport(reportType, name, startDate, endDate);
    }
}
