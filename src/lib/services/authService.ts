import { supabase } from "@/lib/supabase/client";

export const authService = {
  async signUp(email: string, password: string) {
    if (!supabase) {
      throw new Error("Supabase não configurado.");
    }

    return supabase.auth.signUp({ email, password });
  },

  async signIn(email: string, password: string) {
    if (!supabase) {
      throw new Error("Supabase não configurado.");
    }

    return supabase.auth.signInWithPassword({ email, password });
  },

  async signOut() {
    if (!supabase) {
      return;
    }

    await supabase.auth.signOut();
  },

  async getSession() {
    if (!supabase) {
      return undefined;
    }

    const { data } = await supabase.auth.getSession();
    return data.session;
  },
};
