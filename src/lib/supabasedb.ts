import { supabase } from "./supabase"

export async function getSectionText(section: string) {
  const { data, error } = await supabase.from("sections_texts").select("content").eq("section", section).single()

  if (error) {
    console.error(`Erreur lors du chargement du texte pour la section "${section}" :`, error.message)
    return null
  }

  return data?.content ?? null
}
