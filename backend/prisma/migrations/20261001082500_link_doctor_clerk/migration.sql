-- Préserver les docteurs et les anciens mots de passe pendant la transition.
ALTER TABLE "Doctor" ADD COLUMN "clerkUserId" TEXT;
ALTER TABLE "Doctor" ALTER COLUMN "passwordHash" DROP NOT NULL;

-- Un compte Clerk ne peut représenter qu'un seul docteur.
-- Les docteurs non encore liés gardent une valeur NULL.
CREATE UNIQUE INDEX "Doctor_clerkUserId_key" ON "Doctor"("clerkUserId");
