
import java.io.FileWriter;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class Sample {

    private static final String[] NAMES = {"Ahmet", "Mehmet", "Ayşe", "Fatma", "Deniz", "Ece", "Burak", "Cem"};
    private static final String[] SURNAMES = {"Yılmaz", "KAYA", "Şahin", "DEMİR", "Çelik", "ÖZTÜRK", "Kara", "AK"};

    private static final Random RANDOM = new Random();
    private static final int RECORD_COUNT = 10000;
    private static final int DAYS_IN_YEAR = 365;

    private static final DateTimeFormatter TIMESTAMP_FORMATTER = DateTimeFormatter.ofPattern("dd-MMM-yy hh.mm.ss.SSSSSS a");

    public static void main(String[] args) {
        try (FileWriter writer = new FileWriter("sample.sql")) {
            LocalDate startDate = LocalDate.of(2024, 1, 1);
            LocalDate endDate = LocalDate.of(2024, 12, 31);
            List<LocalDate> dates = generateDates(startDate, endDate);
            for (int i = 0; i < RECORD_COUNT; i++) {
                String sql = generateInsert(dates.get(i % DAYS_IN_YEAR));
                writer.write(sql);
            }
            System.out.println("sample.sql dosyası başarıyla oluşturuldu.");
        } catch (IOException e) {
            System.err.println("Dosya oluşturulurken hata meydana geldi: " + e.getMessage());
        }
    }

    private static String generateInsert(LocalDate date) {
        String fullName = generateFullName();
        String phoneNumber = generatePhoneNumber();
        boolean issueBelongsToUnit = RANDOM.nextBoolean();
        boolean needsVisit = RANDOM.nextBoolean();
        String timestamp = generateTimestamp(date);
        return String.format(
                "INSERT INTO CALL_RECORD (FULL_NAME, PHONE_NUMBER, CALL_DATE_TIME, ISSUE_BELONGS_TO_UNIT, NEEDS_VISIT) VALUES ('%s', '%s', TO_TIMESTAMP('%s', 'DD-MON-RR HH12.MI.SSXFF AM'), %d, %d);\n",
                fullName, phoneNumber, timestamp, issueBelongsToUnit ? 1 : 0, needsVisit ? 1 : 0
        );
    }

    private static String generateFullName() {
        String name = NAMES[RANDOM.nextInt(NAMES.length)];
        StringBuilder fullName = new StringBuilder(name);
        int additionalNames = RANDOM.nextInt(3);
        for (int i = 0; i < additionalNames; i++) {
            fullName.append(" ").append(NAMES[RANDOM.nextInt(NAMES.length)]);
        }
        String surname = SURNAMES[RANDOM.nextInt(SURNAMES.length)];
        fullName.append(" ").append(surname);
        if (!surname.equals(surname.toUpperCase()) && RANDOM.nextBoolean()) {
            fullName.append(" ").append(SURNAMES[RANDOM.nextInt(SURNAMES.length)]);
        }
        return fullName.toString();
    }

    private static String generatePhoneNumber() {
        StringBuilder phone = new StringBuilder("05");
        for (int i = 0; i < 9; i++) {
            phone.append(RANDOM.nextInt(10));
        }
        return phone.toString();
    }

    private static String generateTimestamp(LocalDate date) {
        LocalDateTime dateTime = date.atTime(RANDOM.nextInt(24), RANDOM.nextInt(60), RANDOM.nextInt(60), RANDOM.nextInt(1_000_000));
        return dateTime.format(TIMESTAMP_FORMATTER).toUpperCase();
    }

    private static List<LocalDate> generateDates(LocalDate start, LocalDate end) {
        List<LocalDate> dates = new ArrayList<>();
        LocalDate currentDate = start;
        while (!currentDate.isAfter(end)) {
            dates.add(currentDate);
            currentDate = currentDate.plusDays(1);
        }
        return dates;
    }
}
