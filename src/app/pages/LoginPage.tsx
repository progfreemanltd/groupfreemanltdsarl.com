import { useState } from 'react';
import { useNavigate } from 'react-router';
import { auth, db } from '../../lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { Mail, Lock, User, Briefcase, ArrowRight, Loader2, Phone, MapPin, FileText } from 'lucide-react';
import { toast } from 'sonner';

export function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // Nom ou nom entreprise
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [ifu, setIfu] = useState('');
  const [rccm, setRccm] = useState('');
  
  const [role, setRole] = useState<'customer' | 'vendor'>('customer');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // CONNEXION
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const loggedUser = userCredential.user;
        
        const userDoc = await getDoc(doc(db, 'users', loggedUser.uid));
        toast.success("Connexion réussie !");
        
        if (userDoc.exists()) {
          const uData = userDoc.data();
          const uRole = uData.role;
          if (['super_admin', 'moderator'].includes(uRole || '')) {
            navigate('/freemancms/admin');
          } else if (uRole === 'vendor') {
            navigate('/vendeur/dashboard');
          } else {
            navigate('/boutique');
          }
        } else {
          navigate('/boutique');
        }
      } else {
        // INSCRIPTION
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Création du Pseudo Unique auto
        const baseSlug = name.trim().toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
        const pseudo = `${baseSlug}-${Math.floor(1000 + Math.random() * 9000)}`;

        const initialStatus = role === 'vendor' ? 'pending' : 'active';

        // Créer son profil dans la base de données Firestore
        const newUserDoc = {
          uid: user.uid,
          name: name,
          email: email,
          phone: phone,
          address: address,
          role: role,
          pseudo: pseudo,
          createdAt: new Date().toISOString(),
          status: initialStatus,
          walletBalance: 0
        };

        if (role === 'vendor') {
           Object.assign(newUserDoc, { ifu: ifu, rccm: rccm });
        }

        await setDoc(doc(db, 'users', user.uid), newUserDoc);

        toast.success(`Compte ${role === 'vendor' ? 'Vendeur Pro' : 'Acheteur'} créé avec succès !`);
        navigate(role === 'vendor' ? '/vendeur/dashboard' : '/boutique');
      }
    } catch (error: any) {
      console.error(error);
      if (error.code === 'auth/email-already-in-use') {
        toast.error("Cet email est déjà utilisé.");
      } else if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
        toast.error("Identifiants incorrects.");
      } else {
        toast.error("Une erreur est survenue : " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        
        {/* Header Branding */}
        <div className="bg-[#1A2CB5] p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full translate-x-12 -translate-y-12 blur-2xl"></div>
          <img src="/logo.png" alt="Freeman Group" className="h-12 mx-auto mb-4 relative z-10 brightness-0 invert" />
          <h2 className="text-2xl font-black text-white relative z-10">
            {isLogin ? 'Bon retour !' : 'Rejoignez-nous'}
          </h2>
          <p className="text-blue-100 text-sm mt-2 relative z-10">
            {isLogin ? 'Connectez-vous à votre espace' : 'Créez votre compte B2B Vendeur ou Acheteur'}
          </p>
        </div>

        {/* Form Container */}
        <div className="p-8">
          {/* Tabs */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-8">
            <button 
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${isLogin ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Se Connecter
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${!isLogin ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              S'inscrire
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {!isLogin && (
              <>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Nom complet / Entreprise</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <User size={18} />
                    </div>
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#1A2CB5] focus:ring-2 focus:ring-[#1A2CB5]/20 outline-none transition-all"
                      placeholder={role === 'vendor' ? "Nom de l'entreprise (ex: Freeman Group)" : "Votre nom complet"}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Téléphone</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Phone size={18} />
                    </div>
                    <input 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#1A2CB5] focus:ring-2 focus:ring-[#1A2CB5]/20 outline-none transition-all"
                      placeholder="+229 01 02 03 04"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Adresse / Ville</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <MapPin size={18} />
                    </div>
                    <input 
                      type="text" 
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#1A2CB5] focus:ring-2 focus:ring-[#1A2CB5]/20 outline-none transition-all"
                      placeholder="Cotonou, Quartier..."
                    />
                  </div>
                </div>

                {role === 'vendor' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Numéro IFU (Fiscal)</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                          <FileText size={18} />
                        </div>
                        <input 
                          type="text" 
                          value={ifu}
                          onChange={(e) => setIfu(e.target.value)}
                          required
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#1A2CB5] focus:ring-2 focus:ring-[#1A2CB5]/20 outline-none transition-all"
                          placeholder="Numéro IFU valide requis"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Numéro RCCM (Optionnel)</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                          <FileText size={18} />
                        </div>
                        <input 
                          type="text" 
                          value={rccm}
                          onChange={(e) => setRccm(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#1A2CB5] focus:ring-2 focus:ring-[#1A2CB5]/20 outline-none transition-all"
                          placeholder="Registre du Commerce"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Type de compte</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      type="button"
                      onClick={() => setRole('customer')}
                      className={`border-2 rounded-xl p-3 flex flex-col items-center justify-center gap-2 transition-all ${role === 'customer' ? 'border-[#1A2CB5] bg-[#1A2CB5]/5 text-[#1A2CB5]' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                    >
                      <User size={20} />
                      <span className="text-xs font-bold">Acheteur</span>
                    </button>
                    <button 
                      type="button"
                      onClick={() => setRole('vendor')}
                      className={`border-2 rounded-xl p-3 flex flex-col items-center justify-center gap-2 transition-all ${role === 'vendor' ? 'border-[#d4af37] bg-[#d4af37]/5 text-[#d4af37]' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                    >
                      <Briefcase size={20} />
                      <span className="text-xs font-bold">Vendeur Pro</span>
                    </button>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Adresse Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#1A2CB5] focus:ring-2 focus:ring-[#1A2CB5]/20 outline-none transition-all"
                  placeholder="contact@freemangroup.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Mot de passe
                {isLogin && <a href="#" className="float-right text-[#1A2CB5] font-semibold normal-case tracking-normal hover:underline">Oublié ?</a>}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6} 
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#1A2CB5] focus:ring-2 focus:ring-[#1A2CB5]/20 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#1A2CB5] text-white font-bold py-3.5 px-4 rounded-xl hover:bg-black transition-colors flex items-center justify-center gap-2 mt-6 disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Se Connecter' : 'Créer mon compte'}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

          </form>
        </div>
        
        {/* Footer info */}
        <div className="bg-gray-50 border-t border-gray-100 p-4 text-center">
          <p className="text-xs text-gray-500">
            En vous {isLogin ? 'connectant' : 'inscrivant'}, vous acceptez les <a href="#" className="text-[#1A2CB5] hover:underline font-medium">CGU</a> de Freeman Group.
          </p>
        </div>
      </div>
    </div>
  );
}
