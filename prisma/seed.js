const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const DOCS = [
  "CV",
  "Lettre de motivation",
  "Portfolio",
  "Relevés de notes",
  "Lettre de recommandation",
  "Certificat / convention de stage",
];

function daysFromNow(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
}

async function main() {
  await prisma.interaction.deleteMany();
  await prisma.followUp.deleteMany();
  await prisma.documentItem.deleteMany();
  await prisma.application.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.company.deleteMany();

  const airbus = await prisma.company.create({
    data: {
      name: "Airbus",
      sector: "Aéronautique",
      city: "Toulouse",
      country: "France",
      website: "https://www.airbus.com/careers",
      notes: "Programme Graduate très sélectif, candidater tôt.",
      contacts: {
        create: [
          {
            firstName: "Camille",
            lastName: "Roux",
            role: "Chargée de recrutement",
            email: "camille.roux@airbus.com",
            linkedin: "https://linkedin.com/in/camille-roux",
            type: "RH",
            lastContactedAt: daysFromNow(-5),
            notes: "Très réactive par email.",
          },
        ],
      },
    },
  });

  const loreal = await prisma.company.create({
    data: {
      name: "L'Oréal",
      sector: "Cosmétique / FMCG",
      city: "Paris",
      country: "France",
      website: "https://careers.loreal.com",
      contacts: {
        create: [
          {
            firstName: "Julien",
            lastName: "Meyer",
            role: "Manager Finance",
            email: "julien.meyer@loreal.com",
            type: "MANAGER",
          },
        ],
      },
    },
  });

  const bcg = await prisma.company.create({
    data: {
      name: "BCG",
      sector: "Conseil en stratégie",
      city: "Paris",
      country: "France",
      website: "https://careers.bcg.com",
    },
  });

  const spotify = await prisma.company.create({
    data: {
      name: "Spotify",
      sector: "Tech / Streaming",
      city: "Stockholm",
      country: "Suède",
      website: "https://www.lifeatspotify.com",
    },
  });

  const sncf = await prisma.company.create({
    data: {
      name: "SNCF",
      sector: "Transport",
      city: "Paris",
      country: "France",
    },
  });

  async function createApp({
    company,
    title,
    applicationType,
    status,
    priority,
    discoveredAt,
    deadlineAt,
    sentAt,
    link,
    notes,
    docsChecked = 0,
    followUp,
  }) {
    const app = await prisma.application.create({
      data: {
        companyId: company.id,
        title,
        applicationType,
        status,
        priority,
        discoveredAt,
        deadlineAt,
        sentAt,
        link,
        notes,
        documents: {
          create: DOCS.map((label, i) => ({ label, order: i, checked: i < docsChecked })),
        },
        interactions: {
          create: [{ type: "NOTE", content: "Candidature créée.", occurredAt: discoveredAt }],
        },
      },
    });
    if (followUp) {
      await prisma.followUp.create({ data: { applicationId: app.id, dueAt: followUp.dueAt, note: followUp.note, done: !!followUp.done } });
    }
    return app;
  }

  await createApp({
    company: airbus,
    title: "Stage Finance Intern",
    applicationType: "PROGRAMME",
    status: "DOSSIER_EN_PREPARATION",
    priority: 3,
    discoveredAt: daysFromNow(-10),
    deadlineAt: daysFromNow(4),
    link: "https://www.airbus.com/careers/finance-intern",
    notes: "Poste très aligné avec mon profil finance internationale.",
    docsChecked: 4,
  });

  await createApp({
    company: loreal,
    title: "Stage Contrôle de gestion",
    applicationType: "OFFRE",
    status: "ENVOYEE",
    priority: 2,
    discoveredAt: daysFromNow(-20),
    deadlineAt: daysFromNow(10),
    sentAt: daysFromNow(-9),
    docsChecked: 6,
    followUp: { dueAt: daysFromNow(-1), note: "Relancer par email si pas de retour." },
  });

  await createApp({
    company: bcg,
    title: "Summer Internship - Strategy",
    applicationType: "PROGRAMME",
    status: "ENTRETIEN",
    priority: 3,
    discoveredAt: daysFromNow(-30),
    sentAt: daysFromNow(-20),
    docsChecked: 6,
    notes: "Entretien case study prévu, revoir les frameworks classiques.",
    followUp: { dueAt: daysFromNow(2), note: "Préparer un cas de croissance." },
  });

  await createApp({
    company: spotify,
    title: "Data Analyst Intern",
    applicationType: "SPONTANEE",
    status: "EN_ATTENTE",
    priority: 1,
    discoveredAt: daysFromNow(-15),
    sentAt: daysFromNow(-14),
    docsChecked: 5,
    followUp: { dueAt: daysFromNow(0), note: "Vérifier si retour RH." },
  });

  await createApp({
    company: sncf,
    title: "Stage Achats",
    applicationType: "CONTACT",
    status: "A_PREPARER",
    priority: 0,
    discoveredAt: daysFromNow(-2),
    deadlineAt: daysFromNow(20),
    docsChecked: 1,
  });

  const decathlon = await prisma.company.create({
    data: { name: "Decathlon", sector: "Retail / Sport", city: "Lille", country: "France" },
  });
  await createApp({
    company: decathlon,
    title: "Stage Marketing Produit",
    applicationType: "OFFRE",
    status: "REFUSE",
    priority: 1,
    discoveredAt: daysFromNow(-40),
    sentAt: daysFromNow(-35),
    docsChecked: 6,
    notes: "Refus après entretien final, manque d'expérience terrain.",
  });

  const totalenergies = await prisma.company.create({
    data: { name: "TotalEnergies", sector: "Énergie", city: "Paris", country: "France" },
  });
  await createApp({
    company: totalenergies,
    title: "Stage Analyste Financier",
    applicationType: "PROGRAMME",
    status: "ACCEPTE",
    priority: 3,
    discoveredAt: daysFromNow(-60),
    sentAt: daysFromNow(-50),
    docsChecked: 6,
    notes: "Offre signée, début prévu en février.",
  });

  console.log("Seed terminé.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
