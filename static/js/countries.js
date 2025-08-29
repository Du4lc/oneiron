// countries.js
// Objeto global con países y regiones
window.countryData = {
  /* ====== UE ====== */
  "Alemania": [
    "Baden-Wurtemberg","Baviera","Berlín","Brandeburgo","Bremen","Hamburgo","Hesse",
    "Mecklemburgo-Pomerania Occidental","Baja Sajonia","Renania del Norte-Westfalia",
    "Renania-Palatinado","Sarre","Sajonia","Sajonia-Anhalt","Schleswig-Holstein","Turingia"
  ],
  "Austria": [
    "Burgenland","Carintia (Kärnten)","Baja Austria","Alta Austria","Salzburgo",
    "Estiria (Steiermark)","Tirol","Vorarlberg","Viena"
  ],
  "Bélgica": [
    "Bruselas-Capital","Amberes","Brabante Flamenco","Flandes Oriental","Flandes Occidental",
    "Limburgo","Brabante Valón","Hainaut","Lieja","Luxemburgo","Namur"
  ],
  "Bulgaria": [
    "Blagoevgrad","Burgas","Dobrich","Gabrovo","Haskovo","Kardzhali","Kyustendil","Lovech",
    "Montana","Pazardzhik","Pernik","Pleven","Plovdiv","Razgrad","Ruse","Shumen","Silistra",
    "Sliven","Smolyan","Sofía (ciudad)","Sofía (provincia)","Stara Zagora","Targovishte",
    "Varna","Veliko Tarnovo","Vidin","Vratsa","Yambol"
  ],
  "Croacia": [
    "Bjelovar-Bilogora","Brod-Posavina","Dubrovnik-Neretva","Istria","Karlovac",
    "Koprivnica-Križevci","Krapina-Zagorje","Lika-Senj","Međimurje","Osijek-Baranja",
    "Požega-Eslavonia","Primorje-Gorski Kotar","Šibenik-Knin","Sisak-Moslavina",
    "Split-Dalmacia","Varaždin","Virovitica-Podravina","Vukovar-Srijem","Zadar",
    "Condado de Zagreb","Ciudad de Zagreb"
  ],
  "Chipre": ["Nicosia","Limasol","Lárnaca","Pafos","Famagusta","Kyrenia"],
  "Chequia": [
    "Praga","Bohemia Central","Bohemia Meridional","Plzeň","Karlovy Vary","Ústí nad Labem",
    "Liberec","Hradec Králové","Pardubice","Vysočina","Moravia Meridional","Olomouc",
    "Zlín","Moravia-Silesia"
  ],
  "Dinamarca": ["Región Capital","Selandia","Dinamarca Meridional","Jutlandia Central","Jutlandia Septentrional"],
  "Estonia": ["Harju","Hiiu","Ida-Viru","Järva","Jõgeva","Lääne","Lääne-Viru","Põlva","Pärnu","Rapla","Saare","Tartu","Valga","Viljandi","Võru"],
  "Finlandia": [
    "Åland","Carelia del Sur","Ostrobotnia del Sur","Savonia del Sur","Kainuu","Kanta-Häme",
    "Ostrobotnia Central","Finlandia Central","Kymenlaakso","Laponia","Pirkanmaa","Carelia del Norte",
    "Ostrobotnia del Norte","Savonia del Norte","Ostrobotnia","Päijät-Häme","Satakunta","Uusimaa",
    "Finlandia Suroccidental"
  ],
  "Francia": [
    "Auvernia-Ródano-Alpes","Borgoña-Franco Condado","Bretaña","Centre-Val de Loire","Córcega",
    "Gran Este","Hauts-de-France","Isla de Francia","Normandía","Nueva Aquitania","Occitania",
    "Países del Loira","Provenza-Alpes-Costa Azul","Guadalupe","Martinica","Guayana Francesa","Reunión","Mayotte"
  ],
  "Grecia": [
    "Ática","Grecia Central","Macedonia Central","Creta","Macedonia Oriental y Tracia",
    "Epiro","Islas Jónicas","Egeo Septentrional","Peloponeso","Egeo Meridional",
    "Tesalia","Grecia Occidental","Macedonia Occidental"
  ],
  "Hungría": [
    "Budapest","Bács-Kiskun","Baranya","Békés","Borsod-Abaúj-Zemplén","Csongrád-Csanád",
    "Fejér","Győr-Moson-Sopron","Hajdú-Bihar","Heves","Jász-Nagykun-Szolnok",
    "Komárom-Esztergom","Nógrád","Pest","Somogy","Szabolcs-Szatmár-Bereg",
    "Tolna","Vas","Veszprém","Zala"
  ],
  "Irlanda": [
    "Carlow","Cavan","Clare","Cork","Donegal","Dublín","Galway","Kerry","Kildare","Kilkenny",
    "Laois","Leitrim","Limerick","Longford","Louth","Mayo","Meath","Monaghan","Offaly","Roscommon",
    "Sligo","Tipperary","Waterford","Westmeath","Wexford","Wicklow"
  ],
  "Italia": [
    "Abruzos","Basilicata","Calabria","Campania","Emilia-Romaña","Friuli-Venecia Julia","Lacio","Liguria","Lombardía",
    "Marcas","Molise","Piamonte","Apulia (Puglia)","Cerdeña","Sicilia","Toscana","Trentino-Alto Adigio","Umbría",
    "Valle de Aosta","Véneto"
  ],
  "Letonia": ["Región de Riga","Vidzeme","Latgale","Kurzeme","Zemgale"],
  "Lituania": ["Alytus","Kaunas","Klaipėda","Marijampolė","Panevėžys","Šiauliai","Tauragė","Telšiai","Utena","Vilna"],
  "Luxemburgo": ["Capellen","Clervaux","Diekirch","Echternach","Esch-sur-Alzette","Grevenmacher","Luxemburgo","Mersch","Redange","Remich","Vianden","Wiltz"],
  "Malta": ["Central","Gozo","Norte","Suroriental","Sur"],
  "Países Bajos": ["Drenthe","Flevolanda","Frisia","Güeldres","Groninga","Holanda Meridional","Holanda Septentrional","Limburgo","Brabante Septentrional","Utrecht","Overijssel","Zelanda"],
  "Polonia": ["Baja Silesia","Cuyavia y Pomerania","Gran Polonia","Pequeña Polonia","Łódź","Lubusz","Lublin","Masovia","Opole","Podlaquia","Pomerania","Silesia","Subcarpacia","Santa Cruz (Świętokrzyskie)","Varmia y Masuria","Pomerania Occidental"],
  "Portugal": ["Aveiro","Beja","Braga","Braganza","Castelo Branco","Coímbra","Évora","Faro","Guarda","Leiría","Lisboa","Portalegre","Oporto","Santarém","Setúbal","Viana do Castelo","Vila Real","Viseu","Azores","Madeira"],
  "Rumanía": ["Alba","Arad","Argeș","Bacău","Bihor","Bistrița-Năsăud","Botoșani","Brașov","Brăila","Bucarest","Buzău","Călărași","Caraș-Severin","Cluj","Constanța","Covasna","Dâmbovița","Dolj","Galați","Giurgiu","Gorj","Harghita","Hunedoara","Ialomița","Iași","Ilfov","Maramureș","Mehedinți","Mureș","Neamț","Olt","Prahova","Sălaj","Satu Mare","Sibiu","Suceava","Teleorman","Timiș","Tulcea","Vâlcea","Vaslui","Vrancea"],
  "Eslovaquia": ["Bratislava","Trnava","Trenčín","Nitra","Žilina","Banská Bystrica","Prešov","Košice"],
  "Eslovenia": ["Eslovenia Central","Alta Carniola","Savinja","Drava","Carintia","Litoral-Interior","Goriška","Litoral-Karst","Eslovenia Sudoriental","Baja Savinja","Cuenca Central","Mura"],
  "España": [
    "A Coruña","Álava","Albacete","Alicante","Almería","Asturias","Ávila","Badajoz","Illes Balears",
    "Barcelona","Burgos","Cáceres","Cádiz","Cantabria","Castellón","Ciudad Real","Córdoba","Cuenca","Girona",
    "Granada","Guadalajara","Gipuzkoa","Huelva","Huesca","Jaén","La Rioja","Las Palmas","León","Lleida","Lugo",
    "Madrid","Málaga","Murcia","Navarra","Ourense","Palencia","Pontevedra","Salamanca","Santa Cruz de Tenerife",
    "Segovia","Sevilla","Soria","Tarragona","Teruel","Toledo","Valencia","Valladolid","Bizkaia","Zamora","Zaragoza",
    "Ceuta","Melilla"
  ],
  "Suecia": ["Blekinge","Dalarna","Gävleborg","Gotland","Halland","Jämtland","Jönköping","Kalmar","Kronoberg","Norrbotten","Örebro","Östergötland","Skåne","Södermanland","Estocolmo","Uppsala","Värmland","Västerbotten","Västernorrland","Västmanland","Västra Götaland"],

  /* ====== Reino Unido ====== */
  "Reino Unido": [
    "Bedfordshire","Berkshire","Bristol","Buckinghamshire","Cambridgeshire","Cheshire","City of London","Cornualles (Cornwall)","Condado de Durham","Cumbria","Derbyshire","Devon","Dorset","East Riding of Yorkshire","East Sussex","Essex","Gloucestershire","Gran Londres (Greater London)","Gran Mánchester (Greater Manchester)","Hampshire","Herefordshire","Hertfordshire","Isla de Wight","Kent","Lancashire","Leicestershire","Lincolnshire","Merseyside","Norfolk","North Yorkshire","Northamptonshire","Northumberland","Nottinghamshire","Oxfordshire","Rutland","Shropshire","Somerset","South Yorkshire","Staffordshire","Suffolk","Surrey","Tyne and Wear","Warwickshire","West Midlands","West Sussex","West Yorkshire","Wiltshire","Worcestershire",
    "Aberdeen City","Aberdeenshire","Angus","Argyll and Bute","City of Edinburgh","Clackmannanshire","Dumfries y Galloway","Dundee City","East Ayrshire","East Dunbartonshire","East Lothian","East Renfrewshire","Falkirk","Fife","Glasgow City","Highland","Inverclyde","Midlothian","Moray","Na h-Eileanan Siar (Western Isles)","North Ayrshire","North Lanarkshire","Islas Orcadas (Orkney Islands)","Perth and Kinross","Renfrewshire","Scottish Borders","Islas Shetland (Shetland Islands)","South Ayrshire","South Lanarkshire","Stirling","West Dunbartonshire","West Lothian",
    "Blaenau Gwent","Bridgend","Caerphilly","Cardiff","Carmarthenshire","Ceredigion","Conwy","Denbighshire","Flintshire","Gwynedd","Isla de Anglesey","Merthyr Tydfil","Monmouthshire","Neath Port Talbot","Newport","Pembrokeshire","Powys","Rhondda Cynon Taf","Swansea","Torfaen","Vale of Glamorgan","Wrexham",
    "Antrim and Newtownabbey","Ards and North Down","Armagh City, Banbridge and Craigavon","Belfast","Causeway Coast and Glens","Derry City and Strabane","Fermanagh and Omagh","Lisburn and Castlereagh","Mid and East Antrim","Mid Ulster","Newry, Mourne and Down"
  ],

  /* ====== Otros mercados ====== */
  "Estados Unidos": ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawái","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Luisiana","Maine","Maryland","Massachusetts","Míchigan","Minnesota","Misisipi","Misuri","Montana","Nebraska","Nevada","Nuevo Hampshire","Nueva Jersey","Nuevo México","Nueva York","Carolina del Norte","Dakota del Norte","Ohio","Oklahoma","Oregón","Pensilvania","Rhode Island","Carolina del Sur","Dakota del Sur","Tennessee","Texas","Utah","Vermont","Virginia","Washington","Virginia Occidental","Wisconsin","Wyoming","Distrito de Columbia"],
  "Canadá": ["Alberta","Columbia Británica","Manitoba","Nuevo Brunswick","Terranova y Labrador","Nueva Escocia","Ontario","Isla del Príncipe Eduardo","Quebec","Saskatchewan","Yukón","Territorios del Noroeste","Nunavut"],
  "México": ["Aguascalientes","Baja California","Baja California Sur","Campeche","Coahuila de Zaragoza","Colima","Chiapas","Chihuahua","Ciudad de México","Durango","Guanajuato","Guerrero","Hidalgo","Jalisco","México","Michoacán de Ocampo","Morelos","Nayarit","Nuevo León","Oaxaca","Puebla","Querétaro","Quintana Roo","San Luis Potosí","Sinaloa","Sonora","Tabasco","Tamaulipas","Tlaxcala","Veracruz de Ignacio de la Llave","Yucatán","Zacatecas"],
  "Brasil": ["Acre","Alagoas","Amapá","Amazonas","Bahía","Ceará","Distrito Federal","Espírito Santo","Goiás","Maranhão","Mato Grosso","Mato Grosso del Sur","Minas Gerais","Pará","Paraíba","Paraná","Pernambuco","Piauí","Río de Janeiro","Río Grande del Norte","Río Grande del Sur","Rondônia","Roraima","Santa Catarina","São Paulo","Sergipe","Tocantins"],
  "Japón": ["Hokkaidō","Aomori","Iwate","Miyagi","Akita","Yamagata","Fukushima","Ibaraki","Tochigi","Gunma","Saitama","Chiba","Tokio","Kanagawa","Niigata","Toyama","Ishikawa","Fukui","Yamanashi","Nagano","Gifu","Shizuoka","Aichi","Mie","Shiga","Kioto","Osaka","Hyōgo","Nara","Wakayama","Tottori","Shimane","Okayama","Hiroshima","Yamaguchi","Tokushima","Kagawa","Ehime","Kōchi","Fukuoka","Saga","Nagasaki","Kumamoto","Ōita","Miyazaki","Kagoshima","Okinawa"],
  "China": ["Anhui","Fujian","Gansu","Guangdong","Guizhou","Hainan","Hebei","Heilongjiang","Henan","Hubei","Hunan","Jiangsu","Jiangxi","Jilin","Liaoning","Qinghai","Shaanxi","Shandong","Shanxi","Sichuan","Yunnan","Zhejiang","Guangxi (Región autónoma)","Mongolia Interior (Región autónoma)","Ningxia (Región autónoma)","Tíbet (Región autónoma)","Xinjiang (Región autónoma)","Pekín (Municipio)","Chongqing (Municipio)","Shanghái (Municipio)","Tianjin (Municipio)","Hong Kong (RAE)","Macao (RAE)"],
  "India": ["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Guyarat (Gujarat)","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punyab (Punjab)","Rajastán","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","Bengala Occidental","Andamán y Nicobar (UT)","Chandigarh (UT)","Dadra y Nagar Haveli y Damán y Diu (UT)","Delhi (UT)","Jammu y Cachemira (UT)","Ladakh (UT)","Lakshadweep (UT)","Puducherry (UT)"],
  "Corea del Sur": ["Seúl (Ciudad Especial)","Busan","Daegu","Incheon","Gwangju","Daejeon","Ulsan","Sejong (Ciudad)","Gyeonggi","Gangwon","Chungcheong del Norte","Chungcheong del Sur","Jeolla del Norte","Jeolla del Sur","Gyeongsang del Norte","Gyeongsang del Sur","Jeju"],
  "Suiza": ["Zúrich","Berna","Lucerna","Uri","Schwyz","Obwalden","Nidwalden","Glaris","Zug","Friburgo","Soleura","Basilea-Ciudad","Basilea-Campiña","Schaffhausen","Appenzell Rodas Exteriores","Appenzell Rodas Interiores","San Galo","Graubünden","Argovia","Turgovia","Tesino","Vaud","Valais","Neuchâtel","Ginebra","Jura"],
  "Emiratos Árabes Unidos": ["Abu Dabi","Dubái","Sharjah","Ajmán","Umm al-Qaywayn","Ras al-Jaima","Fujairah"],
  "Arabia Saudí": ["Riad","La Meca","Medina","Qasim","Provincia Oriental","Asir","Tabuk","Hail","Frontera Norte","Jazan","Najrán","Al Bahah","Al Jawf"],
  "Singapur": ["Singapur"],
  "Sudáfrica": ["Cabo Occidental","Cabo Oriental","Cabo del Norte","Estado Libre","Gauteng","KwaZulu-Natal","Limpopo","Mpumalanga","Noroeste"]
};
