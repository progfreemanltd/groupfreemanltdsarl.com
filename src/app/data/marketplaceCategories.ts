export interface Level3Category {
  id: string;
  name: string;
}

export interface Level2Category {
  id: string;
  name: string;
  items?: Level3Category[];
}

export interface Level1Category {
  id: string;
  name: string;
  isHighlight?: boolean;
  subcategories: Level2Category[];
}

export const MARKETPLACE_CATEGORIES: Level1Category[] = [
  {
    id: "immobilier",
    name: "Immobilier",
    subcategories: [
      {
        id: "ventes-immo",
        name: "Ventes immobilières",
        items: [
          { id: "v-appart", name: "Appartement" },
          { id: "v-maison", name: "Maison" },
          { id: "v-terrain", name: "Terrain" },
          { id: "v-villa", name: "Villa" },
          { id: "v-duplex", name: "Duplex" }
        ]
      },
      {
        id: "immo-neuf",
        name: "Immobilier Neuf",
        items: [
          { id: "n-appart", name: "Appartement neuf" },
          { id: "n-maison", name: "Maison neuve" },
          { id: "n-programmes", name: "Programmes logements" }
        ]
      },
      {
        id: "locations",
        name: "Locations",
        items: [
          { id: "l-appart", name: "Appartement" },
          { id: "l-maison", name: "Maison" },
          { id: "l-bureau", name: "Bureau" },
          { id: "l-local", name: "Local commercial" }
        ]
      },
      { id: "colocation", name: "Colocations" },
      {
        id: "services-immo",
        name: "Services",
        items: [
          { id: "s-demenagement", name: "Services de déménagement" },
          { id: "s-promoteurs", name: "Promoteurs immobiliers" }
        ]
      }
    ]
  },
  {
    id: "vehicules",
    name: "Véhicules",
    subcategories: [
      {
        id: "voitures",
        name: "Voitures",
        items: [
          { id: "auto-toyota", name: "Toyota" },
          { id: "auto-peugeot", name: "Peugeot" },
          { id: "auto-renault", name: "Renault" },
          { id: "auto-mercedes", name: "Mercedes" },
          { id: "auto-hyundai", name: "Hyundai" },
          { id: "auto-honda", name: "Honda" },
          { id: "auto-suzuki", name: "Suzuki" },
          { id: "auto-kia", name: "Kia" },
          { id: "auto-autres", name: "Voir toutes les marques" }
        ]
      },
      {
        id: "motos",
        name: "Motos & Tricycles",
        items: [
          { id: "moto-honda", name: "Honda" },
          { id: "moto-yamaha", name: "Yamaha" },
          { id: "moto-tvs", name: "TVS" },
          { id: "moto-bajaj", name: "Bajaj" },
          { id: "moto-suzuki", name: "Suzuki" },
          { id: "moto-autres", name: "Voir toutes les marques" }
        ]
      },
      {
        id: "utilitaires",
        name: "Utilitaires & Camions",
        items: [
          { id: "u-fourgon", name: "Fourgonnettes" },
          { id: "u-camion", name: "Camions" },
          { id: "u-pickup", name: "Pick-up" }
        ]
      },
      {
        id: "equipements-auto",
        name: "Équipements",
        items: [
          { id: "eq-auto", name: "Équipement auto" },
          { id: "eq-moto", name: "Équipement moto" },
          { id: "eq-pieces", name: "Pièces détachées" }
        ]
      },
      {
        id: "services-auto",
        name: "Services",
        items: [
          { id: "s-meca", name: "Services de réparations mécaniques" },
          { id: "s-lavage", name: "Lavage auto" }
        ]
      }
    ]
  },
  {
    id: "locations-saisonnieres",
    name: "Locations Saisonnières",
    subcategories: [
      {
        id: "hebergements",
        name: "Types d'hébergements",
        items: [
          { id: "h-maisons", name: "Maisons et villas" },
          { id: "h-appart", name: "Appartements" },
          { id: "h-chambres", name: "Chambres d'hôtes" },
          { id: "h-residences", name: "Résidences hôtelières" }
        ]
      },
      {
        id: "h-caracteristiques",
        name: "Caractéristiques",
        items: [
          { id: "c-clim", name: "Climatisation" },
          { id: "c-piscine", name: "Piscine" },
          { id: "c-jardin", name: "Jardin" },
          { id: "c-animaux", name: "Animaux acceptés" }
        ]
      },
      {
        id: "h-voyageurs",
        name: "Nombre de voyageurs",
        items: [
          { id: "v-1", name: "Solo" },
          { id: "v-2", name: "À deux" },
          { id: "v-4", name: "À quatre" },
          { id: "v-6", name: "À six" },
          { id: "v-plus", name: "Plus de six" }
        ]
      }
    ]
  },
  {
    id: "emploi",
    name: "Emploi",
    subcategories: [
      {
        id: "offres-emploi",
        name: "Offres d'emploi",
        items: [
          { id: "e-cdi", name: "CDI" },
          { id: "e-cdd", name: "CDD" },
          { id: "e-interim", name: "Intérim" },
          { id: "e-benevolat", name: "Bénévolat" },
          { id: "e-stage", name: "Stage / Apprentissage" },
          { id: "e-indep", name: "Indépendant" }
        ]
      },
      { id: "formations-pro", name: "Formations professionnelles" },
      { id: "profil-candidat", name: "Profil Candidat" }
    ]
  },
  {
    id: "maison-jardin",
    name: "Maison & Jardin",
    subcategories: [
      {
        id: "ameublement",
        name: "Ameublement",
        items: [
          { id: "am-armoire", name: "Armoire" },
          { id: "am-buffet", name: "Buffet" },
          { id: "am-canape", name: "Canapé" },
          { id: "am-chaise", name: "Chaise & Tabouret" },
          { id: "am-fauteuil", name: "Fauteuil" },
          { id: "am-lit", name: "Lit" },
          { id: "am-cuisine", name: "Meuble de cuisine" },
          { id: "am-table", name: "Table de salle à manger" }
        ]
      },
      {
        id: "electromenager",
        name: "Électroménager",
        items: [
          { id: "el-refrigerateur", name: "Réfrigérateur" },
          { id: "el-congelateur", name: "Congélateur" },
          { id: "el-four", name: "Four" },
          { id: "el-microondes", name: "Micro-ondes" },
          { id: "el-lavelinge", name: "Lave-linge" },
          { id: "el-aspirateur", name: "Aspirateur" },
          { id: "el-clim", name: "Climatiseur" },
          { id: "el-ventilo", name: "Ventilateur" }
        ]
      },
      {
        id: "arts-table",
        name: "Arts de la table",
        items: [
          { id: "at-assiette", name: "Assiette" },
          { id: "at-vaisselle", name: "Service de vaisselle" },
          { id: "at-verre", name: "Verre" },
          { id: "at-poterie", name: "Canari & Poterie" }
        ]
      },
      {
        id: "decoration",
        name: "Décoration",
        items: [
          { id: "dec-miroir", name: "Miroir" },
          { id: "dec-rideaux", name: "Rideaux & Stores" },
          { id: "dec-tableau", name: "Tableau & Toile" },
          { id: "dec-tapis", name: "Tapis" },
          { id: "dec-vase", name: "Vase & Céramique" },
          { id: "dec-sculpture", name: "Sculpture" }
        ]
      },
      {
        id: "bricolage-jardin",
        name: "Bricolage & Jardin",
        items: [
          { id: "bj-brico", name: "Bricolage" },
          { id: "bj-plantes", name: "Jardin & Plantes" },
          { id: "bj-irrigation", name: "Matériel d'irrigation" }
        ]
      },
      { id: "papeterie", name: "Papeterie & Fournitures scolaires" },
      {
        id: "services-maison",
        name: "Services",
        items: [
          { id: "sm-jardin", name: "Services de jardinerie" },
          { id: "sm-brico", name: "Services de bricolage" }
        ]
      }
    ]
  },
  {
    id: "electronique",
    name: "Électronique",
    subcategories: [
      {
        id: "telephones",
        name: "Téléphones & Objets connectés",
        items: [
          { id: "t-samsung", name: "Samsung" },
          { id: "t-tecno", name: "Tecno" },
          { id: "t-infinix", name: "Infinix" },
          { id: "t-itel", name: "Itel" },
          { id: "t-apple", name: "Apple" },
          { id: "t-huawei", name: "Huawei" },
          { id: "t-autres", name: "Voir toutes les marques" }
        ]
      },
      {
        id: "informatique",
        name: "Ordinateurs & Tablettes",
        items: [
          { id: "i-ordis", name: "Ordinateurs" },
          { id: "i-tablettes", name: "Tablettes" },
          { id: "i-accessoires", name: "Accessoires informatique" },
          { id: "i-liseuses", name: "Liseuses" }
        ]
      },
      {
        id: "audiovisuel",
        name: "Photo, Audio & Vidéo",
        items: [
          { id: "av-tv", name: "Télévision" },
          { id: "av-enceintes", name: "Enceintes" },
          { id: "av-photo", name: "Appareil photo" },
          { id: "av-casque", name: "Casque" },
          { id: "av-ecouteurs", name: "Écouteurs" },
          { id: "av-projo", name: "Vidéoprojecteur" }
        ]
      },
      {
        id: "gaming",
        name: "Consoles & Jeux vidéo",
        items: [
          { id: "g-consoles", name: "Consoles" },
          { id: "g-jeux", name: "Jeux vidéo" }
        ]
      },
      {
        id: "accessoires-elec",
        name: "Accessoires",
        items: [
          { id: "ae-tel", name: "Accessoires téléphone" },
          { id: "ae-cables", name: "Câbles & Chargeurs" },
          { id: "ae-objets", name: "Objets connectés" }
        ]
      },
      {
        id: "energie",
        name: "Énergie solaire",
        items: [
          { id: "en-panneaux", name: "Panneaux solaires" },
          { id: "en-kits", name: "Kits solaires" },
          { id: "en-batteries", name: "Batteries" }
        ]
      },
      {
        id: "services-elec",
        name: "Services",
        items: [
          { id: "se-rep", name: "Services de réparations électroniques" }
        ]
      }
    ]
  },
  {
    id: "produits-digitaux",
    name: "Produits Digitaux",
    isHighlight: true,
    subcategories: [
      {
        id: "logiciels-saas",
        name: "Logiciels & SaaS",
        items: [
          { id: "saas-gestion", name: "Outils de gestion (ERP, CRM)" },
          { id: "saas-creatif", name: "Outils créatifs & Design" },
          { id: "saas-bureau", name: "Bureautique" },
          { id: "saas-cyber", name: "Cybersécurité & Antivirus" }
        ]
      },
      {
        id: "formations-elearning",
        name: "Formations & E-learning",
        items: [
          { id: "edu-b2b", name: "Formations B2B" },
          { id: "edu-ebooks", name: "E-books" },
          { id: "edu-tutos", name: "Tutoriels vidéo" }
        ]
      },
      {
        id: "assets-creations",
        name: "Assets & Créations",
        items: [
          { id: "as-themes", name: "Thèmes & Templates web" },
          { id: "as-3d", name: "Modèles 3D" },
          { id: "as-media", name: "Banques d'images & Audio" },
          { id: "as-plugins", name: "Plugins & Extensions" }
        ]
      },
      {
        id: "services-digitaux",
        name: "Services digitaux purs",
        items: [
          { id: "sd-hebergement", name: "Hébergement & Noms de domaine" },
          { id: "sd-licences", name: "Licences numériques" }
        ]
      }
    ]
  },

  {
    id: "materiel-pro",
    name: "Matériel Professionnel",
    subcategories: [
      {
        id: "agri",
        name: "Agriculture & Élevage",
        items: [
          { id: "ag-tracteur", name: "Tracteurs" },
          { id: "ag-materiel", name: "Matériel agricole" },
          { id: "ag-elevage", name: "Matériel d'élevage" },
          { id: "ag-intrants", name: "Intrants agricoles" }
        ]
      },
      {
        id: "btp",
        name: "BTP & Construction",
        items: [
          { id: "btp-gros", name: "BTP - Chantier gros-oeuvre" },
          { id: "btp-materiel", name: "Matériel de chantier" },
          { id: "btp-camions", name: "Poids lourds" },
          { id: "btp-levage", name: "Manutention & Levage" }
        ]
      },
      {
        id: "industrie",
        name: "Industrie & Commerce",
        items: [
          { id: "ind-equip", name: "Équipements industriels" },
          { id: "ind-resto", name: "Équipements pour restaurants & hôtels" },
          { id: "ind-commerce", name: "Équipements pour commerces & marchés" },
          { id: "ind-bureau", name: "Équipements & Fournitures de bureau" }
        ]
      },
      {
        id: "medical",
        name: "Médical & Santé",
        items: [
          { id: "med-materiel", name: "Matériel médical" },
          { id: "med-pharma", name: "Équipements de pharmacie" }
        ]
      }
    ]
  }
];
