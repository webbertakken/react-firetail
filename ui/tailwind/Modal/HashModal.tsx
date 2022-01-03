import { useLocation, useNavigate } from 'react-router-dom';
import Modal, { ModalProps } from './Modal';
import { useMemo } from 'react';

interface Props extends ModalProps {
  hash: string; // Hashtag to match against, must include `#`.
}

/**
 * Modal that opens when `#hash` is in the url and removes the hash on close.
 */
function HashModal({
  hash,
  onOpen: onOpenFn,
  onClose: onCloseFn,
  ...modalProps
}: Props): JSX.Element {
  const { hash: locationHash, ...locationWithoutHash } = useLocation();
  const navigate = useNavigate();
  const open = useMemo(() => hash === locationHash, [hash, locationHash]);

  // Todo - after react-router-dom v6-stable release - block navigate.back, instead replace to same route without hash
  // https://stackoverflow.com/questions/62792342/in-react-router-v6-how-to-check-form-is-dirty-before-leaving-page-route

  const onOpen = () => {
    if (onOpenFn) onOpenFn();
  };

  const onClose = () => {
    if (onCloseFn) onCloseFn();

    navigate(locationWithoutHash, { replace: true });
  };

  return open ? <Modal {...modalProps} onOpen={onOpen} onClose={onClose} open={open} /> : null;
}

export default HashModal;
