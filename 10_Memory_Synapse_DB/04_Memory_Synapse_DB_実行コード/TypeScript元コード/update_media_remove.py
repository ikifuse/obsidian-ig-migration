import re

filepath = "03_データ入出力/検証用親工程ログ.ts"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update the interface to remove `media: string[];`
content = re.sub(r'\s*media:\s*string\[\];', '', content)

# 2. Remove media arrays from dummy data
# Format looks like:
#    "media": [
#      "2026-01-30-15-00-00_IG_0001_photo_001.jpg"
#    ],
# We will use regex to remove "media": [ ... ], including trailing commas if any.
# A more robust regex:
pattern = r'\s*"media":\s*\[.*?\](?:,)?'
content = re.sub(pattern, '', content, flags=re.DOTALL)

# Cleanup any trailing commas left behind before a closing brace due to the removal
# e.g., "relatedCardIds": [...] , } -> we need to make sure JSON-like TS object is valid.
# Wait, media is usually NOT the last element. The last element is `relatedCardIds` in this file.
# Let's check the interface:
#  media: string[];
#  rawSourcePath: string;
#  relatedCardIds: string[];
# So media is followed by rawSourcePath. The comma after `media` array will be removed by `(?:,)?`.
# Let's just run it.

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)

print("Removed media from:", filepath)
