/**
 * Shared UI Components Barrel Export
 * Location: src/ui/components/shared/index.ts
 * 
 * This pattern allows clean imports from shared components:
 * import { DataTable, LoadingSpinner } from 'ui/components/shared';
 */

export { DataTable } from './DataTable/DataTable';
export type { DataTableColumn, DataTableProps } from './DataTable/DataTable';

// Future exports as more shared components are added:
// export { LoadingSpinner } from './LoadingSpinner/LoadingSpinner';
// export { Modal } from './Modal/Modal';
// export { FormField } from './FormField/FormField';
