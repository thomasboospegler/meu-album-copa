import { createClient } from "@supabase/supabase-js";

const supabaseUrl = normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function normalizeSupabaseUrl(value: string | undefined) {
  if (!value) {
    return undefined;
  }

  return value.trim().replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");
}

function isValidHttpUrl(value: string | undefined) {
  if (!value) {
    return false;
  }

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function isSupabaseConfigured() {
  return Boolean(
    isValidHttpUrl(supabaseUrl) &&
      supabaseKey &&
      !supabaseKey.startsWith("sb_secret_"),
  );
}

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl!, supabaseKey!)
  : null;

export async function getSupabaseUserId() {
  if (!supabase) {
    return undefined;
  }

  const { data } = await supabase.auth.getUser();
  return data.user?.id;
}
