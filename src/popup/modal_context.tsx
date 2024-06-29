import { createContext, useState, useContext } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { ButtonVariant } from 'react-bootstrap/esm/types';

interface ShowModalParams {
  header: string;
  body: string;
  primaryButtonText: string;
  primaryButtonVariant?: ButtonVariant;
  primaryButtonOnClick: () => void;
  secondaryButtonText?: string;
  secondaryButtonVariant?: ButtonVariant;
  secondaryButtonOnClick?: () => void;
};

interface ModalContextType {
  showModal: (args: ShowModalParams) => void;
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
  const [primaryButtonVariant, setPrimaryButtonVariant] = useState<ButtonVariant>("");
  const [primaryButtonOnClick, setPrimaryButtonOnClick] = useState<() => void>(() => {});
  const [secondaryButtonText, setSecondaryButtonText] = useState<string | undefined>(undefined);
  const [secondaryButtonVariant, setSecondaryButtonVariant] = useState<ButtonVariant | undefined>(undefined);
  const [secondaryButtonOnClick, setSecondaryButtonOnClick] = useState<(() => void) | undefined>(undefined);

  const showModal = ({
    header,
    body,
    primaryButtonText,
    primaryButtonVariant,
    primaryButtonOnClick,
    secondaryButtonText,
    secondaryButtonVariant,
    secondaryButtonOnClick,
  }: ShowModalParams) => {
    setHeader(header);
    setBody(body);
    setPrimaryButtonText(primaryButtonText);
    setPrimaryButtonVariant(primaryButtonVariant ?? "primary");
    setPrimaryButtonOnClick(() => primaryButtonOnClick);
    if (secondaryButtonText && secondaryButtonOnClick) {
      setSecondaryButtonText(secondaryButtonText);
      setSecondaryButtonVariant(secondaryButtonVariant ?? "secondary");
      setSecondaryButtonOnClick(() => secondaryButtonOnClick);
    } else {
      setSecondaryButtonText(undefined);
      setSecondaryButtonVariant(undefined);
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
            <Button variant={secondaryButtonVariant} onClick={secondaryButtonOnClick}>{secondaryButtonText}</Button>
          }
          <Button variant={primaryButtonVariant} onClick={primaryButtonOnClick}>{primaryButtonText}</Button>
        </Modal.Footer>
      </Modal>
    </ModalContext.Provider>
  );
};

export function useModal() {
  return useContext(ModalContext);
};
