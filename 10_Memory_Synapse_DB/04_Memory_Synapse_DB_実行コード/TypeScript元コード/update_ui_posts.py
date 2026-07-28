import re

def remove_posts_from_ui(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Remove renderTreeFolder for Posts, Reels, Stories
    content = re.sub(r'\s*html \+= renderTreeFolder\("Posts", depth \+ 1\);', '', content)
    content = re.sub(r'\s*html \+= renderTreeFolder\("Reels", depth \+ 1\);', '', content)
    content = re.sub(r'\s*html \+= renderTreeFolder\("Stories", depth \+ 1\);', '', content)

    # Note: getLogFiles returning posts, reels, stories is left intact as it might be used elsewhere
    # or we can remove the else if block that handles Posts/Reels/Stories inside renderTreeFolder.
    
    # Remove from renderTreeFolder handling:
    # } else if (name === "Posts" || name === "Reels" || name === "Stories") {
    #   const files = name === "Posts" ? logs.posts : name === "Reels" ? logs.reels : logs.stories;
    #   html += files.map((id) => renderTreeFile(id, depth + 1, "post")).join("");
    pattern_else_if = r'\}\s*else\s*if\s*\(\s*name\s*===\s*"Posts"\s*\|\|\s*name\s*===\s*"Reels"\s*\|\|\s*name\s*===\s*"Stories"\s*\)\s*\{[\s\S]*?\}\s*else\s*if\s*\('
    content = re.sub(pattern_else_if, '} else if (', content)

    # Remove Posts, Reels, Stories from expandedFolders Set
    content = re.sub(r'"Posts",\s*"Reels",\s*"Stories",\s*', '', content)

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    
    print("Cleaned UI file (Posts):", filepath)

remove_posts_from_ui("/Users/yoshidakouichi/Desktop/obsidian-ig-migration/10_Memory_Synapse_DB/04_Memory_Synapse_DB_実行コード/TypeScript元コード/04_画面/共有UI.ts")
remove_posts_from_ui("/Users/yoshidakouichi/Desktop/obsidian-ig-migration/10_Memory_Synapse_DB/04_Memory_Synapse_DB_実行コード/TypeScript元コード/04_画面/ブラウザー画面.ts")
