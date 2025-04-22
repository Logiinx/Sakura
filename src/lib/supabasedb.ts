import { supabase } from "./supabase"

export async function getSectionText(section: string) {
  try {
    const { data, error } = await supabase.from("sections_texts").select("content").eq("section", section).maybeSingle()

    if (error) {
      console.error(`Erreur lors du chargement du texte pour la section "${section}" :`, error.message)
      return null
    }

    return data?.content ?? null
  } catch (error) {
    console.error(`Erreur lors du chargement du texte pour la section "${section}" :`, error)
    return null
  }
}
