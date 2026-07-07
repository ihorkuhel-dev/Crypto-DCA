import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button.tsx';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog.tsx';
import { db } from '@/shared/lib/dexie-db.ts';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';

const RELOAD_DELAY_MS = 1000;

function formatBytes(bytes: number, decimals = 2): string {
  if (bytes < 1024) return '< 1 KB';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['KB', 'MB', 'GB'];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(k)) - 1, sizes.length - 1);
  return parseFloat((bytes / Math.pow(k, i + 1)).toFixed(dm)) + ' ' + sizes[i];
}

async function calculateClearableSize(): Promise<number> {
  let lsSize = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      lsSize += key.length + (localStorage.getItem(key)?.length || 0);
    }
  }
  const lsBytes = lsSize * 2;

  let idbBytes = 0;
  if (navigator.storage?.estimate) {
    const estimate = await navigator.storage.estimate();
    idbBytes = estimate.usage || 0;
  }

  let cacheBytes = 0;
  if ('caches' in window) {
    cacheBytes = 0;
  }

  return lsBytes + idbBytes + cacheBytes;
}

export function DangerZone() {
  const { t } = useTranslation('settings');
  const [open, setOpen] = useState(false);
  const [sizeText, setSizeText] = useState('< 1 KB');
  const [isDeleting, setIsDeleting] = useState(false);

  const refreshSize = useCallback(async () => {
    try {
      const totalBytes = await calculateClearableSize();
      setSizeText(formatBytes(totalBytes));
    } catch (error) {
      console.error('Failed to calculate storage size', error);
      setSizeText('< 1 KB');
    }
  }, []);

  useEffect(() => {
    let active = true;
    calculateClearableSize()
      .then((totalBytes) => {
        if (active) {
          setSizeText(formatBytes(totalBytes));
        }
      })
      .catch((error) => {
        console.error('Failed to calculate storage size', error);
      });
    return () => {
      active = false;
    };
  }, [refreshSize]);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen) {
      void refreshSize();
    }
  };

  const handleDeleteData = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await db.delete();
      localStorage.clear();

      setOpen(false);
      toast.success(t('dangerZone.success'));

      setTimeout(() => {
        window.location.reload();
      }, RELOAD_DELAY_MS);
    } catch (error) {
      console.error('Failed to delete data', error);
      toast.error(t('dangerZone.error'));
      setIsDeleting(false);
    }
  };

  const handleDeleteClick = () => {
    void handleDeleteData();
  };

  return (
    <div className="border border-destructive/20 bg-destructive/5 rounded-lg p-4 mt-8 flex flex-col gap-3">
      <h2 className="text-sm font-semibold text-destructive uppercase tracking-wider">
        {t('dangerZone.title')}
      </h2>
      <p className="text-xs text-muted-foreground">
        {t('dangerZone.dialog.description', { size: sizeText })}
      </p>
      <AlertDialog open={open} onOpenChange={handleOpenChange}>
        <AlertDialogTrigger
          render={
            <Button variant="destructive" className="w-fit" size="sm">
              <Trash2 className="size-4 mr-2" />
              {t('dangerZone.deleteButton')}
            </Button>
          }
        />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('dangerZone.dialog.title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('dangerZone.dialog.description', { size: sizeText })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              {t('dangerZone.dialog.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleDeleteClick}
              disabled={isDeleting}
            >
              {isDeleting ? t('dangerZone.dialog.deleting') : t('dangerZone.dialog.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
