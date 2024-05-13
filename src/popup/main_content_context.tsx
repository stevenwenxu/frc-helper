import { createContext, useState, useContext, Dispatch, SetStateAction } from 'react';

type MainContentType = "loading" | "empty" | "family" | "email" | "mathAssessment";

interface MainContentContextType {
  mainContentType: MainContentType;
  setMainContentType: Dispatch<SetStateAction<MainContentType>>;
};

export const MainContentContext = createContext<MainContentContextType>({
  mainContentType: "loading",
  setMainContentType: () => {},
});

interface MainContentTypeProviderProps {
  children: React.ReactNode;
};

export function MainContentTypeProvider({ children }: MainContentTypeProviderProps) {
  const [mainContentType, setMainContentType] = useState<MainContentType>("loading");

  return (
    <MainContentContext.Provider value={{ mainContentType, setMainContentType }}>
      {children}
    </MainContentContext.Provider>
  );
};

export function useMainContentType() {
  return useContext(MainContentContext);
};
