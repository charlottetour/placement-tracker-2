export type StatusKey =
  | "A_RECHERCHER"
  | "A_PREPARER"
  | "DOSSIER_EN_PREPARATION"
  | "PRET_A_ENVOYER"
  | "ENVOYEE"
  | "EN_ATTENTE"
  | "ENTRETIEN"
  | "RELANCE_A_FAIRE"
  | "ACCEPTE"
  | "REFUSE"
  | "ABANDONNE";

export const STATUS_ORDER: StatusKey[] = [
  "A_RECHERCHER",
  "A_PREPARER",
  "DOSSIER_EN_PREPARATION",
  "PRET_A_ENVOYER",
  "ENVOYEE",
  "EN_ATTENTE",
  "ENTRETIEN",
  "RELANCE_A_FAIRE",
  "ACCEPTE",
  "REFUSE",
  "ABANDONNE",
];

export const STATUS_META: Record<
  StatusKey,
  { label: string; tone: string; dot: string; isActive: boolean; isPositive?: boolean; isNegative?: boolean }
> = {
  A_RECHERCHER: { label: "À rechercher", tone: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300", dot: "bg-slate-400", isActive: true },
  A_PREPARER: { label: "À préparer", tone: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300", dot: "bg-amber-500", isActive: true },
  DOSSIER_EN_PREPARATION: { label: "Dossier en préparation", tone: "bg-orange-100 text-orange-800 dark:bg-orange-500/15 dark:text-orange-300", dot: "bg-orange-500", isActive: true },
  PRET_A_ENVOYER: { label: "Prêt à envoyer", tone: "bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-300", dot: "bg-sky-500", isActive: true },
  ENVOYEE: { label: "Candidature envoyée", tone: "bg-indigo-100 text-indigo-800 dark:bg-indigo-500/15 dark:text-indigo-300", dot: "bg-indigo-500", isActive: true },
  EN_ATTENTE: { label: "En attente", tone: "bg-violet-100 text-violet-800 dark:bg-violet-500/15 dark:text-violet-300", dot: "bg-violet-500", isActive: true },
  ENTRETIEN: { label: "Entretien", tone: "bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-500/15 dark:text-fuchsia-300", dot: "bg-fuchsia-500", isActive: true },
  RELANCE_A_FAIRE: { label: "Relance à faire", tone: "bg-rose-100 text-rose-800 dark:bg-rose-500/15 dark:text-rose-300", dot: "bg-rose-500", isActive: true },
  ACCEPTE: { label: "Accepté 🎉", tone: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300", dot: "bg-emerald-500", isActive: false, isPositive: true },
  REFUSE: { label: "Refusé", tone: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300", dot: "bg-red-500", isActive: false, isNegative: true },
  ABANDONNE: { label: "Abandonné", tone: "bg-neutral-200 text-neutral-600 dark:bg-neutral-700/40 dark:text-neutral-400", dot: "bg-neutral-400", isActive: false, isNegative: true },
};

export const STATUS_HEX: Record<StatusKey, string> = {
  A_RECHERCHER: "#94a3b8",
  A_PREPARER: "#f59e0b",
  DOSSIER_EN_PREPARATION: "#f97316",
  PRET_A_ENVOYER: "#0ea5e9",
  ENVOYEE: "#6366f1",
  EN_ATTENTE: "#8b5cf6",
  ENTRETIEN: "#d946ef",
  RELANCE_A_FAIRE: "#f43f5e",
  ACCEPTE: "#10b981",
  REFUSE: "#ef4444",
  ABANDONNE: "#a3a3a3",
};

export type ApplicationTypeKey = "PROGRAMME" | "OFFRE" | "SPONTANEE" | "CONTACT" | "AUTRE";

export const APPLICATION_TYPE_META: Record<ApplicationTypeKey, { label: string }> = {
  PROGRAMME: { label: "Programme de stage" },
  OFFRE: { label: "Offre publiée" },
  SPONTANEE: { label: "Candidature spontanée" },
  CONTACT: { label: "Contact / recommandation" },
  AUTRE: { label: "Autre" },
};

export type ContactTypeKey = "RH" | "RECRUTEUR" | "MANAGER" | "ALUMNI" | "CONNAISSANCE" | "AUTRE";

export const CONTACT_TYPE_META: Record<ContactTypeKey, { label: string }> = {
  RH: { label: "RH" },
  RECRUTEUR: { label: "Recruteur" },
  MANAGER: { label: "Manager" },
  ALUMNI: { label: "Alumni" },
  CONNAISSANCE: { label: "Connaissance" },
  AUTRE: { label: "Autre" },
};

export const DEFAULT_DOCUMENT_LABELS = [
  "CV",
  "Lettre de motivation",
  "Portfolio",
  "Relevés de notes",
  "Lettre de recommandation",
  "Certificat / convention de stage",
];

export const INTERACTION_TYPE_META: Record<string, { label: string; icon: string }> = {
  NOTE: { label: "Note", icon: "StickyNote" },
  EMAIL: { label: "Email", icon: "Mail" },
  CALL: { label: "Appel", icon: "Phone" },
  MEETING: { label: "Rendez-vous", icon: "Users" },
  STATUS_CHANGE: { label: "Changement de statut", icon: "ArrowRightLeft" },
  FOLLOWUP: { label: "Relance", icon: "Bell" },
  DOCUMENT: { label: "Document", icon: "FileText" },
};
