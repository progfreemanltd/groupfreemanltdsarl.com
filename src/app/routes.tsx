import { createBrowserRouter } from "react-router";
import { CorporateLayout } from "./components/CorporateLayout";
import { MarketplaceLayout } from "./components/MarketplaceLayout";
import { CorporateHomePage } from "./pages/CorporateHomePage";
import { AboutPage } from "./pages/AboutPage";
import { CorporateServicesPage } from "./pages/CorporateServicesPage";
import { PortfolioPage } from "./pages/PortfolioPage";
import { InvestmentsPage } from "./pages/InvestmentsPage";
import { BlogPage } from "./pages/BlogPage";
import { CorporateContactPage } from "./pages/CorporateContactPage";
import { MarketplacePage } from "./pages/MarketplacePage";
import { VendorPricingPage } from "./pages/VendorPricingPage";
import { VendorDashboardPage } from "./pages/VendorDashboardPage";
import { VendorNewAdPage } from "./pages/VendorNewAdPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { CustomerDashboardPage } from "./pages/CustomerDashboardPage";
import { MessagesPage } from "./pages/MessagesPage";
import { LoginPage } from "./pages/LoginPage";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { InvoiceView } from "./pages/InvoiceView";
import { CmsDashboardPage } from "./pages/CmsDashboardPage";
import { FormationDetailPage } from "./pages/FormationDetailPage";
import { SaasDetailPage } from "./pages/SaasDetailPage";

import { DigitalLayout } from "./components/DigitalLayout";
import { HomePage as DigitalHomePage } from "./pages/HomePage";
import { ServicesPage as DigitalServicesPage } from "./pages/ServicesPage";
import { SaasPage } from "./pages/SaasPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { FormationsPage } from "./pages/FormationsPage";
import { TeamPage } from "./pages/TeamPage";
import { ContactPage as DigitalContactPage } from "./pages/ContactPage";

import { ServicesInDevelopmentPage } from "./pages/ServicesInDevelopmentPage";
import { AchatLivraisonPage } from "./pages/AchatLivraisonPage";
import { JardinagePage } from "./pages/JardinagePage";
import { DigitalServicePage } from "./pages/DigitalServicePage";
import { BtpServicePage } from "./pages/BtpServicePage";
import { ManagementServicePage } from "./pages/ManagementServicePage";
import { HotellerieServicePage } from "./pages/HotellerieServicePage";
import { AmenagementServicePage } from "./pages/AmenagementServicePage";
import { CommerceServicePage } from "./pages/CommerceServicePage";

import { FreeToolsPage } from "./pages/FreeToolsPage";
import { LegalPage } from "./pages/LegalPage";

export const router = createBrowserRouter([
  // ── Corporate Site (Layout principal) ─────────────────────────
  {
    path: "/",
    Component: CorporateLayout,
    children: [
      { index: true, Component: CorporateHomePage },
      { path: "about", Component: AboutPage },
      { path: "portfolio", Component: PortfolioPage },
      { path: "investments", Component: InvestmentsPage },
      { path: "blog", Component: BlogPage },
      { path: "contact", Component: CorporateContactPage },
      { path: "connexion", Component: LoginPage },
      { path: "outils", Component: FreeToolsPage },
      { path: "mentions-legales", Component: LegalPage },
      { path: "politique-confidentialite", Component: LegalPage },
      { path: "cgv", Component: LegalPage },

      // Services — pages dédiées avec correspondances exactes d'abord
      { path: "services", Component: CorporateServicesPage },
      { path: "services/digital", Component: DigitalServicePage },
      { path: "services/btp", Component: BtpServicePage },
      { path: "services/management", Component: ManagementServicePage },
      { path: "services/hotellerie", Component: HotellerieServicePage },
      { path: "services/amenagement", Component: AmenagementServicePage },
      { path: "services/commerce", Component: CommerceServicePage },
      { path: "services/achat-livraison", Component: AchatLivraisonPage },
      { path: "services/jardinage", Component: JardinagePage },
      { path: "services/en-developpement", Component: ServicesInDevelopmentPage },
      // Fallback pour les onglets /services?tab=xxx via useSearchParams
      { path: "services/:pole", Component: CorporateServicesPage },
    ]
  },

  // ── Marketplace ───────────────────────────────────────────────
  {
    path: "/",
    Component: MarketplaceLayout,
    children: [
      { path: "boutique", Component: MarketplacePage },
      { path: "boutique/:id", Component: ProductDetailPage },
      { path: "vendeur/abonnement", Component: VendorPricingPage },
      { path: "vendeur/dashboard", Component: VendorDashboardPage },
      { path: "vendeur/nouvelle-annonce", Component: VendorNewAdPage },
      { path: "panier", Component: CheckoutPage },
      { path: "client/dashboard", Component: CustomerDashboardPage },
      { path: "boutique/facture/:id", Component: InvoiceView },
    ]
  },

  // ── Admin / CMS ───────────────────────────────────────────────
  { path: "/admin/dashboard", Component: AdminDashboardPage },
  { path: "/freemancms/admin", Component: CmsDashboardPage },

  // ── Messages ──────────────────────────────────────────────────
  { path: "/messages/nouveau", Component: MessagesPage },
  { path: "/messages", Component: MessagesPage },

  // ── Portail Digital (Layout séparé) ──────────────────────────
  {
    path: "/digital",
    Component: DigitalLayout,
    children: [
      { index: true, Component: DigitalHomePage },
      { path: "services", Component: DigitalServicesPage },
      { path: "contact", Component: DigitalContactPage },
    ]
  },
  {
    path: "/",
    Component: DigitalLayout,
    children: [
      { path: "saas", Component: SaasPage },
      { path: "projects", Component: ProjectsPage },
      { path: "formations", Component: FormationsPage },
      { path: "tutoriels", Component: FormationsPage },
      { path: "team", Component: TeamPage },
    ]
  },

  // ── Pages détail ─────────────────────────────────────────────
  { path: "/formations/:slug", Component: FormationDetailPage },
  { path: "/saas/:slug", Component: SaasDetailPage },
]);
