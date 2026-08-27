import { motion } from 'motion/react';
import { ShieldCheck, FileText, Lock, CheckCircle2 } from 'lucide-react';
import { useLocation } from 'react-router';

export function LegalPage() {
  const location = useLocation();
  const path = location.pathname;

  let title = "Mentions Légales";
  let subtitle = "Informations légales, éditeur du site et conditions de diffusion.";

  if (path.includes('confidentialite')) {
    title = "Politique de Confidentialité";
    subtitle = "Engagement de protection de vos données personnelles et conformité RGPD.";
  } else if (path.includes('cgv')) {
    title = "Conditions Générales d'Utilisation & Vente (CGV/CGU)";
    subtitle = "Cadre contractuel régissant nos services, produits et prestations.";
  }

  return (
    <div className="flex flex-col w-full bg-[#fcfcfd] min-h-screen font-['Inter']">
      
      {/* Header Banner */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-gray-950 via-[#1A2CB5] to-gray-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/10 text-[#d4af37] text-xs font-bold uppercase mb-4">
            <ShieldCheck size={14} /> Document Officiel Freeman Group
          </div>
          <h1 className="text-3xl sm:text-5xl font-black mb-4">{title}</h1>
          <p className="text-gray-300 text-base sm:text-lg">{subtitle}</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-200/80 shadow-sm space-y-8 text-gray-700 leading-relaxed">
          
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Éditeur du Site & Raison Sociale</h2>
            <p className="text-sm text-gray-600">
              Le présent site web est édité par <strong>Freeman Group SARL</strong>, société holding multi-secteurs enregistrée au Registre du Commerce et du Crédit Mobilier.
              <br />
              <strong>Siège social :</strong> Cotonou, République du Bénin.
              <br />
              <strong>Directeur de la publication :</strong> Direction Générale Freeman Group.
              <br />
              <strong>Email de contact :</strong> contact@freemangroup.bj
            </p>
          </div>

          <div className="pt-6 border-t border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Propriété Intellectuelle</h2>
            <p className="text-sm text-gray-600">
              L'ensemble des éléments figurant sur le site (logos, marques, textes, architecture, images et logiciels) sont la propriété exclusive de Freeman Group ou font l'objet d'une autorisation d'utilisation. Toute reproduction ou représentation totale ou partielle est formellement interdite sans autorisation écrite préalable.
            </p>
          </div>

          <div className="pt-6 border-t border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Protection des Données Personnelles</h2>
            <p className="text-sm text-gray-600">
              Freeman Group s'engage à protéger la confidentialité de vos informations personnelles. Les données collectées via nos formulaires (contact, devis, inscription newsletter) sont uniquement destinées au traitement de vos demandes. Vous disposez d'un droit d'accès, de rectification et de suppression de vos données sur simple demande par email.
            </p>
          </div>

          <div className="pt-6 border-t border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Hébergement & Sécurité</h2>
            <p className="text-sm text-gray-600">
              Le site est hébergé sur des serveurs haute sécurité garantissant un taux de disponibilité supérieur à 99.9% et le chiffrement SSL/TLS des échanges.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}
