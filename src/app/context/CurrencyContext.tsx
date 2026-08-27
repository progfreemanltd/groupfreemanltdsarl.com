import React, { createContext, useContext, useState, useEffect } from 'react';

export type CurrencyCode = 'XOF' | 'EUR' | 'USD' | 'GBP' | 'JPY' | 'NGN' | 'CNY';

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  country: string;
  exchangeRates: Record<CurrencyCode, number>;
  convertPrice: (amount: number, fromCurrency: CurrencyCode) => { value: number, formatted: string };
}

const defaultRates: Record<CurrencyCode, number> = {
  EUR: 1, // EUR as base for calculations for simplicity
  XOF: 655.957,
  USD: 1.08,
  GBP: 0.85,
  JPY: 160.0,
  NGN: 1300.0,
  CNY: 7.8
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  // Par défaut XOF pour les africains
  const [currency, setCurrency] = useState<CurrencyCode>('XOF');
  // Simulation de détection pays
  const [country, setCountry] = useState<string>('Bénin');

  // En vrai, on ferait un appel à une API (ex: ipapi.co/json/ puis XE pour les taux)
  useEffect(() => {
    // Simuler un appel API
    setTimeout(() => {
      setCountry('Bénin');
    }, 500);
  }, []);

  const convertPrice = (amount: number, fromCurrency?: CurrencyCode) => {
    // 1. Convert to EUR first (if not XOF base, but here we assume inputs are mostly XOF natively for B2B)
    const activeFromCurrency = fromCurrency || 'XOF';
    let inTarget = amount;

    if (activeFromCurrency !== 'XOF') {
       const inEur = amount / defaultRates[activeFromCurrency];
       inTarget = inEur * defaultRates['XOF'];
    }

    let formatter;
    try {
      formatter = new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XOF',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      });
    } catch {
      formatter = new Intl.NumberFormat('fr-FR', {
        minimumFractionDigits: 0,
      });
      return { value: inTarget, formatted: `${formatter.format(inTarget)} F CFA` };
    }

    return {
      value: inTarget,
      formatted: `${formatter.format(inTarget).replace('XOF', '').replace('FCFA', '').trim()} F CFA`
    };
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, country, exchangeRates: defaultRates, convertPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
