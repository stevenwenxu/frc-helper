import { createContext, useState, useContext, Dispatch, SetStateAction } from 'react';
import { Family } from '../common/models/family';
import { Parent, Student } from '../common/models/person';
import { Updater, useImmer } from 'use-immer';

interface FamilyContextType {
  families: Family[];
  setFamilies: Updater<Family[]>;
  selectedFamilyId?: string;
  setSelectedFamilyId: Dispatch<SetStateAction<string | undefined>>;
  selectedFamily?: Family;
  selectedPeopleIndex?: number;
  setSelectedPeopleIndex: Dispatch<SetStateAction<number | undefined>>;
  selectedPerson?: Parent | Student;
};

export const FamilyContext = createContext<FamilyContextType>({
  families: [],
  setFamilies: () => {},
  selectedFamilyId: undefined,
  setSelectedFamilyId: () => {},
  selectedFamily: undefined,
  selectedPeopleIndex: undefined,
  setSelectedPeopleIndex: () => {},
  selectedPerson: undefined,
});

interface FamilyContextProviderProps {
  children: React.ReactNode;
};

export function FamilyContextProvider({ children }: FamilyContextProviderProps) {
  const [families, setFamilies] = useImmer<Family[]>([]);
  const [selectedFamilyId, setSelectedFamilyId] = useState<string | undefined>(undefined);
  const [selectedPeopleIndex, setSelectedPeopleIndex] = useState<number | undefined>(undefined);

  const selectedFamily = families.find(family => family.uniqueId === selectedFamilyId);
  const selectedPerson = (selectedFamily && selectedPeopleIndex !== undefined)
    ? selectedFamily.people[selectedPeopleIndex]
    : undefined;

  return (
    <FamilyContext.Provider value={{
      families,
      setFamilies,
      selectedFamilyId,
      setSelectedFamilyId,
      selectedFamily,
      selectedPeopleIndex,
      setSelectedPeopleIndex,
      selectedPerson,
    }}>
      {children}
    </FamilyContext.Provider>
  );
};

export function useFamilyContext() {
  return useContext(FamilyContext);
};
