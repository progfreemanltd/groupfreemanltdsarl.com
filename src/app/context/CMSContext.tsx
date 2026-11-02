import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import { doc, collection, onSnapshot, setDoc, deleteDoc, updateDoc, query, where } from 'firebase/firestore';
import { useAuth } from './AuthContext';
import { saasProjects, SaasProject } from '../data/saas';
import { teamMembers } from '../data/team';
import { formations as staticFormations } from '../data/formations';
import { staticArticles, BlogArticle } from '../data/blog';

// Interfaces pour le CMS
export interface SectorCMS {
  title: string;
  description: string;
  iconName: string; // Ex: 'Monitor', 'HardHat', etc.
  link: string;
  externalUrl?: string;
  subServices?: string[];
}

export interface HomepageCMS {
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroBtnPrimaryText: string;
  heroBtnPrimaryLink: string;
  heroBtnSecondaryText: string;
  heroBtnSecondaryLink: string;
  aboutTitle: string;
  aboutTeaser1: string;
  aboutTeaser2: string;
  aboutBtnText: string;
  aboutBtnLink: string;
  aboutImagePlaceholderText: string;
  aboutStatNumber: string;
  aboutStatLabel: string;
  ctaTitle: string;
  ctaSubtitle: string;
  ctaBtnText: string;
  ctaBtnLink: string;
  sectors: SectorCMS[];
  visibleSections: string[]; // ['sectors', 'about_teaser', 'cta', 'formations', 'saas']
  heroImages?: string[];
}

export interface NewsletterSubscriber {
  id?: string;
  email: string;
  subscribedAt: string;
  source: string;
}

export interface ContactCMS {
  email: string;
  phone: string;
  address: string;
  linkedin: string;
  github: string;
  twitter: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  socialEnabled?: {
    linkedin?: boolean;
    github?: boolean;
    twitter?: boolean;
    facebook?: boolean;
    instagram?: boolean;
    youtube?: boolean;
  };
  activePayments?: string[];
  partners?: { name: string; imageUrl: string; }[];
  newsletterWebhookUrl?: string;
  systemeIoFormUrl?: string;
  wahornouUrl?: string;
  wahornouLabel?: string;
  wahornouDescription?: string;
}

interface CMSContextType {
  homepageData: HomepageCMS;
  contactData: ContactCMS;
  saasProjectsList: SaasProject[];
  formationsList: any[];
  teamMembersList: any[];
  blogArticlesList: BlogArticle[];
  subscribersList: NewsletterSubscriber[];
  loading: boolean;
  saveHomepageData: (data: Partial<HomepageCMS>) => Promise<void>;
  saveContactData: (data: Partial<ContactCMS>) => Promise<void>;
  saveSaasProject: (saas: SaasProject) => Promise<void>;
  deleteSaasProject: (id: string) => Promise<void>;
  saveFormation: (formation: any) => Promise<void>;
  deleteFormation: (id: string) => Promise<void>;
  saveTeamMember: (member: any) => Promise<void>;
  deleteTeamMember: (id: string) => Promise<void>;
  saveBlogArticle: (article: BlogArticle) => Promise<void>;
  deleteBlogArticle: (id: string) => Promise<void>;
  subscribeNewsletter: (email: string, source?: string) => Promise<void>;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

// Valeurs de secours par défaut (Statiques)
const defaultHomepage: HomepageCMS = {
  heroBadge: "GROUPE MULTI-SECTEURS",
  heroTitle: "Construire l'excellence,\nSecteur par Secteur.",
  heroSubtitle: "De l'ingénierie digitale à la construction BTP, Freeman Group unit 6 pôles d'expertise pour transformer vos ambitions en réalités concrètes.",
  heroBtnPrimaryText: "Découvrir nos pôles",
  heroBtnPrimaryLink: "/services",
  heroBtnSecondaryText: "Nous contacter",
  heroBtnSecondaryLink: "/contact",
  aboutTitle: "L'alliance de 4 associés visionnaires.",
  aboutTeaser1: "Fondé sur l'excellence opérationnelle, Freeman Group est né de la volonté de regrouper sous une même entité des expertises divergentes mais complémentaires.",
  aboutTeaser2: "Chaque associé apporte son expérience pointue dans son secteur, permettant au groupe de répondre aux défis les plus complexes avec une vision à 360 degrés.",
  aboutBtnText: "En savoir plus sur le groupe",
  aboutBtnLink: "/about",
  aboutImagePlaceholderText: "Image Corporate (Bureaux/Équipe)",
  aboutStatNumber: "4",
  aboutStatLabel: "Associés experts",
  ctaTitle: "Prêt à transformer vos ambitions ?",
  ctaSubtitle: "Qu'il s'agisse de construire un immeuble, de structurer votre management ou de développer une application, nos équipes sont prêtes.",
  ctaBtnText: "Lancez votre projet",
  ctaBtnLink: "/contact",
  sectors: [
    {
      title: 'Digital',
      description: 'Transformation digitale, ingénierie logicielle et intelligence artificielle.',
      iconName: 'Monitor',
      link: '/digital'
    },
    {
      title: 'BTP',
      description: 'Construction, rénovation et gros œuvre avec une exigence de qualité supérieure.',
      iconName: 'HardHat',
      link: '/services?tab=btp'
    },
    {
      title: 'Management',
      description: 'Conseil stratégique et optimisation des processus d\'entreprise.',
      iconName: 'Users',
      link: '/services?tab=management'
    },
    {
      title: 'Hôtellerie',
      description: 'Gestion d\'établissements et création d\'expériences clients uniques.',
      iconName: 'Hotel',
      link: '/services?tab=hotellerie'
    },
    {
      title: 'Aménagement',
      description: 'Architecture d\'intérieur, design d\'espaces et optimisation foncière.',
      iconName: 'Ruler',
      link: '/services?tab=amenagement'
    },
    {
      title: 'Commerce',
      description: 'Développement de réseaux de distribution et stratégies retail.',
      iconName: 'ShoppingBag',
      link: '/services?tab=commerce'
    },
    {
      title: 'Achat Facile',
      description: 'Achat international, réception et livraison de colis au Bénin.',
      iconName: 'ShoppingBag',
      link: '/services/achat-livraison'
    },
    {
      title: 'Jardin & Paysage',
      description: 'Conception paysagère, aménagement et entretien des espaces verts.',
      iconName: 'Leaf',
      link: '/services/jardinage'
    },
    {
      title: 'Services en développement',
      description: 'Découvrez les filiales et projets stratégiques en cours de lancement.',
      iconName: 'Sparkles',
      link: '/services/en-developpement',
      subServices: [
        'Freeman Transport & Logistique',
        'Freeman Express Shipping',
        'Freeman Retails',
        'Freeman Best Hydrocarbures',
        'Freeman Prestige IMMO',
        'Freeman International School',
        'Freeman Dream Studio',
        'Fondation AFRICA YOUTH FUTURE',
        'ONG FREEMAN GIVEN HAPPINESS'
      ]
    },
    {
      title: 'WAHONOU',
      description: 'Boutique en ligne indépendante pour acheter les produits en stock Freeman.',
      iconName: 'ExternalLink',
      link: 'https://wahornou.bj',
      externalUrl: 'https://wahornou.bj'
    }
  ],
  visibleSections: ['sectors', 'about_teaser', 'cta', 'formations', 'saas', 'team'],
  heroImages: [
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1470&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1470&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?q=80&w=1470&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1470&auto=format&fit=crop"
  ]
};

const defaultContact: ContactCMS = {
  email: "contact@groupfreemanltdsarl.com",
  phone: "+229 00 00 00 00",
  address: "Cotonou, Bénin",
  linkedin: "https://linkedin.com/",
  github: "https://github.com/",
  twitter: "https://twitter.com/",
  facebook: "",
  instagram: "",
  youtube: "",
  socialEnabled: {
    linkedin: true,
    github: true,
    twitter: true,
    facebook: false,
    instagram: false,
    youtube: false
  },
  activePayments: ['visa', 'mastercard', 'momo', 'moov', 'celtis', 'orange', 'wave'],
  partners: [],
  wahornouUrl: 'https://wahornou.bj',
  wahornouLabel: 'WAHONOU',
  wahornouDescription: 'Boutique officielle'
};

const publicContactFields = [
  'email', 'phone', 'address', 'linkedin', 'github', 'twitter', 'facebook',
  'instagram', 'youtube', 'socialEnabled', 'activePayments', 'partners',
  'wahornouUrl', 'wahornouLabel', 'wahornouDescription'
] as const;

function selectPublicContact(data: Record<string, unknown>): Partial<ContactCMS> {
  return Object.fromEntries(
    publicContactFields
      .filter((key) => key in data)
      .map((key) => [key, data[key]])
  ) as Partial<ContactCMS>;
}

export function CMSProvider({ children }: { children: React.ReactNode }) {
  const { userData } = useAuth();
  const canManageDrafts = userData?.role === 'super_admin' || userData?.role === 'admin';
  const canAccessPrivateContact = userData?.role === 'super_admin';
  const [homepageData, setHomepageData] = useState<HomepageCMS>(defaultHomepage);
  const [contactData, setContactData] = useState<ContactCMS>(defaultContact);
  const [contactIntegrations, setContactIntegrations] = useState<Pick<ContactCMS, 'newsletterWebhookUrl' | 'systemeIoFormUrl'>>({});
  const [saasProjectsList, setSaasProjectsList] = useState<SaasProject[]>(saasProjects);
  const [formationsList, setFormationsList] = useState<any[]>(staticFormations);
  const [teamMembersList, setTeamMembersList] = useState<any[]>(teamMembers);
  const [blogArticlesList, setBlogArticlesList] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let homepageLoaded = false;
    const checkHomepage = () => {
      homepageLoaded = true;
      checkAllLoaded();
    };

    let contactLoaded = false;
    const checkContact = () => {
      contactLoaded = true;
      checkAllLoaded();
    };

    let saasLoaded = false;
    const checkSaas = () => {
      saasLoaded = true;
      checkAllLoaded();
    };

    let formationsLoaded = false;
    const checkFormations = () => {
      formationsLoaded = true;
      checkAllLoaded();
    };

    let teamLoaded = false;
    const checkTeam = () => {
      teamLoaded = true;
      checkAllLoaded();
    };

    let blogLoaded = false;
    const checkBlog = () => {
      blogLoaded = true;
      checkAllLoaded();
    };

    const checkAllLoaded = () => {
      if (homepageLoaded && contactLoaded && saasLoaded && formationsLoaded && teamLoaded && blogLoaded) {
        setLoading(false);
      }
    };

    // 1. Abonnement Homepage
    const unsubHomepage = onSnapshot(doc(db, 'cms_content', 'homepage'), (docSnap) => {
      if (docSnap.exists()) {
        const storedData = docSnap.data();
        const storedSectors = Array.isArray(storedData.sectors) ? storedData.sectors : [];
        const missingSectors = defaultHomepage.sectors.filter(defaultSector =>
          !storedSectors.some((storedSector: SectorCMS) => storedSector.title === defaultSector.title)
        );
        setHomepageData({
          ...defaultHomepage,
          ...storedData,
          sectors: [...storedSectors, ...missingSectors]
        } as HomepageCMS);
      } else {
        setHomepageData(defaultHomepage);
      }
      checkHomepage();
    }, (error) => {
      console.error("Erreur Firestore Homepage:", error);
      setHomepageData(defaultHomepage);
      checkHomepage();
    });

    // 2. Abonnement Contact
    const unsubContact = onSnapshot(doc(db, 'cms_content', 'contact'), (docSnap) => {
      if (docSnap.exists()) {
        const storedContact = docSnap.data();
        setContactData({ ...defaultContact, ...selectPublicContact(storedContact) } as ContactCMS);
        if (canAccessPrivateContact) {
          setContactIntegrations((current) => ({
            newsletterWebhookUrl: current.newsletterWebhookUrl || storedContact.newsletterWebhookUrl || '',
            systemeIoFormUrl: current.systemeIoFormUrl || storedContact.systemeIoFormUrl || ''
          }));
        }
      } else {
        setContactData(defaultContact);
      }
      checkContact();
    }, (error) => {
      console.error("Erreur Firestore Contact:", error);
      setContactData(defaultContact);
      checkContact();
    });

    // 3. Abonnement SaaS
    const unsubSaas = onSnapshot(collection(db, 'saas'), (snap) => {
      if (!snap.empty) {
        setSaasProjectsList(snap.docs.map(d => ({ id: d.id, ...d.data() } as SaasProject)));
      } else {
        setSaasProjectsList(saasProjects);
      }
      checkSaas();
    }, (error) => {
      console.error("Erreur Firestore SaaS:", error);
      setSaasProjectsList(saasProjects);
      checkSaas();
    });

    // 4. Abonnement Formations
    const formationsQuery = canManageDrafts
      ? collection(db, 'formations')
      : query(collection(db, 'formations'), where('published', '==', true));
    const unsubFormations = onSnapshot(formationsQuery, (snap) => {
      if (!snap.empty) {
        setFormationsList(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } else {
        setFormationsList(staticFormations);
      }
      checkFormations();
    }, (error) => {
      console.error("Erreur Firestore Formations:", error);
      setFormationsList(staticFormations);
      checkFormations();
    });

    // 5. Abonnement Team
    const unsubTeam = onSnapshot(collection(db, 'team'), (snap) => {
      if (!snap.empty) {
        setTeamMembersList(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } else {
        setTeamMembersList(teamMembers);
      }
      checkTeam();
    }, (error) => {
      console.error("Erreur Firestore Team:", error);
      setTeamMembersList(teamMembers);
      checkTeam();
    });

    // 6. Abonnement Blog
    const unsubBlog = onSnapshot(collection(db, 'blog'), (snap) => {
      const userArticles = snap.docs.map(d => ({ id: d.id, ...d.data() } as BlogArticle));
      const merged = [...userArticles];
      staticArticles.forEach(staticArt => {
        if (!merged.some(art => art.id === staticArt.id)) {
          merged.push(staticArt);
        }
      });
      setBlogArticlesList(merged);
      checkBlog();
    }, (error) => {
      console.error("Erreur Firestore Blog:", error);
      setBlogArticlesList(staticArticles);
      checkBlog();
    });

    let unsubPrivateContact = () => {};
    if (canAccessPrivateContact) {
      unsubPrivateContact = onSnapshot(doc(db, 'cms_private', 'contact_integrations'), (docSnap) => {
        if (docSnap.exists()) {
          setContactIntegrations(docSnap.data() as Pick<ContactCMS, 'newsletterWebhookUrl' | 'systemeIoFormUrl'>);
        }
      }, (error) => {
        console.error('Erreur Firestore intégrations privées:', error);
        setContactIntegrations({});
      });
    } else {
      setContactIntegrations({});
    }

    return () => {
      unsubHomepage();
      unsubContact();
      unsubSaas();
      unsubFormations();
      unsubTeam();
      unsubBlog();
      unsubPrivateContact();
    };
  }, [canManageDrafts, canAccessPrivateContact]);

  // Actions d'enregistrement CMS
  const saveHomepageData = async (data: Partial<HomepageCMS>) => {
    const ref = doc(db, 'cms_content', 'homepage');
    await setDoc(ref, { ...homepageData, ...data }, { merge: true });
  };

  const saveContactData = async (data: Partial<ContactCMS>) => {
    const mergedContact = { ...contactData, ...data } as ContactCMS;
    const integrations = {
      newsletterWebhookUrl: mergedContact.newsletterWebhookUrl || '',
      systemeIoFormUrl: mergedContact.systemeIoFormUrl || ''
    };
    await setDoc(doc(db, 'cms_private', 'contact_integrations'), integrations, { merge: true });
    await setDoc(doc(db, 'cms_content', 'contact'), selectPublicContact(mergedContact));
    setContactIntegrations(integrations);
  };

  const saveSaasProject = async (saas: SaasProject) => {
    const ref = doc(db, 'saas', saas.id || doc(collection(db, 'saas')).id);
    const dataToSave = { ...saas };
    if (!dataToSave.id) {
      dataToSave.id = ref.id;
    }
    await setDoc(ref, dataToSave, { merge: true });
  };

  const deleteSaasProject = async (id: string) => {
    const ref = doc(db, 'saas', id);
    await deleteDoc(ref);
  };

  const saveFormation = async (formation: any) => {
    const ref = doc(db, 'formations', formation.id || doc(collection(db, 'formations')).id);
    const dataToSave = { ...formation };
    if (!dataToSave.id) {
      dataToSave.id = ref.id;
    }
    await setDoc(ref, dataToSave, { merge: true });
  };

  const deleteFormation = async (id: string) => {
    const ref = doc(db, 'formations', id);
    await deleteDoc(ref);
  };

  const saveTeamMember = async (member: any) => {
    const ref = doc(db, 'team', member.id || doc(collection(db, 'team')).id);
    const dataToSave = { ...member };
    if (!dataToSave.id) {
      dataToSave.id = ref.id;
    }
    await setDoc(ref, dataToSave, { merge: true });
  };

  const deleteTeamMember = async (id: string) => {
    const ref = doc(db, 'team', id);
    await deleteDoc(ref);
  };

  const saveBlogArticle = async (article: BlogArticle) => {
    const ref = doc(db, 'blog', article.id || doc(collection(db, 'blog')).id);
    const dataToSave = { ...article };
    if (!dataToSave.id) {
      dataToSave.id = ref.id;
    }
    await setDoc(ref, dataToSave, { merge: true });
  };

  const deleteBlogArticle = async (id: string) => {
    const ref = doc(db, 'blog', id);
    await deleteDoc(ref);
  };

  const [subscribersList, setSubscribersList] = useState<NewsletterSubscriber[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('freeman_subscribers') || '[]');
    } catch {
      return [];
    }
  });

  const subscribeNewsletter = async (email: string, source = 'footer_newsletter') => {
    const newSub: NewsletterSubscriber = {
      email,
      subscribedAt: new Date().toISOString(),
      source
    };

    // 1. Storage dans LocalStorage & Etat React
    const existing = JSON.parse(localStorage.getItem('freeman_subscribers') || '[]');
    const updated = [newSub, ...existing.filter((s: any) => s.email !== email)];
    localStorage.setItem('freeman_subscribers', JSON.stringify(updated));
    setSubscribersList(updated);

    // 2. Storage Firestore
    try {
      const ref = doc(collection(db, 'subscribers'));
      await setDoc(ref, { ...newSub, id: ref.id });
    } catch (err) {
      console.warn("Save subscriber local backup active:", err);
    }

    // 3. Webhook / Systeme.io Sync HTTP POST Dispatch
    const targetUrl = contactData.newsletterWebhookUrl || contactData.systemeIoFormUrl;
    if (targetUrl) {
      try {
        await fetch(targetUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            source,
            timestamp: newSub.subscribedAt,
            brand: 'Freeman Group'
          }),
          mode: 'no-cors'
        });
      } catch (e) {
        console.warn("External Webhook dispatch error:", e);
      }
    }
  };

  return (
    <CMSContext.Provider
      value={{
        homepageData,
        contactData: canAccessPrivateContact ? { ...contactData, ...contactIntegrations } : contactData,
        saasProjectsList,
        formationsList,
        teamMembersList,
        blogArticlesList,
        subscribersList,
        loading,
        saveHomepageData,
        saveContactData,
        saveSaasProject,
        deleteSaasProject,
        saveFormation,
        deleteFormation,
        saveTeamMember,
        deleteTeamMember,
        saveBlogArticle,
        deleteBlogArticle,
        subscribeNewsletter
      }}
    >
      {children}
    </CMSContext.Provider>
  );
}

export function useCMS() {
  const context = useContext(CMSContext);
  if (context === undefined) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
}
