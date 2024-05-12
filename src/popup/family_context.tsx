import { createContext, useState, useContext, Dispatch, SetStateAction } from 'react';
import { Family } from '../common/models/family';

interface FamilyContextType {
  families: Family[];
  setFamilies: Dispatch<SetStateAction<Family[]>>;
  selectedFamilyId?: string;
  setSelectedFamilyId: Dispatch<SetStateAction<string | undefined>>;
  selectedFamily?: Family;
  selectedPeopleIndex?: number;
  setSelectedPeopleIndex: Dispatch<SetStateAction<number | undefined>>;
};

export const FamilyContext = createContext<FamilyContextType>({
  families: [],
  setFamilies: () => {},
  selectedFamilyId: undefined,
  setSelectedFamilyId: () => {},
  selectedPeopleIndex: undefined,
  setSelectedPeopleIndex: () => {},
});

interface FamilyContextProviderProps {
  children: React.ReactNode;
};

export function FamilyContextProvider({ children }: FamilyContextProviderProps) {
  const [families, setFamilies] = useState<Family[]>([]);
  const [selectedFamilyId, setSelectedFamilyId] = useState<string | undefined>(undefined);
  const [selectedPeopleIndex, setSelectedPeopleIndex] = useState<number | undefined>(undefined);

  const selectedFamily = families.find(family => family.uniqueId === selectedFamilyId);

  return (
    <FamilyContext.Provider value={{
      families,
      setFamilies,
      selectedFamilyId,
      setSelectedFamilyId,
      selectedFamily,
      selectedPeopleIndex,
      setSelectedPeopleIndex,
    }}>
      {children}
    </FamilyContext.Provider>
  );
};

export function useFamilyContext() {
  return useContext(FamilyContext);
};
