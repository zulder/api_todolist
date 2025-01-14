/*
  Warnings:

  - You are about to drop the column `item` on the `Todos` table. All the data in the column will be lost.
  - Added the required column `name` to the `Todos` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Todos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_Todos" ("created_at", "description", "id", "updated_at") SELECT "created_at", "description", "id", "updated_at" FROM "Todos";
DROP TABLE "Todos";
ALTER TABLE "new_Todos" RENAME TO "Todos";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
