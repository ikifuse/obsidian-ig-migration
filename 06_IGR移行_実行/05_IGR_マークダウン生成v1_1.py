def generate_4layer_yaml(p_info):
    entity_layer = f'''id: "{p_info["post_id"]}"
source: instagram
type: Reels
content: "video"'''

    temporal_layer = f"""date: "{p_info['date_iso']}"
created_at: "{p_info['date_iso']}"
updated_at: "{p_info['date_iso']}"
event_at: "{p_info['date_iso']}"
duration: null
created_at_ms: {p_info['timestamp'] * 1000}
updated_at_ms: null
event_at_ms: null"""

    tags_yaml = "\n".join([f"  - \"{t}\"" for t in p_info['tags_normalized']]) if p_info['tags_normalized'] else " []"
    mentions_yaml = "\n".join([f"  - \"{m}\"" for m in p_info['mentions']]) if p_info['mentions'] else " []"
    links_yaml = "\n".join([f"  - \"{l}\"" for l in p_info['links']]) if p_info['links'] else " []"
    
    relation_layer = f"""tags:
{tags_yaml if tags_yaml.strip() != '[]' else ' []'}
mentions:
{mentions_yaml if mentions_yaml.strip() != '[]' else ' []'}
links:
{links_yaml if links_yaml.strip() != '[]' else ' []'}
group_id: null"""

    loc_raw = f'"{p_info["loc_name_raw"]}"' if p_info['loc_name_raw'] else "null"
    loc_normalized = f'"{p_info["loc_name"]}"' if p_info['loc_name'] else "null"
    geo_lat_val = p_info.get("geo_lat", "null")
    if geo_lat_val is None: geo_lat_val = "null"
    geo_lng_val = p_info.get("geo_lng", "null")
    if geo_lng_val is None: geo_lng_val = "null"
    has_gps = (geo_lat_val != "null" and geo_lng_val != "null")
    geo_confidence = "high" if (p_info['loc_name_raw'] or has_gps) else "null"
    synapse_link_val = f'"[[{p_info["loc_name"]}]]"' if p_info['loc_name'] else "null"

    location_layer = f"""location:
  raw: {loc_raw}
  normalized: {loc_normalized}
  geo:
    lat: {geo_lat_val}
    lng: {geo_lng_val}
    alt: null
  address:
    full: null
    components:
      country: null
      prefecture: null
      city: null
      district: null
      street: null
      postal_code: null
  track:
    type: none
    source_file: null
    start_time: null
    end_time: null
  confidence:
    geo: {geo_confidence}
    source: instagram
  resolution_level: point
  synapse_link: {synapse_link_val}"""

    emo_o = "\n".join([f"  - \"{e}\"" for e in p_info['emoji_original']])
    emo_n = "\n".join([f"  - \"{e}\"" for e in p_info['emoji_normalized']])

    media_count = p_info.get('media_count', 0)
    media_items = p_info.get('media_list', [])
    if media_items:
        media_yaml_items = "\n".join(
            [f"  - path: \"{m}\"" for m in media_items]
        )
        media_yaml = f"media_count: {media_count}\nmedia:\n{media_yaml_items}"
    else:
        media_yaml = f"media_count: {media_count}\nmedia: []"

    extra_props = f"""instagram_id: "{p_info['instagram_id']}"
original_filename: "{p_info.get('original_filename', '')}"
migration_version: v6.2
created_from: "Instagram export JSON"
{media_yaml}
emoji_original:
{emo_o if emo_o else ' []'}
emoji_normalized:
{emo_n if emo_n else ' []'}"""

    raw_layer = f"""raw_source_path: "[[{p_info['post_id']}.json]]"
unparsed: null"""

    yaml_text = f"""---
{entity_layer}
{temporal_layer}
{relation_layer}
{location_layer}
{extra_props}
{raw_layer}
---"""
    return yaml_text
