export function getTotalDu(soins, typesSoins) {
  const tarifsMap = Object.fromEntries(typesSoins.map((t) => [t.id, t.tarif ?? 0]));
  return (soins || []).reduce((total, soin) => total + (tarifsMap[soin.typeSoinId] ?? 0), 0);
}

export function getTotalPaye(paiements) {
  return (paiements || []).reduce((total, p) => total + Number(p.amount || 0), 0);
}

export function getSolde(soins, paiements, typesSoins) {
  return getTotalDu(soins, typesSoins) - getTotalPaye(paiements);
}

export function formatMontant(montant) {
  return `${Number(montant || 0).toLocaleString("fr-FR")} Ar`;
}

export function getRecetteJour(consultations, dateStr) {
  return consultations.reduce((total, consultation) => {
    const paiementsDuJour = (consultation.paiements || []).filter((p) => p.date === dateStr);
    return total + getTotalPaye(paiementsDuJour);
  }, 0);
}