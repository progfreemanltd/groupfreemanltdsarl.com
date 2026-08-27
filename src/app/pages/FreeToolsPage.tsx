import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Wrench, 
  Image as ImageIcon, 
  Scan, 
  Sparkles, 
  ArrowRight, 
  Download, 
  Maximize2, 
  CheckCircle2,
  FileText,
  Sliders
} from 'lucide-react';
import { toast } from 'sonner';

export function FreeToolsPage() {
  const [activeTab, setActiveTab] = useState<'logo' | 'resize' | 'scan'>('logo');

  // Interactive State for Logo Generator Tool Placeholder
  const [logoText, setLogoText] = useState('Freeman');
  const [logoTagline, setLogoTagline] = useState('Group');
  const [logoColor, setLogoColor] = useState('#1A2CB5');

  // Interactive State for Image Resizer Tool Placeholder
  const [imgWidth, setImgWidth] = useState(1920);
  const [imgHeight, setImgHeight] = useState(1080);
  const [selectedFormat, setSelectedFormat] = useState('PNG');

  // Interactive State for Document Scanner Tool Placeholder
  const [scannerFile, setScannerFile] = useState<File | null>(null);

  const handleDownloadLogo = () => {
    toast.success('Génération du logo en cours...', {
      description: 'Votre logo haute définition est en cours de téléchargement.'
    });
  };

  const handleResizeImage = () => {
    toast.success('Image redimensionnée avec succès !', {
      description: `Format ${imgWidth}x${imgHeight}px (${selectedFormat}) prêt au téléchargement.`
    });
  };

  const handleScanDoc = () => {
    if (!scannerFile) {
      toast.error('Veuillez d\'abord sélectionner un document à scanner.');
      return;
    }
    toast.success('Document numérisé & optimisé en PDF !', {
      description: `Fichier ${scannerFile.name} traité avec contraste amélioré.`
    });
  };

  return (
    <div className="flex flex-col w-full bg-[#fcfcfd] min-h-screen font-['Inter']">
      
      {/* Hero Banner Header */}
      <section className="relative pt-32 pb-20 bg-gradient-to-b from-[#1a0429] via-[#2a0845] to-[#1A2CB5] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[#d4af37] text-sm font-semibold tracking-wide uppercase mb-6">
              <Wrench size={16} />
              Utilitaires Gratuits en Ligne
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 leading-tight">
              Boîte à <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] via-amber-200 to-white">Outils Gratuits</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-200 max-w-3xl mx-auto font-light leading-relaxed mb-8">
              Des outils numériques rapides, intuitifs et 100% gratuits conçus par Freeman Group pour simplifier vos tâches quotidiennes.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Tools Container */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          <button
            onClick={() => setActiveTab('logo')}
            className={`flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 ${
              activeTab === 'logo'
                ? 'bg-[#1A2CB5] text-white shadow-lg shadow-[#1A2CB5]/30 scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <Sparkles size={18} />
            Générateur de Logo Express
          </button>

          <button
            onClick={() => setActiveTab('resize')}
            className={`flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 ${
              activeTab === 'resize'
                ? 'bg-[#1A2CB5] text-white shadow-lg shadow-[#1A2CB5]/30 scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <ImageIcon size={18} />
            Redimensionneur d'Images
          </button>

          <button
            onClick={() => setActiveTab('scan')}
            className={`flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 ${
              activeTab === 'scan'
                ? 'bg-[#1A2CB5] text-white shadow-lg shadow-[#1A2CB5]/30 scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <Scan size={18} />
            Scanner & Numériseur PDF
          </button>
        </div>

        {/* Tool 1: Logo Generator */}
        {activeTab === 'logo' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-200/80 shadow-xl grid md:grid-cols-2 gap-12 items-center"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#1A2CB5] text-xs font-bold uppercase mb-4">
                <Sparkles size={14} /> Créateur Graphique
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-4">Générateur de Logo Express</h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-8">
                Personnalisez le nom de votre marque, choisissez une couleur principale et téléchargez instantanément votre logo vectoriel professionnel.
              </p>

              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Nom de la marque</label>
                  <input
                    type="text"
                    value={logoText}
                    onChange={(e) => setLogoText(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1A2CB5] font-semibold text-gray-900"
                    placeholder="Ex: Freeman"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Sous-titre / Slogan</label>
                  <input
                    type="text"
                    value={logoTagline}
                    onChange={(e) => setLogoTagline(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1A2CB5] text-gray-700"
                    placeholder="Ex: Group"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Couleur principale</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={logoColor}
                      onChange={(e) => setLogoColor(e.target.value)}
                      className="w-12 h-12 rounded-xl cursor-pointer border-0"
                    />
                    <span className="text-sm font-mono text-gray-600">{logoColor}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleDownloadLogo}
                className="w-full py-4 bg-[#1A2CB5] text-white font-bold rounded-2xl hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <Download size={18} /> Télécharger mon Logo (PNG / SVG)
              </button>
            </div>

            {/* Live Preview Box */}
            <div className="bg-gray-900 rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[320px] border border-gray-800 relative overflow-hidden shadow-inner">
              <div className="absolute top-4 right-4 text-xs font-mono text-gray-500 uppercase">Aperçu en direct</div>
              
              <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl mb-4 flex items-center justify-center shadow-lg" style={{ backgroundColor: logoColor }}>
                  <Sparkles size={32} className="text-white" />
                </div>
                <div className="text-3xl font-black tracking-tight text-white">{logoText || 'Votre Marque'}</div>
                <div className="text-xs font-bold uppercase tracking-widest text-[#d4af37] mt-1">{logoTagline || 'Slogan'}</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tool 2: Image Resizer */}
        {activeTab === 'resize' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-200/80 shadow-xl grid md:grid-cols-2 gap-12 items-center"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-600 text-xs font-bold uppercase mb-4">
                <ImageIcon size={14} /> Traitement d'Images
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-4">Redimensionneur d'Images</h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-8">
                Ajustez les dimensions de vos visuels pour vos réseaux sociaux, votre site web ou vos impressions sans perte de qualité.
              </p>

              <div className="space-y-4 mb-8">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Largeur (px)</label>
                    <input
                      type="number"
                      value={imgWidth}
                      onChange={(e) => setImgWidth(Number(e.target.value))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-600 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Hauteur (px)</label>
                    <input
                      type="number"
                      value={imgHeight}
                      onChange={(e) => setImgHeight(Number(e.target.value))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-600 font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Format de sortie</label>
                  <div className="flex gap-3">
                    {['PNG', 'JPG', 'WEBP'].map((format) => (
                      <button
                        key={format}
                        onClick={() => setSelectedFormat(format)}
                        className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all ${
                          selectedFormat === format ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {format}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={handleResizeImage}
                className="w-full py-4 bg-purple-600 text-white font-bold rounded-2xl hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <Maximize2 size={18} /> Redimensionner & Télécharger
              </button>
            </div>

            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[320px]">
              <ImageIcon size={48} className="text-gray-400 mb-4" />
              <div className="text-sm font-bold text-gray-700 mb-1">Glissez-déposez votre image ici</div>
              <div className="text-xs text-gray-400">ou cliquez pour sélectionner un fichier</div>
            </div>
          </motion.div>
        )}

        {/* Tool 3: Document Scanner */}
        {activeTab === 'scan' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-200/80 shadow-xl grid md:grid-cols-2 gap-12 items-center"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold uppercase mb-4">
                <Scan size={14} /> Numérisation Document
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-4">Scanner & Optimiseur PDF</h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-8">
                Convertissez des photos de contrats, factures ou pièces d'identité en documents PDF scannés haute clarté.
              </p>

              <div className="space-y-4 mb-8">
                <div className="border border-gray-200 rounded-2xl p-4 bg-gray-50">
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => setScannerFile(e.target.files?.[0] || null)}
                    className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-600 file:text-white hover:file:bg-black cursor-pointer"
                  />
                </div>
              </div>

              <button
                onClick={handleScanDoc}
                className="w-full py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <FileText size={18} /> Numériser & Exporter en PDF
              </button>
            </div>

            <div className="bg-emerald-950 text-white rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[320px] relative overflow-hidden">
              <Scan size={48} className="text-emerald-400 mb-4 animate-pulse" />
              <div className="text-lg font-black mb-2">Scan automatique Haute Définition</div>
              <p className="text-xs text-emerald-200 max-w-xs">
                Ajustement automatique du contraste, découpage intelligent des bordures et compression optimale.
              </p>
            </div>
          </motion.div>
        )}

      </section>

    </div>
  );
}
