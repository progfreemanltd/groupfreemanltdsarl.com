import { createBrowserRouter } from "react-router";
import type { ComponentType } from "react";
import { CorporateLayout } from "./components/CorporateLayout";
import { MarketplaceLayout } from "./components/MarketplaceLayout";

import { DigitalLayout } from "./components/DigitalLayout";

const lazyPage = (load: () => Promise<unknown>, exportName: string) => ({
  lazy: async () => ({
    Component: (await load() as Record<string, ComponentType>)[exportName],
  }),
});

export const router = createBrowserRouter([
  // ── Corporate Site (Layout principal) ─────────────────────────
  {
    path: "/",
    Component: CorporateLayout,
    children: [
      { index: true, ...lazyPage(() => import("./pages/CorporateHomePage"), "CorporateHomePage") },
      { path: "about", ...lazyPage(() => import("./pages/AboutPage"), "AboutPage") },
      { path: "portfolio", ...lazyPage(() => import("./pages/PortfolioPage"), "PortfolioPage") },
      { path: "investments", ...lazyPage(() => import("./pages/InvestmentsPage"), "InvestmentsPage") },
      { path: "blog", ...lazyPage(() => import("./pages/BlogPage"), "BlogPage") },
      { path: "contact", ...lazyPage(() => import("./pages/CorporateContactPage"), "CorporateContactPage") },
      { path: "connexion", ...lazyPage(() => import("./pages/LoginPage"), "LoginPage") },
      { path: "outils", ...lazyPage(() => import("./pages/FreeToolsPage"), "FreeToolsPage") },
      { path: "mentions-legales", ...lazyPage(() => import("./pages/LegalPage"), "LegalPage") },
      { path: "politique-confidentialite", ...lazyPage(() => import("./pages/LegalPage"), "LegalPage") },
      { path: "cgv", ...lazyPage(() => import("./pages/LegalPage"), "LegalPage") },

      // Services — pages dédiées avec correspondances exactes d'abord
      { path: "services", ...lazyPage(() => import("./pages/CorporateServicesPage"), "CorporateServicesPage") },
      { path: "services/digital", ...lazyPage(() => import("./pages/DigitalServicePage"), "DigitalServicePage") },
      { path: "services/btp", ...lazyPage(() => import("./pages/BtpServicePage"), "BtpServicePage") },
      { path: "services/management", ...lazyPage(() => import("./pages/ManagementServicePage"), "ManagementServicePage") },
      { path: "services/hotellerie", ...lazyPage(() => import("./pages/HotellerieServicePage"), "HotellerieServicePage") },
      { path: "services/amenagement", ...lazyPage(() => import("./pages/AmenagementServicePage"), "AmenagementServicePage") },
      { path: "services/commerce", ...lazyPage(() => import("./pages/CommerceServicePage"), "CommerceServicePage") },
      { path: "services/achat-livraison", ...lazyPage(() => import("./pages/AchatLivraisonPage"), "AchatLivraisonPage") },
      { path: "services/jardinage", ...lazyPage(() => import("./pages/JardinagePage"), "JardinagePage") },
      { path: "services/en-developpement", ...lazyPage(() => import("./pages/ServicesInDevelopmentPage"), "ServicesInDevelopmentPage") },
      // Fallback pour les onglets /services?tab=xxx via useSearchParams
      { path: "services/:pole", ...lazyPage(() => import("./pages/CorporateServicesPage"), "CorporateServicesPage") },
    ]
  },

  // ── Marketplace ───────────────────────────────────────────────
  {
    path: "/",
    Component: MarketplaceLayout,
    children: [
      { path: "boutique", ...lazyPage(() => import("./pages/MarketplacePage"), "MarketplacePage") },
      { path: "boutique/:id", ...lazyPage(() => import("./pages/ProductDetailPage"), "ProductDetailPage") },
      { path: "vendeur/abonnement", ...lazyPage(() => import("./pages/VendorPricingPage"), "VendorPricingPage") },
      { path: "vendeur/dashboard", ...lazyPage(() => import("./pages/VendorDashboardPage"), "VendorDashboardPage") },
      { path: "vendeur/nouvelle-annonce", ...lazyPage(() => import("./pages/VendorNewAdPage"), "VendorNewAdPage") },
      { path: "panier", ...lazyPage(() => import("./pages/CheckoutPage"), "CheckoutPage") },
      { path: "client/dashboard", ...lazyPage(() => import("./pages/CustomerDashboardPage"), "CustomerDashboardPage") },
      { path: "boutique/facture/:id", ...lazyPage(() => import("./pages/InvoiceView"), "InvoiceView") },
    ]
  },

  // ── Admin / CMS ───────────────────────────────────────────────
  { path: "/admin/dashboard", ...lazyPage(() => import("./pages/AdminDashboardPage"), "AdminDashboardPage") },
  { path: "/freemancms/admin", ...lazyPage(() => import("./pages/CmsDashboardPage"), "CmsDashboardPage") },

  // ── Messages ──────────────────────────────────────────────────
  { path: "/messages/nouveau", ...lazyPage(() => import("./pages/MessagesPage"), "MessagesPage") },
  { path: "/messages", ...lazyPage(() => import("./pages/MessagesPage"), "MessagesPage") },

  // ── Portail Digital (Layout séparé) ──────────────────────────
  {
    path: "/digital",
    Component: DigitalLayout,
    children: [
      { index: true, ...lazyPage(() => import("./pages/HomePage"), "HomePage") },
      { path: "services", ...lazyPage(() => import("./pages/ServicesPage"), "ServicesPage") },
      { path: "contact", ...lazyPage(() => import("./pages/ContactPage"), "ContactPage") },
    ]
  },
  {
    path: "/",
    Component: DigitalLayout,
    children: [
      { path: "saas", ...lazyPage(() => import("./pages/SaasPage"), "SaasPage") },
      { path: "projects", ...lazyPage(() => import("./pages/ProjectsPage"), "ProjectsPage") },
      { path: "formations", ...lazyPage(() => import("./pages/FormationsPage"), "FormationsPage") },
      { path: "tutoriels", ...lazyPage(() => import("./pages/FormationsPage"), "FormationsPage") },
      { path: "team", ...lazyPage(() => import("./pages/TeamPage"), "TeamPage") },
    ]
  },

  // ── Pages détail ─────────────────────────────────────────────
  { path: "/formations/:slug", ...lazyPage(() => import("./pages/FormationDetailPage"), "FormationDetailPage") },
  { path: "/saas/:slug", ...lazyPage(() => import("./pages/SaasDetailPage"), "SaasDetailPage") },
]);
