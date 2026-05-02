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
