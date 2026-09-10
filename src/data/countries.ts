import { CountryItem } from '../types';
import { COUNTRY_CONTINENTS } from './wheelData';

export const COUNTRIES_DATABASE: CountryItem[] = [
  // ================= FACILE =================
  {
    id: 'FR',
    country: 'France',
    capital: 'Paris',
    flag: '🇫🇷',
    difficulty: 'facile',
    distractors: ['Lyon', 'Marseille', 'Bruxelles'],
    coordinates: { lat: 48.8566, lng: 2.3522 },
    acceptableAnswers: ['Paris'],
  },
  {
    id: 'ES',
    country: 'Espagne',
    capital: 'Madrid',
    flag: '🇪🇸',
    difficulty: 'facile',
    distractors: ['Barcelone', 'Séville', 'Lisbonne'],
    coordinates: { lat: 40.4168, lng: -3.7038 },
    acceptableAnswers: ['Madrid'],
  },
  {
    id: 'IT',
    country: 'Italie',
    capital: 'Rome',
    flag: '🇮🇹',
    difficulty: 'facile',
    distractors: ['Milan', 'Florence', 'Naples'],
    coordinates: { lat: 41.9028, lng: 12.4964 },
    acceptableAnswers: ['Rome', 'Roma'],
  },
  {
    id: 'JP',
    country: 'Japon',
    capital: 'Tokyo',
    flag: '🇯🇵',
    difficulty: 'facile',
    distractors: ['Kyoto', 'Osaka', 'Séoul'],
    coordinates: { lat: 35.6762, lng: 139.6503 },
    acceptableAnswers: ['Tokyo'],
  },
  {
    id: 'US',
    country: 'États-Unis',
    capital: 'Washington D.C.',
    flag: '🇺🇸',
    difficulty: 'facile',
    distractors: ['New York', 'Los Angeles', 'Chicago'],
    coordinates: { lat: 38.9072, lng: -77.0369 },
    acceptableAnswers: ['Washington', 'Washington DC', 'Washington D.C.'],
  },
  {
    id: 'DE',
    country: 'Allemagne',
    capital: 'Berlin',
    flag: '🇩🇪',
    difficulty: 'facile',
    distractors: ['Munich', 'Francfort', 'Hambourg'],
    coordinates: { lat: 52.52, lng: 13.405 },
    acceptableAnswers: ['Berlin'],
  },
  {
    id: 'CN',
    country: 'Chine',
    capital: 'Pékin',
    flag: '🇨🇳',
    difficulty: 'facile',
    distractors: ['Shanghai', 'Canton', 'Hong Kong'],
    coordinates: { lat: 39.9042, lng: 116.4074 },
    acceptableAnswers: ['Pekin', 'Beijing'],
  },
  {
    id: 'BR',
    country: 'Brésil',
    capital: 'Brasília',
    flag: '🇧🇷',
    difficulty: 'facile',
    distractors: ['Rio de Janeiro', 'São Paulo', 'Salvador'],
    coordinates: { lat: -15.8267, lng: -47.9218 },
    acceptableAnswers: ['Brasilia', 'Brasília'],
  },
  {
    id: 'GB',
    country: 'Royaume-Uni',
    capital: 'Londres',
    flag: '🇬🇧',
    difficulty: 'facile',
    distractors: ['Manchester', 'Édimbourg', 'Dublin'],
    coordinates: { lat: 51.5074, lng: -0.1278 },
    acceptableAnswers: ['Londres', 'London'],
  },
  {
    id: 'CA',
    country: 'Canada',
    capital: 'Ottawa',
    flag: '🇨🇦',
    difficulty: 'facile',
    distractors: ['Toronto', 'Montréal', 'Vancouver'],
    coordinates: { lat: 45.4215, lng: -75.6972 },
    acceptableAnswers: ['Ottawa'],
  },
  {
    id: 'RU',
    country: 'Russie',
    capital: 'Moscou',
    flag: '🇷🇺',
    difficulty: 'facile',
    distractors: ['Saint-Pétersbourg', 'Kazan', 'Novossibirsk'],
    coordinates: { lat: 55.7558, lng: 37.6173 },
    acceptableAnswers: ['Moscou', 'Moscow'],
  },
  {
    id: 'EG',
    country: 'Égypte',
    capital: 'Le Caire',
    flag: '🇪🇬',
    difficulty: 'facile',
    distractors: ['Alexandrie', 'Gizeh', 'Louxor'],
    coordinates: { lat: 30.0444, lng: 31.2357 },
    acceptableAnswers: ['Le Caire', 'Caire', 'Cairo'],
  },
  {
    id: 'GR',
    country: 'Grèce',
    capital: 'Athènes',
    flag: '🇬🇷',
    difficulty: 'facile',
    distractors: ['Thessalonique', 'Héraklion', 'Nicosie'],
    coordinates: { lat: 37.9838, lng: 23.7275 },
    acceptableAnswers: ['Athenes', 'Athènes', 'Athens'],
  },
  {
    id: 'PT',
    country: 'Portugal',
    capital: 'Lisbonne',
    flag: '🇵🇹',
    difficulty: 'facile',
    distractors: ['Porto', 'Faro', 'Madrid'],
    coordinates: { lat: 38.7223, lng: -9.1393 },
    acceptableAnswers: ['Lisbonne', 'Lisbon', 'Lisboa'],
  },
  {
    id: 'MX',
    country: 'Mexique',
    capital: 'Mexico',
    flag: '🇲🇽',
    difficulty: 'facile',
    distractors: ['Guadalajara', 'Monterrey', 'Cancún'],
    coordinates: { lat: 19.4326, lng: -99.1332 },
    acceptableAnswers: ['Mexico', 'Mexico City', 'Ciudad de Mexico'],
  },
  {
    id: 'AR',
    country: 'Argentine',
    capital: 'Buenos Aires',
    flag: '🇦🇷',
    difficulty: 'facile',
    distractors: ['Córdoba', 'Rosario', 'Mendoza'],
    coordinates: { lat: -34.6037, lng: -58.3816 },
    acceptableAnswers: ['Buenos Aires'],
  },
  {
    id: 'IN',
    country: 'Inde',
    capital: 'New Delhi',
    flag: '🇮🇳',
    difficulty: 'facile',
    distractors: ['Mumbai', 'Bangalore', 'Calcutta'],
    coordinates: { lat: 28.6139, lng: 77.209 },
    acceptableAnswers: ['New Delhi', 'Delhi'],
  },
  {
    id: 'KR',
    country: 'Corée du Sud',
    capital: 'Séoul',
    flag: '🇰🇷',
    difficulty: 'facile',
    distractors: ['Busan', 'Incheon', 'Daegu'],
    coordinates: { lat: 37.5665, lng: 126.978 },
    acceptableAnswers: ['Seoul', 'Séoul'],
  },

  // ================= MOYEN =================
  {
    id: 'SI',
    country: 'Slovénie',
    capital: 'Ljubljana',
    flag: '🇸🇮',
    difficulty: 'moyen',
    distractors: ['Maribor', 'Zagreb', 'Bratislava'],
    coordinates: { lat: 46.0569, lng: 14.5058 },
    acceptableAnswers: ['Ljubljana'],
  },
  {
    id: 'BW',
    country: 'Botswana',
    capital: 'Gaborone',
    flag: '🇧🇼',
    difficulty: 'moyen',
    distractors: ['Francistown', 'Windhoek', 'Pretoria'],
    coordinates: { lat: -24.6282, lng: 25.9231 },
    acceptableAnswers: ['Gaborone'],
  },
  {
    id: 'UY',
    country: 'Uruguay',
    capital: 'Montevideo',
    flag: '🇺🇾',
    difficulty: 'moyen',
    distractors: ['Punta del Este', 'Buenos Aires', 'Asunción'],
    coordinates: { lat: -34.9011, lng: -56.1645 },
    acceptableAnswers: ['Montevideo'],
  },
  {
    id: 'MN',
    country: 'Mongolie',
    capital: 'Oulan-Bator',
    flag: '🇲🇳',
    difficulty: 'moyen',
    distractors: ['Erdenet', 'Astana', 'Irkoutsk'],
    coordinates: { lat: 47.9188, lng: 106.9176 },
    acceptableAnswers: ['Oulan Bator', 'Oulan-Bator', 'Ulaanbaatar'],
  },
  {
    id: 'FI',
    country: 'Finlande',
    capital: 'Helsinki',
    flag: '🇫🇮',
    difficulty: 'moyen',
    distractors: ['Espoo', 'Tampere', 'Stockholm'],
    coordinates: { lat: 60.1699, lng: 24.9384 },
    acceptableAnswers: ['Helsinki'],
  },
  {
    id: 'NO',
    country: 'Norvège',
    capital: 'Oslo',
    flag: '🇳🇴',
    difficulty: 'moyen',
    distractors: ['Bergen', 'Trondheim', 'Copenhague'],
    coordinates: { lat: 59.9139, lng: 10.7522 },
    acceptableAnswers: ['Oslo'],
  },
  {
    id: 'IE',
    country: 'Irlande',
    capital: 'Dublin',
    flag: '🇮🇪',
    difficulty: 'moyen',
    distractors: ['Cork', 'Galway', 'Belfast'],
    coordinates: { lat: 53.3498, lng: -6.2603 },
    acceptableAnswers: ['Dublin'],
  },
  {
    id: 'PL',
    country: 'Pologne',
    capital: 'Varsovie',
    flag: '🇵🇱',
    difficulty: 'moyen',
    distractors: ['Cracovie', 'Gdańsk', 'Wrocław'],
    coordinates: { lat: 52.2297, lng: 21.0122 },
    acceptableAnswers: ['Varsovie', 'Warsaw'],
  },
  {
    id: 'CO',
    country: 'Colombie',
    capital: 'Bogota',
    flag: '🇨🇴',
    difficulty: 'moyen',
    distractors: ['Medellín', 'Cali', 'Barranquilla'],
    coordinates: { lat: 4.711, lng: -74.0721 },
    acceptableAnswers: ['Bogota', 'Bogotá'],
  },
  {
    id: 'PE',
    country: 'Pérou',
    capital: 'Lima',
    flag: '🇵🇪',
    difficulty: 'moyen',
    distractors: ['Cusco', 'Arequipa', 'Quito'],
    coordinates: { lat: -12.0464, lng: -77.0428 },
    acceptableAnswers: ['Lima'],
  },
  {
    id: 'TH',
    country: 'Thaïlande',
    capital: 'Bangkok',
    flag: '🇹🇭',
    difficulty: 'moyen',
    distractors: ['Chiang Mai', 'Phuket', 'Kuala Lumpur'],
    coordinates: { lat: 13.7563, lng: 100.5018 },
    acceptableAnswers: ['Bangkok'],
  },
  {
    id: 'SN',
    country: 'Sénégal',
    capital: 'Dakar',
    flag: '🇸🇳',
    difficulty: 'moyen',
    distractors: ['Saint-Louis', 'Thiès', 'Banjul'],
    coordinates: { lat: 14.7167, lng: -17.4677 },
    acceptableAnswers: ['Dakar'],
  },
  {
    id: 'KE',
    country: 'Kenya',
    capital: 'Nairobi',
    flag: '🇰🇪',
    difficulty: 'moyen',
    distractors: ['Mombasa', 'Kisumu', 'Kampala'],
    coordinates: { lat: -1.2921, lng: 36.8219 },
    acceptableAnswers: ['Nairobi'],
  },
  {
    id: 'IS',
    country: 'Islande',
    capital: 'Reykjavik',
    flag: '🇮🇸',
    difficulty: 'moyen',
    distractors: ['Akureyri', 'Keflavik', 'Tórshavn'],
    coordinates: { lat: 64.1466, lng: -21.9426 },
    acceptableAnswers: ['Reykjavik', 'Reykjavík'],
  },
  {
    id: 'SK',
    country: 'Slovaquie',
    capital: 'Bratislava',
    flag: '🇸🇰',
    difficulty: 'moyen',
    distractors: ['Košice', 'Žilina', 'Ljubljana'],
    coordinates: { lat: 48.1486, lng: 17.1077 },
    acceptableAnswers: ['Bratislava'],
  },
  {
    id: 'HR',
    country: 'Croatie',
    capital: 'Zagreb',
    flag: '🇭🇷',
    difficulty: 'moyen',
    distractors: ['Split', 'Dubrovnik', 'Sarajevo'],
    coordinates: { lat: 45.815, lng: 15.9819 },
    acceptableAnswers: ['Zagreb'],
  },
  {
    id: 'CL',
    country: 'Chili',
    capital: 'Santiago',
    flag: '🇨🇱',
    difficulty: 'moyen',
    distractors: ['Valparaíso', 'Concepción', 'Buenos Aires'],
    coordinates: { lat: -33.4489, lng: -70.6693 },
    acceptableAnswers: ['Santiago'],
  },
  {
    id: 'MA',
    country: 'Maroc',
    capital: 'Rabat',
    flag: '🇲🇦',
    difficulty: 'moyen',
    distractors: ['Casablanca', 'Marrakech', 'Tanger'],
    coordinates: { lat: 34.0209, lng: -6.8416 },
    acceptableAnswers: ['Rabat'],
  },

  // ================= DIFFICILE =================
  {
    id: 'AU',
    country: 'Australie',
    capital: 'Canberra',
    flag: '🇦🇺',
    difficulty: 'difficile',
    distractors: ['Sydney', 'Melbourne', 'Wellington'],
    coordinates: { lat: -35.2809, lng: 149.13 },
    acceptableAnswers: ['Canberra'],
  },
  {
    id: 'TR',
    country: 'Turquie',
    capital: 'Ankara',
    flag: '🇹🇷',
    difficulty: 'difficile',
    distractors: ['Istanbul', 'Izmir', 'Antalya'],
    coordinates: { lat: 39.9334, lng: 32.8597 },
    acceptableAnswers: ['Ankara'],
  },
  {
    id: 'KZ',
    country: 'Kazakhstan',
    capital: 'Astana',
    flag: '🇰🇿',
    difficulty: 'difficile',
    distractors: ['Almaty', 'Chymkent', 'Tachkent'],
    coordinates: { lat: 51.1694, lng: 71.4491 },
    acceptableAnswers: ['Astana', 'Nour-Soultan', 'Nur-Sultan'],
  },
  {
    id: 'BF',
    country: 'Burkina Faso',
    capital: 'Ouagadougou',
    flag: '🇧🇫',
    difficulty: 'difficile',
    distractors: ['Bobo-Dioulasso', 'Koudougou', 'Bamako'],
    coordinates: { lat: 12.3714, lng: -1.5197 },
    acceptableAnswers: ['Ouagadougou'],
  },
  {
    id: 'CH',
    country: 'Suisse',
    capital: 'Berne',
    flag: '🇨🇭',
    difficulty: 'difficile',
    distractors: ['Zurich', 'Genève', 'Bâle'],
    coordinates: { lat: 46.948, lng: 7.4474 },
    acceptableAnswers: ['Berne', 'Bern'],
  },
  {
    id: 'CI',
    country: "Côte d'Ivoire",
    capital: 'Yamoussoukro',
    flag: '🇨🇮',
    difficulty: 'difficile',
    distractors: ['Abidjan', 'Bouaké', 'San-Pédro'],
    coordinates: { lat: 6.8276, lng: -5.2893 },
    acceptableAnswers: ['Yamoussoukro'],
  },
  {
    id: 'NZ',
    country: 'Nouvelle-Zélande',
    capital: 'Wellington',
    flag: '🇳🇿',
    difficulty: 'difficile',
    distractors: ['Auckland', 'Christchurch', 'Canberra'],
    coordinates: { lat: -41.2865, lng: 174.7762 },
    acceptableAnswers: ['Wellington'],
  },
  {
    id: 'ZA',
    country: 'Afrique du Sud',
    capital: 'Pretoria',
    flag: '🇿🇦',
    difficulty: 'difficile',
    distractors: ['Le Cap', 'Johannesburg', 'Durban'],
    coordinates: { lat: -25.7479, lng: 28.2293 },
    acceptableAnswers: ['Pretoria', 'Le Cap', 'Bloemfontein'],
  },
  {
    id: 'AE',
    country: 'Émirats arabes unis',
    capital: 'Abou Dabi',
    flag: '🇦🇪',
    difficulty: 'difficile',
    distractors: ['Dubaï', 'Charjah', 'Doha'],
    coordinates: { lat: 24.4539, lng: 54.3773 },
    acceptableAnswers: ['Abou Dabi', 'Abu Dhabi', 'Abou Dhabi'],
  },
  {
    id: 'NG',
    country: 'Nigéria',
    capital: 'Abuja',
    flag: '🇳🇬',
    difficulty: 'difficile',
    distractors: ['Lagos', 'Kano', 'Ibadan'],
    coordinates: { lat: 9.0765, lng: 7.3986 },
    acceptableAnswers: ['Abuja'],
  },
  {
    id: 'LA',
    country: 'Laos',
    capital: 'Vientiane',
    flag: '🇱🇦',
    difficulty: 'difficile',
    distractors: ['Luang Prabang', 'Hanoï', 'Phnom Penh'],
    coordinates: { lat: 17.9757, lng: 102.6331 },
    acceptableAnswers: ['Vientiane'],
  },
  {
    id: 'MM',
    country: 'Birmanie',
    capital: 'Naypyidaw',
    flag: '🇲🇲',
    difficulty: 'difficile',
    distractors: ['Rangoun', 'Mandalay', 'Bangkok'],
    coordinates: { lat: 19.7633, lng: 96.0785 },
    acceptableAnswers: ['Naypyidaw', 'Nay Pyi Taw'],
  },
  {
    id: 'LK',
    country: 'Sri Lanka',
    capital: 'Sri Jayawardenepura Kotte',
    flag: '🇱🇰',
    difficulty: 'difficile',
    distractors: ['Colombo', 'Kandy', 'Galle'],
    coordinates: { lat: 6.9016, lng: 79.9004 },
    acceptableAnswers: ['Sri Jayawardenepura Kotte', 'Kotte', 'Colombo'],
  },
  {
    id: 'BO',
    country: 'Bolivie',
    capital: 'Sucre',
    flag: '🇧🇴',
    difficulty: 'difficile',
    distractors: ['La Paz', 'Santa Cruz', 'Cochabamba'],
    coordinates: { lat: -19.0196, lng: -65.2619 },
    acceptableAnswers: ['Sucre', 'La Paz'],
  },
  {
    id: 'EC',
    country: 'Équateur',
    capital: 'Quito',
    flag: '🇪🇨',
    difficulty: 'difficile',
    distractors: ['Guayaquil', 'Cuenca', 'Bogota'],
    coordinates: { lat: -0.1807, lng: -78.4678 },
    acceptableAnswers: ['Quito'],
  },
  {
    id: 'BT',
    country: 'Bhoutan',
    capital: 'Thimphou',
    flag: '🇧🇹',
    difficulty: 'difficile',
    distractors: ['Paro', 'Punakha', 'Katmandou'],
    coordinates: { lat: 27.4728, lng: 89.6393 },
    acceptableAnswers: ['Thimphou', 'Thimphu'],
  },
  {
    id: 'TZ',
    country: 'Tanzanie',
    capital: 'Dodoma',
    flag: '🇹🇿',
    difficulty: 'difficile',
    distractors: ['Dar es Salaam', 'Zanzibar', 'Nairobi'],
    coordinates: { lat: -6.163, lng: 35.7516 },
    acceptableAnswers: ['Dodoma'],
  },
  {
    id: 'BJ',
    country: 'Bénin',
    capital: 'Porto-Novo',
    flag: '🇧🇯',
    difficulty: 'difficile',
    distractors: ['Cotonou', 'Parakou', 'Lomé'],
    coordinates: { lat: 6.4969, lng: 2.6289 },
    acceptableAnswers: ['Porto Novo', 'Porto-Novo'],
  },

  // ===== OCÉANIE & ÎLES DU PACIFIQUE (DIFFICILE) =====
  {
    id: 'FM',
    country: 'Micronésie',
    capital: 'Palikir',
    flag: '🇫🇲',
    difficulty: 'difficile',
    distractors: ['Weno', 'Kolonia', 'Majuro'],
    coordinates: { lat: 6.9177, lng: 158.185 },
    acceptableAnswers: ['Palikir'],
  },
  {
    id: 'PF',
    country: 'Polynésie française',
    capital: 'Papeete',
    flag: '🇵🇫',
    difficulty: 'difficile',
    distractors: ['Bora-Bora', "Faa'a", 'Moorea'],
    coordinates: { lat: -17.5516, lng: -149.5585 },
    acceptableAnswers: ['Papeete'],
  },
  {
    id: 'PW',
    country: 'Palaos',
    capital: 'Ngerulmud',
    flag: '🇵🇼',
    difficulty: 'difficile',
    distractors: ['Koror', 'Melekeok', 'Airai'],
    coordinates: { lat: 7.5004, lng: 134.6242 },
    acceptableAnswers: ['Ngerulmud', 'Melekeok'],
  },
  {
    id: 'MH',
    country: 'Îles Marshall',
    capital: 'Majuro',
    flag: '🇲🇭',
    difficulty: 'difficile',
    distractors: ['Ebeye', 'Jaluit', 'Kwajalein'],
    coordinates: { lat: 7.1167, lng: 171.3667 },
    acceptableAnswers: ['Majuro'],
  },
  {
    id: 'NR',
    country: 'Nauru',
    capital: 'Yaren',
    flag: '🇳🇷',
    difficulty: 'difficile',
    distractors: ['Denigomodu', 'Meneng', 'Aiwo'],
    coordinates: { lat: -0.5477, lng: 166.9209 },
    acceptableAnswers: ['Yaren'],
  },
  {
    id: 'TV',
    country: 'Tuvalu',
    capital: 'Funafuti',
    flag: '🇹🇻',
    difficulty: 'difficile',
    distractors: ['Vaiaku', 'Nanumea', 'Niutao'],
    coordinates: { lat: -8.5211, lng: 179.1983 },
    acceptableAnswers: ['Funafuti', 'Vaiaku'],
  },
  {
    id: 'KI',
    country: 'Kiribati',
    capital: 'Tarawa',
    flag: '🇰🇮',
    difficulty: 'difficile',
    distractors: ['Betio', 'Bairiki', 'Kiritimati'],
    coordinates: { lat: 1.3278, lng: 172.9778 },
    acceptableAnswers: ['Tarawa', 'Bairiki', 'South Tarawa'],
  },
  {
    id: 'VU',
    country: 'Vanuatu',
    capital: 'Port-Vila',
    flag: '🇻🇺',
    difficulty: 'difficile',
    distractors: ['Luganville', 'Norsup', 'Isangel'],
    coordinates: { lat: -17.7333, lng: 168.3273 },
    acceptableAnswers: ['Port-Vila', 'Port Vila'],
  },
  {
    id: 'FJ',
    country: 'Fidji',
    capital: 'Suva',
    flag: '🇫🇯',
    difficulty: 'difficile',
    distractors: ['Nadi', 'Lautoka', 'Labasa'],
    coordinates: { lat: -18.1416, lng: 178.4419 },
    acceptableAnswers: ['Suva'],
  },
  {
    id: 'WS',
    country: 'Samoa',
    capital: 'Apia',
    flag: '🇼🇸',
    difficulty: 'difficile',
    distractors: ['Vaitele', 'Faleasiu', 'Salelologa'],
    coordinates: { lat: -13.8333, lng: -171.7667 },
    acceptableAnswers: ['Apia'],
  },
  {
    id: 'TO',
    country: 'Tonga',
    capital: "Nuku'alofa",
    flag: '🇹🇴',
    difficulty: 'difficile',
    distractors: ['Neiafu', 'Haveluloto', 'Pangai'],
    coordinates: { lat: -21.1394, lng: -175.2048 },
    acceptableAnswers: ["Nuku'alofa", 'Nukualofa', 'Nuku alofa'],
  },
  {
    id: 'SB',
    country: 'Îles Salomon',
    capital: 'Honiara',
    flag: '🇸🇧',
    difficulty: 'difficile',
    distractors: ['Gizo', 'Auki', 'Noro'],
    coordinates: { lat: -9.4456, lng: 159.9729 },
    acceptableAnswers: ['Honiara'],
  },
  {
    id: 'PG',
    country: 'Papouasie-Nouvelle-Guinée',
    capital: 'Port Moresby',
    flag: '🇵🇬',
    difficulty: 'difficile',
    distractors: ['Lae', 'Mount Hagen', 'Madang'],
    coordinates: { lat: -9.4438, lng: 147.1803 },
    acceptableAnswers: ['Port Moresby'],
  },

  // ===== ÎLES D'AFRIQUE & ÉTATS SPÉCIFIQUES (DIFFICILE) =====
  {
    id: 'KM',
    country: 'Comores',
    capital: 'Moroni',
    flag: '🇰🇲',
    difficulty: 'difficile',
    distractors: ['Mutsamudu', 'Fomboni', 'Domoni'],
    coordinates: { lat: -11.7172, lng: 43.2473 },
    acceptableAnswers: ['Moroni'],
  },
  {
    id: 'SC',
    country: 'Seychelles',
    capital: 'Victoria',
    flag: '🇸🇨',
    difficulty: 'difficile',
    distractors: ['Anse Boileau', 'Beau Vallon', 'Cascade'],
    coordinates: { lat: -4.6191, lng: 55.4513 },
    acceptableAnswers: ['Victoria'],
  },
  {
    id: 'MU',
    country: 'Maurice',
    capital: 'Port-Louis',
    flag: '🇲🇺',
    difficulty: 'difficile',
    distractors: ['Beau Bassin', 'Curepipe', 'Vacoas'],
    coordinates: { lat: -20.1609, lng: 57.5012 },
    acceptableAnswers: ['Port-Louis', 'Port Louis'],
  },
  {
    id: 'ST',
    country: 'Sao Tomé-et-Principe',
    capital: 'São Tomé',
    flag: '🇸🇹',
    difficulty: 'difficile',
    distractors: ['Trindade', 'Santana', 'Neves'],
    coordinates: { lat: 0.3365, lng: 6.7273 },
    acceptableAnswers: ['Sao Tome', 'São Tomé', 'Sao Tomé'],
  },
  {
    id: 'CV',
    country: 'Cap-Vert',
    capital: 'Praia',
    flag: '🇨🇻',
    difficulty: 'difficile',
    distractors: ['Mindelo', 'Espargos', 'Santa Maria'],
    coordinates: { lat: 14.933, lng: -23.5133 },
    acceptableAnswers: ['Praia'],
  },
  {
    id: 'MG',
    country: 'Madagascar',
    capital: 'Antananarivo',
    flag: '🇲🇬',
    difficulty: 'moyen',
    distractors: ['Tamatave', 'Majunga', 'Antsirabe'],
    coordinates: { lat: -18.8792, lng: 47.5079 },
    acceptableAnswers: ['Antananarivo', 'Tananarive'],
  },
  {
    id: 'SZ',
    country: 'Eswatini',
    capital: 'Mbabane',
    flag: '🇸🇿',
    difficulty: 'difficile',
    distractors: ['Manzini', 'Lobamba', 'Big Bend'],
    coordinates: { lat: -26.3167, lng: 31.1333 },
    acceptableAnswers: ['Mbabane', 'Lobamba'],
  },
  {
    id: 'LS',
    country: 'Lesotho',
    capital: 'Maseru',
    flag: '🇱🇸',
    difficulty: 'difficile',
    distractors: ['Teyateyaneng', 'Mafeteng', 'Hlotse'],
    coordinates: { lat: -29.3167, lng: 27.4833 },
    acceptableAnswers: ['Maseru'],
  },
  {
    id: 'ER',
    country: 'Érythrée',
    capital: 'Asmara',
    flag: '🇪🇷',
    difficulty: 'difficile',
    distractors: ['Keren', 'Massaoua', 'Assab'],
    coordinates: { lat: 15.3229, lng: 38.9251 },
    acceptableAnswers: ['Asmara'],
  },
  {
    id: 'DJ',
    country: 'Djibouti',
    capital: 'Djibouti',
    flag: '🇩🇯',
    difficulty: 'moyen',
    distractors: ['Ali Sabieh', 'Tadjourah', 'Obock'],
    coordinates: { lat: 11.588, lng: 43.145 },
    acceptableAnswers: ['Djibouti'],
  },
  {
    id: 'MR',
    country: 'Mauritanie',
    capital: 'Nouakchott',
    flag: '🇲🇷',
    difficulty: 'difficile',
    distractors: ['Nouadhibou', 'Kiffa', 'Atar'],
    coordinates: { lat: 18.0735, lng: -15.9582 },
    acceptableAnswers: ['Nouakchott'],
  },
  {
    id: 'TD',
    country: 'Tchad',
    capital: "N'Djamena",
    flag: '🇹🇩',
    difficulty: 'difficile',
    distractors: ['Moundou', 'Sarh', 'Abéché'],
    coordinates: { lat: 12.1348, lng: 15.0557 },
    acceptableAnswers: ["N'Djamena", 'Ndjamena', 'N Djamena'],
  },
  {
    id: 'CF',
    country: 'Centrafrique',
    capital: 'Bangui',
    flag: '🇨🇫',
    difficulty: 'difficile',
    distractors: ['Bimbo', 'Berbérati', 'Carnot'],
    coordinates: { lat: 4.3947, lng: 18.5582 },
    acceptableAnswers: ['Bangui'],
  },

  // ===== AMÉRIQUES & CARAÏBES (DIFFICILE & MOYEN) =====
  {
    id: 'KN',
    country: 'Saint-Christophe-et-Niévès',
    capital: 'Basseterre',
    flag: '🇰🇳',
    difficulty: 'difficile',
    distractors: ['Charlestown', 'Sandy Point', 'Cayon'],
    coordinates: { lat: 17.3, lng: -62.7333 },
    acceptableAnswers: ['Basseterre'],
  },
  {
    id: 'LC',
    country: 'Sainte-Lucie',
    capital: 'Castries',
    flag: '🇱🇨',
    difficulty: 'difficile',
    distractors: ['Vieux Fort', 'Soufrière', 'Gros Islet'],
    coordinates: { lat: 14.0101, lng: -60.9875 },
    acceptableAnswers: ['Castries'],
  },
  {
    id: 'VC',
    country: 'Saint-Vincent-et-les-Grenadines',
    capital: 'Kingstown',
    flag: '🇻🇨',
    difficulty: 'difficile',
    distractors: ['Georgetown', 'Barrouallie', 'Port Elizabeth'],
    coordinates: { lat: 13.1587, lng: -61.2248 },
    acceptableAnswers: ['Kingstown'],
  },
  {
    id: 'DM',
    country: 'Dominique',
    capital: 'Roseau',
    flag: '🇩🇲',
    difficulty: 'difficile',
    distractors: ['Portsmouth', 'Marigot', 'Berekua'],
    coordinates: { lat: 15.3017, lng: -61.3881 },
    acceptableAnswers: ['Roseau'],
  },
  {
    id: 'GD',
    country: 'Grenade',
    capital: 'Saint-Georges',
    flag: '🇬🇩',
    difficulty: 'difficile',
    distractors: ['Gouyave', 'Grenville', 'Victoria'],
    coordinates: { lat: 12.0561, lng: -61.7488 },
    acceptableAnswers: ['Saint-Georges', 'Saint Georges', 'St Georges'],
  },
  {
    id: 'BB',
    country: 'Barbade',
    capital: 'Bridgetown',
    flag: '🇧🇧',
    difficulty: 'difficile',
    distractors: ['Speightstown', 'Oistins', 'Holetown'],
    coordinates: { lat: 13.0975, lng: -59.6165 },
    acceptableAnswers: ['Bridgetown'],
  },
  {
    id: 'AG',
    country: 'Antigua-et-Barbuda',
    capital: "Saint John's",
    flag: '🇦🇬',
    difficulty: 'difficile',
    distractors: ['All Saints', 'Liberta', 'Bolans'],
    coordinates: { lat: 17.1172, lng: -61.8457 },
    acceptableAnswers: ["Saint John's", 'Saint Johns', "St John's"],
  },
  {
    id: 'TT',
    country: 'Trinité-et-Tobago',
    capital: "Port-d'Espagne",
    flag: '🇹🇹',
    difficulty: 'difficile',
    distractors: ['San Fernando', 'Chaguanas', 'Arima'],
    coordinates: { lat: 10.6596, lng: -61.5189 },
    acceptableAnswers: ["Port-d'Espagne", "Port d'Espagne", 'Port of Spain'],
  },
  {
    id: 'BS',
    country: 'Bahamas',
    capital: 'Nassau',
    flag: '🇧🇸',
    difficulty: 'moyen',
    distractors: ['Freeport', 'West End', 'Lucaya'],
    coordinates: { lat: 25.048, lng: -77.3554 },
    acceptableAnswers: ['Nassau'],
  },
  {
    id: 'JM',
    country: 'Jamaïque',
    capital: 'Kingston',
    flag: '🇯🇲',
    difficulty: 'moyen',
    distractors: ['Montego Bay', 'Spanish Town', 'Negril'],
    coordinates: { lat: 17.9712, lng: -76.7936 },
    acceptableAnswers: ['Kingston'],
  },
  {
    id: 'SR',
    country: 'Suriname',
    capital: 'Paramaribo',
    flag: '🇸🇷',
    difficulty: 'difficile',
    distractors: ['Lelydorp', 'Nieuw Nickerie', 'Moengo'],
    coordinates: { lat: 5.852, lng: -55.2038 },
    acceptableAnswers: ['Paramaribo'],
  },
  {
    id: 'GY',
    country: 'Guyana',
    capital: 'Georgetown',
    flag: '🇬🇾',
    difficulty: 'difficile',
    distractors: ['Linden', 'New Amsterdam', 'Bartica'],
    coordinates: { lat: 6.8013, lng: -58.1551 },
    acceptableAnswers: ['Georgetown'],
  },
  {
    id: 'BZ',
    country: 'Bélize',
    capital: 'Belmopan',
    flag: '🇧🇿',
    difficulty: 'difficile',
    distractors: ['Belize City', 'San Ignacio', 'Orange Walk'],
    coordinates: { lat: 17.251, lng: -88.767 },
    acceptableAnswers: ['Belmopan'],
  },

  // ===== ASIE & ASIE CENTRALE (DIFFICILE & MOYEN) =====
  {
    id: 'MV',
    country: 'Maldives',
    capital: 'Malé',
    flag: '🇲🇻',
    difficulty: 'difficile',
    distractors: ['Hulhumalé', 'Addu City', 'Fuvahmulah'],
    coordinates: { lat: 4.1755, lng: 73.5093 },
    acceptableAnswers: ['Male', 'Malé'],
  },
  {
    id: 'BN',
    country: 'Brunéi',
    capital: 'Bandar Seri Begawan',
    flag: '🇧🇳',
    difficulty: 'difficile',
    distractors: ['Kuala Belait', 'Seria', 'Tutong'],
    coordinates: { lat: 4.9031, lng: 114.9398 },
    acceptableAnswers: ['Bandar Seri Begawan', 'Bandar'],
  },
  {
    id: 'TL',
    country: 'Timor oriental',
    capital: 'Dili',
    flag: '🇹🇱',
    difficulty: 'difficile',
    distractors: ['Baucau', 'Maliana', 'Suai'],
    coordinates: { lat: -8.5569, lng: 125.5603 },
    acceptableAnswers: ['Dili'],
  },
  {
    id: 'TJ',
    country: 'Tadjikistan',
    capital: 'Douchanbé',
    flag: '🇹🇯',
    difficulty: 'difficile',
    distractors: ['Khodjent', 'Bokhtar', 'Koulob'],
    coordinates: { lat: 38.5598, lng: 68.787 },
    acceptableAnswers: ['Douchanbe', 'Douchanbé', 'Dushanbe'],
  },
  {
    id: 'KG',
    country: 'Kirghizistan',
    capital: 'Bichkek',
    flag: '🇰🇬',
    difficulty: 'difficile',
    distractors: ['Och', 'Djalal-Abad', 'Karakol'],
    coordinates: { lat: 42.8746, lng: 74.5698 },
    acceptableAnswers: ['Bichkek', 'Bishkek'],
  },
  {
    id: 'TM',
    country: 'Turkménistan',
    capital: 'Achgabat',
    flag: '🇹🇲',
    difficulty: 'difficile',
    distractors: ['Turkmenabat', 'Dachoguz', 'Mary'],
    coordinates: { lat: 37.9601, lng: 58.3261 },
    acceptableAnswers: ['Achgabat', 'Ashgabat'],
  },
  {
    id: 'UZ',
    country: 'Ouzbékistan',
    capital: 'Tachkent',
    flag: '🇺🇿',
    difficulty: 'moyen',
    distractors: ['Samarcande', 'Boukhara', 'Namangan'],
    coordinates: { lat: 41.2995, lng: 69.2401 },
    acceptableAnswers: ['Tachkent', 'Tashkent'],
  },

  // ===== EUROPE : MICRO-ÉTATS & CAPITALES PIÈGES (DIFFICILE & MOYEN) =====
  {
    id: 'LI',
    country: 'Liechtenstein',
    capital: 'Vaduz',
    flag: '🇱🇮',
    difficulty: 'difficile',
    distractors: ['Schaan', 'Balzers', 'Triesen'],
    coordinates: { lat: 47.141, lng: 9.5215 },
    acceptableAnswers: ['Vaduz'],
  },
  {
    id: 'SM',
    country: 'Saint-Marin',
    capital: 'Saint-Marin',
    flag: '🇸🇲',
    difficulty: 'difficile',
    distractors: ['Serravalle', 'Borgo Maggiore', 'Domagnano'],
    coordinates: { lat: 43.9333, lng: 12.45 },
    acceptableAnswers: ['Saint-Marin', 'San Marino'],
  },
  {
    id: 'AD',
    country: 'Andorre',
    capital: 'Andorre-la-Vieille',
    flag: '🇦🇩',
    difficulty: 'difficile',
    distractors: ['Escaldes-Engordany', 'Encamp', 'Sant Julià'],
    coordinates: { lat: 42.5063, lng: 1.5218 },
    acceptableAnswers: ['Andorre-la-Vieille', 'Andorra la Vella'],
  },
  {
    id: 'MT',
    country: 'Malte',
    capital: 'La Valette',
    flag: '🇲🇹',
    difficulty: 'difficile',
    distractors: ['Birkirkara', 'Sliema', 'Mosta'],
    coordinates: { lat: 35.8989, lng: 14.5146 },
    acceptableAnswers: ['La Valette', 'Valletta'],
  },
  {
    id: 'CY',
    country: 'Chypre',
    capital: 'Nicosie',
    flag: '🇨🇾',
    difficulty: 'difficile',
    distractors: ['Limassol', 'Larnaca', 'Paphos'],
    coordinates: { lat: 35.1856, lng: 33.3823 },
    acceptableAnswers: ['Nicosie', 'Nicosia'],
  },
  {
    id: 'ME',
    country: 'Monténégro',
    capital: 'Podgorica',
    flag: '🇲🇪',
    difficulty: 'difficile',
    distractors: ['Nikšić', 'Kotor', 'Budva'],
    coordinates: { lat: 42.4304, lng: 19.2594 },
    acceptableAnswers: ['Podgorica'],
  },
  {
    id: 'MK',
    country: 'Macédoine du Nord',
    capital: 'Skopje',
    flag: '🇲🇰',
    difficulty: 'difficile',
    distractors: ['Bitola', 'Kumanovo', 'Prilep'],
    coordinates: { lat: 41.9981, lng: 21.4254 },
    acceptableAnswers: ['Skopje'],
  },
  {
    id: 'AL',
    country: 'Albanie',
    capital: 'Tirana',
    flag: '🇦🇱',
    difficulty: 'difficile',
    distractors: ['Durrës', 'Vlora', 'Shkodra'],
    coordinates: { lat: 41.3275, lng: 19.8187 },
    acceptableAnswers: ['Tirana'],
  },
  {
    id: 'MD',
    country: 'Moldavie',
    capital: 'Chisinau',
    flag: '🇲🇩',
    difficulty: 'difficile',
    distractors: ['Bălți', 'Tiraspol', 'Bender'],
    coordinates: { lat: 47.0105, lng: 28.8638 },
    acceptableAnswers: ['Chisinau', 'Chișinău'],
  },
];

/**
 * Mélange aléatoire de Fisher-Yates
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Mémoire de récence en sessionStorage pour éviter la répétition entre parties consécutives
const RECENT_HISTORY_KEY = 'quiz_recent_country_ids';

function getRecentCountryIds(): string[] {
  try {
    const raw = sessionStorage.getItem(RECENT_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function rememberCountryIds(ids: string[]): void {
  try {
    const existing = getRecentCountryIds();
    const updated = Array.from(new Set([...ids, ...existing])).slice(0, 80);
    sessionStorage.setItem(RECENT_HISTORY_KEY, JSON.stringify(updated));
  } catch {}
}

/**
 * Liste d'identifiants d'îles et archipels lointains pour injection garantie en mode Difficile
 */
const ISLAND_NATION_IDS = new Set([
  'FM', 'PF', 'PW', 'MH', 'NR', 'TV', 'KI', 'VU', 'FJ', 'WS', 'TO', 'SB',
  'KM', 'SC', 'MU', 'ST', 'CV', 'KN', 'LC', 'VC', 'DM', 'GD', 'BB', 'AG', 'MV',
]);

/**
 * Génère une liste de questions avec distinction très prononcée des niveaux
 * et système anti-répétition entre les parties.
 */
export function generateQuestions(
  difficulty: 'facile' | 'moyen' | 'difficile' | 'mix',
  count: number = 5
) {
  const recentIds = new Set(getRecentCountryIds());

  let selected: CountryItem[] = [];

  if (difficulty === 'difficile') {
    // Mode Difficile : très prononcé avec garantie forte de pays insulaires / atolls et pièges
    const allDifficile = COUNTRIES_DATABASE.filter((c) => c.difficulty === 'difficile');
    
    // Séparer les îles et les autres pays difficiles
    const freshIslands = allDifficile.filter((c) => ISLAND_NATION_IDS.has(c.id) && !recentIds.has(c.id));
    const fallbackIslands = allDifficile.filter((c) => ISLAND_NATION_IDS.has(c.id));
    const availableIslands = freshIslands.length >= 2 ? freshIslands : fallbackIslands;

    const freshOthers = allDifficile.filter((c) => !ISLAND_NATION_IDS.has(c.id) && !recentIds.has(c.id));
    const fallbackOthers = allDifficile.filter((c) => !ISLAND_NATION_IDS.has(c.id));
    const availableOthers = freshOthers.length >= 2 ? freshOthers : fallbackOthers;

    // Garantir au moins 2 îles (Micronésie, Polynésie, Palaos, Tuvalu, etc.) dans une partie de 5
    const islandPickCount = Math.max(2, Math.floor(count * 0.45));
    const otherPickCount = count - islandPickCount;

    const pickedIslands = shuffleArray(availableIslands).slice(0, islandPickCount);
    const pickedOthers = shuffleArray(availableOthers).slice(0, otherPickCount);

    selected = shuffleArray([...pickedIslands, ...pickedOthers]);
    // Si besoin de compléter
    if (selected.length < count) {
      const remaining = allDifficile.filter((c) => !selected.some((s) => s.id === c.id));
      selected.push(...shuffleArray(remaining).slice(0, count - selected.length));
    }
  } else if (difficulty === 'mix') {
    // Mode Mix : courbe progressive (facile -> moyen -> difficile/îles)
    const faciles = COUNTRIES_DATABASE.filter((c) => c.difficulty === 'facile' && !recentIds.has(c.id));
    const moyens = COUNTRIES_DATABASE.filter((c) => c.difficulty === 'moyen' && !recentIds.has(c.id));
    const difficiles = COUNTRIES_DATABASE.filter((c) => c.difficulty === 'difficile' && !recentIds.has(c.id));

    const poolF = faciles.length > 0 ? faciles : COUNTRIES_DATABASE.filter((c) => c.difficulty === 'facile');
    const poolM = moyens.length > 0 ? moyens : COUNTRIES_DATABASE.filter((c) => c.difficulty === 'moyen');
    const poolD = difficiles.length > 0 ? difficiles : COUNTRIES_DATABASE.filter((c) => c.difficulty === 'difficile');

    const fCount = Math.max(1, Math.floor(count * 0.3));
    const dCount = Math.max(1, Math.floor(count * 0.4));
    const mCount = count - fCount - dCount;

    const pickedF = shuffleArray(poolF).slice(0, fCount);
    const pickedM = shuffleArray(poolM).slice(0, mCount);
    const pickedD = shuffleArray(poolD).slice(0, dCount);

    selected = shuffleArray([...pickedF, ...pickedM, ...pickedD]);
  } else {
    // Mode Facile ou Moyen standard avec anti-répétition
    const levelPool = COUNTRIES_DATABASE.filter((c) => c.difficulty === difficulty);
    const fresh = levelPool.filter((c) => !recentIds.has(c.id));
    const pool = fresh.length >= count ? fresh : levelPool;
    selected = shuffleArray(pool).slice(0, count);
  }

  // Mémoriser pour les parties suivantes
  rememberCountryIds(selected.map((s) => s.id));

  return selected.map((item) => {
    const options = shuffleArray([item.capital, ...item.distractors]);
    return {
      countryId: item.id,
      country: item.country,
      capital: item.capital,
      flag: item.flag,
      difficulty: item.difficulty,
      options,
      coordinates: item.coordinates,
      acceptableAnswers: item.acceptableAnswers,
    };
  });
}

/**
 * Génère ou remplace une question ciblée sur un continent spécifique
 */
export function getQuestionForContinent(continentId: string, usedCountryIds: Set<string> = new Set()) {
  const matching = COUNTRIES_DATABASE.filter(
    (c) => COUNTRY_CONTINENTS[c.id] === continentId && !usedCountryIds.has(c.id)
  );

  const pool = matching.length > 0 ? matching : COUNTRIES_DATABASE.filter((c) => COUNTRY_CONTINENTS[c.id] === continentId);
  if (pool.length === 0) return null;

  const item = pool[Math.floor(Math.random() * pool.length)];
  const options = shuffleArray([item.capital, ...item.distractors]);
  return {
    countryId: item.id,
    country: item.country,
    capital: item.capital,
    flag: item.flag,
    difficulty: item.difficulty,
    options,
    coordinates: item.coordinates,
    acceptableAnswers: item.acceptableAnswers,
  };
}

