import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router';
import { useCMS, HomepageCMS, ContactCMS } from '../context/CMSContext';
import { auth, db, firebaseConfig } from '../../lib/firebase';
import { initializeApp } from 'firebase/app';
import { updateEmail, updatePassword, getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, updateDoc, setDoc, collection, query, where, getDocs, limit } from 'firebase/firestore';
import { 
  LayoutDashboard, FileText, Settings, Layers, FolderHeart, 
  Award, Users, Save, Plus, Trash2, ArrowLeft, Loader2,
  MapPin, Phone, Mail, HelpCircle, Eye, EyeOff, Check, Lock, LogOut, Menu, X,
  BookOpen, Newspaper
} from 'lucide-react';
import { toast } from 'sonner';
import { SaasProject } from '../data/saas';

export function CmsDashboardPage() {
  const { user, userData, loading: authLoading } = useAuth();
  const { 
    homepageData, contactData, saasProjectsList, formationsList, teamMembersList, blogArticlesList, subscribersList, loading: cmsLoading,
    saveHomepageData, saveContactData, saveSaasProject, deleteSaasProject,
    saveFormation, deleteFormation, saveTeamMember, deleteTeamMember,
    saveBlogArticle, deleteBlogArticle
  } = useCMS();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'hero' | 'sectors' | 'saas' | 'formations' | 'team_contact' | 'layout' | 'profile' | 'blog'>('hero');
  const [saving, setSaving] = useState(false);

  // Blog states
  const [selectedBlogArticle, setSelectedBlogArticle] = useState<any | null>(null);
  const [isEditingBlogArticle, setIsEditingBlogArticle] = useState(false);
  const [previewTab, setPreviewTab] = useState<'card' | 'full' | 'google'>('card');
  const [showAIWriter, setShowAIWriter] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [generatingArticle, setGeneratingArticle] = useState(false);
  const [aiTone, setAiTone] = useState('professionnel');

  // Form State - Hero/General
  const [heroForm, setHeroForm] = useState<Partial<HomepageCMS>>({});
  // Form State - Contact
  const [contactForm, setContactForm] = useState<Partial<ContactCMS>>({});

  // SaaS States
  const [selectedSaas, setSelectedSaas] = useState<Partial<SaasProject> | null>(null);
  const [isEditingSaas, setIsEditingSaas] = useState(false);

  // Formations States
  const [selectedFormation, setSelectedFormation] = useState<any | null>(null);
  const [isEditingFormation, setIsEditingFormation] = useState(false);

  // Team States
  const [selectedMember, setSelectedMember] = useState<any | null>(null);
  const [isEditingMember, setIsEditingMember] = useState(false);

  // Profile States
  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // New Admin States
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [newAdminRole, setNewAdminRole] = useState<'super_admin' | 'moderator'>('super_admin');
  const [creatingAdmin, setCreatingAdmin] = useState(false);

  // New Partner States
  const [partnerName, setPartnerName] = useState('');
  const [partnerLogo, setPartnerLogo] = useState('');

  useEffect(() => {
    if (userData) setProfileName(userData.name || '');
    if (user) setProfileEmail(user.email || '');
  }, [userData, user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSavingProfile(true);
    try {
      if (profileEmail !== user.email) {
        await updateEmail(user, profileEmail);
      }
      await updateDoc(doc(db, 'users', user.uid), {
        name: profileName,
        email: profileEmail
      });
      toast.success("Profil mis à jour avec succès !");
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/requires-recent-login') {
        toast.error("Par sécurité, veuillez vous déconnecter puis vous reconnecter avant de changer votre email.");
      } else {
        toast.error("Erreur : " + err.message);
      }
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (newPassword.length < 6) {
      return toast.error("Le mot de passe doit faire au moins 6 caractères.");
    }
    if (newPassword !== confirmPassword) {
      return toast.error("Les mots de passe ne correspondent pas.");
    }
    setSavingPassword(true);
    try {
      await updatePassword(user, newPassword);
      toast.success("Mot de passe mis à jour avec succès !");
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/requires-recent-login') {
        toast.error("Par sécurité, veuillez vous déconnecter puis vous reconnecter avant de changer votre mot de passe.");
      } else {
        toast.error("Erreur : " + err.message);
      }
    } finally {
      setSavingPassword(false);
    }
  };

  const handleCreateNewAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminName || !newAdminEmail || !newAdminPassword) {
      return toast.error("Veuillez remplir tous les champs.");
    }
    if (newAdminPassword.length < 6) {
      return toast.error("Le mot de passe doit faire au moins 6 caractères.");
    }
    setCreatingAdmin(true);
    try {
      const secondaryApp = initializeApp(firebaseConfig, "CMSSecondary");
      const secondaryAuth = getAuth(secondaryApp);
      
      const userCredential = await createUserWithEmailAndPassword(
        secondaryAuth, 
        newAdminEmail, 
        newAdminPassword
      );
      
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        email: newAdminEmail,
        name: newAdminName,
        role: newAdminRole,
        status: 'active',
        createdAt: new Date().toISOString(),
        walletBalance: 0
      });
      
      await firebaseSignOut(secondaryAuth);
      
      toast.success(`Administrateur ${newAdminName} créé avec succès !`);
      
      setNewAdminName('');
      setNewAdminEmail('');
      setNewAdminPassword('');
    } catch (err: any) {
      console.error(err);
      toast.error("Erreur lors de la création : " + err.message);
    } finally {
      setCreatingAdmin(false);
    }
  };

  // Admin Login States
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  // Bootstrap Setup States
  const [hasSuperAdmin, setHasSuperAdmin] = useState<boolean | null>(null);
  const [setupName, setSetupName] = useState('');
  const [setupEmail, setSetupEmail] = useState('');
  const [setupPassword, setSetupPassword] = useState('');
  const [initializing, setInitializing] = useState(false);
  const [showRegisterDev, setShowRegisterDev] = useState(false);
  const [promoting, setPromoting] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);


  const handlePromoteToAdminDev = async () => {
    if (!user) return;
    setPromoting(true);
    try {
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        name: userData?.name || user.email?.split('@')[0] || 'Admin Dev',
        role: 'super_admin',
        status: 'active',
        createdAt: new Date().toISOString(),
        walletBalance: 0
      }, { merge: true });
      
      toast.success("Votre compte a été promu en Super Admin !");
      setHasSuperAdmin(true);
    } catch (err: any) {
      console.error(err);
      toast.error("Erreur lors de la promotion : " + err.message);
    } finally {
      setPromoting(false);
    }
  };

  useEffect(() => {
    const checkSuperAdmin = async () => {
      try {
        const q = query(collection(db, 'users'), where('role', '==', 'super_admin'), limit(1));
        const snap = await getDocs(q);
        setHasSuperAdmin(!snap.empty);
      } catch (err) {
        console.error("Error checking super_admin:", err);
        setHasSuperAdmin(true); // Fallback so we don't expose setup form on error
      }
    };
    checkSuperAdmin();
  }, []);

  const handleSetupAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!setupName || !setupEmail || !setupPassword) {
      return toast.error("Veuillez remplir tous les champs.");
    }
    if (setupPassword.length < 6) {
      return toast.error("Le mot de passe doit faire au moins 6 caractères.");
    }
    setInitializing(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, setupEmail, setupPassword);
      const newUser = userCredential.user;
      
      await setDoc(doc(db, 'users', newUser.uid), {
        uid: newUser.uid,
        email: setupEmail,
        name: setupName,
        role: 'super_admin',
        status: 'active',
        createdAt: new Date().toISOString(),
        walletBalance: 0
      });
      
      toast.success("Super Administrateur créé et connecté avec succès !");
      setHasSuperAdmin(true);
    } catch (err: any) {
      console.error(err);
      toast.error("Erreur d'initialisation : " + err.message);
    } finally {
      setInitializing(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
      const loggedUser = userCredential.user;
      const userDoc = await getDoc(doc(db, 'users', loggedUser.uid));
      if (userDoc.exists()) {
        const uRole = userDoc.data().role;
        if (['super_admin', 'moderator'].includes(uRole || '')) {
          toast.success("Connexion CMS réussie !");
        } else {
          await firebaseSignOut(auth);
          toast.error("Accès refusé. Ce compte n'a pas les droits d'administration.");
        }
      } else {
        await firebaseSignOut(auth);
        toast.error("Accès refusé. Compte inconnu.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Erreur de connexion : " + err.message);
    } finally {
      setLoggingIn(false);
    }
  };

  const handleAdminLogout = async () => {
    await firebaseSignOut(auth);
    toast.info("Session déconnectée.");
  };

  const handleLogoutAndRedirect = async () => {
    try {
      await firebaseSignOut(auth);
      toast.info("Session déconnectée. Retour au site public.");
      navigate('/');
    } catch (err: any) {
      toast.error("Erreur de déconnexion : " + err.message);
    }
  };

  // Blog CRUD handlers
  const handleEditBlogArticle = (article: any | null) => {
    if (article) {
      setSelectedBlogArticle({ ...article });
    } else {
      setSelectedBlogArticle({
        id: '',
        title: '',
        category: 'Digital & IA',
        date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
        readTime: '5 min',
        desc: '',
        color: '#1A2CB5',
        content: '',
        seoTitle: '',
        seoDesc: '',
        seoKeywords: ''
      });
    }
    setIsEditingBlogArticle(true);
  };

  const handleGenerateSEO = () => {
    if (!selectedBlogArticle) return;
    const title = selectedBlogArticle.title || '';
    const desc = selectedBlogArticle.desc || '';
    const category = selectedBlogArticle.category || '';

    if (!title) {
      toast.error("Veuillez d'abord renseigner le titre de l'article.");
      return;
    }

    const brand = "Freeman Group";
    
    // SEO Title
    let seoTitleGen = `${title.substring(0, 45)} | ${brand}`;
    if (category) {
      seoTitleGen = `${category} : ${title.substring(0, 35)} | ${brand}`;
    }

    // SEO Description
    let seoDescGen = desc 
      ? desc.substring(0, 150) + "..."
      : `Découvrez notre article "${title}" traitant de ${category} par les experts de ${brand}. Lisez la suite pour en savoir plus !`;

    // SEO Keywords
    const keywordsMap: { [key: string]: string } = {
      "Digital & IA": "IA, intelligence artificielle, digital, automation, supply chain, algorithmes, innovation, technologies",
      "BTP & Immobilier": "BTP, immobilier, construction bas carbone, éco-quartier, écoconception, génie civil, bâtiments",
      "Management": "management, hypercroissance, gouvernance, gestion de projet, leadership, scale-up, organisation",
      "Hôtellerie": "hôtellerie de luxe, expérience client, conciergerie digitale, hospitalité, services premium",
      "Aménagement": "space planning, aménagement de bureau, architecture d'intérieur, design collaboratif, espace hybride",
      "Commerce": "phygitalisation, retail, commerce connecté, web-to-store, e-commerce, click and collect, parcours client"
    };

    const words = title.toLowerCase().split(/\s+/).filter(w => w.length > 4);
    const customKeywords = words.slice(0, 4).join(', ');
    const defaultKeywords = keywordsMap[category] || "freeman group, conseils sectoriels, expertise";
    const seoKeywordsGen = `${customKeywords ? customKeywords + ', ' : ''}${defaultKeywords}`;

    setSelectedBlogArticle({
      ...selectedBlogArticle,
      seoTitle: seoTitleGen,
      seoDesc: seoDescGen,
      seoKeywords: seoKeywordsGen
    });
    toast.success("Métadonnées SEO générées avec succès !");
  };

  const handleWriteArticleWithAI = () => {
    if (!aiPrompt) {
      toast.error("Veuillez saisir un sujet ou des mots-clés.");
      return;
    }
    setGeneratingArticle(true);
    
    // Simulate AI generation delay
    setTimeout(() => {
      try {
        const topic = aiPrompt.trim();
        const formattedTopic = topic.charAt(0).toUpperCase() + topic.slice(1);
        
        let cat = "Digital & IA";
        let col = "#1A2CB5";
        const lowerPrompt = topic.toLowerCase();
        
        if (lowerPrompt.includes("btp") || lowerPrompt.includes("construction") || lowerPrompt.includes("immobilier") || lowerPrompt.includes("bâtiment") || lowerPrompt.includes("béton") || lowerPrompt.includes("architecture")) {
          cat = "BTP & Immobilier";
          col = "#ea580c";
        } else if (lowerPrompt.includes("management") || lowerPrompt.includes("leadership") || lowerPrompt.includes("rh") || lowerPrompt.includes("gouvernance") || lowerPrompt.includes("stratégie") || lowerPrompt.includes("équipe") || lowerPrompt.includes("associé")) {
          cat = "Management";
          col = "#047857";
        } else if (lowerPrompt.includes("hôtel") || lowerPrompt.includes("lux") || lowerPrompt.includes("tourisme") || lowerPrompt.includes("voyage") || lowerPrompt.includes("service") || lowerPrompt.includes("hébergement")) {
          cat = "Hôtellerie";
          col = "#b91c1c";
        } else if (lowerPrompt.includes("bureau") || lowerPrompt.includes("espace") || lowerPrompt.includes("design") || lowerPrompt.includes("aménagement") || lowerPrompt.includes("ergonomie")) {
          cat = "Aménagement";
          col = "#6d28d9";
        } else if (lowerPrompt.includes("commerce") || lowerPrompt.includes("retail") || lowerPrompt.includes("vente") || lowerPrompt.includes("phygital") || lowerPrompt.includes("client") || lowerPrompt.includes("magasin") || lowerPrompt.includes("boutique")) {
          cat = "Commerce";
          col = "#0369a1";
        }

        // Title generator
        let titleGen = `Comment ${formattedTopic.toLowerCase()} transforme notre secteur en 2026`;
        if (formattedTopic.startsWith("L") || formattedTopic.startsWith("Les") || formattedTopic.startsWith("L'")) {
          titleGen = `${formattedTopic} : Enjeux et perspectives d'avenir`;
        } else if (formattedTopic.toLowerCase().includes("impact") || formattedTopic.toLowerCase().includes("rôle") || formattedTopic.toLowerCase().includes("défi")) {
          titleGen = formattedTopic;
        } else {
          titleGen = `Analyse stratégique : ${formattedTopic}`;
        }

        // Description generator
        const descGen = `Une analyse approfondie sur ${formattedTopic.toLowerCase()}, explorant les opportunités, les défis de mise en œuvre et les retours d'expérience de nos équipes terrain.`;

        // Content generator
        // Structured content generator answering precisely to user's guidelines:
        // Concis, expliquant la thématique, les raisons, les dangers, pourquoi c'est important, pourquoi il faut agir et les solutions qu'il faut adopter
        const contentGen = `1. Thématique : Comprendre ${formattedTopic.toLowerCase()}
Ce sujet fait référence à ${formattedTopic.toLowerCase()}, un enjeu crucial dans notre secteur d'activité qui englobe l'intégration de méthodes modernes pour restructurer et optimiser les flux de travail.

2. Les raisons de cette évolution
Les raisons principales résident dans la nécessité de s'adapter aux mutations technologiques rapides, de répondre aux nouvelles exigences des clients et de faire face à l'évolution des réglementations.

3. Les dangers et risques encourus
Ignorer ou retarder cette transition présente des dangers majeurs : perte de parts de marché, obsolescence technique, baisse de rentabilité et vulnérabilité face aux acteurs plus agiles.

4. Pourquoi c'est important
Maîtriser ce domaine est indispensable car cela permet de stabiliser les opérations, d'augmenter la productivité, et de poser les fondations d'une croissance à long terme saine et pérenne.

5. Pourquoi il faut agir dès maintenant
L'inaction est aujourd'hui le plus grand risque. Le marché évolue à un rythme exponentiel : prendre du retard maintenant rendra toute mise à niveau future extrêmement coûteuse et complexe.

6. Les solutions et actions à adopter
Chez Freeman Group, nous préconisons le déploiement immédiat des solutions suivantes :
• Auditer en profondeur les processus opérationnels en place.
• Adopter des outils technologiques de pilotage intelligents et agiles.
• Former et accompagner les collaborateurs dans l'assimilation de ces nouveaux frameworks.
Nos experts se tiennent prêts à concevoir avec vous un plan d'action sur-mesure.`;

        // SEO Generator
        const brand = "Freeman Group";
        const seoTitleGen = `${cat} : ${titleGen.substring(0, 35)} | ${brand}`;
        const seoDescGen = descGen.substring(0, 150) + "...";
        
        const words = topic.toLowerCase().split(/\s+/).filter(w => w.length > 4);
        const customKeywords = words.slice(0, 4).join(', ');
        const seoKeywordsGen = `${cat.toLowerCase()}, ${customKeywords ? customKeywords + ', ' : ''}freeman group, innovation`;

        setSelectedBlogArticle({
          id: selectedBlogArticle?.id || '',
          title: titleGen,
          category: cat,
          date: selectedBlogArticle?.date || new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
          readTime: selectedBlogArticle?.readTime || '5 min',
          desc: descGen,
          color: col,
          content: contentGen,
          seoTitle: seoTitleGen,
          seoDesc: seoDescGen,
          seoKeywords: seoKeywordsGen
        });

        setAiPrompt('');
        setShowAIWriter(false);
        toast.success("Article entièrement rédigé par l'IA avec succès !");
      } catch (err: any) {
        toast.error("Erreur de génération : " + err.message);
      } finally {
        setGeneratingArticle(false);
      }
    }, 1500);
  };

  const handleSaveBlogArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBlogArticle) return;
    if (!selectedBlogArticle.title || !selectedBlogArticle.category) {
      toast.error("Le titre et la catégorie sont requis.");
      return;
    }
    setSaving(true);
    try {
      await saveBlogArticle(selectedBlogArticle);
      toast.success("Article de blog enregistré !");
      setIsEditingBlogArticle(false);
      setSelectedBlogArticle(null);
    } catch (err: any) {
      toast.error("Erreur de sauvegarde Blog : " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBlogArticle = async (id: string) => {
    if (!window.confirm("Supprimer définitivement cet article ?")) return;
    try {
      await deleteBlogArticle(id);
      toast.success("Article supprimé.");
    } catch (err: any) {
      toast.error("Erreur : " + err.message);
    }
  };

  // Synchronise form states when CMS data loads
  useEffect(() => {
    if (homepageData) {
      setHeroForm({
        heroBadge: homepageData.heroBadge || '',
        heroTitle: homepageData.heroTitle || '',
        heroSubtitle: homepageData.heroSubtitle || '',
        heroBtnPrimaryText: homepageData.heroBtnPrimaryText || '',
        heroBtnPrimaryLink: homepageData.heroBtnPrimaryLink || '',
        heroBtnSecondaryText: homepageData.heroBtnSecondaryText || '',
        heroBtnSecondaryLink: homepageData.heroBtnSecondaryLink || '',
        aboutTitle: homepageData.aboutTitle || '',
        aboutTeaser1: homepageData.aboutTeaser1 || '',
        aboutTeaser2: homepageData.aboutTeaser2 || '',
        aboutBtnText: homepageData.aboutBtnText || '',
        aboutBtnLink: homepageData.aboutBtnLink || '',
        aboutStatNumber: homepageData.aboutStatNumber || '',
        aboutStatLabel: homepageData.aboutStatLabel || '',
        ctaTitle: homepageData.ctaTitle || '',
        ctaSubtitle: homepageData.ctaSubtitle || '',
        ctaBtnText: homepageData.ctaBtnText || '',
        ctaBtnLink: homepageData.ctaBtnLink || '',
        heroImages: homepageData.heroImages || []
      });
    }
    if (contactData) {
      setContactForm({
        email: contactData.email || '',
        phone: contactData.phone || '',
        address: contactData.address || '',
        linkedin: contactData.linkedin || '',
        github: contactData.github || '',
        twitter: contactData.twitter || '',
        facebook: contactData.facebook || '',
        instagram: contactData.instagram || '',
        youtube: contactData.youtube || '',
        activePayments: contactData.activePayments || [],
        partners: contactData.partners || [],
        newsletterWebhookUrl: contactData.newsletterWebhookUrl || '',
        systemeIoFormUrl: contactData.systemeIoFormUrl || ''
      });
    }
  }, [homepageData, contactData]);

  if (hasSuperAdmin === null || authLoading || cmsLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0A1628]">
        <Loader2 className="animate-spin text-blue-400" size={48} />
      </div>
    );
  }

  const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const isAuthorized = user && userData && ['super_admin', 'moderator'].includes(userData.role || '');

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#070e17] via-[#0A1628] to-[#12233c] flex items-center justify-center p-4 font-sans text-sm">
        <div className="max-w-md w-full bg-white/[0.04] backdrop-blur-2xl border border-white/10 p-8 sm:p-10 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.4)] space-y-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600"></div>
          
          <div className="text-center space-y-3">
            <div className="relative inline-block group">
              <img 
                src="/logo.png" 
                alt="Freeman" 
                className="h-16 mx-auto mb-2 transform hover:scale-105 transition-all duration-300 filter drop-shadow-[0_0_12px_rgba(255,255,255,0.15)]" 
              />
            </div>
            <div>
              <div className="text-[10px] font-extrabold text-blue-400 uppercase tracking-[0.25em] mb-1">Corporate CMS</div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                {hasSuperAdmin === false ? "Configuration Initiale" : "Connexion Administration"}
              </h2>
            </div>
          </div>

          {user ? (
            <div className="space-y-4 text-center">
              <div className="bg-red-500/10 border border-red-500/30 text-red-200 p-5 rounded-2xl font-medium leading-relaxed text-xs">
                Vous êtes connecté en tant que <strong className="text-white block mt-1 font-bold">{user.email}</strong>
                <span className="opacity-80 block mt-2">Ce compte ne possède pas les permissions requises pour gérer le CMS.</span>
              </div>
              <button onClick={handleAdminLogout} className="w-full bg-[#1A2CB5] text-white py-3.5 rounded-xl font-bold hover:bg-white hover:text-black transition-all shadow-md">
                Se connecter avec un autre compte
              </button>
              {isDev && (
                <button 
                  onClick={handlePromoteToAdminDev} 
                  disabled={promoting}
                  className="w-full bg-purple-600 text-white py-3.5 rounded-xl font-bold hover:bg-purple-500 transition-all shadow-md flex items-center justify-center gap-2"
                >
                  {promoting ? <Loader2 className="animate-spin" size={18}/> : "Devenir Super Admin (Dev)"}
                </button>
              )}
            </div>
          ) : (hasSuperAdmin === false || showRegisterDev) ? (
            <form onSubmit={handleSetupAdmin} className="space-y-4 font-bold text-gray-300">
              <div className="bg-blue-500/10 border border-blue-500/20 text-blue-200 p-4 rounded-2xl font-medium leading-relaxed text-xs">
                💡 {hasSuperAdmin === false ? "Aucun compte administrateur n'a été détecté dans la base de données. Initialisez votre premier compte Super Admin." : "Mode Développeur : Créez un compte Super Admin supplémentaire."}
              </div>
              <div>
                <label className="block text-xs mb-1.5 uppercase tracking-wider text-gray-400 font-extrabold">Nom Complet / Entreprise</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Users size={16} />
                  </div>
                  <input 
                    type="text" 
                    required 
                    value={setupName} 
                    onChange={e => setSetupName(e.target.value)} 
                    className="w-full bg-white/5 border border-white/10 pl-10 pr-4 py-3 rounded-xl outline-none focus:border-[#1A2CB5] focus:bg-white/10 hover:border-white/20 text-white font-medium transition-all" 
                    placeholder="Ex: Freeman Group"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs mb-1.5 uppercase tracking-wider text-gray-400 font-extrabold">Adresse Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Mail size={16} />
                  </div>
                  <input 
                    type="email" 
                    required 
                    value={setupEmail} 
                    onChange={e => setSetupEmail(e.target.value)} 
                    className="w-full bg-white/5 border border-white/10 pl-10 pr-4 py-3 rounded-xl outline-none focus:border-[#1A2CB5] focus:bg-white/10 hover:border-white/20 text-white font-medium transition-all" 
                    placeholder="admin@domain.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs mb-1.5 uppercase tracking-wider text-gray-400 font-extrabold">Mot de Passe</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Lock size={16} />
                  </div>
                  <input 
                    type="password" 
                    required 
                    value={setupPassword} 
                    onChange={e => setSetupPassword(e.target.value)} 
                    className="w-full bg-white/5 border border-white/10 pl-10 pr-4 py-3 rounded-xl outline-none focus:border-[#1A2CB5] focus:bg-white/10 hover:border-white/20 text-white font-medium transition-all" 
                    placeholder="Minimum 6 caractères"
                  />
                </div>
              </div>
              <button 
                type="submit" 
                disabled={initializing} 
                className="w-full mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:from-blue-500 hover:to-indigo-500 transition-all shadow-lg shadow-blue-500/10"
              >
                {initializing ? <Loader2 className="animate-spin" size={18}/> : "Créer l'Admin"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleAdminLogin} className="space-y-4 font-bold text-gray-300">
              <div>
                <label className="block text-xs mb-1.5 uppercase tracking-wider text-gray-400 font-extrabold">Adresse Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Mail size={16} />
                  </div>
                  <input 
                    type="email" 
                    required 
                    value={adminEmail} 
                    onChange={e => setAdminEmail(e.target.value)} 
                    className="w-full bg-white/5 border border-white/10 pl-10 pr-4 py-3 rounded-xl outline-none focus:border-[#1A2CB5] focus:bg-white/10 hover:border-white/20 text-white font-medium transition-all" 
                    placeholder="admin@domain.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs mb-1.5 uppercase tracking-wider text-gray-400 font-extrabold">Mot de Passe</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Lock size={16} />
                  </div>
                  <input 
                    type="password" 
                    required 
                    value={adminPassword} 
                    onChange={e => setAdminPassword(e.target.value)} 
                    className="w-full bg-white/5 border border-white/10 pl-10 pr-4 py-3 rounded-xl outline-none focus:border-[#1A2CB5] focus:bg-white/10 hover:border-white/20 text-white font-medium transition-all" 
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <button 
                type="submit" 
                disabled={loggingIn} 
                className="w-full mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:from-blue-500 hover:to-indigo-500 transition-all shadow-lg shadow-blue-500/10"
              >
                {loggingIn ? <Loader2 className="animate-spin" size={18}/> : "Se connecter au CMS"}
              </button>
            </form>
          )}

          <div className="text-center space-y-3 pt-2">
            {isDev && (
              <div>
                <button 
                  type="button" 
                  onClick={() => setShowRegisterDev(!showRegisterDev)} 
                  className="text-xs text-blue-400 hover:text-blue-300 font-bold underline"
                >
                  {showRegisterDev ? "Retour à la Connexion" : "Créer un compte Administrateur (Dev)"}
                </button>
              </div>
            )}
            <div>
              <Link to="/" className="text-xs text-gray-400 hover:text-white transition-colors">← Retour au site public</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }


  // Handle general save
  const handleSaveHeroGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveHomepageData(heroForm);
      toast.success("Contenus Hero et Général enregistrés !");
    } catch (err: any) {
      console.error(err);
      toast.error("Erreur lors de la sauvegarde : " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveContactData(contactForm);
      toast.success("Coordonnées de contact enregistrées !");
    } catch (err: any) {
      console.error(err);
      toast.error("Erreur : " + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Layout visibilities
  const toggleSectionVisibility = async (section: string) => {
    let currentSections = homepageData.visibleSections || [];
    let nextSections: string[];
    if (currentSections.includes(section)) {
      nextSections = currentSections.filter(s => s !== section);
    } else {
      nextSections = [...currentSections, section];
    }
    try {
      await saveHomepageData({ visibleSections: nextSections });
      toast.success("Mise en page mise à jour !");
    } catch (err: any) {
      toast.error("Erreur : " + err.message);
    }
  };

  // SaaS Actions
  const handleEditSaas = (saas: SaasProject | null) => {
    if (saas) {
      setSelectedSaas({ ...saas });
    } else {
      setSelectedSaas({
        id: '',
        slug: '',
        title: '',
        tagline: '',
        vertical: 'IA / LLM',
        status: 'Beta',
        stack: [],
        logo: '🚀',
        description: '',
        problem: '',
        solution: '',
        metrics: { users: '', uptime: '', performance: '', revenue: '' },
        screenshots: [],
        demoUrl: '#'
      });
    }
    setIsEditingSaas(true);
  };

  const handleSaveSaas = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSaas) return;
    if (!selectedSaas.title || !selectedSaas.slug) {
      toast.error("Le titre et le slug sont requis.");
      return;
    }
    setSaving(true);
    try {
      await saveSaasProject(selectedSaas as SaasProject);
      toast.success("Projet SaaS enregistré avec succès !");
      setIsEditingSaas(false);
      setSelectedSaas(null);
    } catch (err: any) {
      toast.error("Erreur SaaS : " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSaas = async (id: string) => {
    if (!window.confirm("Supprimer définitivement ce projet SaaS ?")) return;
    try {
      await deleteSaasProject(id);
      toast.success("Projet SaaS supprimé.");
    } catch (err: any) {
      toast.error("Erreur : " + err.message);
    }
  };

  // Formations Actions
  const handleEditFormation = (formation: any | null) => {
    if (formation) {
      setSelectedFormation({ ...formation });
    } else {
      setSelectedFormation({
        id: '',
        slug: '',
        title: '',
        level: 'Débutant',
        theme: 'Web',
        duration: '6 semaines',
        price: 0,
        students: 0,
        rating: 4.8,
        description: '',
        image: '🎓',
        instructor: 'Freeman LTD',
        program: [
          { module: 'Module 1', chapters: ['Introduction'] }
        ],
        prerequisites: [],
        targetAudience: [],
        whatYouWillLearn: [],
        testimonials: []
      });
    }
    setIsEditingFormation(true);
  };

  const handleSaveFormation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFormation) return;
    if (!selectedFormation.title || !selectedFormation.slug) {
      toast.error("Le titre et le slug sont requis.");
      return;
    }
    setSaving(true);
    try {
      await saveFormation(selectedFormation);
      toast.success("Formation enregistrée avec succès !");
      setIsEditingFormation(false);
      setSelectedFormation(null);
    } catch (err: any) {
      toast.error("Erreur Formation : " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteFormation = async (id: string) => {
    if (!window.confirm("Supprimer définitivement cette formation ?")) return;
    try {
      await deleteFormation(id);
      toast.success("Formation supprimée.");
    } catch (err: any) {
      toast.error("Erreur : " + err.message);
    }
  };

  // Team Actions
  const handleEditMember = (member: any | null) => {
    if (member) {
      setSelectedMember({ ...member });
    } else {
      setSelectedMember({
        id: '',
        name: '',
        role: '',
        image: 'https://i.pravatar.cc/300',
        bio: '',
        social: { linkedin: '', github: '', twitter: '' },
        skills: []
      });
    }
    setIsEditingMember(true);
  };

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember) return;
    if (!selectedMember.name || !selectedMember.role) {
      toast.error("Le nom et le rôle sont requis.");
      return;
    }
    setSaving(true);
    try {
      await saveTeamMember(selectedMember);
      toast.success("Membre d'équipe enregistré !");
      setIsEditingMember(false);
      setSelectedMember(null);
    } catch (err: any) {
      toast.error("Erreur Membre : " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (!window.confirm("Supprimer définitivement ce membre ?")) return;
    try {
      await deleteTeamMember(id);
      toast.success("Membre supprimé.");
    } catch (err: any) {
      toast.error("Erreur : " + err.message);
    }
  };

  return (
    <div className="w-full bg-[#f8f9fa] min-h-screen flex text-sm flex-col md:flex-row font-sans relative overflow-x-hidden">
      
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-[#0A1628] text-white p-4 flex items-center justify-between shadow-md z-30 sticky top-0">
        <div className="flex items-center gap-3">
          <Link to="/"><img src="/logo.png" alt="Freeman" className="h-8 brightness-0 invert opacity-90" /></Link>
          <span className="text-xs font-black uppercase tracking-widest text-blue-400">CMS</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
          className="p-2 text-gray-400 hover:text-white transition-colors"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Backdrop overlay for mobile */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)} 
          className="fixed inset-0 bg-black/60 z-25 md:hidden animate-in fade-in duration-200" 
        />
      )}

      {/* Sidebar CMS */}
      <div className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out w-64 bg-[#0A1628] text-white p-6 flex flex-col shadow-2xl z-30 h-screen md:h-auto`}>
         <div className="mb-8 text-center">
            <Link to="/"><img src="/logo.png" alt="Freeman" className="h-10 mx-auto brightness-0 invert opacity-90 mb-4" /></Link>
            <div className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Corporate CMS</div>
            <div className="text-lg font-black text-white mb-4">Gestion du Site</div>

            {/* Quick Actions Header */}
            <div className="flex flex-col gap-2 bg-white/5 p-3 rounded-2xl border border-white/5 text-left mb-2">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide truncate">
                Admin: <span className="text-blue-300 font-extrabold">{userData?.name || user?.email}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <button
                  onClick={() => { setActiveTab('profile'); setIsSidebarOpen(false); }}
                  className="bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white px-2 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wide transition-colors flex items-center justify-center gap-1 cursor-pointer animate-pulse"
                >
                  <Users size={10} /> Profil
                </button>
                <button
                  onClick={handleAdminLogout}
                  className="bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 px-2 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wide transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <LogOut size={10} /> Déconnecter
                </button>
              </div>
              <button
                onClick={handleLogoutAndRedirect}
                className="w-full bg-[#1A2CB5] hover:bg-blue-600 text-white py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5 mt-1 cursor-pointer"
              >
                <ArrowLeft size={10} /> Retour & Déconnexion
              </button>
            </div>
         </div>
         
         <div className="space-y-2 flex-1 overflow-y-auto pr-1">
            <button onClick={() => { setActiveTab('hero'); setIsSidebarOpen(false); setIsEditingSaas(false); setIsEditingFormation(false); setIsEditingMember(false); setIsEditingBlogArticle(false); }} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors font-bold ${activeTab === 'hero' ? 'bg-[#1A2CB5] text-white' : 'text-gray-400 hover:bg-white/5'}`}>
              <FileText size={18} /> Général & Hero
            </button>
            <button onClick={() => { setActiveTab('sectors'); setIsSidebarOpen(false); setIsEditingSaas(false); setIsEditingFormation(false); setIsEditingMember(false); setIsEditingBlogArticle(false); }} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors font-bold ${activeTab === 'sectors' ? 'bg-[#1A2CB5] text-white' : 'text-gray-400 hover:bg-white/5'}`}>
              <Layers size={18} /> Secteurs du Groupe
            </button>
            <button onClick={() => { setActiveTab('saas'); setIsSidebarOpen(false); setIsEditingSaas(false); setIsEditingFormation(false); setIsEditingMember(false); setIsEditingBlogArticle(false); }} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors font-bold ${activeTab === 'saas' ? 'bg-[#1A2CB5] text-white' : 'text-gray-400 hover:bg-white/5'}`}>
              <FolderHeart size={18} /> Projets SaaS
            </button>
            <button onClick={() => { setActiveTab('formations'); setIsSidebarOpen(false); setIsEditingSaas(false); setIsEditingFormation(false); setIsEditingMember(false); setIsEditingBlogArticle(false); }} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors font-bold ${activeTab === 'formations' ? 'bg-[#1A2CB5] text-white' : 'text-gray-400 hover:bg-white/5'}`}>
              <Award size={18} /> Catalogue Formations
            </button>
            <button onClick={() => { setActiveTab('blog'); setIsSidebarOpen(false); setIsEditingSaas(false); setIsEditingFormation(false); setIsEditingMember(false); setIsEditingBlogArticle(false); }} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors font-bold ${activeTab === 'blog' ? 'bg-[#1A2CB5] text-white' : 'text-gray-400 hover:bg-white/5'}`}>
              <Newspaper size={18} /> Articles Blog
            </button>
            <button onClick={() => { setActiveTab('team_contact'); setIsSidebarOpen(false); setIsEditingSaas(false); setIsEditingFormation(false); setIsEditingMember(false); setIsEditingBlogArticle(false); }} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors font-bold ${activeTab === 'team_contact' ? 'bg-[#1A2CB5] text-white' : 'text-gray-400 hover:bg-white/5'}`}>
              <Users size={18} /> Équipe & Contacts
            </button>
            <button onClick={() => { setActiveTab('layout'); setIsSidebarOpen(false); setIsEditingSaas(false); setIsEditingFormation(false); setIsEditingMember(false); setIsEditingBlogArticle(false); }} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors font-bold ${activeTab === 'layout' ? 'bg-[#1A2CB5] text-white' : 'text-gray-400 hover:bg-white/5'}`}>
              <Settings size={18} /> Structure Page
            </button>
            <button onClick={() => { setActiveTab('profile'); setIsSidebarOpen(false); setIsEditingSaas(false); setIsEditingFormation(false); setIsEditingMember(false); setIsEditingBlogArticle(false); }} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors font-bold ${activeTab === 'profile' ? 'bg-[#1A2CB5] text-white' : 'text-gray-400 hover:bg-white/5'}`}>
              <Lock size={18} /> Mon Compte
            </button>
         </div>

          <div className="mt-auto pt-6 border-t border-white/10 text-center text-xs text-gray-500 font-extrabold uppercase tracking-widest">
             Freeman Group v1.2.0
          </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto w-full">
        
        {/* =======================
            TAB: HERO & GENERAL
           ======================= */}
        {activeTab === 'hero' && (
          <div className="w-full max-w-7xl mx-auto animate-in fade-in duration-300">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
              <div>
                <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3"><FileText className="text-[#1A2CB5]"/> Général & Hero Section</h1>
                <p className="text-gray-500 font-medium mt-1">Configurez le message d'accueil principal et les accroches vitrines.</p>
              </div>
            </div>

            <form onSubmit={handleSaveHeroGeneral} className="space-y-6">
              <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
                <h2 className="text-lg font-bold text-gray-900 border-b pb-2">Hero Header</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-1">Badge Flottant (Top)</label>
                    <input type="text" value={heroForm.heroBadge || ''} onChange={e => setHeroForm({...heroForm, heroBadge: e.target.value})} className="w-full border border-gray-200 p-3 rounded-xl focus:border-[#1A2CB5] outline-none font-medium" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Titre Principal (Sauter de ligne avec \n)</label>
                    <textarea rows={4} value={heroForm.heroTitle || ''} onChange={e => setHeroForm({...heroForm, heroTitle: e.target.value})} className="w-full border border-gray-200 p-3 rounded-xl focus:border-[#1A2CB5] outline-none font-bold text-xl h-[115px]" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Sous-titre explicatif</label>
                    <textarea rows={4} value={heroForm.heroSubtitle || ''} onChange={e => setHeroForm({...heroForm, heroSubtitle: e.target.value})} className="w-full border border-gray-200 p-3 rounded-xl focus:border-[#1A2CB5] outline-none font-medium text-gray-600 leading-relaxed h-[115px]" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Texte Bouton Principal</label>
                    <input type="text" value={heroForm.heroBtnPrimaryText || ''} onChange={e => setHeroForm({...heroForm, heroBtnPrimaryText: e.target.value})} className="w-full border border-gray-200 p-3 rounded-xl focus:border-[#1A2CB5] outline-none font-semibold" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Lien Bouton Principal</label>
                    <input type="text" value={heroForm.heroBtnPrimaryLink || ''} onChange={e => setHeroForm({...heroForm, heroBtnPrimaryLink: e.target.value})} className="w-full border border-gray-200 p-3 rounded-xl focus:border-[#1A2CB5] outline-none font-mono text-xs" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Texte Bouton Secondaire</label>
                    <input type="text" value={heroForm.heroBtnSecondaryText || ''} onChange={e => setHeroForm({...heroForm, heroBtnSecondaryText: e.target.value})} className="w-full border border-gray-200 p-3 rounded-xl focus:border-[#1A2CB5] outline-none font-semibold" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Lien Bouton Secondaire</label>
                    <input type="text" value={heroForm.heroBtnSecondaryLink || ''} onChange={e => setHeroForm({...heroForm, heroBtnSecondaryLink: e.target.value})} className="w-full border border-gray-200 p-3 rounded-xl focus:border-[#1A2CB5] outline-none font-mono text-xs" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
                <h2 className="text-lg font-bold text-gray-900 border-b pb-2">Section À Propos Teaser</h2>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Titre d'Accroche</label>
                    <input type="text" value={heroForm.aboutTitle || ''} onChange={e => setHeroForm({...heroForm, aboutTitle: e.target.value})} className="w-full border border-gray-200 p-3 rounded-xl focus:border-[#1A2CB5] outline-none font-bold" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Paragraphe 1</label>
                    <textarea rows={3} value={heroForm.aboutTeaser1 || ''} onChange={e => setHeroForm({...heroForm, aboutTeaser1: e.target.value})} className="w-full border border-gray-200 p-3 rounded-xl focus:border-[#1A2CB5] outline-none font-medium text-gray-600" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Paragraphe 2</label>
                    <textarea rows={3} value={heroForm.aboutTeaser2 || ''} onChange={e => setHeroForm({...heroForm, aboutTeaser2: e.target.value})} className="w-full border border-gray-200 p-3 rounded-xl focus:border-[#1A2CB5] outline-none font-medium text-gray-600" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Chiffre Clé (Metric)</label>
                      <input type="text" value={heroForm.aboutStatNumber || ''} onChange={e => setHeroForm({...heroForm, aboutStatNumber: e.target.value})} className="w-full border border-gray-200 p-3 rounded-xl focus:border-[#1A2CB5] outline-none font-black text-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Label Clé</label>
                      <input type="text" value={heroForm.aboutStatLabel || ''} onChange={e => setHeroForm({...heroForm, aboutStatLabel: e.target.value})} className="w-full border border-gray-200 p-3 rounded-xl focus:border-[#1A2CB5] outline-none font-medium" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
                <h2 className="text-lg font-bold text-gray-900 border-b pb-2">Bandeau d'Appel à l'Action (CTA)</h2>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Titre CTA</label>
                    <input type="text" value={heroForm.ctaTitle || ''} onChange={e => setHeroForm({...heroForm, ctaTitle: e.target.value})} className="w-full border border-gray-200 p-3 rounded-xl focus:border-[#1A2CB5] outline-none font-bold" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Sous-titre CTA</label>
                    <textarea rows={2} value={heroForm.ctaSubtitle || ''} onChange={e => setHeroForm({...heroForm, ctaSubtitle: e.target.value})} className="w-full border border-gray-200 p-3 rounded-xl focus:border-[#1A2CB5] outline-none font-medium text-gray-600" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Texte Bouton CTA</label>
                      <input type="text" value={heroForm.ctaBtnText || ''} onChange={e => setHeroForm({...heroForm, ctaBtnText: e.target.value})} className="w-full border border-gray-200 p-3 rounded-xl focus:border-[#1A2CB5] outline-none font-semibold" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Lien Bouton CTA</label>
                      <input type="text" value={heroForm.ctaBtnLink || ''} onChange={e => setHeroForm({...heroForm, ctaBtnLink: e.target.value})} className="w-full border border-gray-200 p-3 rounded-xl focus:border-[#1A2CB5] outline-none font-mono text-xs" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
                <h2 className="text-lg font-bold text-gray-900 border-b pb-2">Images du Diaporama (Hero Background Slider)</h2>
                <p className="text-xs text-gray-500 font-medium">Spécifiez 3 à 4 URLs d'images pour l'arrière-plan animé de votre page d'accueil.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[0, 1, 2, 3].map((index) => (
                    <div key={index}>
                      <label className="block text-xs font-bold text-gray-600 mb-1">Image #{index + 1}</label>
                      <input 
                        type="text" 
                        value={(heroForm.heroImages && heroForm.heroImages[index]) || ''} 
                        onChange={e => {
                          const newImages = [...(heroForm.heroImages || [])];
                          while (newImages.length <= index) {
                            newImages.push('');
                          }
                          newImages[index] = e.target.value;
                          setHeroForm({...heroForm, heroImages: newImages});
                        }} 
                        placeholder="https://images.unsplash.com/..."
                        className="w-full border border-gray-200 p-2.5 rounded-lg font-mono text-xs focus:border-[#1A2CB5] outline-none" 
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button type="submit" disabled={saving} className="bg-[#1A2CB5] text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-black transition-colors shadow-lg">
                  {saving ? <Loader2 className="animate-spin" size={20}/> : <Save size={20}/>}
                  Enregistrer les modifications
                </button>
              </div>
            </form>
          </div>
        )}

        {/* =======================
            TAB: SECTORS
           ======================= */}
        {activeTab === 'sectors' && (
          <div className="w-full max-w-7xl mx-auto animate-in fade-in duration-300">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
              <div>
                <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3"><Layers className="text-[#1A2CB5]"/> Secteurs d'Activité (Les 6 Pôles)</h1>
                <p className="text-gray-500 font-medium mt-1">Éditez les blocs de présentation des pôles d'activités sur la page d'accueil.</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(homepageData.sectors || []).map((sector, idx) => (
                  <div key={idx} className="border border-gray-100 p-6 rounded-2xl bg-gray-50/50 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="bg-[#1A2CB5]/10 text-[#1A2CB5] px-3 py-1 rounded-full text-xs font-black">PÔLE #{idx + 1}</span>
                      <span className="font-mono text-xs text-gray-400">Icône : {sector.iconName}</span>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Nom du Pôle</label>
                        <input 
                          type="text" 
                          value={sector.title} 
                          onChange={e => {
                            const newSectors = [...(homepageData.sectors || [])];
                            newSectors[idx].title = e.target.value;
                            saveHomepageData({ sectors: newSectors });
                          }} 
                          className="w-full bg-white border border-gray-200 p-2.5 rounded-lg font-bold" 
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Description courte</label>
                        <textarea 
                          rows={2} 
                          value={sector.description} 
                          onChange={e => {
                            const newSectors = [...(homepageData.sectors || [])];
                            newSectors[idx].description = e.target.value;
                            saveHomepageData({ sectors: newSectors });
                          }} 
                          className="w-full bg-white border border-gray-200 p-2.5 rounded-lg font-medium text-gray-600" 
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Lien de navigation</label>
                        <input 
                          type="text" 
                          value={sector.link} 
                          onChange={e => {
                            const newSectors = [...(homepageData.sectors || [])];
                            newSectors[idx].link = e.target.value;
                            saveHomepageData({ sectors: newSectors });
                          }} 
                          className="w-full bg-white border border-gray-200 p-2.5 rounded-lg font-mono text-xs text-gray-600" 
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =======================
            TAB: SAAS PROJECTS
           ======================= */}
        {activeTab === 'saas' && (
          <div className="w-full max-w-7xl mx-auto animate-in fade-in duration-300">
            {!isEditingSaas ? (
              <>
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
                  <div>
                    <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3"><FolderHeart className="text-[#1A2CB5]"/> Vitrine Projets SaaS</h1>
                    <p className="text-gray-500 font-medium mt-1">Gérez le catalogue des applications SaaS présentées sur le site vitrine.</p>
                  </div>
                  <button onClick={() => handleEditSaas(null)} className="bg-[#1A2CB5] text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-black transition-colors shadow-sm">
                    <Plus size={18} /> Nouveau Projet SaaS
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {saasProjectsList.map(project => (
                    <div key={project.id} className="bg-white border border-gray-200 p-6 rounded-2xl flex flex-col justify-between shadow-sm">
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <span className="text-3xl">{project.logo}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            project.status === 'En production' ? 'bg-green-50 text-green-700' :
                            project.status === 'Beta' ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-700'
                          }`}>{project.status}</span>
                        </div>
                        <h3 className="font-bold text-base text-gray-900">{project.title}</h3>
                        <p className="text-xs text-blue-600 font-bold mb-2">{project.vertical}</p>
                        <p className="text-gray-500 text-xs line-clamp-3 font-medium">{project.description}</p>
                      </div>
                      <div className="flex gap-2 mt-6 pt-4 border-t border-gray-100">
                        <button onClick={() => handleEditSaas(project)} className="flex-1 py-2 bg-gray-50 text-gray-700 rounded-lg font-bold hover:bg-[#1A2CB5] hover:text-white transition-all text-center">Modifier</button>
                        <button onClick={() => handleDeleteSaas(project.id)} className="p-2 text-red-500 bg-red-50 hover:bg-red-500 hover:text-white rounded-lg transition-all"><Trash2 size={16}/></button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="w-full max-w-5xl mx-auto bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
                <div className="flex items-center justify-between mb-6 pb-4 border-b">
                  <h2 className="text-xl font-black text-gray-900">{selectedSaas?.id ? 'Modifier le SaaS' : 'Créer un Projet SaaS'}</h2>
                  <button onClick={() => setIsEditingSaas(false)} className="text-gray-500 hover:text-black font-bold flex items-center gap-1"><ArrowLeft size={16}/> Retour</button>
                </div>

                <form onSubmit={handleSaveSaas} className="space-y-4 font-bold text-gray-700">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs mb-1">Nom du SaaS</label>
                      <input type="text" required value={selectedSaas?.title || ''} onChange={e => setSelectedSaas({...selectedSaas!, title: e.target.value})} className="w-full border p-2.5 rounded-lg outline-none focus:border-[#1A2CB5] font-medium" />
                    </div>
                    <div>
                      <label className="block text-xs mb-1">Slug d'URL (ex: mon-saas)</label>
                      <input type="text" required value={selectedSaas?.slug || ''} onChange={e => setSelectedSaas({...selectedSaas!, slug: e.target.value})} className="w-full border p-2.5 rounded-lg outline-none font-mono text-xs" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs mb-1">Logo (Émoji / Icône)</label>
                      <input type="text" value={selectedSaas?.logo || ''} onChange={e => setSelectedSaas({...selectedSaas!, logo: e.target.value})} className="w-full border p-2.5 rounded-lg outline-none text-center text-lg" />
                    </div>
                    <div>
                      <label className="block text-xs mb-1">Verticale</label>
                      <select value={selectedSaas?.vertical || 'IA / LLM'} onChange={e => setSelectedSaas({...selectedSaas!, vertical: e.target.value as any})} className="w-full border p-2.5 rounded-lg outline-none bg-white">
                        <option value="IA / LLM">IA / LLM</option>
                        <option value="Niche Métier">Niche Métier</option>
                        <option value="Productivité Dev">Productivité Dev</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs mb-1">Statut</label>
                      <select value={selectedSaas?.status || 'Beta'} onChange={e => setSelectedSaas({...selectedSaas!, status: e.target.value as any})} className="w-full border p-2.5 rounded-lg outline-none bg-white">
                        <option value="En production">En Production</option>
                        <option value="Beta">Beta</option>
                        <option value="Stealth">Stealth</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs mb-1">Tagline accrocheur</label>
                    <input type="text" value={selectedSaas?.tagline || ''} onChange={e => setSelectedSaas({...selectedSaas!, tagline: e.target.value})} className="w-full border p-2.5 rounded-lg outline-none font-medium" />
                  </div>

                  <div>
                    <label className="block text-xs mb-1">Description générale</label>
                    <textarea rows={3} value={selectedSaas?.description || ''} onChange={e => setSelectedSaas({...selectedSaas!, description: e.target.value})} className="w-full border p-2.5 rounded-lg outline-none font-medium resize-none" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs mb-1">Le Problème adressé</label>
                      <textarea rows={2} value={selectedSaas?.problem || ''} onChange={e => setSelectedSaas({...selectedSaas!, problem: e.target.value})} className="w-full border p-2.5 rounded-lg outline-none font-medium text-red-600 resize-none" />
                    </div>
                    <div>
                      <label className="block text-xs mb-1">La Solution apportée</label>
                      <textarea rows={2} value={selectedSaas?.solution || ''} onChange={e => setSelectedSaas({...selectedSaas!, solution: e.target.value})} className="w-full border p-2.5 rounded-lg outline-none font-medium text-green-600 resize-none" />
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                    <h4 className="text-xs uppercase tracking-wider text-gray-400">Métriques de réussite</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] text-gray-500 mb-1">Utilisateurs (ex: 2500+ actifs)</label>
                        <input type="text" value={selectedSaas?.metrics?.users || ''} onChange={e => setSelectedSaas({...selectedSaas!, metrics: {...selectedSaas!.metrics, users: e.target.value}})} className="w-full border p-2 bg-white rounded font-medium" />
                      </div>
                      <div>
                        <label className="block text-[10px] text-gray-500 mb-1">Performance (ex: &lt; 200ms)</label>
                        <input type="text" value={selectedSaas?.metrics?.performance || ''} onChange={e => setSelectedSaas({...selectedSaas!, metrics: {...selectedSaas!.metrics, performance: e.target.value}})} className="w-full border p-2 bg-white rounded font-medium" />
                      </div>
                      <div>
                        <label className="block text-[10px] text-gray-500 mb-1">Disponibilité (ex: 99.9%)</label>
                        <input type="text" value={selectedSaas?.metrics?.uptime || ''} onChange={e => setSelectedSaas({...selectedSaas!, metrics: {...selectedSaas!.metrics, uptime: e.target.value}})} className="w-full border p-2 bg-white rounded font-medium" />
                      </div>
                      <div>
                        <label className="block text-[10px] text-gray-500 mb-1">Revenu (ex: Croissance 45%)</label>
                        <input type="text" value={selectedSaas?.metrics?.revenue || ''} onChange={e => setSelectedSaas({...selectedSaas!, metrics: {...selectedSaas!.metrics, revenue: e.target.value}})} className="w-full border p-2 bg-white rounded font-medium" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs mb-1">Technologies utilisées (Séparées par virgules)</label>
                    <input 
                      type="text" 
                      placeholder="React, Next.js, Node.js"
                      value={selectedSaas?.stack?.join(', ') || ''} 
                      onChange={e => setSelectedSaas({...selectedSaas!, stack: e.target.value.split(',').map(x => x.trim()).filter(Boolean)})} 
                      className="w-full border p-2.5 rounded-lg outline-none font-medium" 
                    />
                  </div>

                  <button type="submit" disabled={saving} className="w-full mt-4 bg-[#1A2CB5] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-colors shadow-md">
                    {saving ? <Loader2 className="animate-spin" size={18}/> : <Save size={18}/>} Enregistrer le SaaS
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* =======================
            TAB: CATALOGUE FORMATIONS
           ======================= */}
        {activeTab === 'formations' && (
          <div className="w-full max-w-7xl mx-auto animate-in fade-in duration-300">
            {!isEditingFormation ? (
              <>
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
                  <div>
                    <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3"><Award className="text-[#1A2CB5]"/> Catalogue des Formations</h1>
                    <p className="text-gray-500 font-medium mt-1">Gérez le catalogue des formations institutionnelles proposées par Freeman LTD.</p>
                  </div>
                  <button onClick={() => handleEditFormation(null)} className="bg-[#1A2CB5] text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-black transition-colors shadow-sm">
                    <Plus size={18} /> Nouvelle Formation
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {formationsList.map(formation => (
                    <div key={formation.id} className="bg-white border border-gray-200 p-6 rounded-2xl flex flex-col justify-between shadow-sm">
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <span className="text-3xl">{formation.image || '🎓'}</span>
                          <span className="bg-orange-50 text-orange-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase">{formation.theme}</span>
                        </div>
                        <h3 className="font-bold text-base text-gray-900 leading-tight">{formation.title}</h3>
                        <p className="text-xs text-gray-400 font-bold mb-2">Niveau : {formation.level} | Durée : {formation.duration}</p>
                        <p className="text-gray-500 text-xs line-clamp-3 font-medium">{formation.description}</p>
                        <p className="mt-4 text-base font-black text-[#1A2CB5]">{formation.price} € / H.T.</p>
                      </div>
                      <div className="flex gap-2 mt-6 pt-4 border-t border-gray-100">
                        <button onClick={() => handleEditFormation(formation)} className="flex-1 py-2 bg-gray-50 text-gray-700 rounded-lg font-bold hover:bg-[#1A2CB5] hover:text-white transition-all text-center">Modifier</button>
                        <button onClick={() => handleDeleteFormation(formation.id)} className="p-2 text-red-500 bg-red-50 hover:bg-red-500 hover:text-white rounded-lg transition-all"><Trash2 size={16}/></button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="w-full max-w-5xl mx-auto bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
                <div className="flex items-center justify-between mb-6 pb-4 border-b">
                  <h2 className="text-xl font-black text-gray-900">{selectedFormation?.id ? 'Modifier la Formation' : 'Créer une Formation'}</h2>
                  <button onClick={() => setIsEditingFormation(false)} className="text-gray-500 hover:text-black font-bold flex items-center gap-1"><ArrowLeft size={16}/> Retour</button>
                </div>

                <form onSubmit={handleSaveFormation} className="space-y-4 font-bold text-gray-700">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs mb-1">Titre de la Formation</label>
                      <input type="text" required value={selectedFormation?.title || ''} onChange={e => setSelectedFormation({...selectedFormation!, title: e.target.value})} className="w-full border p-2.5 rounded-lg outline-none font-medium" />
                    </div>
                    <div>
                      <label className="block text-xs mb-1">Slug d'URL (ex: formation-fullstack)</label>
                      <input type="text" required value={selectedFormation?.slug || ''} onChange={e => setSelectedFormation({...selectedFormation!, slug: e.target.value})} className="w-full border p-2.5 rounded-lg outline-none font-mono text-xs" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs mb-1">Image / Émoji</label>
                      <input type="text" value={selectedFormation?.image || ''} onChange={e => setSelectedFormation({...selectedFormation!, image: e.target.value})} className="w-full border p-2.5 rounded-lg text-center" />
                    </div>
                    <div>
                      <label className="block text-xs mb-1">Durée (ex: 8 semaines)</label>
                      <input type="text" value={selectedFormation?.duration || ''} onChange={e => setSelectedFormation({...selectedFormation!, duration: e.target.value})} className="w-full border p-2.5 rounded-lg font-medium" />
                    </div>
                    <div>
                      <label className="block text-xs mb-1">Niveau</label>
                      <select value={selectedFormation?.level || 'Débutant'} onChange={e => setSelectedFormation({...selectedFormation!, level: e.target.value})} className="w-full border p-2.5 rounded-lg outline-none bg-white">
                        <option value="Débutant">Débutant</option>
                        <option value="Intermédiaire">Intermédiaire</option>
                        <option value="Avancé">Avancé</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs mb-1">Thème</label>
                      <select value={selectedFormation?.theme || 'Web'} onChange={e => setSelectedFormation({...selectedFormation!, theme: e.target.value})} className="w-full border p-2.5 rounded-lg outline-none bg-white">
                        <option value="Web">Web</option>
                        <option value="IA">IA</option>
                        <option value="SaaS">SaaS</option>
                        <option value="Growth">Growth</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs mb-1">Prix (€ H.T.)</label>
                      <input type="number" required value={selectedFormation?.price || 0} onChange={e => setSelectedFormation({...selectedFormation!, price: Number(e.target.value)})} className="w-full border p-2.5 rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-xs mb-1">Nombre d'élèves</label>
                      <input type="number" value={selectedFormation?.students || 0} onChange={e => setSelectedFormation({...selectedFormation!, students: Number(e.target.value)})} className="w-full border p-2.5 rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-xs mb-1">Note moyenne (sur 5)</label>
                      <input type="number" step="0.1" max="5" value={selectedFormation?.rating || 4.8} onChange={e => setSelectedFormation({...selectedFormation!, rating: Number(e.target.value)})} className="w-full border p-2.5 rounded-lg" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs mb-1">Description courte</label>
                    <textarea rows={3} value={selectedFormation?.description || ''} onChange={e => setSelectedFormation({...selectedFormation!, description: e.target.value})} className="w-full border p-2.5 rounded-lg outline-none font-medium resize-none" />
                  </div>

                  <div>
                    <label className="block text-xs mb-1">Prérequis (Séparés par des virgules)</label>
                    <input type="text" value={selectedFormation?.prerequisites?.join(', ') || ''} onChange={e => setSelectedFormation({...selectedFormation!, prerequisites: e.target.value.split(',').map(x => x.trim()).filter(Boolean)})} className="w-full border p-2.5 rounded-lg font-medium" placeholder="Bases en JS, Connaissances en Web..." />
                  </div>

                  <div>
                    <label className="block text-xs mb-1">Ce que l'élève va apprendre (Séparés par des virgules)</label>
                    <textarea rows={2} value={selectedFormation?.whatYouWillLearn?.join(', ') || ''} onChange={e => setSelectedFormation({...selectedFormation!, whatYouWillLearn: e.target.value.split(',').map(x => x.trim()).filter(Boolean)})} className="w-full border p-2.5 rounded-lg font-medium resize-none" placeholder="Créer des API, Sécuriser des apps..." />
                  </div>

                  <button type="submit" disabled={saving} className="w-full mt-4 bg-[#1A2CB5] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-colors shadow-md">
                    {saving ? <Loader2 className="animate-spin" size={18}/> : <Save size={18}/>} Enregistrer la formation
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* =======================
            TAB: TEAM & CONTACT
           ======================= */}
        {activeTab === 'team_contact' && (
          <div className="w-full max-w-7xl mx-auto animate-in fade-in duration-300 space-y-12">
            
            {/* Contacts vitrine */}
            <div className="w-full bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
              <h2 className="text-xl font-black text-gray-900 flex items-center gap-2 mb-6 border-b pb-3"><Phone className="text-[#1A2CB5]"/> Coordonnées de Contact Freeman</h2>
              <form onSubmit={handleSaveContact} className="space-y-4 font-bold text-gray-700">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-bold text-gray-700">
                  <div>
                    <label className="block mb-1">Email de Contact</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="email" value={contactForm.email || ''} onChange={e => setContactForm({...contactForm, email: e.target.value})} className="w-full pl-10 pr-3 py-2.5 border rounded-lg font-medium" />
                    </div>
                  </div>
                  <div>
                    <label className="block mb-1">Téléphone Principal</label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="text" value={contactForm.phone || ''} onChange={e => setContactForm({...contactForm, phone: e.target.value})} className="w-full pl-10 pr-3 py-2.5 border rounded-lg font-medium" />
                    </div>
                  </div>
                  <div>
                    <label className="block mb-1">Adresse Siège Social</label>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="text" value={contactForm.address || ''} onChange={e => setContactForm({...contactForm, address: e.target.value})} className="w-full pl-10 pr-3 py-2.5 border rounded-lg font-medium" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block mb-1">Lien LinkedIn</label>
                    <input type="text" value={contactForm.linkedin || ''} onChange={e => setContactForm({...contactForm, linkedin: e.target.value})} className="w-full p-2.5 border rounded-lg font-mono text-xs text-gray-600 focus:border-[#1A2CB5] outline-none" />
                  </div>
                  <div>
                    <label className="block mb-1">Lien GitHub</label>
                    <input type="text" value={contactForm.github || ''} onChange={e => setContactForm({...contactForm, github: e.target.value})} className="w-full p-2.5 border rounded-lg font-mono text-xs text-gray-600 focus:border-[#1A2CB5] outline-none" />
                  </div>
                  <div>
                    <label className="block mb-1">Lien Twitter</label>
                    <input type="text" value={contactForm.twitter || ''} onChange={e => setContactForm({...contactForm, twitter: e.target.value})} className="w-full p-2.5 border rounded-lg font-mono text-xs text-gray-600 focus:border-[#1A2CB5] outline-none" />
                  </div>
                  <div>
                    <label className="block mb-1">Lien Facebook</label>
                    <input type="text" value={contactForm.facebook || ''} onChange={e => setContactForm({...contactForm, facebook: e.target.value})} className="w-full p-2.5 border rounded-lg font-mono text-xs text-gray-600 focus:border-[#1A2CB5] outline-none" />
                  </div>
                  <div>
                    <label className="block mb-1">Lien Instagram</label>
                    <input type="text" value={contactForm.instagram || ''} onChange={e => setContactForm({...contactForm, instagram: e.target.value})} className="w-full p-2.5 border rounded-lg font-mono text-xs text-gray-600 focus:border-[#1A2CB5] outline-none" />
                  </div>
                  <div>
                    <label className="block mb-1">Lien YouTube</label>
                    <input type="text" value={contactForm.youtube || ''} onChange={e => setContactForm({...contactForm, youtube: e.target.value})} className="w-full p-2.5 border rounded-lg font-mono text-xs text-gray-600 focus:border-[#1A2CB5] outline-none" />
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-4">
                  <div>
                    <h3 className="text-xs uppercase tracking-wider text-gray-800 font-extrabold">Prestataires de Paiement (Footer)</h3>
                    <p className="text-[10px] text-gray-400 font-medium">Cochez les prestataires à afficher dans le pied de page.</p>
                  </div>
                  <div className="flex flex-wrap gap-6 text-xs font-bold text-gray-700">
                    {[
                      { key: 'visa', label: "Visa" },
                      { key: 'mastercard', label: "Mastercard" },
                      { key: 'momo', label: "MTN MoMo" },
                      { key: 'moov', label: "Moov Money" },
                      { key: 'celtis', label: "Celtis Pay" },
                      { key: 'orange', label: "Orange Money" },
                      { key: 'wave', label: "Wave Money" }
                    ].map((payment) => {
                      const isChecked = (contactForm.activePayments || []).includes(payment.key);
                      return (
                        <label key={payment.key} className="flex items-center gap-2 cursor-pointer font-bold text-gray-700">
                          <input 
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              const currentPayments = contactForm.activePayments || [];
                              const newPayments = e.target.checked 
                                ? [...currentPayments, payment.key] 
                                : currentPayments.filter(p => p !== payment.key);
                              setContactForm({...contactForm, activePayments: newPayments});
                            }}
                            className="w-4 h-4 text-[#1A2CB5] border-gray-300 rounded focus:ring-[#1A2CB5] cursor-pointer"
                          />
                          {payment.label}
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Partners & Certifications */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-gray-900 border-b pb-2">Partenaires & Certifications (Footer)</h3>
                    <p className="text-xs text-gray-500 font-medium mt-1">Ajoutez d'autres logos de partenaires officiels, labels ou certifications à afficher dans le pied de page.</p>
                  </div>

                  {/* List of current custom partners */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {(contactForm.partners || []).map((partner, index) => (
                      <div key={index} className="p-3 bg-gray-50 border border-gray-150 rounded-xl flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img src={partner.imageUrl} alt={partner.name} className="h-8 w-12 object-contain bg-white rounded border border-gray-200" onError={(e) => { (e.target as any).src = 'https://placehold.co/80x50?text=Logo'; }} />
                          <span className="text-xs font-bold text-gray-800 truncate max-w-[120px]">{partner.name}</span>
                        </div>
                        <button 
                          type="button"
                          onClick={() => {
                            const newPartners = (contactForm.partners || []).filter((_, i) => i !== index);
                            setContactForm({...contactForm, partners: newPartners});
                            toast.info("Partenaire retiré.");
                          }}
                          className="text-red-500 hover:text-white p-1 hover:bg-red-500 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add form */}
                  <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 space-y-4">
                    <h4 className="text-xs uppercase tracking-wider text-gray-700 font-extrabold">Nouveau Partenaire / Label</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] text-gray-500 mb-1">Nom du Partenaire (ex: ISO 9001)</label>
                        <input 
                          type="text" 
                          value={partnerName}
                          onChange={e => setPartnerName(e.target.value)}
                          placeholder="Nom ou Label"
                          className="w-full bg-white border border-gray-200 p-2.5 rounded-lg text-xs outline-none focus:border-[#1A2CB5]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-gray-500 mb-1">URL du Logo (ex: https://.../image.png)</label>
                        <input 
                          type="text" 
                          value={partnerLogo}
                          onChange={e => setPartnerLogo(e.target.value)}
                          placeholder="https://..."
                          className="w-full bg-white border border-gray-200 p-2.5 rounded-lg text-xs font-mono outline-none focus:border-[#1A2CB5]"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          if (!partnerName || !partnerLogo) {
                            return toast.error("Veuillez remplir le nom et l'URL du logo.");
                          }
                          const currentPartners = contactForm.partners || [];
                          const newPartners = [...currentPartners, { name: partnerName, imageUrl: partnerLogo }];
                          setContactForm({...contactForm, partners: newPartners});
                          setPartnerName('');
                          setPartnerLogo('');
                          toast.success("Partenaire ajouté à la liste !");
                        }}
                        className="bg-[#1A2CB5] text-white px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 text-xs hover:bg-black transition-colors cursor-pointer"
                      >
                        <Plus size={16} /> Ajouter à la liste
                      </button>
                    </div>
                  </div>
                </div>

                {/* Newsletter Integration Webhook */}
                <div className="bg-gradient-to-br from-blue-950/80 to-[#1a0429]/80 p-6 rounded-2xl border border-blue-500/20 space-y-4 mt-2">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-8 h-8 rounded-xl bg-blue-500/20 flex items-center justify-center">
                      <Mail size={16} className="text-blue-300" />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-white">Intégration Newsletter & Webhook</h3>
                      <p className="text-[10px] text-blue-300">Connectez un outil externe pour synchroniser automatiquement les abonnés (Systeme.io, Make, Zapier, n8n, Mailchimp...)</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-blue-200 mb-1.5">URL Webhook (Make / Zapier / n8n)</label>
                      <input
                        type="url"
                        value={(contactForm as any).newsletterWebhookUrl || ''}
                        onChange={e => setContactForm({...contactForm, newsletterWebhookUrl: e.target.value} as any)}
                        className="w-full px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400 font-mono text-xs"
                        placeholder="https://hook.make.com/xxxxx ou https://hooks.zapier.com/..."
                      />
                      <p className="text-[10px] text-blue-300/70 mt-1">Chaque inscription déclenchera un POST JSON vers cette URL.</p>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-blue-200 mb-1.5">URL Formulaire Systeme.io (optionnel)</label>
                      <input
                        type="url"
                        value={(contactForm as any).systemeIoFormUrl || ''}
                        onChange={e => setContactForm({...contactForm, systemeIoFormUrl: e.target.value} as any)}
                        className="w-full px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400 font-mono text-xs"
                        placeholder="https://systeme.io/api/webhook/..."
                      />
                      <p className="text-[10px] text-blue-300/70 mt-1">Alternative si vous utilisez Systeme.io directement.</p>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                    <p className="text-[10px] text-blue-200 font-semibold mb-1">📋 Payload JSON envoyé à chaque inscription :</p>
                    <pre className="text-[10px] text-blue-300 font-mono leading-relaxed overflow-x-auto">{`{
  "email": "visiteur@exemple.com",
  "source": "footer_corporate",
  "timestamp": "2026-08-07T04:30:00.000Z",
  "brand": "Freeman Group"
}`}</pre>
                  </div>

                  {/* Subscribers Count Badge */}
                  <div className="flex items-center gap-3 bg-white/5 rounded-xl p-3 border border-white/10">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                      <span className="text-lg font-black text-emerald-400">{subscribersList.length}</span>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Abonnés enregistrés localement</div>
                      <div className="text-[10px] text-blue-300">Stockés dans Firestore + LocalStorage — Export CSV disponible ci-dessous</div>
                    </div>
                    {subscribersList.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          const csv = ['Email,Date,Source', ...subscribersList.map(s => `${s.email},${new Date(s.subscribedAt).toLocaleDateString('fr-FR')},${s.source}`)].join('\n');
                          const blob = new Blob([csv], { type: 'text/csv' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url; a.download = 'abonnes-newsletter-freeman.csv';
                          a.click(); URL.revokeObjectURL(url);
                          toast.success('Export CSV téléchargé !');
                        }}
                        className="ml-auto px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-500 transition-colors flex items-center gap-1.5"
                      >
                        <Save size={12} /> Exporter CSV
                      </button>
                    )}
                  </div>

                  {/* Recent Subscribers Table */}
                  {subscribersList.length > 0 && (
                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      <p className="text-[10px] font-bold text-blue-200 uppercase tracking-wider">Derniers abonnés</p>
                      {subscribersList.slice(0, 10).map((sub, i) => (
                        <div key={i} className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-1.5 border border-white/10">
                          <span className="text-xs font-mono text-white">{sub.email}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-blue-300">{sub.source}</span>
                            <span className="text-[10px] text-blue-400">{new Date(sub.subscribedAt).toLocaleDateString('fr-FR')}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-end pt-4">
                  <button type="submit" disabled={saving} className="bg-[#1A2CB5] text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-black transition-colors shadow-md">
                    {saving ? <Loader2 className="animate-spin" size={16}/> : <Save size={16}/>} Enregistrer les Contacts
                  </button>
                </div>
              </form>
            </div>

            {/* Associés/Équipe */}
            <div className="w-full">
              {!isEditingMember ? (
                <>
                  <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-200">
                    <h2 className="text-xl font-black text-gray-900 flex items-center gap-2"><Users className="text-[#1A2CB5]"/> Membres de l'Équipe (Associés)</h2>
                    <button onClick={() => handleEditMember(null)} className="bg-[#1A2CB5] text-white px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 text-xs hover:bg-black transition-colors">
                      <Plus size={16} /> Ajouter un Membre
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teamMembersList.map(member => (
                      <div key={member.id} className="bg-white border border-gray-200 p-6 rounded-2xl flex flex-col justify-between shadow-sm">
                        <div className="flex gap-4 items-center mb-4">
                          <img src={member.image} className="w-14 h-14 rounded-full object-cover bg-gray-100" alt={member.name} />
                          <div>
                            <h4 className="font-bold text-sm text-gray-900">{member.name}</h4>
                            <p className="text-xs text-blue-600 font-bold">{member.role}</p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 font-medium line-clamp-3 mb-4">{member.bio}</p>
                        <div className="flex gap-2 border-t pt-3">
                          <button onClick={() => handleEditMember(member)} className="flex-1 py-1.5 bg-gray-50 text-gray-600 rounded font-bold text-xs hover:bg-[#1A2CB5] hover:text-white transition-colors">Éditer</button>
                          <button onClick={() => handleDeleteMember(member.id)} className="p-1.5 text-red-500 bg-red-50 hover:bg-red-500 hover:text-white rounded transition-colors"><Trash2 size={14}/></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="w-full max-w-5xl mx-auto bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b">
                    <h2 className="text-lg font-black text-gray-900">{selectedMember?.id ? "Modifier le Membre" : "Ajouter un Membre"}</h2>
                    <button onClick={() => setIsEditingMember(false)} className="text-gray-500 hover:text-black font-bold flex items-center gap-1"><ArrowLeft size={16}/> Annuler</button>
                  </div>

                  <form onSubmit={handleSaveMember} className="space-y-4 font-bold text-gray-700">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs mb-1">Nom Complet</label>
                        <input type="text" required value={selectedMember?.name || ''} onChange={e => setSelectedMember({...selectedMember!, name: e.target.value})} className="w-full border p-2.5 rounded-lg outline-none font-medium" />
                      </div>
                      <div>
                        <label className="block text-xs mb-1">Rôle / Poste</label>
                        <input type="text" required value={selectedMember?.role || ''} onChange={e => setSelectedMember({...selectedMember!, role: e.target.value})} className="w-full border p-2.5 rounded-lg outline-none font-medium" placeholder="Ex: Associé Gérant, Directeur technique" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-xs mb-1">URL de l'image de profil</label>
                        <input type="text" value={selectedMember?.image || ''} onChange={e => setSelectedMember({...selectedMember!, image: e.target.value})} className="w-full border p-2.5 rounded-lg outline-none font-mono text-xs text-gray-600" />
                      </div>
                      <div>
                        <label className="block text-xs mb-1">Biographie</label>
                        <textarea rows={3} value={selectedMember?.bio || ''} onChange={e => setSelectedMember({...selectedMember!, bio: e.target.value})} className="w-full border p-2.5 rounded-lg outline-none font-medium resize-none" />
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                      <h4 className="text-xs uppercase tracking-wider text-gray-400">Réseaux Sociaux du Membre</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[10px] text-gray-500 mb-1">LinkedIn</label>
                          <input type="text" value={selectedMember?.social?.linkedin || ''} onChange={e => setSelectedMember({...selectedMember!, social: {...selectedMember!.social, linkedin: e.target.value}})} className="w-full border p-2 bg-white rounded font-mono text-[10px]" />
                        </div>
                        <div>
                          <label className="block text-[10px] text-gray-500 mb-1">GitHub</label>
                          <input type="text" value={selectedMember?.social?.github || ''} onChange={e => setSelectedMember({...selectedMember!, social: {...selectedMember!.social, github: e.target.value}})} className="w-full border p-2 bg-white rounded font-mono text-[10px]" />
                        </div>
                        <div>
                          <label className="block text-[10px] text-gray-500 mb-1">Twitter</label>
                          <input type="text" value={selectedMember?.social?.twitter || ''} onChange={e => setSelectedMember({...selectedMember!, social: {...selectedMember!.social, twitter: e.target.value}})} className="w-full border p-2 bg-white rounded font-mono text-[10px]" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs mb-1">Compétences / Badges (Séparés par des virgules)</label>
                      <input 
                        type="text" 
                        value={selectedMember?.skills?.join(', ') || ''} 
                        onChange={e => setSelectedMember({...selectedMember!, skills: e.target.value.split(',').map(x => x.trim()).filter(Boolean)})} 
                        className="w-full border p-2.5 rounded-lg outline-none font-medium" 
                        placeholder="React, Growth, Gestion, Conseil"
                      />
                    </div>

                    <button type="submit" disabled={saving} className="w-full mt-4 bg-[#1A2CB5] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-colors shadow-md">
                      {saving ? <Loader2 className="animate-spin" size={18}/> : <Save size={18}/>} Enregistrer le Membre
                    </button>
                  </form>
                </div>
              )}
            </div>

          </div>
        )}

        {/* =======================
            TAB: LAYOUT & SECTIONS
           ======================= */}
        {activeTab === 'layout' && (
          <div className="w-full max-w-7xl mx-auto animate-in fade-in duration-300">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
              <div>
                <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3"><Settings className="text-[#1A2CB5]"/> Pages & Structure du Site</h1>
                <p className="text-gray-500 font-medium mt-1">Gérez la liste des pages de votre site et organisez leurs éléments.</p>
              </div>
            </div>

            {/* List of Pages */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm mb-8">
              <h3 className="text-xs uppercase tracking-wider text-gray-400 mb-4 font-bold">Pages du Site Freeman Group</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { title: "Page d'Accueil", slug: "/", tab: "hero" },
                  { title: "Secteurs d'Activité", slug: "/services", tab: "sectors" },
                  { title: "Projets SaaS", slug: "/saas", tab: "saas" },
                  { title: "Catalogue Formations", slug: "/formations", tab: "formations" },
                  { title: "Équipe & Contacts", slug: "/contact", tab: "team_contact" }
                ].map((pg) => (
                  <div key={pg.title} className="p-4 border border-gray-100 rounded-2xl bg-gray-50/50 flex flex-col justify-between items-start gap-3">
                    <div>
                      <h4 className="font-bold text-gray-900 text-xs">{pg.title}</h4>
                      <code className="text-[10px] text-blue-600 font-bold">{pg.slug}</code>
                    </div>
                    <button 
                      onClick={() => setActiveTab(pg.tab as any)} 
                      className="text-[10px] uppercase tracking-wider font-extrabold text-[#1A2CB5] hover:text-black transition-colors cursor-pointer"
                    >
                      Éditer le Contenu →
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Structure de la Page d'Accueil</h2>
                  <p className="text-xs text-gray-400 font-medium mt-1">Ajoutez, ordonnez ou supprimez les sections de votre page vitrine.</p>
                </div>
              </div>

              {/* Sections list in order */}
              <div className="space-y-3">
                {(homepageData.visibleSections || []).map((sectionKey, index) => {
                  const sectionInfo = [
                    { key: 'sectors', label: "Les 6 Pôles d'Expertise", desc: "La grille des 6 secteurs Freeman (Digital, BTP, etc.)" },
                    { key: 'about_teaser', label: "Présentation / Associés", desc: "Le teaser présentant l'équipe d'associés et le chiffre clé." },
                    { key: 'saas', label: "Projets SaaS de l'Agence", desc: "Vitrine des 3 derniers projets SaaS." },
                    { key: 'formations', label: "Catalogue Formations", desc: "Grille des 3 dernières formations du catalogue." },
                    { key: 'slider_carousel', label: "Galerie Diaporama (Slider)", desc: "Diaporama animé avec les images configurées." },
                    { key: 'contact_form', label: "Formulaire de Contact", desc: "Formulaire de demande de projet interactif." },
                    { key: 'cta', label: "Bandeau d'Appel à l'Action (CTA)", desc: "Bandeau d'accroche pour lancer un projet." }
                  ].find(s => s.key === sectionKey) || { key: sectionKey, label: sectionKey, desc: "Section personnalisée" };

                  return (
                    <div key={sectionKey + index} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-2xl">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-700 font-bold text-xs">
                          {index + 1}
                        </span>
                        <div>
                          <h4 className="font-bold text-gray-900 text-sm">{sectionInfo.label}</h4>
                          <p className="text-[10px] text-gray-400 font-medium">{sectionInfo.desc}</p>
                        </div>
                      </div>

                      {/* Reorder and Delete controls */}
                      <div className="flex items-center gap-2">
                        {/* Move Up */}
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={async () => {
                            const newSections = [...(homepageData.visibleSections || [])];
                            const temp = newSections[index];
                            newSections[index] = newSections[index - 1];
                            newSections[index - 1] = temp;
                            await saveHomepageData({ visibleSections: newSections });
                            toast.success("Ordre mis à jour !");
                          }}
                          className="p-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-40 cursor-pointer"
                          title="Monter"
                        >
                          <ArrowLeft className="rotate-90" size={14} />
                        </button>
                        {/* Move Down */}
                        <button
                          type="button"
                          disabled={index === (homepageData.visibleSections || []).length - 1}
                          onClick={async () => {
                            const newSections = [...(homepageData.visibleSections || [])];
                            const temp = newSections[index];
                            newSections[index] = newSections[index + 1];
                            newSections[index + 1] = temp;
                            await saveHomepageData({ visibleSections: newSections });
                            toast.success("Ordre mis à jour !");
                          }}
                          className="p-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-40 cursor-pointer"
                          title="Descendre"
                        >
                          <ArrowLeft className="-rotate-90" size={14} />
                        </button>
                        {/* Remove */}
                        <button
                          type="button"
                          onClick={async () => {
                            if (!window.confirm("Retirer cette section de la page ?")) return;
                            const newSections = (homepageData.visibleSections || []).filter((_, i) => i !== index);
                            await saveHomepageData({ visibleSections: newSections });
                            toast.info("Section retirée.");
                          }}
                          className="p-1.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all cursor-pointer"
                          title="Supprimer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add section control */}
              <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                <div>
                  <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider">Ajouter une nouvelle section</h4>
                  <p className="text-[10px] text-gray-400">Insérez un nouvel élément dynamique dans la page vitrine.</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <select id="section-select" className="bg-white border border-gray-200 p-2.5 rounded-xl font-bold outline-none text-xs w-full sm:w-64">
                    <option value="slider_carousel">Galerie Diaporama (Slider)</option>
                    <option value="contact_form">Formulaire de Contact</option>
                    <option value="sectors">Les 6 Pôles d'Expertise</option>
                    <option value="about_teaser">Présentation / Associés</option>
                    <option value="saas">Projets SaaS de l'Agence</option>
                    <option value="formations">Catalogue Formations</option>
                    <option value="cta">Bandeau d'Appel à l'Action (CTA)</option>
                  </select>
                  <button
                    type="button"
                    onClick={async () => {
                      const select = document.getElementById('section-select') as HTMLSelectElement;
                      if (!select) return;
                      const selectedVal = select.value;
                      const currentSections = homepageData.visibleSections || [];
                      const newSections = [...currentSections, selectedVal];
                      await saveHomepageData({ visibleSections: newSections });
                      toast.success("Section ajoutée avec succès !");
                    }}
                    className="bg-[#1A2CB5] text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-1.5 text-xs hover:bg-black transition-colors shrink-0 cursor-pointer"
                  >
                    <Plus size={16} /> Ajouter
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =======================
            TAB: MON COMPTE (PROFILE)
           ======================= */}
        {activeTab === 'profile' && (
          <div className="w-full max-w-7xl mx-auto animate-in fade-in duration-300">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
              <div>
                <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3"><Lock className="text-[#1A2CB5]"/> Mon Compte Administrateur</h1>
                <p className="text-gray-500 font-medium mt-1">Gérez votre email, mot de passe et créez des accès collaborateurs.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form 1: Profile info */}
              <form onSubmit={handleUpdateProfile} className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4 font-bold text-gray-700 flex flex-col justify-between h-full">
                <div className="space-y-4">
                  <h3 className="text-sm uppercase tracking-wider text-gray-400 border-b pb-2">Informations de Connexion</h3>
                  <div>
                    <label className="block text-xs mb-1">Nom Complet / Entreprise</label>
                    <input type="text" required value={profileName} onChange={e => setProfileName(e.target.value)} className="w-full border p-2.5 rounded-lg outline-none font-medium" />
                  </div>
                  <div>
                    <label className="block text-xs mb-1">Nouvelle Adresse Email</label>
                    <input type="email" required value={profileEmail} onChange={e => setProfileEmail(e.target.value)} className="w-full border p-2.5 rounded-lg outline-none font-medium" />
                  </div>
                </div>
                <div className="pt-4">
                  <button type="submit" disabled={savingProfile} className="w-full bg-[#1A2CB5] text-white px-6 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-colors shadow-md">
                    {savingProfile ? <Loader2 className="animate-spin" size={16}/> : <Save size={16}/>} Enregistrer le profil
                  </button>
                </div>
              </form>

              {/* Form 2: Password reset */}
              <form onSubmit={handleUpdatePassword} className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4 font-bold text-gray-700 flex flex-col justify-between h-full">
                <div className="space-y-4">
                  <h3 className="text-sm uppercase tracking-wider text-gray-400 border-b pb-2">Modifier le Mot de Passe</h3>
                  <div>
                    <label className="block text-xs mb-1">Nouveau mot de passe</label>
                    <input type="password" required value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full border p-2.5 rounded-lg outline-none font-medium" placeholder="Minimum 6 caractères" />
                  </div>
                  <div>
                    <label className="block text-xs mb-1">Confirmer le mot de passe</label>
                    <input type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full border p-2.5 rounded-lg outline-none font-medium" />
                  </div>
                </div>
                <div className="pt-4">
                  <button type="submit" disabled={savingPassword} className="w-full bg-black text-white px-6 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#1A2CB5] transition-colors shadow-md">
                    {savingPassword ? <Loader2 className="animate-spin" size={16}/> : <Save size={16}/>} Modifier le mot de passe
                  </button>
                </div>
              </form>

              {/* Form 3: Add new admin */}
              <form onSubmit={handleCreateNewAdmin} className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4 font-bold text-gray-700 flex flex-col justify-between h-full">
                <div className="space-y-4">
                  <h3 className="text-sm uppercase tracking-wider text-purple-600 border-b pb-2 font-black">Créer un Administrateur</h3>
                  <div>
                    <label className="block text-xs mb-1">Nom Complet</label>
                    <input type="text" required value={newAdminName} onChange={e => setNewAdminName(e.target.value)} className="w-full border p-2.5 rounded-lg outline-none font-medium" placeholder="Ex: Jean Martin" />
                  </div>
                  <div>
                    <label className="block text-xs mb-1">Adresse Email</label>
                    <input type="email" required value={newAdminEmail} onChange={e => setNewAdminEmail(e.target.value)} className="w-full border p-2.5 rounded-lg outline-none font-medium" placeholder="admin@domain.com" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs mb-1">Mot de passe</label>
                      <input type="password" required value={newAdminPassword} onChange={e => setNewAdminPassword(e.target.value)} className="w-full border p-2.5 rounded-lg outline-none font-medium text-xs" placeholder="Min 6 car." />
                    </div>
                    <div>
                      <label className="block text-xs mb-1">Rôle admin</label>
                      <select value={newAdminRole} onChange={e => setNewAdminRole(e.target.value as any)} className="w-full border p-2.5 rounded-lg outline-none bg-white text-xs">
                        <option value="super_admin">Super Admin</option>
                        <option value="moderator">Modérateur</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="pt-4">
                  <button type="submit" disabled={creatingAdmin} className="w-full bg-purple-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-colors shadow-md">
                    {creatingAdmin ? <Loader2 className="animate-spin" size={16}/> : <Plus size={16}/>} Créer l'administrateur
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* =======================
            TAB: ARTICLES BLOG
           ======================= */}
        {activeTab === 'blog' && (
          <div className="w-full max-w-7xl mx-auto animate-in fade-in duration-300">
            {!isEditingBlogArticle ? (
              <>
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
                  <div>
                    <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3"><BookOpen className="text-[#1A2CB5]"/> Gestion du Blog</h1>
                    <p className="text-gray-500 font-medium mt-1">Gérez et générez vos articles de blog d'actualités et tendances.</p>
                  </div>
                  <button onClick={() => handleEditBlogArticle(null)} className="bg-[#1A2CB5] text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-black transition-colors shadow-md cursor-pointer">
                    <Plus size={16} /> Écrire un Article
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {blogArticlesList.map((article) => (
                    <div key={article.id} className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border" style={{ color: article.color || '#1A2CB5', borderColor: `${article.color || '#1A2CB5'}30`, backgroundColor: `${article.color || '#1A2CB5'}05` }}>
                            {article.category}
                          </span>
                          <span className="text-xs text-gray-400 font-semibold">{article.date}</span>
                        </div>
                        <h3 className="font-extrabold text-gray-900 text-base leading-tight mb-2 hover:text-[#1A2CB5] transition-colors">{article.title}</h3>
                        <p className="text-xs text-gray-500 line-clamp-3">{article.desc}</p>
                      </div>
                      <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-2">
                        <button onClick={() => handleEditBlogArticle(article)} className="bg-white border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-gray-100 transition-colors cursor-pointer">
                          Modifier
                        </button>
                        <button onClick={() => handleDeleteBlogArticle(article.id)} className="bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-600 hover:text-white transition-colors cursor-pointer">
                          Supprimer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
                  <div>
                    <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                      {selectedBlogArticle?.id ? "Modifier l'Article" : "Nouvel Article de Blog"}
                    </h1>
                    <p className="text-gray-500 font-medium mt-1">Rédigez l'introduction et le contenu détaillé de votre article.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      type="button"
                      onClick={() => setShowAIWriter(true)}
                      className="bg-purple-600 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-black transition-colors shadow-md cursor-pointer hover:shadow-purple-600/10 border border-purple-500 hover:border-transparent"
                    >
                      🤖 Rédiger avec l'IA
                    </button>
                    <button onClick={() => { setIsEditingBlogArticle(false); setSelectedBlogArticle(null); }} className="bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl font-bold flex items-center gap-1.5 hover:bg-gray-50 transition-colors shadow-sm cursor-pointer">
                      <ArrowLeft size={16} /> Retour
                    </button>
                  </div>
                </div>

                {/* AI WRITER MODAL OVERLAY */}
                {showAIWriter && (
                  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#0A1628] text-white p-8 rounded-3xl border border-white/10 max-w-lg w-full space-y-6 shadow-2xl relative font-sans">
                      <button 
                        type="button"
                        onClick={() => setShowAIWriter(false)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors cursor-pointer"
                      >
                        <X size={20} />
                      </button>
                      <div className="space-y-2 text-left">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">🤖</span>
                          <h3 className="text-xl font-black text-white">Assistant de Rédaction IA</h3>
                        </div>
                        <p className="text-xs text-gray-400 font-medium">Rédigez un article entier automatiquement. L'IA choisira la catégorie idéale, configurera le style, écrira le contenu et générera les tags SEO.</p>
                      </div>

                      <div className="space-y-4 text-left">
                        <div>
                          <label className="block text-xs uppercase tracking-wider text-gray-400 font-extrabold mb-1.5">Sujet de l'Article / Mots-clés</label>
                          <textarea
                            rows={3}
                            value={aiPrompt}
                            onChange={e => setAiPrompt(e.target.value)}
                            placeholder="ex: Les opportunités de la transition énergétique pour le BTP au Bénin..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs outline-none focus:border-purple-500 font-medium text-white resize-none"
                            disabled={generatingArticle}
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs uppercase tracking-wider text-gray-400 font-extrabold mb-1.5">Ton de rédaction</label>
                            <select
                              value={aiTone}
                              onChange={e => setAiTone(e.target.value)}
                              className="w-full bg-[#12233c] border border-white/10 rounded-xl p-2.5 text-xs outline-none text-white font-medium"
                              disabled={generatingArticle}
                            >
                              <option value="professionnel">💼 Professionnel</option>
                              <option value="inspirant">✨ Inspirant</option>
                              <option value="analytique">📊 Analytique</option>
                              <option value="technique">⚙️ Technique</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs uppercase tracking-wider text-gray-400 font-extrabold mb-1.5">Temps estimé</label>
                            <div className="w-full bg-[#12233c] border border-white/10 rounded-xl p-2.5 text-xs text-gray-400 font-medium select-none">
                              ⏳ ~2 secondes
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowAIWriter(false)}
                          className="border border-white/10 hover:bg-white/5 text-gray-300 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                          disabled={generatingArticle}
                        >
                          Annuler
                        </button>
                        <button
                          type="button"
                          onClick={handleWriteArticleWithAI}
                          className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20 cursor-pointer"
                          disabled={generatingArticle}
                        >
                          {generatingArticle ? (
                            <>
                              <Loader2 className="animate-spin" size={14} /> Rédaction en cours...
                            </>
                          ) : (
                            <>
                              ⚡ Générer l'Article
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* LEFT COLUMN: Editor Form (7/12 cols) */}
                  <form onSubmit={handleSaveBlogArticle} className="lg:col-span-7 bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6 font-bold text-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs mb-1">Titre de l'Article</label>
                        <input 
                          type="text" 
                          required 
                          value={selectedBlogArticle?.title || ''} 
                          onChange={e => setSelectedBlogArticle({...selectedBlogArticle, title: e.target.value})} 
                          className="w-full border p-2.5 rounded-lg outline-none font-medium focus:border-[#1A2CB5]"
                          placeholder="Comment l'IA redéfinit..." 
                        />
                      </div>
                      <div>
                        <label className="block text-xs mb-1">Catégorie</label>
                        <select 
                          value={selectedBlogArticle?.category || 'Digital & IA'} 
                          onChange={e => setSelectedBlogArticle({...selectedBlogArticle, category: e.target.value})} 
                          className="w-full border p-2.5 rounded-lg outline-none bg-white font-medium focus:border-[#1A2CB5]"
                        >
                          <option value="Digital & IA">Digital & IA</option>
                          <option value="BTP & Immobilier">BTP & Immobilier</option>
                          <option value="Management">Management</option>
                          <option value="Hôtellerie">Hôtellerie</option>
                          <option value="Aménagement">Aménagement</option>
                          <option value="Commerce">Commerce</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-xs mb-1">Couleur d'Accentuation</label>
                        <div className="flex gap-2">
                          <input 
                            type="color" 
                            value={selectedBlogArticle?.color || '#1A2CB5'} 
                            onChange={e => setSelectedBlogArticle({...selectedBlogArticle, color: e.target.value})} 
                            className="h-10 w-10 p-0 border border-gray-200 rounded-lg outline-none cursor-pointer"
                          />
                          <input 
                            type="text" 
                            value={selectedBlogArticle?.color || ''} 
                            onChange={e => setSelectedBlogArticle({...selectedBlogArticle, color: e.target.value})} 
                            className="flex-1 border p-2.5 rounded-lg outline-none font-mono text-xs focus:border-[#1A2CB5]" 
                            placeholder="#1A2CB5"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs mb-1">Temps de Lecture</label>
                        <input 
                          type="text" 
                          value={selectedBlogArticle?.readTime || ''} 
                          onChange={e => setSelectedBlogArticle({...selectedBlogArticle, readTime: e.target.value})} 
                          className="w-full border p-2.5 rounded-lg outline-none font-medium focus:border-[#1A2CB5]" 
                          placeholder="5 min"
                        />
                      </div>
                      <div>
                        <label className="block text-xs mb-1">Date d'Affichage</label>
                        <input 
                          type="text" 
                          value={selectedBlogArticle?.date || ''} 
                          onChange={e => setSelectedBlogArticle({...selectedBlogArticle, date: e.target.value})} 
                          className="w-full border p-2.5 rounded-lg outline-none font-medium focus:border-[#1A2CB5]" 
                          placeholder="10 Juil 2026"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs mb-1">Résumé / Description Courte</label>
                      <textarea 
                        rows={2} 
                        value={selectedBlogArticle?.desc || ''} 
                        onChange={e => setSelectedBlogArticle({...selectedBlogArticle, desc: e.target.value})} 
                        className="w-full border p-2.5 rounded-lg outline-none font-medium resize-y focus:border-[#1A2CB5]"
                        placeholder="Résumé court de l'article pour attirer le lecteur..."
                      />
                    </div>

                    <div>
                      <label className="block text-xs mb-1">Contenu de l'Article (Texte détaillé)</label>
                      <textarea 
                        rows={6} 
                        value={selectedBlogArticle?.content || ''} 
                        onChange={e => setSelectedBlogArticle({...selectedBlogArticle, content: e.target.value})} 
                        className="w-full border p-2.5 rounded-lg outline-none font-medium resize-y font-mono text-xs focus:border-[#1A2CB5]"
                        placeholder="Rédigez ici le corps de l'article..."
                      />
                    </div>

                    {/* SEO Optimisation */}
                    <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 space-y-4">
                      <div className="flex items-center justify-between border-b border-blue-100 pb-2">
                        <div>
                          <h4 className="text-xs font-black text-blue-900 uppercase tracking-wider">Optimisation SEO & Meta-tags</h4>
                          <p className="text-[10px] text-blue-700 font-medium">Générez et validez le référencement naturel Google.</p>
                        </div>
                        <button
                          type="button"
                          onClick={handleGenerateSEO}
                          className="bg-blue-600 hover:bg-black text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          🤖 Générer avec l'IA
                        </button>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-[10px] text-blue-900 mb-0.5">Titre SEO (Balise Title)</label>
                          <input 
                            type="text" 
                            value={selectedBlogArticle?.seoTitle || ''} 
                            onChange={e => setSelectedBlogArticle({...selectedBlogArticle, seoTitle: e.target.value})} 
                            className="w-full bg-white border border-blue-200 p-2.5 rounded-lg text-xs outline-none focus:border-blue-500 font-medium"
                            placeholder="Titre optimisé Google (max 60 car.)" 
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-blue-900 mb-0.5">Description SEO (Meta Description)</label>
                          <textarea 
                            rows={2} 
                            value={selectedBlogArticle?.seoDesc || ''} 
                            onChange={e => setSelectedBlogArticle({...selectedBlogArticle, seoDesc: e.target.value})} 
                            className="w-full bg-white border border-blue-200 p-2.5 rounded-lg text-xs outline-none focus:border-blue-500 font-medium resize-y"
                            placeholder="Meta description de recherche (max 155 car.)" 
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-blue-900 mb-0.5">Mots-clés SEO (séparés par des virgules)</label>
                          <input 
                            type="text" 
                            value={selectedBlogArticle?.seoKeywords || ''} 
                            onChange={e => setSelectedBlogArticle({...selectedBlogArticle, seoKeywords: e.target.value})} 
                            className="w-full bg-white border border-blue-200 p-2.5 rounded-lg text-xs outline-none focus:border-blue-500 font-medium"
                            placeholder="mot-clé-1, mot-clé-2, ..." 
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-2 gap-3">
                      <button 
                        type="button" 
                        onClick={() => { setIsEditingBlogArticle(false); setSelectedBlogArticle(null); }} 
                        className="border border-gray-300 text-gray-700 px-5 py-2.5 rounded-xl font-bold hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        Annuler
                      </button>
                      <button 
                        type="submit" 
                        disabled={saving} 
                        className="bg-[#1A2CB5] text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-black transition-colors shadow-md cursor-pointer"
                      >
                        {saving ? <Loader2 className="animate-spin" size={16}/> : <Save size={16}/>} Enregistrer l'Article
                      </button>
                    </div>
                  </form>

                  {/* RIGHT COLUMN: Live Preview Panel (5/12 cols) */}
                  <div className="lg:col-span-5 space-y-4 sticky top-6">
                    <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
                      <div className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-3">Aperçu en Direct</div>
                      
                      {/* Tabs */}
                      <div className="flex bg-gray-100 p-1 rounded-xl gap-1 mb-4">
                        {[
                          { key: 'card', label: "Carte Feed" },
                          { key: 'full', label: "Article Complet" },
                          { key: 'google', label: "Aperçu Google" }
                        ].map((tab) => (
                          <button
                            key={tab.key}
                            type="button"
                            onClick={() => setPreviewTab(tab.key as any)}
                            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${previewTab === tab.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>

                      {/* Preview Container */}
                      <div className="border border-gray-100 rounded-2xl overflow-hidden min-h-[350px]">
                        
                        {/* 1. CARD PREVIEW */}
                        {previewTab === 'card' && (
                          <div className="bg-gray-50/50 p-6 flex items-center justify-center min-h-[350px]">
                            <div className="w-full max-w-[280px] flex flex-col bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-md">
                              <div className="h-28 w-full relative overflow-hidden" style={{ backgroundColor: `${selectedBlogArticle?.color || '#1A2CB5'}15` }}>
                                <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                                  <span className="text-xl">📰</span>
                                </div>
                              </div>
                              <div className="p-4 flex flex-col flex-1">
                                <div className="flex items-center gap-4 text-[9px] font-semibold uppercase tracking-wider mb-2">
                                  <span className="bg-white/50 px-2 py-0.5 rounded border" style={{ color: selectedBlogArticle?.color || '#1A2CB5', borderColor: `${selectedBlogArticle?.color || '#1A2CB5'}30` }}>
                                    {selectedBlogArticle?.category || 'Digital & IA'}
                                  </span>
                                </div>
                                <h4 className="text-sm font-extrabold text-black mb-1 line-clamp-2 leading-snug">
                                  {selectedBlogArticle?.title || 'Titre de l\'article'}
                                </h4>
                                <p className="text-gray-500 mb-3 text-[11px] line-clamp-2 leading-relaxed">
                                  {selectedBlogArticle?.desc || 'Résumé court de l\'article...'}
                                </p>
                                <div className="flex items-center justify-between text-[9px] text-gray-400 font-bold border-t border-gray-50 pt-2 mt-auto">
                                  <span>📅 {selectedBlogArticle?.date || '10 Juil 2026'}</span>
                                  <span>⏱️ {selectedBlogArticle?.readTime || '5 min'}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 2. FULL PREVIEW */}
                        {previewTab === 'full' && (
                          <div className="bg-white p-5 max-h-[420px] overflow-y-auto font-sans min-h-[350px]">
                            <div className="border-b pb-3 mb-3">
                              <div className="flex items-center gap-2 mb-1.5">
                                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded" style={{ backgroundColor: `${selectedBlogArticle?.color || '#1A2CB5'}10`, color: selectedBlogArticle?.color || '#1A2CB5' }}>
                                  {selectedBlogArticle?.category || 'Digital & IA'}
                                </span>
                                <span className="text-[10px] text-gray-400 font-bold">{selectedBlogArticle?.date || '10 Juil 2026'}</span>
                              </div>
                              <h3 className="text-lg font-black text-gray-900 leading-snug">{selectedBlogArticle?.title || 'Titre de l\'article'}</h3>
                              <p className="text-[10px] text-gray-400 font-bold mt-1">Temps de lecture : {selectedBlogArticle?.readTime || '5 min'}</p>
                            </div>
                            <div className="space-y-3">
                              <p className="text-gray-800 text-xs italic font-extrabold border-l-3 pl-2" style={{ borderColor: selectedBlogArticle?.color || '#1A2CB5' }}>
                                {selectedBlogArticle?.desc || 'Introduction de l\'article...'}
                              </p>
                              <div className="text-gray-700 text-[11px] font-medium leading-relaxed whitespace-pre-wrap">
                                {selectedBlogArticle?.content || 'Rédigez le contenu détaillé dans le formulaire pour le voir s\'afficher en direct ici...'}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 3. GOOGLE PREVIEW */}
                        {previewTab === 'google' && (
                          <div className="bg-[#f8f9fa] p-5 space-y-4 min-h-[350px]">
                            <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-sm space-y-1.5">
                              <div className="flex items-center gap-1.5 text-xs text-gray-600 font-normal">
                                <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-700 text-[9px]">F</div>
                                <div>
                                  <div className="text-[10px] font-medium leading-none text-gray-900">Freeman Group</div>
                                  <div className="text-[9px] text-gray-500 leading-none">https://groupfreemanltdsarl.com › blog</div>
                                </div>
                              </div>
                              <h4 className="text-[15px] text-[#1a0dab] hover:underline font-normal cursor-pointer leading-tight">
                                {selectedBlogArticle?.seoTitle || `${selectedBlogArticle?.title || 'Titre de l\'article'} | Freeman Group`}
                              </h4>
                              <p className="text-[11px] text-[#4d5156] font-normal leading-normal">
                                <span className="text-gray-400">{selectedBlogArticle?.date || '10 Juil 2026'} — </span>
                                {selectedBlogArticle?.seoDesc || (selectedBlogArticle?.desc || 'Découvrez notre article de blog. Lisez la suite pour en savoir plus !')}
                              </p>
                            </div>
                            <div className="text-[9px] text-gray-400 font-bold space-y-1 bg-white p-3 rounded-lg border border-gray-100">
                              <div>🔑 MOTS-CLÉS SEO ACTIFS :</div>
                              <div className="text-gray-600 font-mono text-[8px] break-words">
                                {selectedBlogArticle?.seoKeywords || "Aucun mot-clé généré."}
                              </div>
                            </div>
                          </div>
                        )}

                      </div>
                    </div>
                  </div>

                </div>
              </>
            )}
          </div>
        )}


      </div>
    </div>
  );
}
