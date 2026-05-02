import { supabase } from "@/lib/supabase/client";

const localSessionKey = "meu-album-copa:local-session";

type LocalSession = {
  user: {
    id: string;
    email: string;
  };
};

export const authService = {
  async signUp(email: string, password: string) {
    if (!supabase) {
      return createLocalSession(email, password);
    }

    try {
      return await supabase.auth.signUp({ email, password });
    } catch (error) {
      return createAuthNetworkError(error);
    }
  },

  async signIn(email: string, password: string) {
    if (!supabase) {
      return createLocalSession(email, password);
    }

    try {
      return await supabase.auth.signInWithPassword({ email, password });
    } catch (error) {
      return createAuthNetworkError(error);
    }
  },

  async signOut() {
    if (!supabase) {
      window.localStorage.removeItem(localSessionKey);
      return;
    }

    await supabase.auth.signOut();
  },

  async getSession() {
    if (!supabase) {
      return getLocalSession();
    }

    const { data } = await supabase.auth.getSession();
    return data.session;
  },
};

function createLocalSession(email: string, password: string) {
  if (!email.trim() || password.length < 4) {
    return {
      data: { session: null },
      error: { message: "Use um email e uma senha com pelo menos 4 caracteres." },
    };
  }

  const session: LocalSession = {
    user: {
      id: "local-user",
      email,
    },
  };

  window.localStorage.setItem(localSessionKey, JSON.stringify(session));

  return {
    data: { session },
    error: null,
  };
}

function createAuthNetworkError(error: unknown) {
  const message =
    error instanceof Error && error.message.toLowerCase().includes("fetch")
      ? "Não consegui conectar ao Supabase. Confira se a URL e a chave pública estão corretas."
      : error instanceof Error
        ? error.message
        : "Erro de autenticação.";

  return {
    data: { session: null, user: null },
    error: { message },
  };
}

function getLocalSession() {
  const rawSession = window.localStorage.getItem(localSessionKey);

  if (!rawSession) {
    return undefined;
  }

  try {
    return JSON.parse(rawSession) as LocalSession;
  } catch {
    window.localStorage.removeItem(localSessionKey);
    return undefined;
  }
}
