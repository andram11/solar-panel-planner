/*Enable the phonetic search matching with pg_trgm*/
create extension if not exists pg_trgm

/*create index on street_name from Address Listing*/
create index streetname_trgm_idx on planner."Address_listing" using gin (street_name gin_trgm_ops)