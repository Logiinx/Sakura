// supabase/functions/_shared/cors.ts
const allowedOrigins = ["https://sakura-iota.vercel.app", "https://www.momb-photographie.fr"]

/**
 * Retourne les en-têtes CORS adaptés à l’origine de la requête.
 * @param origin Le header Origin de la requête entrante
 */
export function getCorsHeaders(origin: string | null) {
  // Si l’origine est dans la whitelist, on la renvoie, sinon on renvoie une chaîne vide
  const allowOrigin = origin && allowedOrigins.includes(origin) ? origin : ""

  const headers: Record<string, string> = {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type, x-upload-section, x-upload-alt-text",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS, PUT, DELETE",
  }

  // Si vous devez utiliser des cookies / credentials, décommentez :
  // if (allowOrigin) headers["Access-Control-Allow-Credentials"] = "true";

  return headers
}
