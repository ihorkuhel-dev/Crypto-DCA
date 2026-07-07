import { useState } from 'react';
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

export function DangerZone() {
  const { t } = useTranslation('settings');
  const [open, setOpen] = useState(false);

  const handleDeleteData = async () => {
    try {
      await Promise.all(db.tables.map((table) => table.clear()));
      localStorage.clear();
      // Close dialog
      setOpen(false);
      // Notify user
      toast.success(t('dangerZone.success'));
      // Reload page to reset state completely after toast shows
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch {
      toast.error('Failed to delete data');
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
        {t('dangerZone.dialog.description')}
      </p>
      <AlertDialog open={open} onOpenChange={setOpen}>
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
              {t('dangerZone.dialog.description')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('dangerZone.dialog.cancel')}</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDeleteClick}>
              {t('dangerZone.dialog.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
