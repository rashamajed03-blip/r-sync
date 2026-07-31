import { PrismaClient } from "@prisma/client";
import { MOCK_TRACKS } from "../src/lib/mock-data";

const prisma = new PrismaClient();

async function main() {
  console.log(`Seeding ${MOCK_TRACKS.length} tracks...`);

  for (const t of MOCK_TRACKS) {
    await prisma.track.upsert({
      where: { id: t.id },
      update: {},
      create: {
        id: t.id,
        title: t.title,
        artist: t.artist,
        label: t.label,
        genre: t.genre,
        subgenre: t.subgenre,
        releaseYear: t.releaseYear,
        durationSec: t.durationSec,
        bpm: t.bpm,
        camelotKey: t.camelotKey,
        musicalKey: t.musicalKey,
        energy: t.energy,
        danceability: t.danceability,
        popularity: t.popularity,
        mood: t.mood,
        vocal: t.vocal,
        explicit: t.explicit,
        artworkColor1: t.artworkColors[0],
        artworkColor2: t.artworkColors[1],
      },
    });
  }

  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
