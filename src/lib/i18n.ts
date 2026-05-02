"use client";

import { useEffect, useState } from "react";

export type Locale = "pt" | "es" | "en";

const localeKey = "meu-album-copa:locale";
const localeEventName = "meu-album-copa:locale-change";
const localeCookieName = "meu_album_copa_locale";

export const localeLabels: Record<Locale, string> = {
  pt: "Português",
  es: "Español",
  en: "English",
};

export const messages = {
  pt: {
    appName: "Meu Álbum Copa",
    independent: "App independente, não afiliado à Panini ou FIFA.",
    loginTitle: "Entre para começar seu álbum",
    loginSubtitle:
      "Seu álbum físico fica salvo na sua conta. Escolha a versão correta depois do login.",
    email: "Email",
    password: "Senha",
    signIn: "Entrar",
    signUp: "Criar conta",
    signOut: "Sair",
    continue: "Continuar",
    authConfig:
      "Modo local de teste ativo. Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY para ativar login real.",
    authNetworkError:
      "Não consegui conectar ao Supabase. Confira a URL do projeto, reinicie o servidor local e teste sua conexão.",
    emailConfirmationRequired:
      "Conta criada, mas o Supabase exige confirmação por email antes do login.",
    emailNotConfirmed:
      "Email ainda não confirmado. Para testar agora, desative Confirm email no Supabase ou crie um usuário confirmado no painel.",
    authRateLimit:
      "Limite de envio de email do Supabase atingido. Para testes, desative Confirm email ou configure SMTP próprio.",
    authSuccess: "Login realizado. Você já pode escolher seu álbum.",
    signUpSuccess: "Conta criada. Você já pode escolher seu álbum.",
    albumSetup: "Qual versão física você tem?",
    albumSetupSubtitle:
      "Escolha olhando o país, idioma, capa e o pacote ilustrativo. Brasil e Bolívia já aparecem como mercados principais.",
    chooseEdition: "Escolha sua versão",
    nickname: "Apelido do álbum",
    startTracking: "Começar meu controle",
    accountRequired: "Faça login para criar um álbum.",
    physicalPanini: "Físico Panini",
    myAlbums: "Meus álbuns",
    dashboard: "Dashboard",
    uniqueProgress: "Progresso único",
    officialTotal: "Total oficial",
    inChecklist: "No checklist",
    owned: "Tenho",
    missing: "Faltantes",
    missingShort: "Faltam",
    duplicates: "Repetidas",
    collectedSpecials: "Especiais coletadas",
    sectionProgress: "Progresso por seção",
    digitalAlbum: "Álbum digital",
    albumPageHint: "Troque de página e toque no espaço da figurinha para marcar.",
    previousPages: "Páginas anteriores",
    nextPages: "Próximas páginas",
    emptyPage: "Página sem figurinhas neste checklist.",
    stickerSlot: "Espaço da figurinha",
    stickerList: "Lista geral",
    quickAdd: "Marcação rápida",
    stickers: "Figurinhas",
    quickAddNav: "Adição rápida",
    digitalHint: "Clique em uma figurinha para somar +1.",
    pageShort: "Pág.",
    officialNumberShort: "Nº",
    searchAndAdjust: "Busque e ajuste quantidades sem sair da lista.",
    searchPlaceholder: "Buscar número, código, nome, seleção...",
    section: "Seção",
    allSections: "Todas as seções",
    status: "Status",
    all: "Todas",
    type: "Tipo",
    allTypes: "Todos os tipos",
    normal: "Normal",
    special: "Especial",
    goldenBaller: "Golden Baller",
    ownedBadge: "tenho",
    missingBadge: "falta",
    duplicateBadge: "repetida(s)",
    quickAddHint: "Digite o número oficial ou código e marque com velocidade.",
    quickAddPlaceholder: "Ex.: 12, ARG03, BRA10...",
    noStickerFound: "Nenhuma figurinha encontrada.",
    lastAdded: "Últimas adicionadas",
    nothingMarkedSession: "Nada marcado nesta sessão ainda.",
    quantityShort: "qtd.",
    missingDescription: "Figurinhas com quantidade 0, agrupadas por seção.",
    duplicatesDescription: "Figurinhas com quantidade maior que 1 para troca.",
    copyMissing: "Copiar faltantes",
    copyTrade: "Copiar troca",
    noMissing: "Nenhuma faltante no checklist carregado.",
    noDuplicates: "Nenhuma repetida cadastrada ainda.",
    forTrade: "para troca",
    product: "Produto",
    checklist: "Checklist",
    pages: "Páginas",
    localControl: "Controle da conta",
    albumsSubtitle: "Álbuns físicos cadastrados para este usuário.",
    newAlbum: "Novo álbum",
    noAlbumsYet: "Nenhum álbum criado ainda. Comece escolhendo uma edição física Panini.",
    addPhysicalAlbum: "Adicionar álbum físico",
    complete: "completo",
    open: "Abrir",
    authentication: "Autenticação",
    authGenericError: "Erro de autenticação.",
    localMigrationTitle: "Migrar localStorage",
    localMigrationDescription:
      "Encontrado localmente: {albums} álbum(ns) e {stickers} marcação(ões). A migração cria novos álbuns no Supabase e não apaga o localStorage.",
    localMigrationButton: "Migrar para Supabase",
    migrationRunning: "Migrando dados locais...",
    migrationComplete:
      "Migração concluída: {migratedAlbums}/{sourceAlbums} álbuns e {migratedStickers}/{sourceStickers} figurinhas.",
    migrationError: "Erro ao migrar.",
    loadingAlbum: "Carregando álbum",
    albumNotFound: "Álbum não encontrado",
    createOrChooseAlbum: "Crie ou escolha um álbum físico",
    albumNotFoundSubtitle:
      "Os álbuns desta versão ficam salvos na sua conta quando o Supabase está configurado.",
    decreaseQuantity: "Diminuir quantidade",
    increaseQuantity: "Aumentar quantidade",
    copiedMissing: "Lista de faltantes copiada.",
    copiedTrade: "Lista de troca copiada.",
    copyFailed: "Não consegui copiar a lista.",
  },
  es: {
    appName: "Mi Álbum Copa",
    independent: "App independiente, no afiliada a Panini o FIFA.",
    loginTitle: "Entra para empezar tu álbum",
    loginSubtitle:
      "Tu álbum físico queda guardado en tu cuenta. Elige la versión correcta después de iniciar sesión.",
    email: "Email",
    password: "Contraseña",
    signIn: "Entrar",
    signUp: "Crear cuenta",
    signOut: "Salir",
    continue: "Continuar",
    authConfig:
      "Modo local de prueba activo. Configura NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY para activar login real.",
    authNetworkError:
      "No pude conectar con Supabase. Revisa la URL del proyecto, reinicia el servidor local y prueba tu conexión.",
    emailConfirmationRequired:
      "Cuenta creada, pero Supabase exige confirmación por email antes del login.",
    emailNotConfirmed:
      "Email todavía no confirmado. Para probar ahora, desactiva Confirm email en Supabase o crea un usuario confirmado en el panel.",
    authRateLimit:
      "Límite de envío de emails de Supabase alcanzado. Para pruebas, desactiva Confirm email o configura SMTP propio.",
    authSuccess: "Login realizado. Ya puedes elegir tu álbum.",
    signUpSuccess: "Cuenta creada. Ya puedes elegir tu álbum.",
    albumSetup: "¿Qué versión física tienes?",
    albumSetupSubtitle:
      "Elige mirando país, idioma, tapa y el sobre ilustrativo. Brasil y Bolivia ya aparecen como mercados principales.",
    chooseEdition: "Elige tu versión",
    nickname: "Nombre del álbum",
    startTracking: "Empezar mi control",
    accountRequired: "Inicia sesión para crear un álbum.",
    physicalPanini: "Físico Panini",
    myAlbums: "Mis álbumes",
    dashboard: "Panel",
    uniqueProgress: "Progreso único",
    officialTotal: "Total oficial",
    inChecklist: "En el checklist",
    owned: "Tengo",
    missing: "Faltantes",
    missingShort: "Faltan",
    duplicates: "Repetidas",
    collectedSpecials: "Especiales coleccionadas",
    sectionProgress: "Progreso por sección",
    digitalAlbum: "Álbum digital",
    albumPageHint: "Cambia de página y toca el espacio de la figurita para marcar.",
    previousPages: "Páginas anteriores",
    nextPages: "Próximas páginas",
    emptyPage: "Página sin figuritas en este checklist.",
    stickerSlot: "Espacio de la figurita",
    stickerList: "Lista general",
    quickAdd: "Marcación rápida",
    stickers: "Figuritas",
    quickAddNav: "Marcación rápida",
    digitalHint: "Haz clic en una figurita para sumar +1.",
    pageShort: "Pág.",
    officialNumberShort: "N.º",
    searchAndAdjust: "Busca y ajusta cantidades sin salir de la lista.",
    searchPlaceholder: "Buscar número, código, nombre, selección...",
    section: "Sección",
    allSections: "Todas las secciones",
    status: "Estado",
    all: "Todas",
    type: "Tipo",
    allTypes: "Todos los tipos",
    normal: "Normal",
    special: "Especial",
    goldenBaller: "Golden Baller",
    ownedBadge: "tengo",
    missingBadge: "falta",
    duplicateBadge: "repetida(s)",
    quickAddHint: "Digita el número oficial o código y marca rápido.",
    quickAddPlaceholder: "Ej.: 12, ARG03, BRA10...",
    noStickerFound: "No se encontró ninguna figurita.",
    lastAdded: "Últimas agregadas",
    nothingMarkedSession: "Nada marcado en esta sesión todavía.",
    quantityShort: "cant.",
    missingDescription: "Figuritas con cantidad 0, agrupadas por sección.",
    duplicatesDescription: "Figuritas con cantidad mayor que 1 para intercambio.",
    copyMissing: "Copiar faltantes",
    copyTrade: "Copiar intercambio",
    noMissing: "Ninguna faltante en el checklist cargado.",
    noDuplicates: "Todavía no hay repetidas cargadas.",
    forTrade: "para intercambio",
    product: "Producto",
    checklist: "Checklist",
    pages: "Páginas",
    localControl: "Control de la cuenta",
    albumsSubtitle: "Álbumes físicos registrados para este usuario.",
    newAlbum: "Nuevo álbum",
    noAlbumsYet: "Todavía no hay álbumes creados. Empieza eligiendo una edición física Panini.",
    addPhysicalAlbum: "Agregar álbum físico",
    complete: "completo",
    open: "Abrir",
    authentication: "Autenticación",
    authGenericError: "Error de autenticación.",
    localMigrationTitle: "Migrar localStorage",
    localMigrationDescription:
      "Encontrado localmente: {albums} álbum(es) y {stickers} marca(s). La migración crea nuevos álbumes en Supabase y no borra el localStorage.",
    localMigrationButton: "Migrar a Supabase",
    migrationRunning: "Migrando datos locales...",
    migrationComplete:
      "Migración completada: {migratedAlbums}/{sourceAlbums} álbumes y {migratedStickers}/{sourceStickers} figuritas.",
    migrationError: "Error al migrar.",
    loadingAlbum: "Cargando álbum",
    albumNotFound: "Álbum no encontrado",
    createOrChooseAlbum: "Crea o elige un álbum físico",
    albumNotFoundSubtitle:
      "Los álbumes de esta versión quedan guardados en tu cuenta cuando Supabase está configurado.",
    decreaseQuantity: "Disminuir cantidad",
    increaseQuantity: "Aumentar cantidad",
    copiedMissing: "Lista de faltantes copiada.",
    copiedTrade: "Lista de intercambio copiada.",
    copyFailed: "No pude copiar la lista.",
  },
  en: {
    appName: "My World Cup Album",
    independent: "Independent app, not affiliated with Panini or FIFA.",
    loginTitle: "Sign in to start your album",
    loginSubtitle:
      "Your physical album is saved to your account. Pick the right edition after signing in.",
    email: "Email",
    password: "Password",
    signIn: "Sign in",
    signUp: "Create account",
    signOut: "Sign out",
    continue: "Continue",
    authConfig:
      "Local test mode is active. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to enable real login.",
    authNetworkError:
      "Could not connect to Supabase. Check the project URL, restart the local server, and test your connection.",
    emailConfirmationRequired:
      "Account created, but Supabase requires email confirmation before signing in.",
    emailNotConfirmed:
      "Email is not confirmed yet. For testing now, disable Confirm email in Supabase or create a confirmed user in the dashboard.",
    authRateLimit:
      "Supabase email rate limit reached. For testing, disable Confirm email or configure custom SMTP.",
    authSuccess: "Signed in. You can now choose your album.",
    signUpSuccess: "Account created. You can now choose your album.",
    albumSetup: "Which physical edition do you have?",
    albumSetupSubtitle:
      "Choose by country, language, cover and the illustrated packet. Brazil and Bolivia are primary markets now.",
    chooseEdition: "Choose your edition",
    nickname: "Album nickname",
    startTracking: "Start tracking",
    accountRequired: "Sign in to create an album.",
    physicalPanini: "Physical Panini",
    myAlbums: "My albums",
    dashboard: "Dashboard",
    uniqueProgress: "Unique progress",
    officialTotal: "Official total",
    inChecklist: "In checklist",
    owned: "Owned",
    missing: "Missing",
    missingShort: "Missing",
    duplicates: "Duplicates",
    collectedSpecials: "Specials collected",
    sectionProgress: "Section progress",
    digitalAlbum: "Digital album",
    albumPageHint: "Flip pages and tap the sticker slot to mark it.",
    previousPages: "Previous pages",
    nextPages: "Next pages",
    emptyPage: "Page without stickers in this checklist.",
    stickerSlot: "Sticker slot",
    stickerList: "Sticker list",
    quickAdd: "Quick add",
    stickers: "Stickers",
    quickAddNav: "Quick add",
    digitalHint: "Click a sticker to add +1.",
    pageShort: "Page",
    officialNumberShort: "No.",
    searchAndAdjust: "Search and adjust quantities without leaving the list.",
    searchPlaceholder: "Search number, code, name, team...",
    section: "Section",
    allSections: "All sections",
    status: "Status",
    all: "All",
    type: "Type",
    allTypes: "All types",
    normal: "Normal",
    special: "Special",
    goldenBaller: "Golden Baller",
    ownedBadge: "owned",
    missingBadge: "missing",
    duplicateBadge: "duplicate(s)",
    quickAddHint: "Type the official number or code and mark it quickly.",
    quickAddPlaceholder: "Ex.: 12, ARG03, BRA10...",
    noStickerFound: "No sticker found.",
    lastAdded: "Last added",
    nothingMarkedSession: "Nothing marked in this session yet.",
    quantityShort: "qty.",
    missingDescription: "Stickers with quantity 0, grouped by section.",
    duplicatesDescription: "Stickers with quantity greater than 1 for trading.",
    copyMissing: "Copy missing",
    copyTrade: "Copy trade list",
    noMissing: "No missing stickers in the loaded checklist.",
    noDuplicates: "No duplicates added yet.",
    forTrade: "for trade",
    product: "Product",
    checklist: "Checklist",
    pages: "Pages",
    localControl: "Account control",
    albumsSubtitle: "Physical albums registered for this user.",
    newAlbum: "New album",
    noAlbumsYet: "No album created yet. Start by choosing a physical Panini edition.",
    addPhysicalAlbum: "Add physical album",
    complete: "complete",
    open: "Open",
    authentication: "Authentication",
    authGenericError: "Authentication error.",
    localMigrationTitle: "Migrate localStorage",
    localMigrationDescription:
      "Found locally: {albums} album(s) and {stickers} sticker mark(s). Migration creates new albums in Supabase and does not delete localStorage.",
    localMigrationButton: "Migrate to Supabase",
    migrationRunning: "Migrating local data...",
    migrationComplete:
      "Migration complete: {migratedAlbums}/{sourceAlbums} albums and {migratedStickers}/{sourceStickers} stickers.",
    migrationError: "Migration error.",
    loadingAlbum: "Loading album",
    albumNotFound: "Album not found",
    createOrChooseAlbum: "Create or choose a physical album",
    albumNotFoundSubtitle:
      "Albums in this version are saved to your account when Supabase is configured.",
    decreaseQuantity: "Decrease quantity",
    increaseQuantity: "Increase quantity",
    copiedMissing: "Missing list copied.",
    copiedTrade: "Trade list copied.",
    copyFailed: "Could not copy the list.",
  },
} satisfies Record<Locale, Record<string, string>>;

export function useLocale() {
  const [locale, setLocaleState] = useState<Locale>("pt");

  useEffect(() => {
    const updateLocale = () => setLocaleState(getLocale());

    updateLocale();
    window.addEventListener(localeEventName, updateLocale);
    window.addEventListener("storage", updateLocale);

    return () => {
      window.removeEventListener(localeEventName, updateLocale);
      window.removeEventListener("storage", updateLocale);
    };
  }, []);

  function setLocale(nextLocale: Locale) {
    window.localStorage.setItem(localeKey, nextLocale);
    document.cookie = `${localeCookieName}=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
    setLocaleState(nextLocale);
    window.dispatchEvent(new Event(localeEventName));
  }

  return {
    locale,
    setLocale,
    t: messages[locale],
  };
}

function getLocale(): Locale {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return "pt";
  }

  const savedLocale = window.localStorage.getItem(localeKey) as Locale | null;
  if (savedLocale && savedLocale in messages) {
    return savedLocale;
  }

  const cookieLocale = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(`${localeCookieName}=`))
    ?.split("=")[1] as Locale | undefined;

  return cookieLocale && cookieLocale in messages ? cookieLocale : "pt";
}
