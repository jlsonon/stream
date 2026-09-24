const fs = require('fs');
const metadata = require('./tmdb_cached_metadata.json');

const catalogPath = 'src/lib/catalog-data.ts';
let content = fs.readFileSync(catalogPath, 'utf8');

let updateCount = 0;
for (const [id, meta] of Object.entries(metadata)) {
  const idStr = `id: '${id}'`;
  const idIndex = content.indexOf(idStr);
  if (idIndex === -1) {
    console.error(`ID not found: ${id}`);
    continue;
  }

  const chunk = content.slice(idIndex, idIndex + 2500);
  const posterRegex = /posterUrl:\s*'[^']+',/;
  const backdropRegex = /backdropUrl:\s*'[^']+',/;

  if (posterRegex.test(chunk) && backdropRegex.test(chunk)) {
    // Replace posterUrl first
    let updatedChunk = chunk.replace(posterRegex, `posterUrl: '${meta.posterUrl}',`);
    // Then replace backdropUrl with backdropUrl + tmdbId + trailerUrl
    updatedChunk = updatedChunk.replace(backdropRegex, `backdropUrl: '${meta.backdropUrl}',\n    tmdbId: ${meta.tmdbId},${meta.trailerUrl ? `\n    trailerUrl: '${meta.trailerUrl}',` : ''}`);
    
    // Also update score if present
    const scoreRegex = /score:\s*[0-9.]+,/;
    if (scoreRegex.test(updatedChunk)) {
      updatedChunk = updatedChunk.replace(scoreRegex, `score: ${meta.score},`);
    }

    content = content.slice(0, idIndex) + updatedChunk + content.slice(idIndex + 2500);
    updateCount++;
  } else {
    console.error(`Poster or backdrop regex failed for ${id}`);
  }
}

// Replace episode unsplash thumbnails with the show's backdrop
content = content.replace(/thumbnailUrl:\s*'https:\/\/images\.unsplash\.com\/[^']+'/g, (match, offset) => {
  const prevText = content.slice(Math.max(0, offset - 6000), offset);
  const showMatch = prevText.match(/id:\s*'([a-z0-9-]+)'/g);
  if (showMatch && showMatch.length > 0) {
    for (let i = showMatch.length - 1; i >= 0; i--) {
      const candidateId = showMatch[i].match(/id:\s*'([^']+)'/)[1];
      if (metadata[candidateId] && metadata[candidateId].backdropUrl) {
        return `thumbnailUrl: '${metadata[candidateId].backdropUrl}'`;
      }
    }
  }
  return match;
});

fs.writeFileSync(catalogPath, content, 'utf8');
console.log(`Successfully updated ${updateCount} titles in ${catalogPath}`);
