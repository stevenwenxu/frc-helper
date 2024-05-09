import { createContext, useState, useContext, Dispatch, SetStateAction } from 'react';

type MainContentType = "empty" | "familyCard" | "email" | null;

interface MainContentContextType {
  mainContentType: MainContentType;
  setMainContentType: Dispatch<SetStateAction<MainContentType>>;
};

export const MainContentContext = createContext<MainContentContextType>({
  mainContentType: null,
  setMainContentType: () => {},
});

interface MainContentTypeProviderProps {
  children: React.ReactNode;
};

export function MainContentTypeProvider({ children }: MainContentTypeProviderProps) {
  const [mainContentType, setMainContentType] = useState<MainContentType>(null);

  return (
    <MainContentContext.Provider value={ { mainContentType, setMainContentType } }>
      {children}
    </MainContentContext.Provider>
  );
};

export function useMainContentType() {
  return useContext(MainContentContext);
};
