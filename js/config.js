// === Configuración ===

// Países disponibles
const COUNTRIES = [
  "España",
  "Portugal",
  "Francia",
  "Italia",
  "Alemania",
  "Reino Unido",
  "Estados Unidos",
  "Canadá"
];

// Provincias / Estados por país
const REGIONS_BY_COUNTRY = {
  "España": [
    "Madrid", "Barcelona", "Valencia", "Sevilla", "Málaga", "Zaragoza",
    "Murcia", "Alicante", "Cádiz", "Granada", "Toledo", "Salamanca",
    "Valladolid", "Badajoz", "A Coruña", "Asturias", "Cantabria", "Navarra",
    "La Rioja", "Álava", "Guipúzcoa", "Vizcaya", "Ceuta", "Melilla"
  ],
  "Portugal": [
    "Lisboa", "Porto", "Braga", "Aveiro", "Coímbra", "Faro", "Setúbal",
    "Madeira", "Azores"
  ],
  "Francia": [
    "Île-de-France", "Occitanie", "Nouvelle-Aquitaine",
    "Provence-Alpes-Côte d'Azur", "Auvergne-Rhône-Alpes",
    "Hauts-de-France", "Normandie", "Bretagne", "Pays de la Loire"
  ],
  "Italia": [
    "Lombardia", "Lazio", "Campania", "Sicilia", "Piemonte", "Veneto",
    "Emilia-Romagna", "Toscana", "Puglia", "Sardegna"
  ],
  "Alemania": [
    "Baviera", "Berlín", "Hamburgo", "Baden-Württemberg",
    "Renania del Norte-Westfalia", "Hesse", "Sajonia", "Baja Sajonia",
    "Brandeburgo", "Turingia"
  ],
  "Reino Unido": [
    "England", "Scotland", "Wales", "Northern Ireland"
  ],
  "Estados Unidos": [
    "California", "Texas", "New York", "Florida", "Illinois", "Pennsylvania",
    "Ohio", "Georgia", "North Carolina", "Michigan", "Washington", "Arizona"
  ],
  "Canadá": [
    "Ontario", "Quebec", "British Columbia", "Alberta",
    "Manitoba", "Saskatchewan", "Nova Scotia", "New Brunswick",
    "Newfoundland and Labrador", "Prince Edward Island"
  ]
};

// === Supabase ===
// Dejo tus valores como estaban originalmente
const SUPABASE_URL = "https://sceylguujzjfjpmeodxt.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjZXlsZ3V1anpqZmpwbWVvZHh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUzMzQxODAsImV4cCI6MjA3MDkxMDE4MH0.GPAT4mpTSobe-vrEEFb4PCS_7uXZC6dVkO_XGW26W8Y";
