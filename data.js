window.APP_DATA = {
  "archLayers": [
    {
      "num": "Katman 5",
      "title": "Güvenlik, Yönetişim & Ürün Değerlendirmeleri (Evals & KVKK)",
      "summary": "Ölümcül Üçlü (Lethal Trifecta) savunması, insan onay kapıları, OWASP 2026 limitleri, KVKK/ZDR ve gerçek izlere dayalı Open/Axial Coding + LLM-as-a-Judge.",
      "badge": "Doğrulama & Koruma"
    },
    {
      "num": "Katman 4",
      "title": "İzole Araçlar, MCP & Kod Yürütme (Tools & Sandbox)",
      "summary": "MCP sunucularını doğrudan izole kod yürütme (TypeScript/Python) ortamında çalıştırarak bağlamı %98,7'ye kadar küçültme ve PII anonimleştirme.",
      "badge": "Eylem Katmanı"
    },
    {
      "num": "Katman 3",
      "title": "Akıllı Model Yönlendirme (%90 Hızlı / %10 Akıl Yürütme)",
      "summary": "Rutin işleri hızlı Sistem 1 modellerine, çok değişkenli karar ve derin hata ayıklamayı Sistem 2 (reasoning) modellerine sevk etme + Prompt Caching & Batch API.",
      "badge": "Bilişsel Motor"
    },
    {
      "num": "Katman 2",
      "title": "Bağlam Mühendisliği & Hibrit RAG (Context Budget)",
      "summary": "Bağlam Çürümesine (Context Rot) karşı kıt dikkat bütçesi yönetimi: Doğru İrtifa, Just-in-Time Retrieval, Sıkıştırma, BM25 + Vektör + Reranker.",
      "badge": "Çalışma Belleği"
    },
    {
      "num": "Katman 1",
      "title": "Kalıcı Proje Belleği & Harness (AGENTS.md / SKILL.md)",
      "summary": "Ajan = Model + Harness. Sürüm kontrollü şartnameler (SDD), AGENTS.md kuralları, kademeli yüklenen SKILL.md becerileri, feature_list.json ve deterministik kontrol akışı.",
      "badge": "Omurga"
    }
  ],
  "lessons": [
    {
      "id": "L1",
      "title": "1. Bağlam Çürümesi ve Harness Mühendisliği",
      "tag": "Temel Mimari",
      "duration": "5 dk",
      "mentalModel": "Bağlam penceresi sınırsız bir hard disk değil, her kelimenin dikkat bütçesinden çaldığı dar bir çalışma masasıdır. Ajan = Model + Harness.",
      "sections": [
        {
          "heading": "Bağlam Çürümesi (Context Rot) Gerçeği",
          "points": [
            "1 milyon tokenlık pencerelere rağmen 18 sınır modelde yapılan ölçümler, girdi uzadıkça doğruluğun belirgin biçimde düştüğünü gösterir (200K pencerede ~50K civarında ciddi kayıp).",
            "Transformer dikkat mekanizması n token için n² ikili ilişki kurar; uzun girdilerde dikkat bütçesi incelir.",
            "Lost in the Middle etkisi: İlgili bilginin 20 dokümanlık bağlamın ortasına gömülmesi doğruluğu yaklaşık 20 puan düşürebilir."
          ]
        },
        {
          "heading": "Üst Düzey Bağlam Yönetiminin 6 Kuralı",
          "points": [
            "Doğru İrtifa (Right Altitude): Ne kırılgan if-else kuralları ne de muğlak genellemeler; XML etiketleri (<instructions>, <data>, <output_format>) ve birkaç temsili örnek kullanın.",
            "Anında Erişim (Just-in-Time) & SKILL.md: Tüm kod tabanını baştan yapıştırmayın. SKILL.md açılışta sadece ~100 token (ad + açıklama) yükler, gerektiğinde tam yönergeyi açar.",
            "Sıkıştırma & Tekrarlama (Recitation): %60–80 dolulukta eski araç çıktılarını temizleyin, geçmişi özetleyin ve todo.md dosyasını güncelleyerek ana hedefi bağlamın en sonuna taşıyın.",
            "Hataları Bağlamda Bırakın: Başarısız araç çağrılarını gizlemek yerine bırakın ki model aynı hatayı tekrarlamayıp gerçek hata kurtarma yapsın.",
            "Initializer + Coding Agent: Uzun projelerde önce init.sh, claude-progress.txt ve makine okunur feature_list.json ('passes': false) oluşturun; her oturum tek bir özelliği test edip commit etsin.",
            "12-Factor Agents: Bir sonraki adımı model seçebilir ama döngü sınırı, bütçe tavanı ve insan onay kapılarını deterministik kod yönetmelidir."
          ]
        }
      ],
      "check": {
        "q": "50 araç çağrılık uzun bir ajan görevinde hedeften sapmayı önlemek için Manus ekibinin önerdiği 'Tekrarlama (Recitation)' tekniği nedir?",
        "options": [
          "Tüm sistem promptunu her adımda 3 kez kopyalamak",
          "todo.md dosyasını düzenli güncelleyip ana hedefi bağlamın en sonuna taşımak",
          "Önceki tüm hata mesajlarını bağlamdan silmek"
        ],
        "answer": 1,
        "explain": "todo.md dosyasını güncelleyip sona yazmak, ana hedefi modelin en taze dikkat bölgesinde tutar; hataları silmek ise aynı hatanın tekrarlanmasına yol açar."
      }
    },
    {
      "id": "L2",
      "title": "2. %90/%10 Model Yönlendirme ve Maliyet Mühendisliği",
      "tag": "Maliyet & Performans",
      "duration": "5 dk",
      "mentalModel": "Her işe akıl yürütme (reasoning) modeli göndermek, markete gitmek için Formula 1 aracı kiralamaya benzer: 5–20 kat pahalı, daha yavaş ve bazen aşırı düşünme yüzünden daha hatalı.",
      "sections": [
        {
          "heading": "Sistem 1 (Hızlı) vs. Sistem 2 (Akıl Yürütme)",
          "points": [
            "%90+ Rutin İşler (Hızlı Standart Modeller): Özetleme, metin düzenleme, format dönüştürme, sınıflandırma, basit kod tamamlama (ör. Haiku 5.5, Gemini 3.8 Flash, GPT-5.6 hızlı katman).",
            "%5–10 Kritik Kararlar (Akıl Yürütme Modelleri): Çok değişkenli mimari kararlar, hukuki/finansal çelişki taraması, karmaşık hata ayıklama ve hasmane (Red-Team) plan eleştirisi.",
            "Akıl yürütme modellerine 'adım adım şöyle düşün' diye tarif vermek yerine kesin kısıtları ve öz-doğrulama ölçütlerini verin; derinliği API'deki effort (low/medium/high) parametresiyle ayarlayın."
          ]
        },
        {
          "heading": "KV-Cache (Prompt Caching) & Batch API ile %78–90 Tasarruf",
          "points": [
            "Ajan döngülerinde girdi/çıktı token oranı ortalama 100:1'dir; KV-Cache isabet oranı en kritik maliyet metriğidir.",
            "Önbelleği bozan 4 hata: (1) Sistem promptunun başına saniyeli zaman damgası koymak, (2) Dinamik kullanıcı girdisini sabit yönergenin önüne koymak, (3) Görev ortasında araç tanımlarını silip eklemek, (4) JSON anahtar sıralamasını bozmak.",
            "Batch API asenkron işlerde %50 indirim sağlar; Anthropic gibi sağlayıcılarda Prompt Caching ile birleştiğinde günlük maliyet %90'a yakın düşebilir (Vertex AI ve Groq'ta iki indirim birleşmez).",
            "Yeni tokenizer değişimleri (%30'a varan token farkı) nedeniyle maliyeti 'milyon token fiyatı' ile değil, görev başına toplam maliyetle ölçün."
          ]
        }
      ],
      "check": {
        "q": "Bir ajan sisteminde Prompt Caching (KV-Cache) isabet oranının neredeyse %0'a düşmesinin en yaygın teknik sebebi hangisidir?",
        "options": [
          "Sistem promptunun en başına saniye bazlı güncel zaman damgası (timestamp) eklemek",
          "Sabit yönergeleri başa, kullanıcı sorusunu sona koymak",
          "JSON anahtarlarını alfabetik sırayla sabit tutmak"
        ],
        "answer": 0,
        "explain": "Önek (prefix) tabanlı KV-Cache'te ilk satırdaki tek bir değişen token (ör. saniyeli saat) sonraki tüm sistem promptunun önbelleğini geçersiz kılar."
      }
    },
    {
      "id": "L3",
      "title": "3. İş Akışları, Ajanlar, Yapılandırılmış Çıktı ve MCP",
      "tag": "Sistem Tasarımı",
      "duration": "6 dk",
      "mentalModel": "Adımlar akış şeması olarak çizilebiliyorsa otonom ajan değil, deterministik İş Akışı (Workflow) kurun. Ajanı yalnızca açık uçlu muhakeme gerektiğinde açın.",
      "sections": [
        {
          "heading": "5 Deterministik İş Akışı Deseni",
          "points": [
            "Prompt Zincirleme (Chaining): Ara doğrulama kapılarıyla (gates) sabit alt adımlar.",
            "Yönlendirme (Routing): Girdiyi sınıflandırıp ucuz/pahalı modele sevk etme (kaliteyi ~%95 koruyup maliyeti ~%70 düşürebilir).",
            "Paralelleştirme (Parallelization): Bölme (Sectioning) veya çoklu oylama (Voting) ile hız ve güvenlik.",
            "Orkestratör-İşçiler (Orchestrator-Workers): Lider model alt görevleri izole alt ajanlara dağıtır. Araştırma testinde tekil modeli %90,2 geçip süreyi %90 kısaltabilir ama ~15× token tüketir!",
            "Değerlendirici-Optimize Edici (Evaluator-Optimizer): Bir model üretir, diğeri net ölçütlerle eleştirip iyileştirir."
          ]
        },
        {
          "heading": "Yapılandırılmış Çıktı & MCP ile Kod Yürütme",
          "points": [
            "Structured Outputs (Constrained Decoding): Pydantic/Zod şemasıyla geçerli JSON garantilenir; ancak içerik doğruluğu garantilenmez ve refusal/max_tokens durumları ayrıca yakalanmalıdır.",
            "Code Execution with MCP: Yüzlerce araç tanımını ve 10.000 satırlık ham tabloyu bağlama sokmak yerine MCP sunucularını izole TypeScript/Python kod ortamında çağırıp modele yalnızca 5 özet satır döndürün.",
            "Anthropic'in Drive–Salesforce örneğinde bu desen bağlam tüketimini 150.000 tokendan 2.000 tokena indirmiş (%98,7 tasarruf) ve PII verilerini modele gitmeden istemci tarafında maskelemiştir."
          ]
        }
      ],
      "check": {
        "q": "Pydantic / Zod ile şema kısıtlı yapılandırılmış çıktı (Constrained Decoding) kullandığınızda aşağıdakilerden hangisi GARANTİ EDİLMEZ?",
        "options": [
          "Çıktının geçerli JSON sözdizimine uyması",
          "JSON alanlarının içindeki bilgilerin olgusal olarak doğru (halüsinasyonsuz) olması",
          "Zorunlu alan adlarının şemayla eşleşmesi"
        ],
        "answer": 1,
        "explain": "Constrained Decoding yalnızca biçimsel (sözdizimsel) uyumu zorunlu kılar; model geçerli bir JSON içinde hâlâ yanlış veya uydurma değer üretebilir."
      }
    },
    {
      "id": "L4",
      "title": "4. Halüsinasyon Önleme, Hibrit RAG ve Ürün Değerlendirmeleri (Evals)",
      "tag": "Kalite & Güvenilirlik",
      "duration": "6 dk",
      "mentalModel": "Genel liderlik tabloları (MMLU) sadece başlangıç modeli seçtirir; kendi ürününüzde neyin kırıldığını yalnızca kendi 30–100 gerçek izinizdeki hata analizi (Evals) söyler.",
      "sections": [
        {
          "heading": "3 Katmanlı Halüsinasyon Savunması",
          "points": [
            "İki türü ayırın: Olgusallık (bilmediğini uydurma) ve Bağlılık (önündeki kaynakla çelişme).",
            "Hibrit RAG + Reranking: Anthropic Bağlamsal Erişim deneyinde bağlamsal özet erişim hatalarını %35, BM25 hibrit arama %49, üstüne Reranker eklemek ise %67 azaltmıştır.",
            "Vaka çalışması: Meta veri filtreli RAG + Rerank + atıf doğrulama, 12.000 poliçelik finans sisteminde halüsinasyonu %19'dan %1'in altına indirmiştir.",
            "Zorunlu Atıf & Çekinme (Abstention) + CoVe: Şemaya zorunlu sources alanı koyun; boşsa 'Doğrulanmış kaynak bulunamadı' döndürün ve Doğrulama Zinciri (CoVe) uygulayın."
          ]
        },
        {
          "heading": "Hamel Husain'in 4 Adımlı Eval Döngüsü",
          "points": [
            "1. Temsili İz Toplama: Gerçek kullanımdan en az 30–100 uçtan uca iz (trace) toplayın.",
            "2. Açık Kodlama (Open Coding): Tek bir alan uzmanı 1–5 puan yerine ikili Geçti/Kaldı (Pass/Fail) kararı ve kısa eleştiriyle ilk kırılma noktasını işaretler.",
            "3. Eksenel Kodlama (Axial Coding): Serbest notları somut hata kategorilerine ayırıp sıklığını sayın.",
            "4. Kalibre Otomatik Evals: Önce deterministik kod testleri, ardından insan etiketleriyle TPR/TNR kalibre edilmiş özel LLM-as-a-Judge kurup her değişiklikte çalıştırın."
          ]
        }
      ],
      "check": {
        "q": "Hamel Husain'in ürün değerlendirme (Evals) metodolojisinde Açık Kodlama (Open Coding) aşamasında neden 1–5 arası puanlama yerine Geçti/Kaldı (Pass/Fail) önerilir?",
        "options": [
          "1–5 puanlama belirsiz ve tutarsızdır; ikili Pass/Fail kararı net hata kök nedenlerini ve ilk kırılma noktasını ortaya çıkarır",
          "LLM'ler 1 ile 5 arasındaki sayıları okuyamaz",
          "Pass/Fail daha az veri gerektirir ve insan incelemesine ihtiyaç duymaz"
        ],
        "answer": 0,
        "explain": "3/5 veya 4/5 gibi muğlak puanlar ekip içinde gürültü yaratır; ikili Pass/Fail kararı somut bir kusuru zorunlu kılar ve eyleme geçirilebilir hata taksonomisi üretir."
      }
    },
    {
      "id": "L5",
      "title": "5. Ajan Güvenliği (Ölümcül Üçlü), OWASP 2026 ve Türkiye KVKK",
      "tag": "Güvenlik & Hukuk",
      "duration": "5 dk",
      "mentalModel": "Ajan güvenliği modele 'saldırıya kanma' diye yalvarmak değil, Ölümcül Üçlünün en az bir bacağını mimari olarak kesmektir.",
      "sections": [
        {
          "heading": "Ölümcül Üçlü (The Lethal Trifecta) & OWASP 2026",
          "points": [
            "Aynı oturumda şu üçü birleşirse dolaylı komut enjeksiyonu otomatik veri sızıntısına dönüşür: (1) Özel/hassas verilere erişim, (2) Güvenilmeyen dış içeriğe maruz kalma, (3) Dışa iletişim yeteneği (e-posta, HTTP, Markdown görsel linki, PR).",
            "Savunma: Okuma adımında yazma/ağ araçlarını kapatın, kod çalıştırmayı kum havuzunda (sandbox) tutun, API anahtarlarını ajandan gizleyin ve geri döndürülemez işlemlerde insan onay kapısı koyun.",
            "OWASP LLM Top 10 (Ağustos 2026): Aşırı Yetki (Excessive Agency) 3. sıraya, Sınırsız Tüketim (Unbounded Consumption) 6. sıraya yükseldi. Sert harcama limitleri ve token hız (velocity) alarmları şarttır.",
            "Snyk ToxicSkills incelemesi açık ajan becerilerinin %13,4'ünde kritik güvenlik sorunu saptadı: kaynak kodunu okumadan MCP veya SKILL.md kurmayın."
          ]
        },
        {
          "heading": "Türkiye 6698 Sayılı KVKK ve Yerel Mahremiyet",
          "points": [
            "Tüketici abonelikleri ile API/kurumsal planların veri saklama politikaları farklıdır; standart API'de bile kötüye kullanım günlükleri 30 gün tutulabilir.",
            "Hassas verileri (T.C. kimlik, sağlık, müşteri kaydı) yurt dışı bulut sohbet araçlarına doğrudan girmeyin.",
            "3 Pratik Çözüm: (1) Göndermeden önce Microsoft Presidio veya Türkçe hukuk belgeleri için yerel Katip ile maskeleme, (2) ZDR (Zero Data Retention) sözleşmeli kurumsal API, (3) Ollama + Open WebUI ile Qwen3.8-27B, Gemma 4 veya Kumru-2B'yi tamamen yerel çalıştırma."
          ]
        }
      ],
      "check": {
        "q": "Simon Willison'ın tanımladığı 'Ölümcül Üçlü (Lethal Trifecta)' hangi üç yeteneğin aynı ajan oturumunda birleşmesiyle oluşur?",
        "options": [
          "Büyük model + Yüksek sıcaklık + Uzun sistem promptu",
          "Hassas verilere erişim + Güvenilmeyen dış içerik okuma + Dışa iletişim (veri gönderme) yeteneği",
          "Vektör veritabanı + BM25 arama + Reranker"
        ],
        "answer": 1,
        "explain": "Bu üç bacak aynı anda açıksa, dış içerikteki gizli bir talimat (indirect prompt injection) ajana hassas veriyi okutup dışa iletişim aracıyla saldırgana göndertir."
      }
    },
    {
      "id": "L6",
      "title": "6. Türkiye Ekosistemi, 8 Yerli Model ve Sürdürülebilir Öğrenme",
      "tag": "Ekosistem & Strateji",
      "duration": "5 dk",
      "mentalModel": "Kendi hızında MOOC'ların tamamlanma oranı yalnızca %3–6'dır. Bilgi aşırı yüklenmesini yenmenin yolu pasif tüketim değil, kısıtlı bilgi diyeti + somut çıktı (artifact) üretimidir.",
      "sections": [
        {
          "heading": "Türkiye 2026 Yapay Zeka Fotoğrafı",
          "points": [
            "18 Ağustos 2026'da Resmî Gazete'de yayımlanan Türkiye Yapay Zekâ Eylem Planı (2026–2030), 16 öncelikli eylem tanımladı; TRAI haritasında 504 yerli YZ girişimi bulunuyor.",
            "TRAI 2026 Araştırması: Kurumların %67,1'i en az bir alanda ajan tabanlı YZ kullanırken onaylı stratejiye sahip olanlar %35,8'de kalıyor. Merkezi bütçesi olanların %53,6'sı 6+ alana ölçeklenirken bütçesizlerde bu oran %6,8.",
            "8 Yerli Model: BİLGE (37B, TÜBİTAK BİLGEM), Kumru AI (7.4B & açık kaynak 2B, VNGRS), Cosmos Turkish-Gemma-9b-T1 (YTÜ), Trendyol LLM / Asure-12B (çok modlu), TURNA (1.1B, Boğaziçi), T3 AI, MAIN GPT (HAVELSAN), Aigency."
          ]
        },
        {
          "heading": "Bilgi Diyeti ve Şartname Odaklı Günlük Alışkanlık",
          "points": [
            "Bilgi Diyeti Kuralı: En fazla 2 bülten (1 günlük hızlı filtre + 1 haftalık derin sentez), 2 sessize alınmış topluluk (yalnızca takılınca açılacak) ve 1 aktif öğrenme reposu.",
            "Yazılımcılar için Spec-Driven Development (SDD): Önce kapsam dışı maddeleri (non-goals) içeren şartname → salt-okunur Plan Modu → önce test sonra kod → doğrulama + şartname güncelleme.",
            "Bilgi Çalışanları için: Gemini Notebook (kapalı kaynak-temelli RAG), Deep Research, n8n/Dify otomasyonları ve akıl yürütme modeliyle Hasmane (Red-Team) eleştiri."
          ]
        }
      ],
      "check": {
        "q": "Kendi hızında çevrimiçi yapay zeka kurslarında tamamlanma oranının %3–6 bandında kalmasının ana nedeni ve çözümü nedir?",
        "options": [
          "Kursların çok kısa olması; çözüm günde 10 bülten okumaktır",
          "Pasif video izleme döngüsüne girmek; çözüm her aşamada gerçek işinizde kullanacağınız somut bir çıktı (artifact) üretmektir",
          "Yeterince sertifika verilmemesi; çözüm her hafta yeni bir rozet toplamaktır"
        ],
        "answer": 1,
        "explain": "Pasif izleme kalıcı yetkinlik üretmez; aktif pratik, SM-2 tekrarı ve her faz sonunda çalışan bir çıktı (şablon, otomasyon, RAG, MCP, eval seti) üretmek kalıcılığı sağlar."
      }
    }
  ],
  "flashcards": [
    {
      "id": "fc1",
      "cat": "Mimari",
      "q": "2026'da ileri düzey ajan tasarımının temel formülü nedir?",
      "a": "Ajan = Model + Harness. Performansı belirleyen yalnızca model değil; bellek, araçlar, doğrulama döngüsü ve deterministik kontrol çerçevesidir."
    },
    {
      "id": "fc2",
      "cat": "Bağlam",
      "q": "Bağlam Çürümesi (Context Rot) nedir?",
      "a": "Büyük bağlam pencerelerine (1M token) rağmen girdi uzadıkça dikkat bütçesinin (n²) incelmesi nedeniyle model doğruluğunun erken düşmesidir (200K'da ~50K civarında ciddi düşüş görülebilir)."
    },
    {
      "id": "fc3",
      "cat": "Bağlam",
      "q": "Lost in the Middle (Ortada Kaybolma) etkisi doğruluğu ne kadar etkiler?",
      "a": "İlgili bilginin 20 dokümanlık bir bağlamın ortasına gömülmesi doğruluğu yaklaşık 20 puan düşürebilir."
    },
    {
      "id": "fc4",
      "cat": "Bağlam",
      "q": "Agent Skills (SKILL.md) standardındaki 'Kademeli Yükleme' (Progressive Disclosure) nasıl çalışır?",
      "a": "Açılışta her becerinin yalnızca adı ve kısa açıklaması (~100 token) yüklenir; ilgili görev geldiğinde tam yönerge (<5.000 token) açılır; ek betikler sadece çalışırken okunur."
    },
    {
      "id": "fc5",
      "cat": "Bağlam",
      "q": "Manus ekibinin uzun görevlerde hedef sapmasını önleyen 'Tekrarlama (Recitation)' tekniği nedir?",
      "a": "Ajanın her birkaç adımda bir todo.md dosyasını güncelleyerek ana hedefi bağlam penceresinin en sonuna taşımasıdır."
    },
    {
      "id": "fc6",
      "cat": "Bağlam",
      "q": "Başarısız araç çağrıları ve hata izleri bağlamdan silinmeli midir?",
      "a": "Hayır. Hataları bağlamda bırakmak modelin aynı hatayı tekrarlamasını önler ve gerçek hata kurtarma (error recovery) davranışı üretir."
    },
    {
      "id": "fc7",
      "cat": "Harness",
      "q": "Initializer + Coding Agent deseninde neden Markdown yerine feature_list.json kullanılır?",
      "a": "Modeller makine okunur JSON yapısını ('passes': false/true) serbest Markdown listelerine göre çok daha az bozar; her oturum tek bir özelliği test edip commit ederek devreder."
    },
    {
      "id": "fc8",
      "cat": "Maliyet",
      "q": "%90 / %10 Model Yönlendirme kuralı nedir?",
      "a": "Rutin işlerin %90+'ını hızlı/ucuz standart modellere (Sistem 1), yalnızca çok değişkenli karar ve derin hata ayıklama içeren %5–10'luk dilimi akıl yürütme (Sistem 2) modellerine göndermektir."
    },
    {
      "id": "fc9",
      "cat": "Maliyet",
      "q": "Ajan döngülerinde ortalama girdi/çıktı token oranı kaçtır ve KV-Cache neden kritiktir?",
      "a": "Ortalama 100:1'dir. Önbellekten okunan tokenlar standart girdinin onda birine mal olabilir; bu yüzden KV-Cache isabet oranı en kritik maliyet metriğidir."
    },
    {
      "id": "fc10",
      "cat": "Maliyet",
      "q": "Prompt Caching (KV-Cache) isabetini bozan en klasik 2 hata nedir?",
      "a": "1) Sistem promptunun başına saniyeli zaman damgası koymak, 2) Görev ortasında araç tanımlarını silip eklemek veya sabit metnin önüne dinamik veri koymak."
    },
    {
      "id": "fc11",
      "cat": "Maliyet",
      "q": "Prompt Caching + Batch API birleşimi tekrarlı sistem promptlu işlerde maliyeti ne kadar düşürebilir?",
      "a": "%78–90'a varan oranlarda düşürebilir (Anthropic, Fireworks ve xAI'da iki indirim birleşir; Vertex AI ve Groq'ta birleşmez)."
    },
    {
      "id": "fc12",
      "cat": "Ajanlar",
      "q": "Anthropic'in Orkestratör-İşçiler çoklu ajan değerlendirmesindeki kazanım ve maliyet uyarısı nedir?",
      "a": "Tekil modeli %90,2 geride bırakıp süreyi %90'a kadar kısaltmıştır; ancak standart sohbete göre ~15× token tüketir."
    },
    {
      "id": "fc13",
      "cat": "MCP",
      "q": "Code Execution with MCP (MCP ile Kod Yürütme) bağlam tüketimini ne kadar azaltmıştır?",
      "a": "Anthropic'in Drive–Salesforce örneğinde 150.000 tokendan 2.000 tokena indirerek %98,7 tasarruf sağlamış ve istemci tarafında PII maskelemesine olanak tanımıştır."
    },
    {
      "id": "fc14",
      "cat": "Çıktı",
      "q": "Constrained Decoding (Yapılandırılmış Çıktı) neyi garanti eder, neyi etmez?",
      "a": "Geçerli JSON şema biçimini garanti eder; ancak içerik doğruluğunu garanti etmez ve güvenlik reddi (refusal) ile max_tokens kesintileri ayrıca yakalanmalıdır."
    },
    {
      "id": "fc15",
      "cat": "RAG",
      "q": "Anthropic Bağlamsal Erişim deneyinde kümülatif erişim hatası azalma oranları nedir?",
      "a": "Bağlamsal özet: %35 azalma → +BM25 Hibrit Arama: %49 azalma → +Reranker (Yeniden Sıralama): %67 azalma."
    },
    {
      "id": "fc16",
      "cat": "Evals",
      "q": "Hamel Husain'in 4 adımlı Ürün Değerlendirme (Evals) döngüsü nedir?",
      "a": "1) 30–100 gerçek iz topla, 2) Alan uzmanıyla ikili Geçti/Kaldı Open Coding yap, 3) Axial Coding ile hata kategorilerini say, 4) Kod testleri + TPR/TNR kalibre LLM-as-a-Judge kur."
    },
    {
      "id": "fc17",
      "cat": "Güvenlik",
      "q": "Ölümcül Üçlü (The Lethal Trifecta) nedir ve nasıl engellenir?",
      "a": "Hassas veri erişimi + güvenilmeyen dış içerik + dışa iletişim yeteneğinin aynı oturumda birleşmesidir. Çözüm: En az bir bacağı mimari olarak kesmek (sandbox, ağ kısıtı, insan onayı)."
    },
    {
      "id": "fc18",
      "cat": "Güvenlik",
      "q": "Snyk ToxicSkills incelemesi açık kaynak ajan becerileri hakkında ne bulmuştur?",
      "a": "Herkese açık ajan becerilerinin %13,4'ünde kritik güvenlik sorunları saptanmıştır; kaynak kodu incelenmeden üçüncü taraf MCP/SKILL.md kurulmamalıdır."
    },
    {
      "id": "fc19",
      "cat": "Güvenlik",
      "q": "OWASP LLM Top 10 (Ağustos 2026) listesinde hangi iki ajan riski hızla yükseldi?",
      "a": "Aşırı Yetki / Özerklik (Excessive Agency) 3. sıraya, Sınırsız Tüketim (Unbounded Consumption) 6. sıraya yükseldi."
    },
    {
      "id": "fc20",
      "cat": "KVKK",
      "q": "Türkiye'de KVKK uyumlu ileri yapay zeka kullanımı için 3 pratik katman nedir?",
      "a": "1) Presidio veya Türkçe Katip ile veri maskeleme, 2) ZDR (Zero Data Retention) sözleşmeli kurumsal API, 3) Ollama + Open WebUI üzerinde yerel açık model (Qwen3.8-27B, Gemma 4, Kumru-2B)."
    },
    {
      "id": "fc21",
      "cat": "GitHub",
      "q": "Kasım 2026 itibarıyla GitHub'da en çok yıldız alan ilk 3 YZ eğitim/beceri deposu hangisidir?",
      "a": "1) obra/superpowers (311,3B), 2) anthropics/skills (199,5B), 3) Fatih Kadir Akın'ın f/prompts.chat (178B) deposu."
    },
    {
      "id": "fc22",
      "cat": "Türkiye",
      "q": "TRAI 2026 Araştırması Türkiye kurumlarında hangi olgunluk açığını gösterdi?",
      "a": "Kurumların %67,1'i en az bir alanda ajan tabanlı YZ kullanırken onaylı strateji oranı %35,8'de kalıyor. Merkezi bütçelilerin %53,6'sı 6+ alana ölçeklenirken bütçesizlerde bu oran %6,8."
    },
    {
      "id": "fc23",
      "cat": "Yerli Model",
      "q": "TÜBİTAK BİLGEM'in BİLGE modeli ile VNGRS'nin Kumru AI modeli arasındaki temel farklar nelerdir?",
      "a": "BİLGE 37B parametreli kamu/kritik veri odaklı (henüz pilot/kapalı) ulusal modeldir; Kumru AI 7.4B (demo) ve 2B (Hugging Face'te Apache 2.0 açık ağırlıklı) hafif kurumsal Türkçe modeldir."
    },
    {
      "id": "fc24",
      "cat": "Yerli Model",
      "q": "YTÜ COSMOS ve Trendyol Tech'in öne çıkan açık ağırlıklı Türkçe modelleri hangileridir?",
      "a": "YTÜ COSMOS: Turkish-Gemma-9b-T1 (adım adım Türkçe akıl yürütme) + turkish-e5-large embedding. Trendyol Tech: Asure-12B (çok modlu metin+görsel dahil 7B–70B aile)."
    },
    {
      "id": "fc25",
      "cat": "Pratik",
      "q": "Yazılımcılar için Şartname Odaklı Geliştirme (SDD) 4 adımı nedir?",
      "a": "1) Kapsam dışı maddeleri içeren Markdown şartnamesi, 2) Salt-okunur Plan Modu, 3) Küçük görevlerde önce test sonra kod, 4) Doğrulama + şartname güncellemesi."
    },
    {
      "id": "fc26",
      "cat": "Öğrenme",
      "q": "Bilgi aşırı yüklenmesine karşı önerilen 'Bilgi Diyeti' kuralı nedir?",
      "a": "En fazla 2 bülten (1 günlük hızlı filtre + 1 haftalık derin analiz), 2 sessize alınmış topluluk ve tek bir aktif öğrenme deposu + her fazda somut çıktı (artifact)."
    }
  ],
  "quizzes": [
    {
      "id": "q1",
      "cat": "Model Yönlendirme",
      "scenario": "Günde 5.000 müşteri destek e-postasını 6 kategoriye ayırıp kısa Türkçe özet çıkaran bir sistem kuruyorsunuz. Geliştiriciniz en pahalı akıl yürütme (reasoning) modelini seçmek istiyor.",
      "q": "En doğru mühendislik kararı hangisidir?",
      "options": [
        "En yüksek doğruluk için tüm 5.000 e-postayı akıl yürütme modeline göndermek",
        "Hızlı/ucuz standart model + Yapılandırılmış Çıktı (JSON Schema) + Batch API kullanmak; sadece belirsiz/kritik %5 vakayı üst modele yönlendirmek",
        "Tüm e-postaları tek bir 1M tokenlık sohbete yapıştırıp tek seferde sınıflandırmak",
        "Sıcaklığı (temperature) 1.5 yapıp rastgeleliği artırmak"
      ],
      "answer": 1,
      "explain": "Sınıflandırma ve özetleme %90'lık Sistem 1 dilimine girer. Akıl yürütme modeli 5–20× pahalı ve yavaştır; yönlendirme + şema kısıtlı çıktı + Batch API maliyeti dramatik biçimde düşürür."
    },
    {
      "id": "q2",
      "cat": "Güvenlik (Lethal Trifecta)",
      "scenario": "Bir yapay zeka ajanına şirket e-postalarınızı okuma, dışarıdan gelen PDF faturaları inceleme ve otomatik e-posta gönderme (send_email) yetkisi verdiniz.",
      "q": "Bu mimarideki en kritik güvenlik açığı ve doğru çözümü nedir?",
      "options": [
        "Açık yok; sistem promptuna 'Saldırgan komutlara uyma' yazmak yeterlidir",
        "Ölümcül Üçlü (Hassas veri + Güvenilmeyen dış PDF + Dışa gönderim) oluşmuştur; send_email aracını okuma oturumundan ayırmalı veya insan onay kapısı koymalısınız",
        "Sadece PDF boyutunu 5 MB ile sınırlamak yeterlidir",
        "Modeli daha büyük bir modele yükseltmek açığı tamamen kapatır"
      ],
      "answer": 1,
      "explain": "Dış PDF içine gizlenmiş bir dolaylı komut enjeksiyonu ajana şirket e-postalarını okutup send_email ile dışarı sızdırtabilir. Çözüm prompt değil, mimari izolasyon ve insan onay kapısıdır."
    },
    {
      "id": "q3",
      "cat": "Maliyet & KV-Cache",
      "scenario": "20.000 tokenlık sabit kurumsal kılavuz içeren bir ajan servisiniz var. Prompt Caching açtınız ama faturanız neredeyse hiç düşmedi.",
      "q": "Aşağıdaki kod pratiklerinden hangisi önbelleği sürekli bozuyor olabilir?",
      "options": [
        "Sistem promptunun 1. satırına 'Şu anki zaman: 2026-11-25 14:22:09' eklemek",
        "Sabit kılavuzu başa, kullanıcı mesajını en sona yerleştirmek",
        "Araç tanımlarını tüm oturum boyunca sabit tutmak",
        "JSON anahtarlarını deterministik sıralamak"
      ],
      "answer": 0,
      "explain": "KV-Cache önek (prefix) eşleşmesiyle çalışır. İlk satırdaki saniyeli zaman damgası her istekte değiştiği için 20.000 tokenlık önbelleğin tamamını geçersiz kılar."
    },
    {
      "id": "q4",
      "cat": "MCP & Bağlam",
      "scenario": "Ajanınız Google Drive'dan 10.000 satırlık satış tablosu okuyup 5 özet satırı CRM'e yazıyor. Her çalıştırmada 150.000 token harcanıyor ve bağlam doluyor.",
      "q": "Anthropic'in önerdiği en etkili optimizasyon hangisidir?",
      "options": [
        "Daha büyük bağlam penceresi olan bir modele geçmek",
        "MCP ile Kod Yürütme (Code Execution with MCP): Tabloyu izole kod ortamında filtreleyip modele yalnızca 5 özet satırı döndürmek",
        "Tabloyu 50 ayrı sohbete bölüp manuel yapıştırmak",
        "Araç açıklamalarını daha da uzatmak"
      ],
      "answer": 1,
      "explain": "Code Execution with MCP ham veriyi modelin bağlamından geçirmeden yerel/izole kod ortamında işler; Anthropic örneğinde 150K → 2K (%98,7) token tasarrufu sağlamıştır."
    },
    {
      "id": "q5",
      "cat": "Hibrit RAG",
      "scenario": "12.000 kurumsal poliçe dokümanı üzerinde yalnızca standart vektör araması (dense embedding) yapan RAG sisteminizde halüsinasyon ve eksik belge oranı yüksek.",
      "q": "En yüksek ölçülmüş iyileşmeyi sağlayan mimari yükseltme hangisidir?",
      "options": [
        "Top-K değerini 100 yapıp tüm metinleri bağlama doldurmak",
        "Bağlamsal parçalama + BM25 anahtar kelime hibrit araması + Cross-Encoder Reranker + zorunlu atıf/çekinme sözleşmesi",
        "Vektör aramasını kapatıp sadece modelin genel bilgisine güvenmek",
        "Sıcaklığı artırarak daha yaratıcı yanıtlar almak"
      ],
      "answer": 1,
      "explain": "Bağlamsal erişim + BM25 + Reranker erişim hatalarını %67'ye kadar azaltır; atıf ve çekinme sözleşmesi halüsinasyonu %1'in altına indirmeye yardımcı olur."
    },
    {
      "id": "q6",
      "cat": "Evals Disiplini",
      "scenario": "Yeni kurduğunuz yapay zeka asistanının kalitesini ölçmek ve hızla iyileştirmek istiyorsunuz. Ekibiniz hazır bir '1–5 Yardımseverlik Puanı' metriği kurmayı öneriyor.",
      "q": "Hamel Husain'in saha rehberine göre ilk yapmanız gereken nedir?",
      "options": [
        "MMLU ve GPQA skorlarına bakıp en yüksek modeli seçmek yeterlidir",
        "30–100 gerçek iz toplayıp tek bir alan uzmanıyla ikili Geçti/Kaldı (Open Coding) incelemesi yapmak ve hata kategorilerini (Axial Coding) çıkarmak",
        "Doğrudan 10 farklı jenerik 1–5 puan metriği açmak",
        "Kullanıcı şikayeti gelene kadar beklemek"
      ],
      "answer": 1,
      "explain": "Jenerik 1–5 puanlar gerçek kırılma nedenlerini gizler. Önce 30–100 gerçek izde alan uzmanıyla Pass/Fail hata analizi yapıp özel hata taksonomisi çıkarılmalıdır."
    },
    {
      "id": "q7",
      "cat": "KVKK & Gizlilik",
      "scenario": "Türkiye'de bir hukuk/sağlık ekibi, içinde T.C. kimlik numaraları ve hasta/müvekkil kayıtları bulunan belgeleri özetlemek için bireysel tüketici sohbet hesabı kullanmak istiyor.",
      "q": "6698 sayılı KVKK açısından en güvenli ve doğru yaklaşım hangisidir?",
      "options": [
        "Tüketici hesabında 'sohbet geçmişini kapat' demek her hukuki yükümlülüğü çözer",
        "Verileri göndermeden Presidio/Katip ile anonimleştirmek veya ZDR sözleşmeli kurumsal API ya da Ollama + Open WebUI üzerinde yerel açık model (Qwen3.8/Kumru-2B) kullanmak",
        "Sadece dosya adını değiştirip yüklemek",
        "Promptun sonuna 'KVKK uyumlu ol' yazmak"
      ],
      "answer": 1,
      "explain": "Kişisel verilerin yurt dışı tüketici arayüzlerine aktarılması KVKK açısından ciddi risk taşır; maskeleme (Presidio/Katip), ZDR sözleşmeli API veya tam yerel açık modeller kullanılmalıdır."
    },
    {
      "id": "q8",
      "cat": "İş Akışı vs Ajan",
      "scenario": "Her sabah gelen 3 sabit formattaki raporu okuyup, belirlenmiş 4 kurala göre kontrol eden ve onaylı tabloya yazan bir süreç kuruyorsunuz.",
      "q": "Hangi mimariyi seçmelisiniz?",
      "options": [
        "Tam otonom 5 ajanlık Orkestratör-İşçiler sürüsü",
        "Deterministik İş Akışı (Prompt Chaining + Programatik Doğrulama Kapıları)",
        "Kısıtsız kabuk (shell) erişimli otonom kodlama ajanı",
        "İnsan incelemesiz sonsuz döngülü ajan"
      ],
      "answer": 1,
      "explain": "Adımlar önceden akış şeması olarak çizilebiliyorsa deterministik iş akışı çok daha ucuz, hızlı, öngörülebilir ve test edilebilirdir."
    },
    {
      "id": "q9",
      "cat": "Kodlama Ajanları",
      "scenario": "Çok oturumlu büyük bir yazılım projesinde kodlama ajanınız ilk oturumda her şeyi yarıda bırakıyor, sonraki oturumda da bitmemiş özellikler için 'tamamlandı' diyor.",
      "q": "Anthropic'in Long-Running Harnesses rehberine göre çözüm nedir?",
      "options": [
        "Tek seferde daha uzun bir prompt yazmak",
        "Initializer + Coding Agent: init.sh, claude-progress.txt ve 'passes': false bayraklı feature_list.json kurup her oturumda yalnızca tek özelliği uçtan uca test edip git commit ile devretmek",
        "Ajanın test yazmasını yasaklamak",
        "Tüm proje dosyalarını tek bir dosyada birleştirmek"
      ],
      "answer": 1,
      "explain": "Yapılandırılmış feature_list.json ve oturum başı tek özellik + gerçek uçtan uca test doğrulaması, erken zafer ilan etme ve yarıda bırakma sorunlarını çözer."
    },
    {
      "id": "q10",
      "cat": "Açık Kaynak Güvenliği",
      "scenario": "İnternette bulduğunuz popüler bir topluluk dizininden 5 adet üçüncü taraf SKILL.md ve MCP sunucusunu doğrudan şirket bilgisayarınıza kuracaksınız.",
      "q": "2026 güvenlik verilerine göre hangi önlem zorunludur?",
      "options": [
        "Yıldız sayısı yüksekse hiçbir kontrole gerek yoktur",
        "Snyk ToxicSkills (%13,4 kritik açık) riskine karşı kaynak kodunu ve istenen izinleri okumadan kurmamak, mümkünse resmi üretici MCP sunucularını tercih etmek",
        "Sadece dosya uzantısının .md olmasına bakmak yeterlidir",
        "Tüm API anahtarlarını global ortam değişkenine koymak"
      ],
      "answer": 1,
      "explain": "Açık beceri pazarlarında kritik güvenlik açıkları yaygındır. Resmi tedarikçi MCP sunucuları tercih edilmeli ve tüm üçüncü taraf kodlar/izinler denetlenmelidir."
    }
  ],
  "roadmaps": {
    "dev": {
      "label": "Yazılım ve Yapay Zeka Geliştiricisi",
      "months": [
        {
          "title": "1. Ay: Temel Kurulum, Bağlam & SDD Alışkanlığı (Gün 1–30)",
          "tasks": [
            {
              "id": "d1",
              "title": "microsoft/generative-ai-for-beginners veya mlabonne/llm-course ilk modüllerini tamamla",
              "artifact": "Çıktı: Çalışan ilk API + Python/TS proje reposu"
            },
            {
              "id": "d2",
              "title": "3Blue1Brown Transformer serisi & Karpathy Zero to Hero temellerini izle",
              "artifact": "Çıktı: Attention & Tokenizasyon kişisel özet notu"
            },
            {
              "id": "d3",
              "title": "Aktif projelerine kısa ve net AGENTS.md / CLAUDE.md + Spec-Driven Development akışı kur",
              "artifact": "Çıktı: Sürüm kontrollü şartname (spec.md) + AGENTS.md"
            },
            {
              "id": "d4",
              "title": "Pydantic veya Zod + Constrained Decoding ile şema garantili bir API servisi yaz",
              "artifact": "Çıktı: Refusal & max_tokens yakalayan yapılandırılmış çıktı servisi"
            }
          ]
        },
        {
          "title": "2. Ay: Hibrit RAG, MCP ve Yerel Model Yığını (Gün 31–60)",
          "tasks": [
            {
              "id": "d5",
              "title": "Claude Academy (MCP Intro & Advanced) ve TÜBİTAK BİLGEM YTE Harness Mühendisliği raporunu bitir",
              "artifact": "Çıktı: Kendi 3 araçlık çalışan MCP sunucun"
            },
            {
              "id": "d6",
              "title": "NirDiamant/RAG_Techniques & openai-cookbook ile Hibrit RAG kur",
              "artifact": "Çıktı: BM25 + Vektör + Reranker + zorunlu atıf içeren RAG servisi"
            },
            {
              "id": "d7",
              "title": "Ollama + Open WebUI ile yerel gizlilik ortamı kur",
              "artifact": "Çıktı: Yerelde çalışan Qwen3.8-27B / Gemma 4 veya Türkçe Kumru-2B test yığını"
            },
            {
              "id": "d8",
              "title": "Code Execution with MCP veya izole sandbox araç akışı dene",
              "artifact": "Çıktı: Ham veriyi bağlama sokmadan özetleyen araç betiği"
            }
          ]
        },
        {
          "title": "3. Ay: Evals, Maliyet Optimizasyonu ve Güvenlik (Gün 61–90)",
          "tasks": [
            {
              "id": "d9",
              "title": "Hamel Husain Evals rehberini ve humanlayer/12-factor-agents ilkelerini uygula",
              "artifact": "Çıktı: 50+ gerçek izde Open/Axial Coding + kalibre LLM-as-a-Judge eval paketi"
            },
            {
              "id": "d10",
              "title": "Prompt Caching (KV-Cache) + Batch API + %90/%10 Yönlendirme ekle",
              "artifact": "Çıktı: Görev başı maliyet/gecikme karşılaştırma raporu"
            },
            {
              "id": "d11",
              "title": "Ölümcül Üçlü (Lethal Trifecta) & OWASP 2026 güvenlik denetimi yap",
              "artifact": "Çıktı: Sert harcama limiti, token hız alarmı ve insan onay kapısı"
            },
            {
              "id": "d12",
              "title": "rasbt/LLMs-from-scratch ile derin mekanik pekiştirme yap",
              "artifact": "Çıktı: Portföyde yayımlanmış uçtan uca üretim kalitesinde YZ uygulaması"
            }
          ]
        }
      ]
    },
    "knowledge": {
      "label": "Bilgi Çalışanı, Akademisyen & Araştırmacı",
      "months": [
        {
          "title": "1. Ay: Temel Okuryazarlık ve Kişisel Bilgi Bankası (Gün 1–30)",
          "tasks": [
            {
              "id": "k1",
              "title": "OpenAI Academy (AI Foundations) + Claude Academy (Claude 101, AI Fluency) + BTK Akademi temel derslerini tamamla",
              "artifact": "Çıktı: Temel okuryazarlık rozetleri ve kavram haritası"
            },
            {
              "id": "k2",
              "title": "Günlük en sık yaptığın 3 tekrarlı iş için XML etiketli (<instructions>, <data>, <output_format>) kalıcı şablonlar oluştur",
              "artifact": "Çıktı: 3 adet test edilmiş kişisel sistem promptu"
            },
            {
              "id": "k3",
              "title": "Gemini Notebook (eski NotebookLM) üzerinde kendi belgelerinle kapalı bilgi bankası kur",
              "artifact": "Çıktı: Halüsinasyonsuz alıntılı kişisel araştırma defteri"
            }
          ]
        },
        {
          "title": "2. Ay: İş Akışı Otomasyonu ve Beceri Dosyaları (Gün 31–60)",
          "tasks": [
            {
              "id": "k4",
              "title": "OpenAI Academy (Agents & Workflows) + DeepLearning.AI AI Prompting for Everyone + f/prompts.chat incele",
              "artifact": "Çıktı: Kendi alanına özel 2 adet SKILL.md çalışma yönergesi"
            },
            {
              "id": "k5",
              "title": "n8n veya Dify üzerinde kod yazmadan otomasyon kur",
              "artifact": "Çıktı: E-posta, belge veya tablo bağlayan en az 2 çalışan iş akışı"
            },
            {
              "id": "k6",
              "title": "Bilgi diyetini kur (1 günlük + 1 haftalık bülten + Otostopçunun YZ Rehberi podcast'i)",
              "artifact": "Çıktı: Gürültüsüz haftalık 30 dakikalık takip rutini"
            }
          ]
        },
        {
          "title": "3. Ay: Hasmane İnceleme, Deep Research ve KVKK (Gün 61–90)",
          "tasks": [
            {
              "id": "k7",
              "title": "Ethan Mollick (One Useful Thing) + KVKK 15 Soruda YZ Rehberini oku",
              "artifact": "Çıktı: Kişisel/kurumsal veri maskeleme kontrol listesi"
            },
            {
              "id": "k8",
              "title": "Hızlı vs. akıl yürütme modeli seçim matrisini günlük işine uygula",
              "artifact": "Çıktı: Akıl yürütme modeliyle Hasmane (Red-Team) eleştiriden geçmiş stratejik belge"
            },
            {
              "id": "k9",
              "title": "Deep Research ajanlarıyla tam kaynaklı literatür/sektör sentezi üret",
              "artifact": "Çıktı: Doğrulanmış kaynaklı kapsamlı sektör/akademi raporu"
            }
          ]
        }
      ]
    },
    "leader": {
      "label": "Yönetici, Ürün Lideri & Girişimci",
      "months": [
        {
          "title": "1. Ay: Strateji, Politika ve KVKK/ZDR Çerçevesi (Gün 1–30)",
          "tasks": [
            {
              "id": "l1",
              "title": "OpenAI Academy (AI Leadership) + Claude Academy (Human-Agent Teams) + Andrew Ng AI for Everyone + TRAI 2026 Araştırmasını incele",
              "artifact": "Çıktı: Kurum/ekip içi YZ olgunluk öz-değerlendirmesi"
            },
            {
              "id": "l2",
              "title": "Kurumsal kullanım politikası ve KVKK/ZDR veri sınıflandırma kurallarını yaz",
              "artifact": "Çıktı: 1 sayfalık ekip YZ kullanım ve veri mahremiyeti politikası"
            },
            {
              "id": "l3",
              "title": "TRAI 2026 bulgusuna uygun merkezi pilot bütçe planı oluştur",
              "artifact": "Çıktı: Ayrılmış bütçeli 90 günlük pilot yol haritası"
            }
          ]
        },
        {
          "title": "2. Ay: ROI Odaklı Süreç Seçimi ve Mimari Karar (Gün 31–60)",
          "tasks": [
            {
              "id": "l4",
              "title": "Anthropic Building Effective Agents + OpenAI Practical Guide to Building Agents rehberlerini oku",
              "artifact": "Çıktı: Yüksek ROI'lı 3 süreç için 'İş Akışı mı, Ajan mı?' karar matrisi"
            },
            {
              "id": "l5",
              "title": "Görev başına maliyet, gecikme ve kalite KPI'larını tanımla",
              "artifact": "Çıktı: Milyon token yerine görev başı maliyet takip tablosu"
            }
          ]
        },
        {
          "title": "3. Ay: Yönetişim, Hata Analizi Ritmi ve Ölçekleme (Gün 61–90)",
          "tasks": [
            {
              "id": "l6",
              "title": "OWASP LLM Top 10 (2026) + Türkiye 2026–2030 YZ Eylem Planı çerçevesinde denetim yap",
              "artifact": "Çıktı: Sert API harcama tavanları ve insan onay kapıları politikası"
            },
            {
              "id": "l7",
              "title": "Alan uzmanlarının yönettiği haftalık eval/hata inceleme ritmi başlat",
              "artifact": "Çıktı: Kurum içi paylaşımlı SKILL.md kütüphanesi ve haftalık eval raporu"
            }
          ]
        }
      ]
    }
  },
  "resources": [
    {
      "id": "r1",
      "name": "obra/superpowers",
      "cat": "GitHub",
      "lang": "EN",
      "level": "İleri",
      "meta": "311,3B ⭐",
      "desc": "15 bileşenli ajan yazılım geliştirme metodolojisi (plan, git worktree, TDD, inceleme); 16 kodlama ajanıyla uyumlu.",
      "url": "https://github.com/obra/superpowers"
    },
    {
      "id": "r2",
      "name": "anthropics/skills",
      "cat": "GitHub",
      "lang": "EN",
      "level": "Orta-İleri",
      "meta": "199,5B ⭐",
      "desc": "Resmi SKILL.md standardı, belge ve kurumsal ajan beceri şablonları.",
      "url": "https://github.com/anthropics/skills"
    },
    {
      "id": "r3",
      "name": "f/prompts.chat (Fatih Kadir Akın)",
      "cat": "GitHub",
      "lang": "EN/TR",
      "level": "Tümü",
      "meta": "178B ⭐ (TR Kökenli)",
      "desc": "Dünyanın en büyük açık kaynak prompt, bot ve çoklu bot takımı kütüphanesi; self-host edilebilir.",
      "url": "https://github.com/f/prompts.chat"
    },
    {
      "id": "r4",
      "name": "Shubhamsaboo/awesome-llm-apps",
      "cat": "GitHub",
      "lang": "EN",
      "level": "Orta",
      "meta": "146B ⭐",
      "desc": "100+ uçtan uca çalışan ajan, RAG, sesli ajan, MCP ve ince ayar uygulaması.",
      "url": "https://github.com/Shubhamsaboo/awesome-llm-apps"
    },
    {
      "id": "r5",
      "name": "x1xhlol/system-prompts-and-models-of-ai-tools",
      "cat": "GitHub",
      "lang": "EN",
      "level": "İleri",
      "meta": "145B ⭐",
      "desc": "Cursor, Claude Code, Devin, Manus gibi 40+ aracın 30.000+ satır sistem promptu incelemesi.",
      "url": "https://github.com/x1xhlol/system-prompts-and-models-of-ai-tools"
    },
    {
      "id": "r6",
      "name": "microsoft/generative-ai-for-beginners",
      "cat": "GitHub",
      "lang": "EN",
      "level": "Başlangıç",
      "meta": "124B ⭐",
      "desc": "21 derslik kapsamlı üretken YZ uygulama kursu (Python & TypeScript, RAG, UX, güvenlik).",
      "url": "https://github.com/microsoft/generative-ai-for-beginners"
    },
    {
      "id": "r7",
      "name": "rasbt/LLMs-from-scratch",
      "cat": "GitHub",
      "lang": "EN",
      "level": "İleri",
      "meta": "108,9B ⭐",
      "desc": "PyTorch ile sıfırdan GPT inşası, LoRA, DPO, Qwen3.5 ve Gemma 4 bonus defterleri.",
      "url": "https://github.com/rasbt/LLMs-from-scratch"
    },
    {
      "id": "r8",
      "name": "modelcontextprotocol/servers",
      "cat": "GitHub",
      "lang": "EN",
      "level": "Orta",
      "meta": "92,2B ⭐",
      "desc": "Anthropic'in resmi referans MCP sunucuları (Filesystem, Fetch, Git, Memory vb.).",
      "url": "https://github.com/modelcontextprotocol/servers"
    },
    {
      "id": "r9",
      "name": "mlabonne/llm-course",
      "cat": "GitHub",
      "lang": "EN",
      "level": "Orta-İleri",
      "meta": "85,2B ⭐",
      "desc": "3 kulvarlı LLM yol haritası (Temeller, Bilimci, Mühendis) + ücretsiz Colab defterleri.",
      "url": "https://github.com/mlabonne/llm-course"
    },
    {
      "id": "r10",
      "name": "microsoft/ai-agents-for-beginners",
      "cat": "GitHub",
      "lang": "EN",
      "level": "Orta",
      "meta": "80,8B ⭐",
      "desc": "18 derslik AI ajan kursu (araç kullanımı, planlama, MCP, A2A, tarayıcı otomasyonu, güvenlik).",
      "url": "https://github.com/microsoft/ai-agents-for-beginners"
    },
    {
      "id": "r11",
      "name": "dair-ai/Prompt-Engineering-Guide",
      "cat": "GitHub",
      "lang": "EN",
      "level": "Tümü",
      "meta": "80,3B ⭐",
      "desc": "Prompt, bağlam mühendisliği, RAG ve ajan teknikleri akademik/pratik kılavuzu.",
      "url": "https://github.com/dair-ai/Prompt-Engineering-Guide"
    },
    {
      "id": "r12",
      "name": "openai/openai-cookbook",
      "cat": "GitHub",
      "lang": "EN",
      "level": "Orta",
      "meta": "77,4B ⭐",
      "desc": "Structured Outputs, RAG evals, Voice Agents ve Agents API için resmi çalıştırılabilir defterler.",
      "url": "https://github.com/openai/openai-cookbook"
    },
    {
      "id": "r13",
      "name": "anthropics/claude-cookbooks",
      "cat": "GitHub",
      "lang": "EN",
      "level": "Orta",
      "meta": "55,1B ⭐",
      "desc": "Prompt caching, alt ajanlar, PDF/görsel analizi ve otomatik evals reçeteleri.",
      "url": "https://github.com/anthropics/claude-cookbooks"
    },
    {
      "id": "r14",
      "name": "NirDiamant/RAG_Techniques & GenAI_Agents",
      "cat": "GitHub",
      "lang": "EN",
      "level": "İleri",
      "meta": "30,5B / 25,1B ⭐",
      "desc": "42+ ileri RAG (HyDE, CRAG, Graph RAG) ve 64+ ajan tekniği defteri (ticari lisansı kontrol edin).",
      "url": "https://github.com/NirDiamant/RAG_Techniques"
    },
    {
      "id": "r15",
      "name": "humanlayer/12-factor-agents",
      "cat": "GitHub",
      "lang": "EN",
      "level": "İleri",
      "meta": "27,4B ⭐",
      "desc": "Güvenilir üretim ajanları için kontrol akışını sahiplenme manifestosu (12 ilke).",
      "url": "https://github.com/humanlayer/12-factor-agents"
    },
    {
      "id": "r16",
      "name": "ollama/ollama",
      "cat": "GitHub",
      "lang": "EN",
      "level": "Tümü",
      "meta": "165B+ ⭐",
      "desc": "Yerel LLM çalıştırmanın Docker'ı; Open WebUI ile tam çevrimdışı, KVKK uyumlu sohbet yığını.",
      "url": "https://github.com/ollama/ollama"
    },
    {
      "id": "r17",
      "name": "komunite/ai-engineering & agmmnn/turkish-nlp-resources",
      "cat": "GitHub",
      "lang": "TR",
      "level": "Orta",
      "meta": "Türkçe Güncel",
      "desc": "20 fazlık Türkçe AI Mühendisliği müfredatı ile Türkçe LLM, RAG veri setleri ve Katip maskeleme dizini.",
      "url": "https://github.com/agmmnn/turkish-nlp-resources"
    },
    {
      "id": "r18",
      "name": "Claude Academy",
      "cat": "Akademi",
      "lang": "EN",
      "level": "Tümü",
      "meta": "29 Ücretsiz Kurs",
      "desc": "Claude 101, Claude Code 101, Intro & Advanced MCP, AI Fluency ve ücretsiz LinkedIn rozetleri.",
      "url": "https://academy.claude.com/courses"
    },
    {
      "id": "r19",
      "name": "OpenAI Academy",
      "cat": "Akademi",
      "lang": "EN",
      "level": "Tümü",
      "meta": "Ücretsiz Sertifika",
      "desc": "AI Foundations, Agents & Workflows, Evaluate AI Apps ve Codex serisi (%80 sınavla rozet).",
      "url": "https://academy.openai.com/"
    },
    {
      "id": "r20",
      "name": "DeepLearning.AI",
      "cat": "Akademi",
      "lang": "EN",
      "level": "Tümü",
      "meta": "7M+ Öğrenci",
      "desc": "Andrew Ng liderliğinde 60 GenAI, 47 Ajan, 33 RAG kısa kursu ve Agentic AI uzmanlığı.",
      "url": "https://www.deeplearning.ai/"
    },
    {
      "id": "r21",
      "name": "Hugging Face Learn",
      "cat": "Akademi",
      "lang": "EN",
      "level": "Orta",
      "meta": "Ücretsiz & Açık",
      "desc": "LLM Course, Context Course, Agents Course, a smol course (fine-tuning) ve LeRobot.",
      "url": "https://huggingface.co/learn"
    },
    {
      "id": "r22",
      "name": "Stanford CS336 & MIT 6.S191",
      "cat": "Akademi",
      "lang": "EN",
      "level": "İleri",
      "meta": "Ücretsiz Üniversite",
      "desc": "Sıfırdan LLM sistemleri (Triton FlashAttention2, RL hizalama) ve güncel derin öğrenme dersleri.",
      "url": "https://cs336.stanford.edu/"
    },
    {
      "id": "r23",
      "name": "BTK Akademi",
      "cat": "Türkiye",
      "lang": "TR",
      "level": "Başlangıç-Orta",
      "meta": "3M Kullanıcı, Ücretsiz",
      "desc": "Üretken YZ, MLOps, XAI ve Güvenilir YZ dahil 400+ ücretsiz sertifikalı Türkçe eğitim.",
      "url": "https://www.btkakademi.gov.tr/"
    },
    {
      "id": "r24",
      "name": "TÜBİTAK BİLGEM (YTE Harness Raporu & YZE)",
      "cat": "Türkiye",
      "lang": "TR",
      "level": "İleri",
      "meta": "Açık Erişim PDF",
      "desc": "Kodlama Ajanı Kullanıcıları için Harness Mühendisliği (42. Sayı) — en güncel Türkçe ileri mühendislik raporu.",
      "url": "https://bilgem.tubitak.gov.tr/yze/"
    },
    {
      "id": "r25",
      "name": "ODTÜ Bilgeİş & YZTA",
      "cat": "Türkiye",
      "lang": "TR",
      "level": "Başlangıç-Orta",
      "meta": "Ücretsiz Kamu/Burs",
      "desc": "Herkes için Yapay Zeka I–II (50B+ öğrenci) ve Bakanlık/Google destekli Yapay Zeka ve Teknoloji Akademisi.",
      "url": "https://bilgeis.net/"
    },
    {
      "id": "r26",
      "name": "Turkcell Geleceği Yazanlar & Miuul",
      "cat": "Türkiye",
      "lang": "TR",
      "level": "Orta",
      "meta": "Türkçe Pratik",
      "desc": "LLM & Prompt Mühendisliği, Copilot & FastAPI, veri bilimi bootcamp'leri ve güncel Claude Skills etkinlikleri.",
      "url": "https://gelecegiyazanlar.turkcell.com.tr/egitimler"
    },
    {
      "id": "r27",
      "name": "TRAI (Türkiye Yapay Zeka İnisiyatifi)",
      "cat": "Türkiye",
      "lang": "TR",
      "level": "Tümü",
      "meta": "504 Yerli Girişim",
      "desc": "Türkiye YZ girişim haritası, 2026 kurumsal olgunluk araştırması, etkinlikler ve TRAI Podcast.",
      "url": "https://turkiye.ai/"
    },
    {
      "id": "r28",
      "name": "Anthropic Engineering Blog",
      "cat": "Blog & Bülten",
      "lang": "EN",
      "level": "İleri",
      "meta": "Kanonik Referans",
      "desc": "Building Effective Agents, Effective Context Engineering, Long-Running Harnesses ve Code Execution with MCP.",
      "url": "https://www.anthropic.com/engineering"
    },
    {
      "id": "r29",
      "name": "Hamel Husain (Evals FAQ) & Simon Willison",
      "cat": "Blog & Bülten",
      "lang": "EN",
      "level": "İleri",
      "meta": "Pratisyen Blogu",
      "desc": "Ürün değerlendirmeleri (Evals), LLM-as-a-Judge, günlük kodlama ajanı testleri ve Lethal Trifecta.",
      "url": "https://hamel.dev/blog/posts/evals-faq/"
    },
    {
      "id": "r30",
      "name": "TLDR AI & The Batch & One Useful Thing",
      "cat": "Blog & Bülten",
      "lang": "EN",
      "level": "Tümü",
      "meta": "En İyi Bilgi Diyeti",
      "desc": "Günlük 3 dk teknik özet (TLDR AI), haftalık strateji (The Batch) ve kanıta dayalı iş deneyleri (Ethan Mollick).",
      "url": "https://tldr.tech/ai"
    },
    {
      "id": "r31",
      "name": "Otostopçunun Yapay Zeka Rehberi & Üretim Bandı",
      "cat": "Blog & Bülten",
      "lang": "TR",
      "level": "Orta-İleri",
      "meta": "Türkçe Podcast",
      "desc": "Agentic Harness Engineering, Türkiye 2026–2030 Eylem Planı ve yazılım/YZ ürün geliştirme sohbetleri.",
      "url": "https://open.spotify.com/show/1rCeqPdviUG61ucnpFDl6n"
    },
    {
      "id": "r32",
      "name": "3Blue1Brown & Andrej Karpathy (YouTube)",
      "cat": "Sosyal Medya",
      "lang": "EN",
      "level": "Tümü",
      "meta": "8,7M / 1,73M Abone",
      "desc": "Transformer matematiğinin görsel sezgisi ve sıfırdan canlı kodlamalı Zero to Hero serisi.",
      "url": "https://www.youtube.com/@3blue1brown"
    },
    {
      "id": "r33",
      "name": "r/LocalLLaMA & Hugging Face Discord",
      "cat": "Sosyal Medya",
      "lang": "EN",
      "level": "Orta-İleri",
      "meta": "733B / 248B Üye",
      "desc": "Yerel donanım, niceleme (quantization), açık ağırlıklı modeller ve gerçek zamanlı mühendislik desteği.",
      "url": "https://www.reddit.com/r/LocalLLaMA/"
    },
    {
      "id": "r34",
      "name": "Ozan Sihay, BilgisayarKavramları & Murat Karakaya",
      "cat": "Sosyal Medya",
      "lang": "TR",
      "level": "Tümü",
      "meta": "Türkçe YouTube",
      "desc": "Üretken görsel/video iş akışları, akademik bilgisayar bilimi temelleri ve Türkçe YZ ajan mimarileri.",
      "url": "https://www.youtube.com/@OzanSihay"
    },
    {
      "id": "r35",
      "name": "BİLGE (37B — TÜBİTAK BİLGEM)",
      "cat": "Yerli Model",
      "lang": "TR",
      "level": "Kurumsal",
      "meta": "37B Parametre",
      "desc": "Türkçe optimize tokenizer ile düşük donanım maliyetli ulusal model; pilot kurumlara açık.",
      "url": "https://bilgem.tubitak.gov.tr/yze/"
    },
    {
      "id": "r36",
      "name": "Kumru AI (7.4B & 2B — VNGRS)",
      "cat": "Yerli Model",
      "lang": "TR",
      "level": "Orta",
      "meta": "2B Apache 2.0 Açık",
      "desc": "Sıfırdan Türkçe eğitilmiş hızlı kurumsal LLM; 2B sürümü Hugging Face'te açık ağırlıklı.",
      "url": "https://medium.com/vngrs/kumru-llm-34d1628cfd93"
    },
    {
      "id": "r37",
      "name": "Cosmos Turkish-Gemma-9b-T1 (YTÜ)",
      "cat": "Yerli Model",
      "lang": "TR",
      "level": "Orta-İleri",
      "meta": "9B Açık Ağırlıklı",
      "desc": "Türkçe adım adım akıl yürütme (reasoning) için ince ayarlı model + turkish-e5-large embedding.",
      "url": "https://huggingface.co/ytu-ce-cosmos/turkish-e5-large"
    },
    {
      "id": "r38",
      "name": "Trendyol LLM (Asure-12B) & TURNA (Boğaziçi)",
      "cat": "Yerli Model",
      "lang": "TR",
      "level": "Orta",
      "meta": "Açık Ağırlıklı",
      "desc": "Trendyol'un çok modlu Asure-12B dahil 7B–70B ailesi ve Boğaziçi TABILab'ın akademik TURNA (1.1B) modeli.",
      "url": "https://huggingface.co/Trendyol"
    }
  ],
  "glossary": [
    {
      "term": "Bağlam Mühendisliği (Context Engineering)",
      "def": "Modelin çalışma belleğini (sistem talimatı, araçlar, geçmiş, RAG) kıt bir dikkat bütçesi olarak optimize etme disiplini."
    },
    {
      "term": "Harness Mühendisliği (Harness Engineering)",
      "def": "Modelin etrafındaki çalışma çerçevesini (dosya belleği, test betikleri, döngü sınırları, onay kapıları) güvenilir yazılım mühendisliğiyle kurma yaklaşımı (Ajan = Model + Harness)."
    },
    {
      "term": "Bağlam Çürümesi (Context Rot)",
      "def": "Büyük bağlam pencerelerine rağmen girdi uzunluğu arttıkça dikkat dağılması nedeniyle model doğruluğunun erken düşmesi."
    },
    {
      "term": "Ortada Kaybolma (Lost in the Middle)",
      "def": "Kritik bilginin uzun bir bağlamın ortasında yer alması durumunda modelin onu gözden kaçırarak ~20 puan doğruluk kaybetmesi."
    },
    {
      "term": "Doğru İrtifa (Right Altitude)",
      "def": "Sistem promptunu ne aşırı katı if-else kurallarıyla kırılganlaştırmak ne de muğlak genellemelerle belirsiz bırakmak."
    },
    {
      "term": "Kademeli Yükleme (Progressive Disclosure)",
      "def": "Agent Skills (SKILL.md) standardında önce sadece ~100 tokenlık başlık/açıklamayı, tam yönergeyi ise yalnızca görev tetiklendiğinde yükleme tekniği."
    },
    {
      "term": "Tekrarlama (Recitation)",
      "def": "Uzun ajan görevlerinde todo.md dosyasını düzenli güncelleyip ana hedefi bağlamın en sonuna taşıyarak hedef sapmasını önleme."
    },
    {
      "term": "KV-Cache / Prompt Önbellekleme",
      "def": "Tekrarlanan sabit sistem promptu ve araç tanımlarının ara hesaplamalarını önbellekte tutarak API maliyetini %78–90'a kadar düşüren mekanizma."
    },
    {
      "term": "Akıl Yürütme Modeli (Reasoning / Sistem 2)",
      "def": "Yanıt vermeden önce içsel düşünme adımları üreten, karmaşık çok değişkenli kararlarda yüksek doğruluk sağlayan model katmanı."
    },
    {
      "term": "Model Context Protocol (MCP)",
      "def": "Yapay zeka ajanlarının dosya sistemi, veritabanı, API ve dış araçlara standartlaştırılmış biçimde bağlanmasını sağlayan açık protokol."
    },
    {
      "term": "MCP ile Kod Yürütme (Code Execution with MCP)",
      "def": "MCP araçlarını izole kod ortamında (TS/Python) çağırıp ham veriyi yerel olarak filtreleyerek bağlam tüketimini %98,7'ye kadar azaltma deseni."
    },
    {
      "term": "Yapılandırılmış Çıktı (Structured Outputs / Constrained Decoding)",
      "def": "Pydantic/Zod şemasıyla modelin yalnızca geçerli JSON sözdizimi üretmesini zorunlu kılan kod çözme tekniği."
    },
    {
      "term": "Hibrit RAG + Yeniden Sıralama (Reranking)",
      "def": "Anlamsal vektör araması ile anahtar kelime tabanlı BM25 aramasını birleştirip çapraz kodlayıcı (reranker) ile en alakalı parçaları öne çıkarma (%67'ye varan hata azalması)."
    },
    {
      "term": "Kalibre Edilmiş Çekinme (Abstention)",
      "def": "Doğrulanmış kaynak bulunmadığında modelin tahmin yürütüp uydurması yerine açıkça 'bilmiyorum / kaynak yok' yanıtını vermesini zorunlu kılma."
    },
    {
      "term": "Doğrulama Zinciri (Chain-of-Verification — CoVe)",
      "def": "Modelin önce taslak üretip ardından her iddiayı bağımsız doğrulama sorularıyla kaynak metne karşı test etmesi."
    },
    {
      "term": "Açık ve Eksenel Kodlama (Open & Axial Coding)",
      "def": "Gerçek kullanım izlerini alan uzmanıyla Pass/Fail olarak inceleyip (Open) tekrarlayan somut hata kategorilerini sayma (Axial) süreci."
    },
    {
      "term": "Yargıç LLM (LLM-as-a-Judge)",
      "def": "İnsan etiketleriyle TPR/TNR kalibre edilmiş, başka bir modelin çıktısını belirli hata kriterlerine göre otomatik denetleyen değerlendirici model."
    },
    {
      "term": "Ölümcül Üçlü (The Lethal Trifecta)",
      "def": "Hassas veri erişimi + güvenilmeyen dış içerik + dışa iletişim yeteneğinin aynı ajan oturumunda birleşmesiyle oluşan kritik veri sızıntısı riski."
    },
    {
      "term": "Dolaylı Komut Enjeksiyonu (Indirect Prompt Injection)",
      "def": "Saldırganın bir web sayfası, PDF veya e-posta içine gizlediği talimatlarla ajanın davranışını ele geçirmesi."
    },
    {
      "term": "Sıfır Veri Saklama (Zero Data Retention — ZDR)",
      "def": "Kurumsal API çağrılarındaki metin ve verilerin sağlayıcı sunucularında saklanmamasını ve eğitimde kullanılmamasını sağlayan sözleşmeli gizlilik katmanı."
    },
    {
      "term": "Şartname Odaklı Geliştirme (Spec-Driven Development — SDD)",
      "def": "Doğaçlama vibe coding yerine önce sürüm kontrollü şartname ve kapsam dışı maddeler, sonra salt-okunur Plan Modu ve test-önce geliştirme disiplini."
    },
    {
      "term": "12-Factor Agents",
      "def": "Üretimde güvenilir ajanlar için döngü sınırı, bütçe tavanı ve durum kontrolünü çerçevenin gizli döngüsüne değil deterministik koda devreden 12 mühendislik ilkesi."
    },
    {
      "term": "Aralıklı Tekrar (Spaced Repetition — SM-2)",
      "def": "Bilgi kartlarını unutma eğrisine göre zorlandığınızda daha sık, kolay bildiğinizde giderek artan aralıklarla sorarak uzun süreli hafızaya işleyen algoritma."
    },
    {
      "term": "Token Tüketim Hızı Alarmı (Token Velocity Alert)",
      "def": "Sonsuz döngüye giren bir ajanın tek bir öğleden sonra aylık bütçeyi tüketmesini önlemek için saatlik/dakikalık harcama artışını kesen güvenlik mekanizması."
    }
  ]
};
