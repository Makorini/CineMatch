-- CreateTable
CREATE TABLE "Movie" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "posterLink" TEXT,                -- Poster_Link
    "title" TEXT NOT NULL,            -- Series_Title
    "year" INTEGER NOT NULL,          -- Released_Year
    "certificate" TEXT,               -- Certificate (A, U, PG-13, etc.)
    "runtime" TEXT,                   -- Runtime (ex: "142 min")
    "genres" TEXT NOT NULL,           -- Genre (ex: "Drama, Crime")
    "imdbRating" REAL,                -- IMDB_Rating
    "overview" TEXT,                  -- Overview (descrição do filme)
    "metaScore" REAL,                 -- Meta_score
    "director" TEXT,                  -- Director
    "star1" TEXT,                     -- Star1
    "star2" TEXT,                     -- Star2
    "star3" TEXT,                     -- Star3
    "star4" TEXT,                     -- Star4
    "votes" INTEGER,                  -- No_of_Votes
    "gross" TEXT                      -- Gross (bilheteria, texto porque vem com vírgula e $)
);