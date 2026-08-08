# StageTrack

Plateforme personnelle pour suivre ta recherche de stage — en remplacement d'un fichier Excel.

## Stack

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS v4** pour le design système (clair/sombre)
- **Prisma** + **SQLite** pour la base de données locale
- **dnd-kit** pour le tableau Kanban (glisser-déposer)
- **Recharts** pour les graphiques du dashboard
- **Radix UI** pour les composants accessibles (dialogues, select, tabs, checkbox)

## Démarrage

```bash
npm install
npx prisma db push       # crée la base SQLite locale (prisma/dev.db)
node prisma/seed.js       # (optionnel) données de démonstration
npm run dev
```

L'application est disponible sur http://localhost:3000.

## Fonctionnalités

- **Dashboard** : vue d'ensemble (stats, graphiques, tâches du jour, relances)
- **Candidatures** : vue Tableau et vue Kanban (glisser-déposer entre statuts), filtres et recherche
- **Entreprises** : fiche détaillée par entreprise (candidatures, contacts, historique, liens utiles)
- **Contacts** : carnet de contacts par entreprise
- **Documents** : checklist de dossier avec barre de progression par candidature
- **Calendrier / Relances** : deadlines et relances à venir ou en retard
- **Paramètres** : thème clair/sombre/système, export JSON, réinitialisation des données

## Modèle de données

`Company` → `Application` (candidature) → `DocumentItem`, `FollowUp`, `Interaction`
`Company` → `Contact`

Voir `prisma/schema.prisma` pour le détail.
