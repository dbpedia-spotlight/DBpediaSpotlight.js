//TODO: write some test cases

var tape = require('tape');
var mlspotlight = require('../index');
var annotate = mlspotlight.annotate;

var languages = ["english", "german", "dutch", "hungarian", "french", "portuguese", "italian", "rusian", "turkish", "spanish"];
var texts = {
    english: "First documented in the 13th century, Berlin was the capital of the Kingdom of Prussia (1701–1918), the German Empire (1871–1918), the Weimar Republic (1919–33) and the Third Reich (1933–45). Berlin in the 1920s was the third largest municipality in the world. After World War II, the city became divided into East Berlin -- the capital of East Germany -- and West Berlin, a West German exclave surrounded by the Berlin Wall from 1961–89. Following German reunification in 1990, the city regained its status as the capital of Germany, hosting 147 foreign embassies.",
    german: "Erstmals 1237 urkundlich erwähnt, war Berlin im Verlauf der Geschichte und in verschiedenen Staatsformen Hauptstadt Brandenburgs, Preußens und des Deutschen Reichs. Faktisch war der Ostteil der Stadt Hauptstadt der Deutschen Demokratischen Republik. Seit der Wiedervereinigung im Jahr 1990 ist Berlin gesamtdeutsche Hauptstadt mit Sitz des Bundespräsidenten seit 1994, des Deutschen Bundestags seit 1999 sowie des Bundesrats seit 2000.",
    dutch: "In zijn geschiedenis, die teruggaat tot de dertiende eeuw, was Berlijn de hoofdstad van Pruisen (1701–1918), het Duitse Keizerrijk (1871–1918), de Weimarrepubliek (1919–1933) en nazi-Duitsland (1933–1945). Na de Tweede Wereldoorlog was Berlijn gedurende meer dan veertig jaar een verdeelde stad, waarbij het oostelijke deel als hoofdstad fungeerde van de Duitse Democratische Republiek en West-Berlijn een de facto exclave van West-Duitsland was. Na de Duitse hereniging in 1990 werd Berlijn de hoofdstad van de Bondsrepubliek Duitsland en de zetel van het parlement, de deelstaatvertegenwoordiging en het staatshoofd.",
    hungarian: "A város központja a Spree folyó partján fekszik, az ún. Varsó-Berlin-ősfolyamvölgyben. A folyó kelet-nyugati irányban folyik át a városon, a belvárosban két ágra oszlik és szigetet képez (Múzeum-sziget). Ezenkívül átszeli a várost a Landwehr-, a Lujza- és a berlin-spandaui hajózási csatorna, amelyeken 50-nél több híd ível át. E hidak közül a legszebb a Schlossbrücke (48 m hosszú), amelyet 1822–1824 között Schinkel tervei szerint építettek; széleit négy-négy, a katonai életet ábrázoló márvány szoborcsoport ékesíti. Jelentősebb hidak még: a Kurfürst híd, a nagy választófejedelem ércből öntött lovasszobrával; a Vilmos császár hídja, a 4 márvány szoborcsoporttal ékesített Belle-Alliance híd és a Herkules híd.",
    french: "La ville de Berlin se situe dans le nord-est de l'Allemagne, dans la plaine germano-polonaise, à 33 m d'altitude, au confluent de la Spree et de la Havel. Une particularité de la ville est la présence de nombreux lacs et rivières, le long des cours d'eau. On en trouve plusieurs à l'ouest, mais aussi à l'est avec le Müggelsee. Berlin est égayée par plusieurs rivières, canaux, parcs et lacs (Havel, Wannsee, Müggelsee, Spree, Dahme, Landwehrkanal). Elle possède en outre une architecture ancienne et classique très riche.",
    portuguese: "Pela primeira vez documentada no século XIII, Berlim foi sucessivamente a capital do Reino da Prússia (1701), do Império Alemão (1871-1918), da República de Weimar (1919-1932) e do Terceiro Reich (1933-1945). Depois da Segunda Guerra Mundial, a cidade foi dividida. Berlim Oriental se tornou a capital da República Democrática Alemã (RDA), enquanto Berlim Ocidental continuou sendo parte da República Federal da Alemanha (RFA).18 Com a reunificação alemã em 1990, a cidade passou a ser capital de toda a Alemanha.",
    italian: "Berlino è situata nella parte orientale della Germania, a 70 km dal confine polacco. È situata nella regione geografica del Brandeburgo, ma non fa parte dell'omonimo Land, da cui è peraltro interamente circondata. La città ha una superficie molto vasta, di 892 km². L'estensione in senso nord-sud è di 38 km, in senso est-ovest di 45 km. Il centro di Berlino sorge sulle rive della Sprea (Spree in tedesco), in un'ampia valle di origine glaciale (Berliner Urstromtal) fra gli altipiani di Barnim e Teltow, orientata in senso est-ovest.",
    rusian: "Берлин расположен на востоке Германии, в 70 километрах от границы с Польшей. Берлин обладает правами федеральной земли и целиком располагается внутри федеральной земли Бранденбург. Исторический центр Берлина находится в низине, в пойме реки Шпрее, между двумя моренными возвышенностями (холмами), называемыми Барним и Тельтов. Значительная часть современного города расположена также на этих холмах: часть территории в административных округах Райниккендорф, Панков, Лихтенберг, Марцан-Хеллерсдорф расположена на Барниме, а в округах Шарлоттенбург-Вильмерсдорф, Штеглиц-Целендорф, Темпельхоф-Шёнеберг и Нойкёльн — на возвышенности Тельтов.", // 'rusian' instead of 'russian' seems to be an error in the API itself
    turkish: "Kentin ortasından akan Spree nehrinin, iki kıyısında, Cölln ve Berlin adlı iki balıkçı köyü iken ilk kez 1307 yılında birleşti. Brandenburg'un (daha sonra ise Prusya'nın) başkentliğini yapan Berlin, 18. yüzyıla kadar önemli arz eden bir şehir değildi. Ancak Prusya'nın güçlenmesi sürecinde öncelikle Kuzey Almanya'nın ve sonrasında da Avrupa'nın siyasi, ekonomik ve kültürel anlamda önemli merkezlerinden biri haline geldi. 1871 yılında kurulan Alman İmparatorluğu'na da başkentlik yapan Berlin, 1933 yılından itibaren Nazi Almanyası'nın da başkentiydi. II. Dünya Savaşı'nda harabeye döndü, müttefik devletler tarafından işgal edildi.",
    spanish: "Fundada en 1237 como Cölln, Berlín fue sucesivamente capital del Reino de Prusia (1701-1918), del Imperio Alemán (1871–1918), de la República de Weimar (1919–1933) y del Tercer Reich (1933–1945). Después de la Segunda Guerra Mundial, la ciudad fue dividida; la parte este de la ciudad se convirtió en la capital de la República Democrática Alemana, mientras que la región oeste de la ciudad se convirtió en un enclave de la República Federal de Alemania en el interior de la Alemania Oriental."
};

var testLanguage = function(language){
    tape(`dbpedia-spotlight ${language}`, function(test){
        mlspotlight.fixToEndpoint(language);
        mlspotlight.annotate(texts[language], function(output){
            test.plan(4);
            test.ok(output.language === language, 'language');
            test.ok(output.error === null, 'error');
            test.ok(output.response['@text'] === texts[language], 'response @text');
            test.ok(output.response.Resources.length >= 5, 'response Resources');
        })
    })
}

for(var language of languages){
    testLanguage(language);
}
