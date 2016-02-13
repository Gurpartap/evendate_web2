
--UPLOAD FILES BEFORE IT!
CREATE TEXT SEARCH DICTIONARY ispell_ru (
template  =   ispell,
  dictfile  =   ru,
  afffile   =   ru,
  stopwords =   russian
);

CREATE TEXT SEARCH DICTIONARY ispell_en (
template  = ispell,
  dictfile  = en,
  afffile   = en,
  stopwords = english
);

CREATE TEXT SEARCH CONFIGURATION ru ( COPY = russian );


ALTER TEXT SEARCH CONFIGURATION ru
ALTER MAPPING
FOR word, hword, hword_part
WITH ispell_ru, russian_stem;

ALTER TEXT SEARCH CONFIGURATION ru
ALTER MAPPING
FOR asciiword, asciihword, hword_asciipart
WITH ispell_en, english_stem;

SET default_text_search_config = 'ru';

--
-- Чтобы не определять конфигурацию поиска каждый раз в новой сессии,
-- мы должны прописать ее в файле настроек PostgreSQL "postgresql.conf".
-- Установите переменную default_text_search_config равную имени нашей конфигурации "ru"
-- default_text_search_config = 'ru'.



SELECT * FROM ts_lexize('ispell_ru', 'полнотекстовый');