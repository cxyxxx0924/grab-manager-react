declare namespace RCC_API {
  interface PaginationModal {
    page: number;
    per_page: number;
    total: number;
  }

  interface RccPagination<T> extends PaginationModal {
    list: T[];
  }

  interface ManagerItemModal {
    id: number;
    name: string;
    url: string;
    updated_at: Date;
    updated_by: string;
    external_id: string;
  }

  interface FormSearchModal {
    name?: string;
    url?: string;
    remember?: string;
    external_id?: string;
    external_platform_id: number;
  }
}
