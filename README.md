# Arama Takip

Arama Takip, kullanıcı ve tarih-saat bazlı arama kaydı tutulabilmesi ve mevcut kayıtların görüntülenebilmesi amacı ile geliştirilmiş bir projedir. Kullanıcılar, ad-soyad, telefon, tarih-saat, sorunun birime ait olup olmadığı ve gelmeyi gerektirip gerektirmediği gibi bilgileri içeren bir formu doldurup kaydedebilir veya mevcut kayıtları filtreleyerek görüntüleyebilir. Bu proje **Oracle DB**, **Spring Boot**, ve **React (Javascript + Ant Design)** kullanılarak geliştirilmiştir.

## Özellikler
- Proje, hem Docker üzerinde hem de lokal olarak çalışabilecek şekilde üretilmiştir.
- Lokal çalıştırma için **Java 17** ve bir **Web Server (veya NPX)** bulunması gereklidir.
- Bağlanılan Database'de **CALL_RECORD** tablosu otomatik olarak oluşturulacaktır.

## Kurulum

### Gereksinimler
- **Docker** bilgisayarınızda yüklü olmalıdır.
- Bir **Oracle Database** mevcut olmalı ve `.env` dosyasında bağlantı bilgileri doğru bir şekilde yapılandırılmalıdır.

### Adımlar

1. Mevcut imajların veya bu imajlardan oluşturacağınız konteynerlerin **Environment** bilgilerini düzenleyerek projeyi tekrar derlemeden kullanabilirsiniz.

2. Eğer `.env` dosyasında veya proje kodlarında bir değişiklik yaptıktan sonra projeyi tekrar derlemek isterseniz `docker-compose.yml` dosyasının bulunduğu dizinde şu komutu kullanarak imaj ve konteynerleri oluşturup başlatabilirsiniz.

    ```bash
    docker-compose up --build
    ```

   > **Not**: Paylaşılan proje paketinde Docker imajları `.tar` dosya formatında eklenmiştir. İmajları yüklemek için aşağıdaki komutu kullanabilirsiniz:
   > ```bash
   > docker load -i <image_name>.tar
   > ```
