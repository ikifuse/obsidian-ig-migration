import re

def remove_media_from_ui(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # The block looks like:
    #   const media = log.media
    #     ? log.media
    #         .map(...)
    #         .join("")
    #     : "";
    pattern_media_var = r'const\s+media\s*=\s*log\.media[\s\S]*?\s*:\s*"";'
    content = re.sub(pattern_media_var, '', content)

    # And the template part:
    # <div class="log-media">
    #   ${media}
    # </div>
    pattern_media_div = r'<div class="log-media">\s*\$\{media\}\s*</div>'
    content = re.sub(pattern_media_div, '', content)

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    
    print("Cleaned UI file:", filepath)

remove_media_from_ui("/Users/yoshidakouichi/Desktop/obsidian-ig-migration/10_Memory_Synapse_DB/04_Memory_Synapse_DB_実行コード/TypeScript元コード/04_画面/共有UI.ts")
remove_media_from_ui("/Users/yoshidakouichi/Desktop/obsidian-ig-migration/10_Memory_Synapse_DB/04_Memory_Synapse_DB_実行コード/TypeScript元コード/04_画面/ブラウザー画面.ts")
