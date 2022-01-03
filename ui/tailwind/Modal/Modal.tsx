import { useCallback, useState } from 'react';
import cx from 'classnames';
import ErrorBoundary from '../../react/ErrorBoundary';

interface CloseInjected extends Object {
  closeModal: (event: Event) => void;
}

interface OpenInjected extends Object {
  openModal: (event: Event) => void;
}

export interface ModalProps {
  title?: string;
  Content: ({ closeModal }: CloseInjected) => JSX.Element;
  Footer?: ({ closeModal }: CloseInjected) => JSX.Element;
  Trigger?: ({ openModal }: OpenInjected) => JSX.Element;
  onOpen?: () => void;
  onClose?: () => void;
  open?: boolean; // manual open/close
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl';
  className?: string;
}

function Modal({
  title,
  Content,
  Footer,
  Trigger,
  onOpen,
  onClose,
  open,
  size = 'md',
  className,
}: ModalProps): JSX.Element {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [originalOverflow, setOriginalOverflow] = useState<string>();

  const openModal = useCallback(() => {
    setIsOpen(true);

    // Disable scrollbars
    setOriginalOverflow(document.body.style.overflow);
    document.body.style.overflow = 'hidden';

    // Callbacks
    if (onOpen) onOpen();
  }, [onOpen, setOriginalOverflow, setIsOpen]);

  const closeModal = useCallback(() => {
    setIsOpen(false);

    // Set scrollbars back to previous
    document.body.style.overflow = originalOverflow;

    // Callbacks
    if (onClose) onClose();
  }, [onClose, originalOverflow, setIsOpen]);

  return (
    <>
      {Trigger && (
        <ErrorBoundary>
          <Trigger openModal={openModal} />
        </ErrorBoundary>
      )}
      {(open || isOpen) && (
        <div className="z-50 inset-0 fixed flex justify-center items-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
          <div
            className={cx(
              `z-50 relative w-full flex flex-col border-0 rounded-md bg-black bg-opacity-70 shadow-black shadow-md outline-none focus:outline-none`,
              className,
              {
                // Explicit, so it is included in JIT compiler
                'max-w-xs': size === 'xs',
                'max-w-sm': size === 'sm',
                'max-w-md': size === 'md',
                'max-w-lg': size === 'lg',
                'max-w-xl': size === 'xl',
                'max-w-2xl': size === '2xl',
                'max-w-3xl': size === '3xl',
                'max-w-4xl': size === '4xl',
                'max-w-5xl': size === '5xl',
                'max-w-6xl': size === '6xl',
                'max-w-7xl': size === '7xl',
              },
            )}
          >
            {title && (
              <div className="flex items-start justify-between p-6 border-none border-solid border-black border-opacity-30 rounded-t text-3xl">
                <h3>{title}</h3>
                <button
                  className="px-2 ml-auto leading-none outline-none opacity-50"
                  onClick={closeModal}
                >
                  ×
                </button>
              </div>
            )}

            <div className="relative px-6 py-6 flex-auto text-lg leading-relaxed space-y-4">
              <ErrorBoundary>
                <Content closeModal={closeModal} />
              </ErrorBoundary>
            </div>

            {Footer && (
              <div className="flex items-center justify-end py-6 px-6 border-none border-solid border-black border-opacity-50 rounded-b">
                <ErrorBoundary>
                  <Footer closeModal={closeModal} />
                </ErrorBoundary>
              </div>
            )}
          </div>
          <div className="fixed inset-0 z-40 backdrop-blur-xl" onClick={closeModal} />
        </div>
      )}
    </>
  );
}

export default Modal;
