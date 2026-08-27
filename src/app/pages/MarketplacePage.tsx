import { Search, ShoppingCart, Filter, Star, PlusSquare, Bell, Heart, MessageCircle, User, Grid, ChevronRight, Globe, MapPin, Loader2 } from 'lucide-react';
import { Link, useSearchParams } from 'react-router';
import { useState, useRef, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { MARKETPLACE_CATEGORIES } from '../data/marketplaceCategories';
import { useCurrency, CurrencyCode } from '../context/CurrencyContext';
import { useCart } from '../context/CartContext';

const ProductPriceDisplay = ({ product }: { product: any }) => {
  const { currency, setCurrency, convertPrice } = useCurrency();
  const converted = convertPrice(product.priceValue, product.priceCurrency);
  
  return (
    <div className="flex items-end gap-1">
      <span className="text-base sm:text-xl font-black text-[#1A2CB5] leading-none">{converted.formatted}</span>
      {product.priceUnit && <span className="text-[10px] text-gray-500 font-bold mb-0.5 whitespace-nowrap">{product.priceUnit}</span>}
    </div>
  );
};

export function MarketplacePage() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [searchParams] = useSearchParams();
  const currentCat = searchParams.get("cat");
  const { country, currency, setCurrency } = useCurrency();
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const { items } = useCart();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedProducts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(fetchedProducts);
      setLoadingProducts(false);
    });
    return () => unsubscribe();
  }, []);

  const activeCategoryData = MARKETPLACE_CATEGORIES.find(c => c.id === activeMenu);

  const filteredProducts = currentCat 
    ? products.filter(p => (p.categoryId === currentCat || p.parentIds?.includes(currentCat)) && p.status === 'active')
    : products.filter(p => p.status === 'active');

  return (
    <div className="w-full bg-[#f8f9fa] min-h-screen pb-20">
      


      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Sidebar (Filters) */}
        <div className="hidden lg:block col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-40">
            <div className="flex items-center gap-2 font-bold mb-6 text-black border-b border-gray-100 pb-4">
              <Filter size={18} /> Filtrer les résultats
            </div>
            
            <div className="mb-6">
              <h4 className="font-bold text-sm text-gray-800 mb-3">Par Prix</h4>
              <div className="space-y-3">
                {['Moins de 50 000 FCFA', '50 000 à 250 000 FCFA', '250 000 à 1 000 000 FCFA', 'Plus de 1 000 000 FCFA'].map((price, i) => (
                  <label key={i} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-[#1A2CB5] group">
                    <input type="checkbox" className="rounded border-gray-300 text-[#1A2CB5] focus:ring-[#1A2CB5] w-4 h-4 cursor-pointer" />
                    <span className="group-hover:translate-x-1 transition-transform">{price}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-bold text-sm text-gray-800 mb-3">État du produit</h4>
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-[#1A2CB5] group">
                  <input type="checkbox" className="rounded border-gray-300 text-[#1A2CB5] focus:ring-[#1A2CB5] w-4 h-4 cursor-pointer" defaultChecked />
                  <span className="group-hover:translate-x-1 transition-transform">Neuf (Garantie Officielle)</span>
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-400 cursor-not-allowed group">
                  <input type="checkbox" className="rounded border-gray-200 text-gray-300 w-4 h-4" disabled />
                  <span>Occasion (Non autorisé)</span>
                </label>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-bold text-sm text-gray-800 mb-3">Vendeur</h4>
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-[#1A2CB5] group">
                  <input type="checkbox" className="rounded border-gray-300 text-[#1A2CB5] focus:ring-[#1A2CB5] w-4 h-4 cursor-pointer" defaultChecked />
                  <span className="group-hover:translate-x-1 transition-transform font-bold text-[#1A2CB5]">Stock Freeman Group</span>
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-[#1A2CB5] group">
                  <input type="checkbox" className="rounded border-gray-300 text-[#1A2CB5] focus:ring-[#1A2CB5] w-4 h-4 cursor-pointer" defaultChecked />
                  <span className="group-hover:translate-x-1 transition-transform flex items-center gap-2">
                    Partenaires Pros <span className="bg-black text-[#d4af37] text-[9px] font-bold px-1.5 py-0.5 rounded tracking-widest">ABONNÉ</span>
                  </span>
                </label>
              </div>
            </div>
            
            <button className="w-full py-2.5 bg-gray-50 text-black text-sm font-bold rounded-xl border border-gray-200 hover:bg-black hover:text-white hover:border-black transition-colors">
              Appliquer les filtres
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="col-span-1 lg:col-span-3">
          <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <span className="text-gray-500 text-sm font-medium">Affichage de <strong className="text-black">{filteredProducts.length}</strong> annonces pro</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 font-medium">Trier par:</span>
              <select className="border border-gray-200 rounded-lg text-sm px-3 py-1.5 font-bold text-gray-800 bg-gray-50 focus:outline-none focus:border-[#1A2CB5] cursor-pointer">
                <option>Pertinence</option>
                <option>Nouveautés</option>
                <option>Prix croissant</option>
                <option>Prix décroissant</option>
                <option>Meilleures notes</option>
              </select>
            </div>
          </div>

          {loadingProducts ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <Loader2 size={48} className="text-[#1A2CB5] animate-spin mb-4" />
              <h3 className="text-xl font-bold text-gray-900">Chargement des annonces...</h3>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white border text-center py-20 px-8 rounded-2xl border-dashed border-gray-200">
              <Search className="mx-auto text-gray-300 mb-4" size={48} />
              <h3 className="text-xl font-bold mb-2 text-gray-900">Aucune annonce trouvée</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">La marketplace vient d'être lancée ! Soyez le premier vendeur à publier votre offre dans cette catégorie.</p>
              <Link to="/vendeur/nouvelle-annonce" className="inline-block bg-[#1A2CB5] text-white font-bold px-6 py-3 rounded-xl hover:bg-black transition-colors">Déposer une annonce</Link>
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Link to={`/boutique/${product.id}`} key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-[#1A2CB5]/30 transition-all duration-300 group flex flex-col">
                <div className="h-48 overflow-hidden relative bg-gray-50">
                  <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                    {product.category}
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex items-center gap-1 mb-2">
                    <Star size={14} className="fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-bold text-gray-700">{product.rating}</span>
                    <span className="text-[10px] text-gray-400 ml-1">(24 avis)</span>
                  </div>
                  <h3 className="font-bold text-gray-900 leading-snug mb-1 group-hover:text-[#1A2CB5] transition-colors line-clamp-2">
                    {product.title}
                  </h3>
                  <p className="text-xs text-gray-500 mb-4 flex items-center gap-1">
                    Vendu par <span className="font-semibold text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded">{product.vendor}</span>
                  </p>
                  <div className="flex items-end justify-between mt-auto pt-4 border-t border-gray-50">
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase tracking-widest block mb-0.5">Prix Pro HT</span>
                      <ProductPriceDisplay product={product} />
                    </div>
                    <button className="w-10 h-10 rounded-xl bg-gray-50 text-gray-900 flex items-center justify-center hover:bg-[#1A2CB5] hover:text-white transition-all transform group-hover:scale-110 shadow-sm shrink-0">
                      <ShoppingCart size={18} />
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          )}
          
          <div className="mt-12 text-center">
            <button className="px-8 py-3 bg-white border-2 border-gray-200 text-gray-600 font-bold rounded-xl hover:border-black hover:text-black transition-all hover:shadow-md">
              Charger plus d'annonces
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
