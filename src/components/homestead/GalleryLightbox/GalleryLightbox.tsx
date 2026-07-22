import { useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { CloseIcon, ChevronIcon } from '@/components/icons';
import { productPage } from '@/content/designContent';
import styles from './GalleryLightbox.module.scss';

type GalleryPhoto = {
  id: number;
  url: string;
};

type GalleryLightboxProps = {
  photos: GalleryPhoto[];
  activeIndex: number;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
  onSelectIndex: (index: number) => void;
};

const { gallery } = productPage;

export function GalleryLightbox({
  photos,
  activeIndex,
  alt,
  isOpen,
  onClose,
  onSelectIndex,
}: GalleryLightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const touchStartXRef = useRef<number | null>(null);
  const activePhoto = photos[activeIndex];

  const showPreviousPhoto = useCallback(() => {
    if (activeIndex > 0) {
      onSelectIndex(activeIndex - 1);
    }
  }, [activeIndex, onSelectIndex]);

  const showNextPhoto = useCallback(() => {
    if (activeIndex < photos.length - 1) {
      onSelectIndex(activeIndex + 1);
    }
  }, [activeIndex, onSelectIndex, photos.length]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key === 'ArrowLeft') {
        showPreviousPhoto();
        return;
      }

      if (event.key === 'ArrowRight') {
        showNextPhoto();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose, showNextPhoto, showPreviousPhoto]);

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.focus();
    }
  }, [isOpen, activeIndex]);

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartXRef.current = event.changedTouches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    const startX = touchStartXRef.current;

    if (startX === null) {
      return;
    }

    const endX = event.changedTouches[0]?.clientX ?? startX;
    const deltaX = endX - startX;
    touchStartXRef.current = null;

    if (Math.abs(deltaX) < 40) {
      return;
    }

    if (deltaX < 0) {
      showNextPhoto();
      return;
    }

    showPreviousPhoto();
  };

  if (!isOpen || !activePhoto) {
    return null;
  }

  return createPortal(
    <div
      className={styles.overlay}
      onClick={handleOverlayClick}
      role="presentation"
    >
      <div
        ref={dialogRef}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-label={gallery.viewerLabel}
        tabIndex={-1}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label={gallery.close}
        >
          <CloseIcon size={22} />
        </button>

        {photos.length > 1 && activeIndex > 0 && (
          <button
            type="button"
            className={`${styles.navButton} ${styles.navButtonPrev}`}
            onClick={showPreviousPhoto}
            aria-label={gallery.previousPhoto}
          >
            <ChevronIcon direction="left" size={18} />
          </button>
        )}

        {photos.length > 1 && activeIndex < photos.length - 1 && (
          <button
            type="button"
            className={`${styles.navButton} ${styles.navButtonNext}`}
            onClick={showNextPhoto}
            aria-label={gallery.nextPhoto}
          >
            <ChevronIcon direction="right" size={18} />
          </button>
        )}

        <div className={styles.imageStage}>
          <img
            className={styles.image}
            src={activePhoto.url}
            alt={alt}
            draggable={false}
          />
        </div>

        {photos.length > 1 && (
          <p className={styles.counter} aria-live="polite">
            {gallery.photoCounter(activeIndex + 1, photos.length)}
          </p>
        )}
      </div>
    </div>,
    document.body,
  );
}
