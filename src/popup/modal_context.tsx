import { createContext, useState, useContext } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

interface ModalContextType {
  showModal: (
    header: string,
    body: string,
    primaryButtonText: string,
    primaryButtonOnClick: () => void,
    secondaryButtonText?: string,
    secondaryButtonOnClick?: () => void,
  ) => void;
  hideModal: () => void;
};

export const ModalContext = createContext<ModalContextType>({
  showModal: () => {},
  hideModal: () => {},
});

interface ModalProviderProps {
  children: React.ReactNode;
};

export function ModalProvider({ children }: ModalProviderProps) {
  const [shouldShow, setShouldShow] = useState<boolean>(false);
  const [header, setHeader] = useState("");
  const [body, setBody] = useState("");
  const [primaryButtonText, setPrimaryButtonText] = useState("");
  const [primaryButtonOnClick, setPrimaryButtonOnClick] = useState<() => void>(() => {});
  const [secondaryButtonText, setSecondaryButtonText] = useState<string | undefined>(undefined);
  const [secondaryButtonOnClick, setSecondaryButtonOnClick] = useState<(() => void) | undefined>(undefined);

  const showModal = (
    header: string,
    body: string,
    primaryButtonText: string,
    primaryButtonOnClick: () => void,
    secondaryButtonText?: string,
    secondaryButtonOnClick?: () => void,
) => {
    setHeader(header);
    setBody(body);
    setPrimaryButtonText(primaryButtonText);
    setPrimaryButtonOnClick(() => primaryButtonOnClick);
    if (secondaryButtonText && secondaryButtonOnClick) {
      setSecondaryButtonText(secondaryButtonText);
      setSecondaryButtonOnClick(() => secondaryButtonOnClick);
    } else {
      setSecondaryButtonText(undefined);
      setSecondaryButtonOnClick(undefined);
    }
    setShouldShow(true);
  };

  const hideModal = () => {
    setShouldShow(false);
  }

  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {children}

      <Modal show={shouldShow} backdrop="static" keyboard={false} >
        <Modal.Header>
          <Modal.Title>{header}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{whiteSpace: "pre-wrap"}}>{body}</Modal.Body>
        <Modal.Footer>
          {
            secondaryButtonText && secondaryButtonOnClick &&
            <Button variant="secondary" onClick={secondaryButtonOnClick}>{secondaryButtonText}</Button>
          }
          <Button variant="primary" onClick={primaryButtonOnClick}>{primaryButtonText}</Button>
        </Modal.Footer>
      </Modal>
    </ModalContext.Provider>
  );
};

export function useModal() {
  return useContext(ModalContext);
};
