import { createContext, useState, useContext, Dispatch, SetStateAction } from 'react';

interface ModalContextType {
  shouldShowModal: boolean;
  setShouldShowModal: Dispatch<SetStateAction<boolean>>;
  showModal: (
    header: string,
    body: string,
    modalPrimaryButtonText: string,
    modalPrimaryButtonOnClick: () => void,
    modalSecondaryButtonText?: string,
    modalSecondaryButtonOnClick?: () => void,
  ) => void;
  modalHeader: string;
  modalBody: string;
  modalPrimaryButtonText: string;
  modalPrimaryButtonOnClick: () => void;
  modalSecondaryButtonText?: string;
  modalSecondaryButtonOnClick?: () => void;
};

export const ModalContext = createContext<ModalContextType>({
  shouldShowModal: false,
  setShouldShowModal: () => {},
  showModal: () => {},
  modalHeader: "",
  modalBody: "",
  modalPrimaryButtonText: "",
  modalPrimaryButtonOnClick: () => {},
  modalSecondaryButtonText: undefined,
  modalSecondaryButtonOnClick: undefined,
});

interface ModalProviderProps {
  children: React.ReactNode;
};

export function ModalProvider({ children }: ModalProviderProps) {
  const [shouldShowModal, setShouldShowModal] = useState<boolean>(false);
  const [modalHeader, setModalHeader] = useState("");
  const [modalBody, setModalBody] = useState("");
  const [modalPrimaryButtonText, setModalPrimaryButtonText] = useState("");
  const [modalPrimaryButtonOnClick, setModalPrimaryButtonOnClick] = useState<() => void>(() => {});
  const [modalSecondaryButtonText, setModalSecondaryButtonText] = useState<string | undefined>(undefined);
  const [modalSecondaryButtonOnClick, setModalSecondaryButtonOnClick] = useState<(() => void) | undefined>(undefined);

  const showModal = (
    header: string,
    body: string,
    primaryButtonText: string,
    primaryButtonOnClick: () => void,
    secondaryButtonText?: string,
    secondaryButtonOnClick?: () => void,
) => {
    setModalHeader(header);
    setModalBody(body);
    setModalPrimaryButtonText(primaryButtonText);
    setModalPrimaryButtonOnClick(() => primaryButtonOnClick);
    if (secondaryButtonText && secondaryButtonOnClick) {
      setModalSecondaryButtonText(secondaryButtonText);
      setModalSecondaryButtonOnClick(() => secondaryButtonOnClick);
    } else {
      setModalSecondaryButtonText(undefined);
      setModalSecondaryButtonOnClick(undefined);
    }
    setShouldShowModal(true);
  };

  return (
    <ModalContext.Provider value={{
      shouldShowModal,
      setShouldShowModal,
      showModal,
      modalHeader,
      modalBody,
      modalPrimaryButtonText,
      modalPrimaryButtonOnClick,
      modalSecondaryButtonText,
      modalSecondaryButtonOnClick,
    }}>
      {children}
    </ModalContext.Provider>
  );
};

export function useModal() {
  return useContext(ModalContext);
};
