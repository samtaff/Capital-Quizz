export const SUCCESS_MESSAGES: string[] = [
  "Ça, c'était limite trop facile pour toi.",
  "Stop, on va croire que t'as triché.",
  "T'as répondu plus vite que ton ombre.",
  "Tranquille, comme si t'étais né avec un atlas dans le berceau.",
  "On dirait que t'as un GPS greffé dans le cerveau.",
  "Bon ok là tu commences à faire peur.",
  "T'as sorti ça sans trembler, respect total.",
  "Impossible de te piéger toi, hein.",
  "T'es en train de ruiner la moyenne des autres, là.",
  "Franchement, t'as pas volé tes points.",
  "Tu collectionnes les capitales comme d'autres les timbres.",
  "On sent l'ancien élève studieux qui sommeille en toi.",
  "T'as dégainé ça plus vite que ton café du matin.",
  "Ok, on arrête de te sous-estimer à partir de maintenant.",
  "Y'a un before/after cette réponse, clairement.",
  "T'as fait ça les doigts dans le nez.",
  "C'est le genre de réponse qui muscle l'ego.",
  "Petit rappel : le hasard, c'est pas ton truc, t'assures vraiment.",
  "T'as dû réviser en cachette, avoue.",
  "La classe, rien à redire.",
];

export const FAILURE_MESSAGES: string[] = [
  "Après tout, la moitié de la population est en dessous de la moyenne.",
  "Au village, c'est toi qui cours après le facteur depuis que le chien est mort.",
  "C'est pas de ta faute si c'est pas marqué \"ne pas manger\" sur le shampoing.",
  "T'es pas la carpe la plus oxygénée du bassin.",
  "T'es pas la chips la plus croustillante du paquet.",
  "T'es pas la flèche la plus aiguisée du carquois.",
  "T'es pas la lumière la plus brillante du lustre.",
  "T'es pas la perle la plus brillante du collier.",
  "T'es pas la pomme la plus sucrée du verger.",
  "T'es pas le castor le plus utile au barrage.",
  "T'es pas le couteau le plus aiguisé du tiroir.",
  "T'es pas le fromage le plus affiné du terroir.",
  "T'es pas le kouign-amann le plus beurré de la vitrine.",
  "T'es pas le lampadaire qui éclaire le mieux l'allée.",
  "T'es pas le pingouin qui glisse le plus loin.",
  "T'es pas le pigeon qui vole le plus haut.",
  "T'es pas le plus malin de la bande.",
  "T'es pas le plus rapide du peloton.",
  "T'es pas le processeur le mieux cadencé du marché.",
  "T'es pas le rosier le plus fleuri du jardin.",
  "T'es pas le saumon le plus vigoureux de l'Atlantique.",
  "T'es pas le sommet le plus enneigé du massif.",
  "T'es pas le volcan le plus actif d'Auvergne.",
  "T'as 2 neurones qui se battent pour la 3ème place.",
  "T'as de la bonne mécanique, mais personne au volant.",
  "T'as des ampoules mais pas de lumière.",
  "T'as été démoulé trop chaud.",
  "T'as l'étincelle, mais la flamme s'est éteinte.",
  "T'as la boîte, mais pas les outils.",
  "T'as le pâté qui touche le couvercle.",
];

export function getRandomSuccessPunchline(): string {
  const idx = Math.floor(Math.random() * SUCCESS_MESSAGES.length);
  return SUCCESS_MESSAGES[idx];
}

export function getRandomFailurePunchline(): string {
  const idx = Math.floor(Math.random() * FAILURE_MESSAGES.length);
  return FAILURE_MESSAGES[idx];
}

// ================= PHRASES DU PODIUM FINAL =================

export const PODIUM_CHAMPION_MESSAGES: string[] = [
  "Atlas réincarné. On s'incline devant tant d'arrogance géographique.",
  "Il a le globe terrestre gravé sur la rétine, c'est totalement indécent.",
  "Le ministre des Affaires Étrangères en sueur devant ta performance.",
  "Tu triches ou t'as vraiment passé tous tes week-ends sur Google Earth ?",
  "Victoire écrasante. Les autres peuvent directement aller réviser le collège.",
  "Un vrai GPS sur pattes. Respect éternel pour cette démonstration.",
  "Champion incontesté. Tu mérites ton passeport diplomatique.",
  "Aucune capitale ne lui résiste, même pas les atolls du Pacifique.",
  "Une masterclass du début à la fin. Les autres n'ont servi que de décor.",
];

export const PODIUM_SECOND_MESSAGES: string[] = [
  "Deuxième... La place des gens sympas mais qu'on oublie dans l'histoire.",
  "Si près du but, et pourtant si loin de la gloire éternelle.",
  "Médaille d'argent ! C'est très honorable, mais le premier te regarde de haut.",
  "Le roi sans couronne. Il te manquait juste un chouïa de caféine.",
  "Premier des perdants ! Mais avec un panache indéniable.",
  "T'as brillé tout le long, mais quelqu'un a éteint la lumière au finish.",
  "Une performance solide, mais le numéro 1 était sur une autre planète.",
];

export const PODIUM_THIRD_MESSAGES: string[] = [
  "Sur le podium par miracle ! On a tous vu tes hésitations suspectes.",
  "Troisième ! Tu sauves l'honneur sur le fil, range le champagne quand même.",
  "Médaille de bronze : ça brille moins, mais ça fait joli sur le CV.",
  "Le bronze te va à ravir, ne regarde surtout pas l'écart de points.",
  "Accroché à la 3ème marche comme une bernique à son rocher.",
  "Présent sur la photo souvenir, et c'est déjà un exploit inattendu.",
];

export const PODIUM_RUNNER_MESSAGES: string[] = [
  "L'important c'est de participer... disaient ceux qui n'ont absolument rien gagné.",
  "Pour toi, la capitale de l'Australie restera Sydney pour l'éternité.",
  "Tu confonds encore la Suisse et la Suède, mais on t'aime bien quand même.",
  "Au moins, tu as permis aux autres d'avoir des statistiques élogieuses.",
  "Un sens de l'orientation digne d'un pigeon voyageur sans réseau.",
  "T'es venu en touriste, t'es reparti avec le magnet de frigo.",
  "T'as 2 neurones qui se battent encore pour la 3ème place.",
  "T'es pas le pingouin qui glisse le plus loin sur la banquise.",
  "T'as de la bonne mécanique, mais il manquait quelqu'un au volant.",
  "Si l'échec était un pays, tu en serais la capitale incontestée.",
  "Promis, pour ton anniversaire on se cotise tous pour t'offrir un globe.",
  "Géographie niveau maternelle, mais ambianceur niveau champion du monde.",
  "T'as confondu la Micronésie avec un modèle de four micro-ondes.",
  "Un score qui fait relativiser le réchauffement climatique.",
];

/**
 * Retourne une phrase de podium synchronisée pour un joueur donné.
 * Utilise un hachage déterministe pour que TOUS les joueurs connectés voient la même phrase pour chaque participant.
 */
export function getPodiumPunchline(
  playerId: string,
  rank: number,
  score: number,
  seed: string = 'QUIZ'
): string {
  // Simple hash for consistency across all clients
  const key = `${seed}_${playerId}_${rank}_${score}`;
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash << 5) - hash + key.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  if (rank === 1) {
    return PODIUM_CHAMPION_MESSAGES[absHash % PODIUM_CHAMPION_MESSAGES.length];
  }
  if (rank === 2) {
    return PODIUM_SECOND_MESSAGES[absHash % PODIUM_SECOND_MESSAGES.length];
  }
  if (rank === 3) {
    return PODIUM_THIRD_MESSAGES[absHash % PODIUM_THIRD_MESSAGES.length];
  }
  return PODIUM_RUNNER_MESSAGES[absHash % PODIUM_RUNNER_MESSAGES.length];
}
