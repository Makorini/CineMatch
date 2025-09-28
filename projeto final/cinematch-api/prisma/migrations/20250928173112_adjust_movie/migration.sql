/*
  Warnings:

  - The primary key for the `Movie` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `genres` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `votes` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `Movie` table. All the data in the column will be lost.
  - Added the required column `genre` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seriesTitle` to the `Movie` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Movie" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "posterLink" TEXT DEFAULT 'https://via.placeholder.com/180x270?text=No+Image',
    "seriesTitle" TEXT NOT NULL,
    "releasedYear" INTEGER,
    "certificate" TEXT,
    "runtime" TEXT,
    "genre" TEXT NOT NULL,
    "imdbRating" REAL,
    "overview" TEXT,
    "metaScore" REAL,
    "director" TEXT,
    "star1" TEXT,
    "star2" TEXT,
    "star3" TEXT,
    "star4" TEXT,
    "noOfVotes" INTEGER,
    "gross" TEXT
);
INSERT INTO "new_Movie" ("certificate", "director", "gross", "id", "imdbRating", "metaScore", "overview", "posterLink", "runtime", "star1", "star2", "star3", "star4") SELECT "certificate", "director", "gross", "id", "imdbRating", "metaScore", "overview", "posterLink", "runtime", "star1", "star2", "star3", "star4" FROM "Movie";
DROP TABLE "Movie";
ALTER TABLE "new_Movie" RENAME TO "Movie";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
