const fs = require('fs');

const content = fs.readFileSync('10_Memory_Synapse_DB/05_Memory_Synapse_DB_ブラウザー確認版/app.js', 'utf8');

// Use regex to extract the cards object string
const stateMatch = content.match(/cards:(\{.*?\})\},groups:/s);
if (!stateMatch) {
    console.log("Could not parse cards from app.js");
    process.exit(1);
}

// Very hacky parse using Function
let cards;
try {
    const fn = new Function('return ' + stateMatch[1] + ';');
    cards = fn();
} catch (e) {
    console.error("Error parsing cards:", e);
    process.exit(1);
}

const posts = new Set();
const reels = new Set();
const stories = new Set();

for (const c of Object.values(cards)) {
    c.relatedPosts.forEach(link => {
        const match = link.match(/\[\[(.*?)\]\]/);
        if (match) {
            const file = match[1];
            if (file.includes("_IGP_")) posts.add(file);
            if (file.includes("_IGR_")) reels.add(file);
            if (file.includes("_IGS_")) stories.add(file);
        }
    });
}

console.log(`Found ${posts.size} Posts, ${reels.size} Reels, ${stories.size} Stories`);
if (posts.size === 0) {
    console.log("POSTS IS EMPTY!");
} else {
    console.log("Sample post:", Array.from(posts)[0]);
}
