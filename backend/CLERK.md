# Relier Clerk à un docteur

Clerk vérifie l'identité. PostgreSQL détermine si cette identité correspond à un
docteur autorisé. L'inscription Clerk ne crée jamais automatiquement un docteur.

## Installer cette étape en local

Depuis le dossier `backend`, avec le serveur arrêté et `DATABASE_URL` configurée :

```powershell
npm ci
npx prisma migrate dev --config prisma7.config.ts
npx prisma generate --config prisma7.config.ts
npm run dev
```

La migration ajoute `Doctor.clerkUserId` unique et facultatif. Elle conserve les
données existantes et rend `passwordHash` facultatif, sans supprimer les anciens
hashes. Ce champ n'est plus utilisé pour la connexion. Ne modifiez pas la migration
initiale et refusez toute proposition inattendue de réinitialisation de la base.

## Autoriser le premier docteur

1. Connectez-vous au frontend avec le compte Clerk du docteur.
2. Dans le tableau de bord de la même application Clerk, ouvrez ce compte dans
   Users et copiez son identifiant `user_...` (pas une clé API ni un jeton).
3. Depuis `backend`, lancez `npx prisma studio --config prisma7.config.ts`.
4. Dans Doctor, renseignez `clerkUserId` sur le bon docteur. S'il n'existe pas,
   créez-le avec firstName, lastName, email, speciality et clerkUserId. Laissez
   passwordHash vide (NULL) et photo vide si aucune photo n'est disponible.
5. Vérifiez soigneusement le compte choisi : ce rattachement accorde l'accès
   métier. Pour révoquer cet accès, remettez clerkUserId à NULL.

Le champ nullable permet de conserver les docteurs non encore associés, qui ne
peuvent pas accéder aux routes protégées. L'email seul n'accorde aucun accès.

## Contrat des routes

- `GET /api/health` : public, réponse 200.
- `GET /api/auth/me` : identité Clerk, 401 sans session, sinon 200 avec clerkUserId.
- `GET /api/doctors/me` : 401 sans session, 403 si le compte n'est pas lié,
  sinon 200 avec `{ "doctor": { ... } }`. Aucun passwordHash n'est renvoyé.

Pour les requêtes authentifiées, le frontend obtient le jeton par `getToken()` et
l'envoie dans `Authorization: Bearer <jeton>`. Les clés frontend et backend doivent
appartenir à la même application Clerk. Le frontend local autorisé est
`http://localhost:5173`.

Chaque future route métier (patients, consultations, etc.) doit utiliser
`requireDoctor` après `clerkMiddleware`. Masquer l'interface React ne protège pas
une route API.

## Vérifications prévues avec Thunder Client

- Sans jeton : `/api/doctors/me` retourne 401.
- Session valide non liée : 403, même si l'email correspond à un docteur.
- Session valide liée : 200, profil du docteur associé, aucun passwordHash.
- Un patientId, doctorId ou clerkUserId envoyé par le client ne change pas
  l'identité du docteur utilisé par cette route.
- Deux docteurs ne peuvent pas partager le même clerkUserId.
- Après révocation du rattachement : 403 même si la session Clerk est encore valide.

Ces vérifications nécessitent la base locale et de vraies sessions Clerk.
