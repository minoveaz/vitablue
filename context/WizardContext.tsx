import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ProfileType = 'student' | 'expat' | 'nomad' | 'individual' | 'pet' | null;
export type DurationType = 'less_6' | '6_12' | 'more_12' | null;
export type StartDateType = 'weeks' | 'month' | 'later' | null;
export type VisaRequiredType = 'yes' | 'no' | 'unknown' | null;
export type AgeRangeType = '18_24' | '25_30' | '31_40' | 'plus_40' | null;
export type TravelFrequencyType = 'low' | 'high' | null;
export type ResidencyType = 'non_lucrative' | 'work' | 'golden_visa' | 'reunification' | null;
export type CountriesPerYearType = '1_3' | '4_6' | '7_12' | '13_plus' | null;
export type TelemedLanguageType = 'es' | 'en' | 'both' | null;

interface WizardState {
  profile: ProfileType;
  duration: DurationType;
  startDate: StartDateType;
  visaRequired: VisaRequiredType;
  ageRange: AgeRangeType;
  travelFrequency: TravelFrequencyType;
  residencyType: ResidencyType;
  continents: string[];
  countriesPerYear: CountriesPerYearType;
  telemedLanguage: TelemedLanguageType;
}

interface WizardContextType extends WizardState {
  setProfile: (profile: ProfileType) => void;
  setDuration: (duration: DurationType) => void;
  setStartDate: (startDate: StartDateType) => void;
  setVisaRequired: (visaRequired: VisaRequiredType) => void;
  setAgeRange: (ageRange: AgeRangeType) => void;
  setTravelFrequency: (freq: TravelFrequencyType) => void;
  setResidencyType: (type: ResidencyType) => void;
  setContinents: (continents: string[]) => void;
  setCountriesPerYear: (countries: CountriesPerYearType) => void;
  setTelemedLanguage: (lang: TelemedLanguageType) => void;
  resetWizard: () => void;
  isComplete: boolean;
}

const initialState: WizardState = {
  profile: null,
  duration: null,
  startDate: null,
  visaRequired: null,
  ageRange: null,
  travelFrequency: null,
  residencyType: null,
  continents: [],
  countriesPerYear: null,
  telemedLanguage: null,
};

const WizardContext = createContext<WizardContextType | undefined>(undefined);

const STORAGE_KEY = 'vb_wizard_state';

export const WizardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<WizardState>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = sessionStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : initialState;
      } catch (e) {
        console.error("Error parsing wizard state from sessionStorage:", e);
        return initialState;
      }
    }
    return initialState;
  });

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const setProfile = (profile: ProfileType) => setState(prev => ({ ...prev, profile }));
  const setDuration = (duration: DurationType) => setState(prev => ({ ...prev, duration }));
  const setStartDate = (startDate: StartDateType) => setState(prev => ({ ...prev, startDate }));
  const setVisaRequired = (visaRequired: VisaRequiredType) => setState(prev => ({ ...prev, visaRequired }));
  const setAgeRange = (ageRange: AgeRangeType) => setState(prev => ({ ...prev, ageRange }));
  const setTravelFrequency = (travelFrequency: TravelFrequencyType) => setState(prev => ({ ...prev, travelFrequency }));
  const setResidencyType = (residencyType: ResidencyType) => setState(prev => ({ ...prev, residencyType }));
  const setContinents = (continents: string[]) => setState(prev => ({ ...prev, continents }));
  const setCountriesPerYear = (countriesPerYear: CountriesPerYearType) => setState(prev => ({ ...prev, countriesPerYear }));
  const setTelemedLanguage = (telemedLanguage: TelemedLanguageType) => setState(prev => ({ ...prev, telemedLanguage }));

  const resetWizard = () => {
    setState(initialState);
    sessionStorage.removeItem(STORAGE_KEY);
  };

  const isComplete = Boolean(
    state.profile && 
    state.duration && 
    state.startDate && 
    state.visaRequired && 
    state.ageRange &&
    (state.profile !== 'nomad' || (state.travelFrequency && state.countriesPerYear && state.continents.length > 0)) &&
    (state.profile !== 'expat' || state.residencyType)
  );

  return (
    <WizardContext.Provider value={{ 
      ...state, 
      setProfile, 
      setDuration, 
      setStartDate, 
      setVisaRequired, 
      setAgeRange, 
      setTravelFrequency,
      setResidencyType,
      setContinents,
      setCountriesPerYear,
      setTelemedLanguage,
      resetWizard,
      isComplete 
    }}>
      {children}
    </WizardContext.Provider>
  );
};

export const useWizard = () => {
  const context = useContext(WizardContext);
  if (context === undefined) {
    throw new Error('useWizard must be used within a WizardProvider');
  }
  return context;
};
