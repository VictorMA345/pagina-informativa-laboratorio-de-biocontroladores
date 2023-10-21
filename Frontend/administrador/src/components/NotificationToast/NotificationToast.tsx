import './NotificationToast.css';
import { useEffect } from 'react';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import { CSSTransition } from 'react-transition-group'; // Importa CSSTransition

interface NotificationToast {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  headerLabel: string;
  label: string;
  type: string;
}

export const NotificationToast: React.FC<NotificationToast> = ({ open, setOpen, headerLabel, label, type }) => {
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        setOpen(false);
      }, 10000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [open, setOpen]);

  return (
    <ToastContainer className="notification-toast-container" position="bottom-end">
      <CSSTransition in={open} timeout={500} classNames="notification-toast" unmountOnExit>
        <Toast show={open} onClose={() => setOpen(!open)}>
          <Toast.Header
            className="notification-toast-header"
            style={{ background: type === 'success' ? '#5bb450' : '#b53737' }}
          >
            <strong className="me-auto">{headerLabel}</strong>
          </Toast.Header>
          <Toast.Body>{label}</Toast.Body>
        </Toast>
      </CSSTransition>
    </ToastContainer>
  );
};
