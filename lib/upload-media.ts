import { supabase } from "@/lib/supabase"

export async function uploadMedia(file: File) {
  const fileName = `${Date.now()}-${file.name}`
  const { data, error } = await supabase.storage.from("media").upload(fileName, file)
  if (error) throw new Error(error.message)

  const { data: publicUrlData } = supabase.storage.from("media").getPublicUrl(fileName)
  return publicUrlData.publicUrl
}
