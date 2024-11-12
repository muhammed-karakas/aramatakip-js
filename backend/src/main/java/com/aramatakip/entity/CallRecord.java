package com.aramatakip.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "CALL_RECORD")
@Getter
@Setter
public class CallRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "FULL_NAME", nullable = false, length = 255)
    @NotBlank(message = "Ad-Soyad boş bırakılamaz.")
    @Pattern(regexp = "^(?=\\S+(?: \\S+){1,4}$)(?:(?:[A-ZÇĞİÖŞÜ][a-zçğıöşü]{1,} (?:[A-ZÇĞİÖŞÜ][a-zçğıöşü]{1,}|[A-ZÇĞİÖŞÜ]{2,}))|(?:(?:[A-ZÇĞİÖŞÜ][a-zçğıöşü]{1,} ){1,3}(?:[A-ZÇĞİÖŞÜ][a-zçğıöşü]{1,} (?:[A-ZÇĞİÖŞÜ][a-zçğıöşü]{1,}|[A-ZÇĞİÖŞÜ]{2,})|[A-ZÇĞİÖŞÜ]{2,} [A-ZÇĞİÖŞÜ]{2,})))$",
            message = "Geçersiz Ad-Soyad biçimi.")
    private String fullName;

    @Column(name = "PHONE_NUMBER", nullable = false, length = 11)
    @NotNull(message = "Telefon Numarası boş bırakılamaz.")
    @Pattern(regexp = "^05\\d{9}$",
            message = "Telefon Numarası '05' ile başlamalı ve 11 haneli olmalıdır.")
    private String phoneNumber;

    @Column(name = "CALL_DATE_TIME", nullable = false)
    @NotNull(message = "Tarih-Saat boş bırakılamaz.")
    private LocalDateTime callDateTime;

    @Column(name = "ISSUE_BELONGS_TO_UNIT", nullable = false)
    @NotNull(message = "Sorun Birime Ait Mi? boş bırakılamaz.")
    private Boolean issueBelongsToUnit;

    @Column(name = "NEEDS_VISIT", nullable = false)
    @NotNull(message = "Gelmeyi Gerektirir Mi? boş bırakılamaz.")
    private Boolean needsVisit;
}
