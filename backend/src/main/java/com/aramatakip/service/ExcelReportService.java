package com.aramatakip.service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import com.aramatakip.entity.CallRecord;

@Service
public class ExcelReportService {

    public ByteArrayInputStream generateReport(List<CallRecord> callRecords) throws IOException {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Call Records");
            CellStyle headerStyle = workbook.createCellStyle();
            XSSFFont font = ((XSSFWorkbook) workbook).createFont();
            font.setBold(true);
            headerStyle.setFont(font);
            Row headerRow = sheet.createRow(0);
            String[] headers = {"ID", "Ad-Soyad", "Telefon Numarası", "Tarih-Saat", "Sorun Birime Ait Mi?", "Gelmeyi Gerektirir Mi?"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }
            int rowIndex = 1;
            for (CallRecord record : callRecords) {
                Row row = sheet.createRow(rowIndex++);
                row.createCell(0).setCellValue(record.getId());
                row.createCell(1).setCellValue(record.getFullName());
                row.createCell(2).setCellValue(record.getPhoneNumber());
                row.createCell(3).setCellValue(record.getCallDateTime().toString());
                row.createCell(4).setCellValue(record.getIssueBelongsToUnit() ? "Evet" : "Hayır");
                row.createCell(5).setCellValue(record.getNeedsVisit() ? "Evet" : "Hayır");
            }
            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }
}
