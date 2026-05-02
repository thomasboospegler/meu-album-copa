insert into public.collections (
  id,
  name,
  publisher,
  competition,
  year,
  total_stickers,
  total_pages,
  source_url
) values (
  'fifa-world-cup-2026',
  'FIFA World Cup 2026',
  'Panini',
  'FIFA World Cup',
  2026,
  980,
  112,
  'https://www.panini.com/'
) on conflict (id) do update set
  name = excluded.name,
  publisher = excluded.publisher,
  competition = excluded.competition,
  year = excluded.year,
  total_stickers = excluded.total_stickers,
  total_pages = excluded.total_pages,
  source_url = excluded.source_url;

insert into public.checklist_variants (
  id,
  collection_id,
  name,
  country,
  language,
  total_stickers,
  source_url
) values
  (
    'fwc-2026-cl-es-sample',
    'fifa-world-cup-2026',
    'Chile ES - Checklist inicial',
    'Chile',
    'es-CL',
    980,
    'https://www.panini.com/'
  ),
  (
    'fwc-2026-intl-sample',
    'fifa-world-cup-2026',
    'Internacional - Checklist inicial',
    'Internacional',
    'en',
    980,
    'https://www.panini.com/'
  ),
  (
    'fwc-2026-bo-es-sample',
    'fifa-world-cup-2026',
    'Bolívia ES - Checklist inicial',
    'Bolívia',
    'es-BO',
    980,
    'https://www.panini.com/'
  ),
  (
    'fwc-2026-br-pt-sample',
    'fifa-world-cup-2026',
    'Brasil PT - Checklist inicial',
    'Brasil',
    'pt-BR',
    980,
    'https://www.panini.com/'
  )
on conflict (id) do update set
  name = excluded.name,
  country = excluded.country,
  language = excluded.language,
  total_stickers = excluded.total_stickers,
  source_url = excluded.source_url;

insert into public.album_editions (
  id,
  collection_id,
  checklist_variant_id,
  country,
  language,
  edition_name,
  cover_type,
  cover_variant,
  product_name,
  product_url
) values
  (
    'bolivia-tapa-blanda',
    'fifa-world-cup-2026',
    'fwc-2026-bo-es-sample',
    'Bolívia',
    'es-BO',
    'Bolívia - Álbum Tapa Blanda',
    'Tapa Blanda',
    'Standard',
    'FIFA World Cup 2026 - Álbum Bolivia',
    'https://www.panini.com/'
  ),
  (
    'bolivia-tapa-dura',
    'fifa-world-cup-2026',
    'fwc-2026-bo-es-sample',
    'Bolívia',
    'es-BO',
    'Bolívia - Álbum Tapa Dura',
    'Tapa Dura',
    'Coleccionista',
    'FIFA World Cup 2026 - Álbum Bolivia Tapa Dura',
    'https://www.panini.com/'
  ),
  (
    'brasil-capa-brochura',
    'fifa-world-cup-2026',
    'fwc-2026-br-pt-sample',
    'Brasil',
    'pt-BR',
    'Brasil - Álbum Capa Brochura',
    'Capa Brochura',
    'Standard',
    'FIFA World Cup 2026 - Álbum Brasil',
    'https://www.panini.com/'
  ),
  (
    'brasil-capa-dura',
    'fifa-world-cup-2026',
    'fwc-2026-br-pt-sample',
    'Brasil',
    'pt-BR',
    'Brasil - Álbum Capa Dura',
    'Capa Dura',
    'Colecionador',
    'FIFA World Cup 2026 - Álbum Brasil Capa Dura',
    'https://www.panini.com/'
  ),
  (
    'chile-tapa-blanda',
    'fifa-world-cup-2026',
    'fwc-2026-cl-es-sample',
    'Chile',
    'es-CL',
    'Chile - Álbum Tapa Blanda',
    'Tapa Blanda',
    'Standard',
    'FIFA World Cup 2026 - Álbum Tapa Blanda',
    'https://www.panini.com/'
  ),
  (
    'chile-tapa-dura-gold',
    'fifa-world-cup-2026',
    'fwc-2026-cl-es-sample',
    'Chile',
    'es-CL',
    'Chile - Álbum Tapa Dura Gold',
    'Tapa Dura',
    'Gold',
    'FIFA World Cup 2026 - Álbum Tapa Dura Gold',
    'https://www.panini.com/'
  ),
  (
    'chile-tapa-dura-silver',
    'fifa-world-cup-2026',
    'fwc-2026-cl-es-sample',
    'Chile',
    'es-CL',
    'Chile - Álbum Tapa Dura Silver',
    'Tapa Dura',
    'Silver',
    'FIFA World Cup 2026 - Álbum Tapa Dura Silver',
    'https://www.panini.com/'
  ),
  (
    'chile-tapa-dura-color',
    'fifa-world-cup-2026',
    'fwc-2026-cl-es-sample',
    'Chile',
    'es-CL',
    'Chile - Álbum Tapa Dura Color',
    'Tapa Dura',
    'Color',
    'FIFA World Cup 2026 - Álbum Tapa Dura Color',
    'https://www.panini.com/'
  ),
  (
    'international-softcover-preview',
    'fifa-world-cup-2026',
    'fwc-2026-intl-sample',
    'Internacional',
    'en',
    'Internacional - Softcover Preview',
    'Softcover',
    'Standard',
    'FIFA World Cup 2026 - International Softcover Preview',
    'https://www.panini.com/'
  )
on conflict (id) do update set
  checklist_variant_id = excluded.checklist_variant_id,
  country = excluded.country,
  language = excluded.language,
  edition_name = excluded.edition_name,
  cover_type = excluded.cover_type,
  cover_variant = excluded.cover_variant,
  product_name = excluded.product_name,
  product_url = excluded.product_url;

-- Checklist temporario de desenvolvimento.
-- Substituir pelo checklist oficial importado pela rota /admin/import-checklist
-- assim que a numeracao publica/fornecida pela Panini estiver validada.
with variants(checklist_variant_id) as (
  values
    ('fwc-2026-bo-es-sample'),
    ('fwc-2026-br-pt-sample'),
    ('fwc-2026-cl-es-sample'),
    ('fwc-2026-intl-sample')
),
section_seed(name, code, section_type, sort_order, page_start, page_end) as (
  values
    ('Golden Ballers', 'GB', 'special', 1, 4, 7),
    ('Argentina', 'ARG', 'team', 2, 12, 15),
    ('Brazil', 'BRA', 'team', 3, 20, 23),
    ('France', 'FRA', 'team', 4, 28, 31),
    ('Germany', 'GER', 'team', 5, 36, 39),
    ('Japan', 'JPN', 'team', 6, 44, 47),
    ('Mexico', 'MEX', 'team', 7, 52, 55)
)
insert into public.checklist_sections (
  id,
  checklist_variant_id,
  name,
  code,
  section_type,
  sort_order,
  page_start,
  page_end
)
select
  variants.checklist_variant_id || '-' || lower(section_seed.code),
  variants.checklist_variant_id,
  section_seed.name,
  section_seed.code,
  section_seed.section_type,
  section_seed.sort_order,
  section_seed.page_start,
  section_seed.page_end
from variants
cross join section_seed
on conflict (id) do update set
  name = excluded.name,
  code = excluded.code,
  section_type = excluded.section_type,
  sort_order = excluded.sort_order,
  page_start = excluded.page_start,
  page_end = excluded.page_end;

with variants(checklist_variant_id) as (
  values
    ('fwc-2026-bo-es-sample'),
    ('fwc-2026-br-pt-sample'),
    ('fwc-2026-cl-es-sample'),
    ('fwc-2026-intl-sample')
),
sticker_seed(section_code, official_number, display_code, name, country_code, team_name, sticker_type, rarity_type, role, page_number, sort_order) as (
  values
    ('GB', 1, 'GB01', 'Golden Baller 01', null, null, 'golden-baller', 'rare', 'Especial', 4, 1),
    ('GB', 2, 'GB02', 'Golden Baller 02', null, null, 'golden-baller', 'rare', 'Especial', 4, 2),
    ('GB', 3, 'GB03', 'Golden Baller 03', null, null, 'golden-baller', 'rare', 'Especial', 4, 3),
    ('GB', 4, 'GB04', 'Golden Baller 04', null, null, 'golden-baller', 'rare', 'Especial', 5, 4),
    ('GB', 5, 'GB05', 'Golden Baller 05', null, null, 'golden-baller', 'rare', 'Especial', 5, 5),
    ('GB', 6, 'GB06', 'Golden Baller 06', null, null, 'golden-baller', 'rare', 'Especial', 5, 6),
    ('GB', 7, 'GB07', 'Golden Baller 07', null, null, 'golden-baller', 'rare', 'Especial', 6, 7),
    ('GB', 8, 'GB08', 'Golden Baller 08', null, null, 'golden-baller', 'rare', 'Especial', 6, 8),
    ('GB', 9, 'GB09', 'Golden Baller 09', null, null, 'golden-baller', 'rare', 'Especial', 6, 9),
    ('GB', 10, 'GB10', 'Golden Baller 10', null, null, 'golden-baller', 'rare', 'Especial', 7, 10),
    ('ARG', 11, 'ARG01', 'Escudo Argentina', 'ARG', 'Argentina', 'special', 'foil', 'Escudo', 12, 11),
    ('ARG', 12, 'ARG02', 'Foto de equipe Argentina', 'ARG', 'Argentina', 'special', 'foil', 'Equipe', 12, 12),
    ('ARG', 13, 'ARG03', 'Goleiro Argentina', 'ARG', 'Argentina', 'normal', 'base', 'Goleiro', 12, 13),
    ('ARG', 14, 'ARG04', 'Defensor Argentina', 'ARG', 'Argentina', 'normal', 'base', 'Defensor', 13, 14),
    ('ARG', 15, 'ARG05', 'Lateral Argentina', 'ARG', 'Argentina', 'normal', 'base', 'Defensor', 13, 15),
    ('ARG', 16, 'ARG06', 'Volante Argentina', 'ARG', 'Argentina', 'normal', 'base', 'Meio-campo', 13, 16),
    ('ARG', 17, 'ARG07', 'Meio-campista Argentina', 'ARG', 'Argentina', 'normal', 'base', 'Meio-campo', 14, 17),
    ('ARG', 18, 'ARG08', 'Atacante Argentina', 'ARG', 'Argentina', 'normal', 'base', 'Atacante', 14, 18),
    ('ARG', 19, 'ARG09', 'Craque Argentina', 'ARG', 'Argentina', 'normal', 'base', 'Atacante', 14, 19),
    ('ARG', 20, 'ARG10', 'Torcida Argentina', 'ARG', 'Argentina', 'normal', 'base', 'Torcida', 15, 20),
    ('BRA', 21, 'BRA01', 'Escudo Brazil', 'BRA', 'Brazil', 'special', 'foil', 'Escudo', 20, 21),
    ('BRA', 22, 'BRA02', 'Foto de equipe Brazil', 'BRA', 'Brazil', 'special', 'foil', 'Equipe', 20, 22),
    ('BRA', 23, 'BRA03', 'Goleiro Brazil', 'BRA', 'Brazil', 'normal', 'base', 'Goleiro', 20, 23),
    ('BRA', 24, 'BRA04', 'Defensor Brazil', 'BRA', 'Brazil', 'normal', 'base', 'Defensor', 21, 24),
    ('BRA', 25, 'BRA05', 'Lateral Brazil', 'BRA', 'Brazil', 'normal', 'base', 'Defensor', 21, 25),
    ('BRA', 26, 'BRA06', 'Volante Brazil', 'BRA', 'Brazil', 'normal', 'base', 'Meio-campo', 21, 26),
    ('BRA', 27, 'BRA07', 'Meio-campista Brazil', 'BRA', 'Brazil', 'normal', 'base', 'Meio-campo', 22, 27),
    ('BRA', 28, 'BRA08', 'Atacante Brazil', 'BRA', 'Brazil', 'normal', 'base', 'Atacante', 22, 28),
    ('BRA', 29, 'BRA09', 'Craque Brazil', 'BRA', 'Brazil', 'normal', 'base', 'Atacante', 22, 29),
    ('BRA', 30, 'BRA10', 'Torcida Brazil', 'BRA', 'Brazil', 'normal', 'base', 'Torcida', 23, 30),
    ('FRA', 31, 'FRA01', 'Escudo France', 'FRA', 'France', 'special', 'foil', 'Escudo', 28, 31),
    ('FRA', 32, 'FRA02', 'Foto de equipe France', 'FRA', 'France', 'special', 'foil', 'Equipe', 28, 32),
    ('FRA', 33, 'FRA03', 'Goleiro France', 'FRA', 'France', 'normal', 'base', 'Goleiro', 28, 33),
    ('FRA', 34, 'FRA04', 'Defensor France', 'FRA', 'France', 'normal', 'base', 'Defensor', 29, 34),
    ('FRA', 35, 'FRA05', 'Lateral France', 'FRA', 'France', 'normal', 'base', 'Defensor', 29, 35),
    ('FRA', 36, 'FRA06', 'Volante France', 'FRA', 'France', 'normal', 'base', 'Meio-campo', 29, 36),
    ('FRA', 37, 'FRA07', 'Meio-campista France', 'FRA', 'France', 'normal', 'base', 'Meio-campo', 30, 37),
    ('FRA', 38, 'FRA08', 'Atacante France', 'FRA', 'France', 'normal', 'base', 'Atacante', 30, 38),
    ('FRA', 39, 'FRA09', 'Craque France', 'FRA', 'France', 'normal', 'base', 'Atacante', 30, 39),
    ('FRA', 40, 'FRA10', 'Torcida France', 'FRA', 'France', 'normal', 'base', 'Torcida', 31, 40),
    ('GER', 41, 'GER01', 'Escudo Germany', 'GER', 'Germany', 'special', 'foil', 'Escudo', 36, 41),
    ('GER', 42, 'GER02', 'Foto de equipe Germany', 'GER', 'Germany', 'special', 'foil', 'Equipe', 36, 42),
    ('GER', 43, 'GER03', 'Goleiro Germany', 'GER', 'Germany', 'normal', 'base', 'Goleiro', 36, 43),
    ('GER', 44, 'GER04', 'Defensor Germany', 'GER', 'Germany', 'normal', 'base', 'Defensor', 37, 44),
    ('GER', 45, 'GER05', 'Lateral Germany', 'GER', 'Germany', 'normal', 'base', 'Defensor', 37, 45),
    ('GER', 46, 'GER06', 'Volante Germany', 'GER', 'Germany', 'normal', 'base', 'Meio-campo', 37, 46),
    ('GER', 47, 'GER07', 'Meio-campista Germany', 'GER', 'Germany', 'normal', 'base', 'Meio-campo', 38, 47),
    ('GER', 48, 'GER08', 'Atacante Germany', 'GER', 'Germany', 'normal', 'base', 'Atacante', 38, 48),
    ('GER', 49, 'GER09', 'Craque Germany', 'GER', 'Germany', 'normal', 'base', 'Atacante', 38, 49),
    ('GER', 50, 'GER10', 'Torcida Germany', 'GER', 'Germany', 'normal', 'base', 'Torcida', 39, 50),
    ('JPN', 51, 'JPN01', 'Escudo Japan', 'JPN', 'Japan', 'special', 'foil', 'Escudo', 44, 51),
    ('JPN', 52, 'JPN02', 'Foto de equipe Japan', 'JPN', 'Japan', 'special', 'foil', 'Equipe', 44, 52),
    ('JPN', 53, 'JPN03', 'Goleiro Japan', 'JPN', 'Japan', 'normal', 'base', 'Goleiro', 44, 53),
    ('JPN', 54, 'JPN04', 'Defensor Japan', 'JPN', 'Japan', 'normal', 'base', 'Defensor', 45, 54),
    ('JPN', 55, 'JPN05', 'Lateral Japan', 'JPN', 'Japan', 'normal', 'base', 'Defensor', 45, 55),
    ('JPN', 56, 'JPN06', 'Volante Japan', 'JPN', 'Japan', 'normal', 'base', 'Meio-campo', 45, 56),
    ('JPN', 57, 'JPN07', 'Meio-campista Japan', 'JPN', 'Japan', 'normal', 'base', 'Meio-campo', 46, 57),
    ('JPN', 58, 'JPN08', 'Atacante Japan', 'JPN', 'Japan', 'normal', 'base', 'Atacante', 46, 58),
    ('JPN', 59, 'JPN09', 'Craque Japan', 'JPN', 'Japan', 'normal', 'base', 'Atacante', 46, 59),
    ('JPN', 60, 'JPN10', 'Torcida Japan', 'JPN', 'Japan', 'normal', 'base', 'Torcida', 47, 60),
    ('MEX', 61, 'MEX01', 'Escudo Mexico', 'MEX', 'Mexico', 'special', 'foil', 'Escudo', 52, 61),
    ('MEX', 62, 'MEX02', 'Foto de equipe Mexico', 'MEX', 'Mexico', 'special', 'foil', 'Equipe', 52, 62),
    ('MEX', 63, 'MEX03', 'Goleiro Mexico', 'MEX', 'Mexico', 'normal', 'base', 'Goleiro', 52, 63),
    ('MEX', 64, 'MEX04', 'Defensor Mexico', 'MEX', 'Mexico', 'normal', 'base', 'Defensor', 53, 64),
    ('MEX', 65, 'MEX05', 'Lateral Mexico', 'MEX', 'Mexico', 'normal', 'base', 'Defensor', 53, 65),
    ('MEX', 66, 'MEX06', 'Volante Mexico', 'MEX', 'Mexico', 'normal', 'base', 'Meio-campo', 53, 66),
    ('MEX', 67, 'MEX07', 'Meio-campista Mexico', 'MEX', 'Mexico', 'normal', 'base', 'Meio-campo', 54, 67),
    ('MEX', 68, 'MEX08', 'Atacante Mexico', 'MEX', 'Mexico', 'normal', 'base', 'Atacante', 54, 68),
    ('MEX', 69, 'MEX09', 'Craque Mexico', 'MEX', 'Mexico', 'normal', 'base', 'Atacante', 54, 69),
    ('MEX', 70, 'MEX10', 'Torcida Mexico', 'MEX', 'Mexico', 'normal', 'base', 'Torcida', 55, 70)
)
insert into public.official_stickers (
  id,
  checklist_variant_id,
  section_id,
  official_number,
  display_code,
  name,
  country_code,
  team_name,
  sticker_type,
  rarity_type,
  role,
  page_number,
  sort_order
)
select
  variants.checklist_variant_id || '-' || sticker_seed.display_code,
  variants.checklist_variant_id,
  variants.checklist_variant_id || '-' || lower(sticker_seed.section_code),
  sticker_seed.official_number,
  sticker_seed.display_code,
  sticker_seed.name,
  sticker_seed.country_code,
  sticker_seed.team_name,
  sticker_seed.sticker_type,
  sticker_seed.rarity_type,
  sticker_seed.role,
  sticker_seed.page_number,
  sticker_seed.sort_order
from variants
cross join sticker_seed
on conflict (checklist_variant_id, official_number) do update set
  section_id = excluded.section_id,
  display_code = excluded.display_code,
  name = excluded.name,
  country_code = excluded.country_code,
  team_name = excluded.team_name,
  sticker_type = excluded.sticker_type,
  rarity_type = excluded.rarity_type,
  role = excluded.role,
  page_number = excluded.page_number,
  sort_order = excluded.sort_order;

-- Validacao de desenvolvimento em 2026-05-02:
-- o album fisico visto em Bolivia tem 20 espacos por selecao. Este bloco
-- normaliza o seed sample para 10 Golden Ballers + 20 figurinhas por time.
-- Mantem ids existentes, entao user_stickers continuam apontando para as mesmas
-- figurinhas quando o seed for reexecutado.
with variants(checklist_variant_id) as (
  values
    ('fwc-2026-bo-es-sample'),
    ('fwc-2026-br-pt-sample'),
    ('fwc-2026-cl-es-sample'),
    ('fwc-2026-intl-sample')
)
update public.official_stickers
set
  official_number = official_number + 10000,
  sort_order = sort_order + 10000
where checklist_variant_id in (select checklist_variant_id from variants);

with variants(checklist_variant_id) as (
  values
    ('fwc-2026-bo-es-sample'),
    ('fwc-2026-br-pt-sample'),
    ('fwc-2026-cl-es-sample'),
    ('fwc-2026-intl-sample')
),
section_seed(name, code, section_type, sort_order, page_start, page_end) as (
  values
    ('Golden Ballers', 'GB', 'special', 1, 4, 7),
    ('Argentina', 'ARG', 'team', 2, 12, 15),
    ('Brazil', 'BRA', 'team', 3, 20, 23),
    ('France', 'FRA', 'team', 4, 28, 31),
    ('Germany', 'GER', 'team', 5, 36, 39),
    ('Japan', 'JPN', 'team', 6, 44, 47),
    ('Mexico', 'MEX', 'team', 7, 52, 55)
),
generated_stickers as (
  select
    section_seed.code as section_code,
    case
      when section_seed.code = 'GB' then slot.slot_index
      else 11 + ((section_seed.sort_order - 2) * 20) + slot.slot_index - 1
    end as official_number,
    section_seed.code || lpad(slot.slot_index::text, 2, '0') as display_code,
    case
      when section_seed.code = 'GB' then 'Golden Baller ' || lpad(slot.slot_index::text, 2, '0')
      when slot.slot_index = 1 then 'Escudo ' || section_seed.name
      when slot.slot_index = 2 then 'Foto de equipe ' || section_seed.name
      when slot.slot_index = 3 then 'Goleiro ' || section_seed.name
      when slot.slot_index in (4, 5) then 'Defensor ' || (slot.slot_index - 3)::text || ' ' || section_seed.name
      when slot.slot_index = 6 then 'Lateral direito ' || section_seed.name
      when slot.slot_index = 7 then 'Lateral esquerdo ' || section_seed.name
      when slot.slot_index in (8, 9) then 'Volante ' || (slot.slot_index - 7)::text || ' ' || section_seed.name
      when slot.slot_index between 10 and 12 then 'Meio-campista ' || (slot.slot_index - 9)::text || ' ' || section_seed.name
      when slot.slot_index = 13 then 'Ponta direita ' || section_seed.name
      when slot.slot_index = 14 then 'Ponta esquerda ' || section_seed.name
      when slot.slot_index in (15, 16) then 'Atacante ' || (slot.slot_index - 14)::text || ' ' || section_seed.name
      when slot.slot_index = 17 then 'Craque ' || section_seed.name
      when slot.slot_index = 18 then 'Lenda ' || section_seed.name
      when slot.slot_index = 19 then 'Torcida ' || section_seed.name
      else 'Estadio ' || section_seed.name
    end as name,
    case when section_seed.section_type = 'team' then section_seed.code else null end as country_code,
    case when section_seed.section_type = 'team' then section_seed.name else null end as team_name,
    case
      when section_seed.code = 'GB' then 'golden-baller'
      when slot.slot_index <= 2 then 'special'
      else 'normal'
    end as sticker_type,
    case
      when section_seed.code = 'GB' then 'rare'
      when slot.slot_index <= 2 then 'foil'
      else 'base'
    end as rarity_type,
    case
      when slot.slot_index = 1 then 'Escudo'
      when slot.slot_index = 2 then 'Equipe'
      when slot.slot_index = 19 then 'Torcida'
      when slot.slot_index = 20 then 'Estadio'
      when section_seed.code = 'GB' then 'Especial'
      else 'Jogador'
    end as role,
    section_seed.page_start +
      floor((slot.slot_index - 1)::numeric / case when section_seed.code = 'GB' then 3 else 5 end)::integer
      as page_number,
    case
      when section_seed.code = 'GB' then slot.slot_index
      else 11 + ((section_seed.sort_order - 2) * 20) + slot.slot_index - 1
    end as sort_order
  from section_seed
  cross join lateral generate_series(
    1,
    case when section_seed.code = 'GB' then 10 else 20 end
  ) as slot(slot_index)
)
insert into public.official_stickers (
  id,
  checklist_variant_id,
  section_id,
  official_number,
  display_code,
  name,
  country_code,
  team_name,
  sticker_type,
  rarity_type,
  role,
  page_number,
  sort_order
)
select
  variants.checklist_variant_id || '-' || generated_stickers.display_code,
  variants.checklist_variant_id,
  variants.checklist_variant_id || '-' || lower(generated_stickers.section_code),
  generated_stickers.official_number,
  generated_stickers.display_code,
  generated_stickers.name,
  generated_stickers.country_code,
  generated_stickers.team_name,
  generated_stickers.sticker_type,
  generated_stickers.rarity_type,
  generated_stickers.role,
  generated_stickers.page_number,
  generated_stickers.sort_order
from variants
cross join generated_stickers
on conflict (id) do update set
  official_number = excluded.official_number,
  section_id = excluded.section_id,
  display_code = excluded.display_code,
  name = excluded.name,
  country_code = excluded.country_code,
  team_name = excluded.team_name,
  sticker_type = excluded.sticker_type,
  rarity_type = excluded.rarity_type,
  role = excluded.role,
  page_number = excluded.page_number,
  sort_order = excluded.sort_order;
