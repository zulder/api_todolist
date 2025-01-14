-- CreateTable
CREATE TABLE "Todos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "item" TEXT NOT NULL,
    "description" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
