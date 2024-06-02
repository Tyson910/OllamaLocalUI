import type { PageProps } from '@/types';
import { usePage } from '@inertiajs/react';

export function useTypeSafePage() {
  return usePage<PageProps>();
}
