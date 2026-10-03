import { en } from './en';
import type { Dictionary } from './types';

export const pl: Dictionary = {
  meta: {
    title: 'Petro Hordiienko · Inżynier oprogramowania i fractional CTO',
    description:
      'Niezależny inżynier oprogramowania i fractional CTO z Poznania. Aplikacje web i mobile, backend, chmura, AI i blockchain, realizowane osobiście.',
    keywords: [
      'programista Poznań',
      'fractional CTO',
      'freelancer programista',
      'tworzenie aplikacji webowych',
      'tworzenie aplikacji mobilnych',
      'backend i API',
      'chmura i DevOps',
      'integracja AI',
      'blockchain',
      'fintech',
    ],
  },
  nav: {
    services: 'Usługi',
    work: 'Portfolio',
    process: 'Proces',
    contact: 'Kontakt',
    language: 'Język',
    menu: 'Menu',
    close: 'Zamknij menu',
  },
  theme: { label: 'Motyw', light: 'Jasny', dark: 'Ciemny' },
  hero: {
    notes: ['Niezależny inżynier oprogramowania', 'Od 2016', '52.41° N · 16.93° E — Poznań'],
    titleTop: 'Pomysły,',
    titleBottom: 'w produkcji.',
    lede: 'Oprogramowanie, systemy i AI dla zespołów, które działają szybko. Doświadczenie seniora, osobiście i bez narzutu agencji.',
    ctaBook: 'Rozpocznij projekt',
    ctaServices: 'Co buduję',
    canvasLabel: 'Animowane tło z gradientem',
    fieldLabel: 'Interaktywne pole przepływu',
    fieldHint: 'Porusz kursorem, by zakrzywić przepływ · kliknij, by wysłać falę',
    stackLabel: 'Technologie',
    stack: en.hero.stack,
  },
  manifesto: {
    label: 'O mnie',
    text: 'Zamieniam pomysły w niezawodne produkty skupione na użytkowniku, dla startupów i rosnących zespołów.',
    textMuted:
      'Łączę technologię ze strategią biznesową, by każde rozwiązanie działało technicznie i dawało mierzalną wartość.',
    pillars: [
      {
        title: 'Inżynieria nastawiona na wyniki',
        body: 'Lata projektowania, budowania i dostarczania rozwiązań w różnych branżach, prowadzenia zespołów interdyscyplinarnych i zamieniania złożonych wyzwań technicznych w realny efekt.',
      },
      {
        title: 'Startupy, od pomysłu do produktu',
        body: 'Pomagam startupom odnieść sukces, zamieniając pomysły w niezawodne produkty skupione na użytkowniku, z każdą decyzją powiązaną z wartością biznesową.',
      },
      {
        title: 'Krypto spotyka fiat',
        body: 'Działam na styku zdecentralizowanych i tradycyjnych finansów, łącząc systemy kryptowalutowe i fiat, by zmieniać sposób, w jaki ludzie doświadczają pieniądza.',
      },
      {
        title: 'AI, które działa już dziś',
        body: 'Wąska AI już dziś ulepsza istniejące rozwiązania i optymalizuje procesy. Wdrażam ją w produktach teraz i projektuję je z myślą o jeszcze zdolniejszych systemach.',
      },
    ],
    facts: [
      { k: 'Tworzę od', v: '2016' },
      { k: 'Były CTO', v: 'Giełda kryptowalut' },
      { k: 'Principal engineer', v: 'Platforma danych AI' },
      { k: 'Praca', v: 'Zdalnie · CET' },
    ],
  },
  services: {
    label: 'Usługi',
    title: 'Kompleksowe',
    titleMuted: 'usługi IT',
    sub: 'Od pierwszego prototypu po systemy obsługujące prawdziwe pieniądze i prawdziwy ruch.',
    outcomeLabel: 'Efekt',
    pointsLabel: 'Co dostajesz',
    stackLabel: 'Technologie',
    relatedLabel: 'Powiązane realizacje',
    detailsLabel: 'Zobacz szczegóły',
    closeLabel: 'Zamknij',
    items: [
      {
        title: 'Aplikacje webowe',
        body: 'Produkty SaaS, panele i platformy: szybkie, dostępne i gotowe na rozwój.',
        points: [
          'Produkty SaaS, narzędzia administracyjne i portale klientów',
          'React i Next.js z renderowaniem po stronie serwera i wysoką wydajnością',
          'Typowane biblioteki komponentów i systemy projektowe',
          'Funkcje czasu rzeczywistego przez WebSocket',
        ],
        tech: en.services.items[0].tech,
        related: en.services.items[0].related,
        outcome: 'Szybki produkt, który zespół może dalej rozwijać.',
      },
      {
        title: 'Aplikacje mobilne',
        body: 'Wieloplatformowe aplikacje na iOS i Androida, dzielące kod z produktem webowym.',
        points: [
          'iOS i Android z jednej bazy kodu',
          'Moduły natywne w Swift lub Kotlin, gdy wymaga tego platforma',
          'Powiadomienia push, logowanie OAuth i praca offline',
          'Wspólna logika i API z produktem webowym',
        ],
        tech: en.services.items[1].tech,
        related: en.services.items[1].related,
        outcome: 'Jeden zespół publikujący w obu sklepach z aplikacjami.',
      },
      {
        title: 'Backend i API',
        body: 'Usługi, integracje, VoIP i systemy czasu rzeczywistego projektowane z myślą o obciążeniu i zmianach.',
        points: [
          'API REST, GraphQL i gRPC',
          'Mikroserwisy i architektura zdarzeniowa',
          'Audio i wideo w czasie rzeczywistym: WebRTC, VoIP i SIP',
          'Projektowane na duże obciążenie i wysoką dostępność',
        ],
        tech: en.services.items[2].tech,
        related: en.services.items[2].related,
        outcome: 'Usługi, które pozostają szybkie i stabilne wraz ze wzrostem ruchu.',
      },
      {
        title: 'Chmura i DevOps',
        body: 'Infrastruktura jako kod, CI/CD, monitoring i wysoka dostępność w dowolnej chmurze.',
        points: [
          'Infrastruktura jako kod z Terraform',
          'Kubernetes, GitOps i potoki CI/CD',
          'Obserwowalność z Prometheus, Grafana, ELK i Jaeger',
          'Chmura lub bare metal: AWS, GCP i Azure',
        ],
        tech: en.services.items[3].tech,
        related: en.services.items[3].related,
        outcome: 'Powtarzalne wydania i środowisko, któremu można zaufać.',
      },
      {
        title: 'Integracja AI',
        body: 'Funkcje LLM, agenci i RAG, które rozwiązują mierzalny problem w Twoim produkcie.',
        points: [
          'Funkcje LLM i modularna orkiestracja agentów',
          'RAG i inżynieria promptów z ewaluacją',
          'Integracje z Model Context Protocol',
          'Procesy z człowiekiem w pętli tam, gdzie liczy się dokładność',
        ],
        tech: en.services.items[4].tech,
        related: en.services.items[4].related,
        outcome: 'AI, które usprawnia prawdziwy proces, a nie demo.',
      },
      {
        title: 'Blockchain i fintech',
        body: 'Giełdy, silniki handlowe, portfele i przepływy płatności z wbudowanym bezpieczeństwem.',
        points: [
          'Architektura giełd i silników handlowych',
          'Portfele i przepływy płatności w kryptowalutach i fiat',
          'Smart kontrakty i integracje z EVM',
          'Bezpieczeństwo i zgodność uwzględnione od pierwszego dnia',
        ],
        tech: en.services.items[5].tech,
        related: en.services.items[5].related,
        outcome: 'Systemy finansowe, które są bezpieczne i nie przestają działać.',
      },
      {
        title: 'Inżynieria danych',
        body: 'Potoki, jakość danych i fundamenty analityczne, którym można zaufać przy decyzjach.',
        points: [
          'Potoki ETL i profilowanie zbiorów danych',
          'Ocena jakości danych i wykrywanie anomalii',
          'Fundamenty analityki i raportowania',
          'Skalowalne platformy wielu przestrzeni roboczych',
        ],
        tech: en.services.items[6].tech,
        related: en.services.items[6].related,
        outcome: 'Dane, na których zespół może polegać przy decyzjach.',
      },
      {
        title: 'Doradztwo i audyty',
        body: 'Przeglądy architektury, audyty kodu i dostawców, techniczne due diligence.',
        points: [
          'Przeglądy architektury i techniczne due diligence',
          'Audyty kodu, bezpieczeństwa i dostawców',
          'Roadmapa, rekrutacja i rozmowy z inwestorami jako fractional CTO',
          'Plany skalowania dla rosnących zespołów',
        ],
        tech: en.services.items[7].tech,
        related: en.services.items[7].related,
        outcome: 'Jasne decyzje i plan, który można wdrożyć.',
      },
    ],
    cto: {
      strong: 'Fractional CTO.',
      body: ' Przywództwo techniczne kilka dni w miesiącu: roadmapa, rekrutacja, architektura i rozmowy z inwestorami.',
      cta: 'Porozmawiajmy o projekcie',
    },
  },
  work: {
    label: 'Realizacje',
    title: 'Wybrane',
    titleMuted: 'portfolio',
    sub: 'Produkty z obszaru web, mobile i backendu wraz z przepływami, które za nimi stoją. Otwórz dowolny projekt, aby przejść przez jego ekrany.',
    filterLabel: 'Filtruj',
    dialog: {
      close: 'Zamknij',
      workflow: 'Przepływ',
      prev: 'Poprzedni krok',
      next: 'Następny krok',
      open: 'Zobacz przepływ',
    },
    filters: {
      all: 'Wszystko',
      web: 'Web',
      mobile: 'Mobile',
      backend: 'Backend',
      ai: 'AI',
      fintech: 'Fintech',
      realtime: 'Czas rzeczywisty',
      webgl: 'WebGL',
      wasm: 'WebAssembly',
    },
    items: [
      {
        ...en.work.items[0],
        workflow: [
          {
            title: 'Handel',
            caption: 'Wykres na żywo, arkusz zleceń i składanie zleceń jednym kliknięciem.',
          },
          { title: 'Środki', caption: 'Salda i portfele w kryptowalutach i fiat.' },
          {
            title: 'Potwierdzenie',
            caption: 'Przegląd zlecenia, kontrola ryzyka i natychmiastowe potwierdzenie.',
          },
        ],
        title: 'Platforma giełdy kryptowalut',
        summary:
          'Silnik handlowy, portfele i webowy terminal handlowy dla giełdy z Dubaju, prowadzone od architektury po produkcję.',
        highlights: [
          'Mikroserwisy na Kubernetes z wysoką dostępnością',
          'Portfele HD i integracje z blockchainami EVM',
          'Bezpieczeństwo i zgodność wbudowane w rdzeń',
        ],
        role: 'CTO',
      },
      {
        ...en.work.items[1],
        workflow: [
          { title: 'Profil', caption: 'Wgraj zbiór danych i zobacz jego strukturę oraz braki.' },
          {
            title: 'Ocena',
            caption: 'Jakość oceniona pod kątem kompletności, dokładności i spójności.',
          },
          { title: 'Przegląd', caption: 'Agent proponuje poprawki, człowiek je zatwierdza.' },
        ],
        title: 'Platforma jakości danych z AI',
        summary:
          'Platforma, która zamienia surowe, nieustrukturyzowane dane w wiarygodne informacje dzięki profilowaniu, wykrywaniu anomalii i uzupełnianiu braków.',
        highlights: [
          'Profilowanie zbiorów danych z oceną jakości',
          'Agenci LLM z decyzjami człowieka w pętli',
          'Skalowalna architektura wielu przestrzeni roboczych',
        ],
        role: 'Principal Engineer',
      },
      {
        ...en.work.items[2],
        workflow: [
          {
            title: 'Odtwarzanie',
            caption: 'Dźwięk z wielu źródeł zmiksowany w jeden strumień na żywo.',
          },
          { title: 'Miks', caption: 'Poziomy kanałów regulowane w czasie rzeczywistym.' },
          { title: 'Monitoring', caption: 'Opóźnienia i metryki słuchaczy w skrócie.' },
        ],
        title: 'Strumieniowanie audio na żywo',
        summary:
          'Serwis strumieniowania audiobooków, który miksuje kilka źródeł w jedno wyjście na żywo z niskim opóźnieniem.',
        highlights: [
          'Transport WebRTC i gRPC',
          'Orkiestracja kontenerów na DigitalOcean',
          'Infrastruktura jako kod z Terraform',
        ],
        role: 'Senior Engineer',
      },
      {
        ...en.work.items[3],
        workflow: [
          { title: 'Czat', caption: 'Kanały, wątki i bogate wiadomości.' },
          { title: 'Połączenie', caption: 'Konferencje wewnątrz rozmowy.' },
          {
            title: 'Automatyzacja',
            caption: 'Przepływy uruchamiane wiadomościami i integracjami.',
          },
        ],
        title: 'Komunikator zespołowy z połączeniami',
        summary:
          'Komunikator zespołowy z AI, z konferencjami przez PBX, powiadomieniami push i automatyzacją przepływów pracy.',
        highlights: [
          'Konferencje z SIP i Freeswitch',
          'OAuth 2.0 i integracje zewnętrzne',
          'Automatyzacje w Zapier i IFTTT',
        ],
        role: 'Software Engineer',
      },
      {
        ...en.work.items[4],
        workflow: [
          { title: 'Szukaj', caption: 'Wyszukuj podróże i porównuj oferty po drodze.' },
          { title: 'Śledź', caption: 'Obserwuj paczkę na żywo na mapie.' },
          { title: 'Przekaż', caption: 'Potwierdź dostawę bezpiecznym kodem.' },
        ],
        title: 'Marketplace dostaw P2P',
        summary:
          'Aplikacje webowe i natywne mobilne łączące nadawców z podróżnymi, zbudowane pod szybkie iteracje przy budżecie startupu.',
        highlights: [
          'React Native i natywne moduły Kotlin oraz Swift',
          'Usługi GraphQL, gRPC i RabbitMQ',
          'Kubernetes i pełny zautomatyzowany zestaw testów',
        ],
        role: 'Full Stack Engineer',
      },
      {
        ...en.work.items[5],
        workflow: [
          { title: 'Przegląd', caption: 'Przychody, lejek i aktywność w jednym panelu.' },
          { title: 'Lejek', caption: 'Transakcje przenoszone między etapami przeciąganiem.' },
          { title: 'Klient', caption: 'Pełna historia i kolejne kroki dla każdego kontaktu.' },
        ],
        title: 'System CRM i ERP',
        summary:
          'Systemy zarządzania firmą i hybrydowe aplikacje mobilne dla średnich firm, dostarczane jako skalowalny SaaS.',
        highlights: [
          'Modułowe panele, role i raporty',
          'Hybrydowe aplikacje mobilne',
          'Wdrożenia i utrzymanie na AWS i Google Cloud',
        ],
        role: 'Full Stack Engineer',
      },
      {
        ...en.work.items[6],
        workflow: [
          { title: 'Onboarding', caption: 'Przyjazny pierwszy ekran w aplikacji mobilnej.' },
          { title: 'Premiera', caption: 'Strona, która szybko tłumaczy wartość.' },
          { title: 'Obsługa', caption: 'Panel administracyjny dla pierwszych klientów.' },
        ],
        title: 'Tworzenie MVP dla startupów',
        summary:
          'Kompletne MVP dla międzynarodowych klientów, od badania rynku i projektu produktu po premierę.',
        highlights: [
          'Web, iOS i Android w jednym zespole',
          'Zwinna realizacja z wyraźnymi kamieniami milowymi',
          'Przekazanie z dokumentacją i CI/CD',
        ],
        role: 'CTO i współzałożyciel',
      },
      {
        ...en.work.items[7],
        workflow: [
          { title: 'Obserwuj', caption: 'Metryki i alerty dla każdej usługi.' },
          { title: 'Dostarczaj', caption: 'Potok GitOps od commita po produkcję.' },
          { title: 'Skaluj', caption: 'Pody i węzły planowane automatycznie.' },
        ],
        title: 'Infrastruktura cloud-native',
        summary:
          'Produkcyjne platformy Kubernetes z dostarczaniem przez GitOps, obserwowalnością i wysoką dostępnością w chmurze lub na bare metal.',
        highlights: [
          'Potoki Terraform i ArgoCD',
          'Obserwowalność z Prometheus, Grafana, ELK i Jaeger',
          'Niezawodność krytyczna dla systemów handlowych',
        ],
        role: 'CTO i inżynier',
        company: 'Różni klienci',
      },
      {
        ...en.work.items[8],
        workflow: [
          {
            title: 'Konfiguruj',
            caption: 'Scena 3D w czasie rzeczywistym dostosowywana kontrolkami.',
          },
          { title: 'Eksploruj', caption: 'Duże zbiory danych jako interaktywna chmura punktów.' },
          { title: 'Inspekcja', caption: 'Graf sceny i narzędzia do dopracowania szczegółów.' },
        ],
        title: 'Interaktywne doświadczenia 3D w przeglądarce',
        summary:
          'Konfiguratory produktów, wizualizacje danych i immersyjne strony w WebGL, działające płynnie na każdym urządzeniu.',
        highlights: [
          'Własne shadery i systemy cząsteczek na GPU',
          'Interaktywne konfiguratory produktów 3D',
          'Dopracowane pod 60 klatek na sekundę na mobile i desktopie',
        ],
        role: 'Creative Engineer',
        company: 'Wybrane projekty',
      },
      {
        ...en.work.items[9],
        workflow: [
          {
            title: 'Przetwarzaj',
            caption: 'Ciężkie filtry obrazu działające z prędkością zbliżoną do natywnej.',
          },
          { title: 'Benchmark', caption: 'To samo zadanie w JavaScript i WebAssembly.' },
          { title: 'Montaż', caption: 'Edycja osi czasu i eksport w całości w przeglądarce.' },
        ],
        title: 'Przetwarzanie w przeglądarce z WebAssembly',
        summary:
          'Wymagające obliczeniowo przetwarzanie obrazu, mediów i danych skompilowane do WebAssembly, działające prywatnie w przeglądarce z prędkością zbliżoną do natywnej.',
        highlights: [
          'Rust i C++ skompilowane do WebAssembly',
          'Wielowątkowe workery i pamięć współdzielona',
          'Pliki nigdy nie opuszczają urządzenia użytkownika',
        ],
        role: 'Software Engineer',
        company: 'Wybrane projekty',
      },
    ],
  },
  process: {
    label: 'Proces',
    title: 'Jasne kroki,',
    titleMuted: 'działające oprogramowanie co tydzień',
    steps: [
      {
        title: 'Rozmowa wstępna',
        body: '30 minut o celu, użytkownikach i ograniczeniach. Bez przygotowania.',
        time: '30 MIN',
      },
      {
        title: 'Zakres i wycena',
        body: 'Krótki plan na piśmie: architektura, kamienie milowe, ryzyka i widełki kosztów.',
        time: '2–3 DNI',
      },
      {
        title: 'Budowa etapami',
        body: 'Cotygodniowe demo na środowisku testowym. Postęp, który można kliknąć, a nie raporty.',
        time: 'DEMO CO TYDZIEŃ',
      },
      {
        title: 'Start i przekazanie',
        body: 'Wdrożenie produkcyjne, dokumentacja i wsparcie albo przekazanie projektu Twojemu zespołowi.',
        time: '1 TYDZIEŃ',
      },
    ],
    modelLabel: 'Współpraca',
    models: [
      {
        title: 'MVP o stałym zakresie',
        body: 'Uzgodniony zakres i cena pierwszej wersji.',
      },
      {
        title: 'Miesięczny kontrakt B2B',
        body: 'Stały rozwój, faktura co miesiąc.',
      },
      {
        title: 'Dni doradcze',
        body: 'Czas fractional CTO, audyty i przeglądy.',
      },
    ],
  },
  contact: {
    label: 'Kontakt',
    title: 'Masz pomysł? Zbudujmy go.',
    sub: 'Napisz, nad czym pracujesz i w czym potrzebujesz pomocy.',
    copy: 'Kopiuj',
    copied: 'Skopiowano',
    note: 'Każde zapytanie czyta osobiście Petro.',
  },
  footer: {
    ceidg: 'Wpis do CEIDG',
  },
};
