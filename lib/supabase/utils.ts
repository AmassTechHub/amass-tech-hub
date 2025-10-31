// lib/supabase/utils.ts
import { createClient } from "./client"
import type { Database } from "@/types/supabase"

/**
 * ✅ Checks if Supabase is connected by querying a small table.
 */
export const checkSupabaseConnection = async () => {
  const supabase = createClient()

  try {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .limit(1)

    if (error) {
      console.error("Supabase connection error:", error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error checking Supabase connection:", error)
    return { success: false, error }
  }
}

/**
 * ✅ Fetches all data from a given table name (type-safe)
 */
export const fetchTableData = async <T extends keyof Database["public"]["Tables"]>(
  tableName: T
) => {
  const supabase = createClient()

  try {
    const { data, error } = await supabase
      .from(tableName)
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error

    // Type-safe result
    return {
      data: data as Database["public"]["Tables"][T]["Row"][],
      error: null,
    }
  } catch (error) {
    console.error(`Error fetching data from ${tableName}:`, error)
    return { data: null, error }
  }
}
