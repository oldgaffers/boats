import { usePagination } from '@material-ui/lab/Pagination';

export function useBoatPagination( count, page, onChange ) {
    const { items } = usePagination({ count, page, onChange });
    const a = items.findIndex((cur) => cur.type === "start-ellipsis");
    if (a>=0) {
      const firstHalf = Math.floor(items[a+1].page / 2);
      items.splice(a, 0, {
        disabled: false,
        onClick: undefined,
        page: null,
        selected: false,
        type: 'other-ellipsis'
      },
      {
        disabled: false,
        onClick: (event) => onChange(event, firstHalf),
        page: firstHalf,
        selected: false,
        type: 'page'
      });
    }
    const b = items.findIndex((cur) => cur.type === "end-ellipsis");
    if (b>=0) {
      const lastHalf = items[b-1].page + Math.floor((count - items[b-1].page) / 2);
      items.splice(b+1, 0, {
        disabled: false,
        onClick: (event) => onChange(event, lastHalf),
        page: lastHalf,
        selected: false,
        type: 'page'
      },
      {
        disabled: false,
        onClick: undefined,
        page: null,
        selected: false,
        type: 'other-ellipsis'
      });
    }
    console.log('BoatPagination', items);
    return items;
  }
  