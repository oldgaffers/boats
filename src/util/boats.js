import { useEffect, useState } from 'react';
import { getFilterable } from '../util/api';

export function useBoats(id, ownedOnly) {
    const [data, setData] = useState();
  
    useEffect(() => {
      if (!data) {
        getFilterable().then((r) => {
          setData(r);
        }).catch((e) => console.log(e));
      }
    }, [data]);
  
    if (!data) return undefined;
  
    if (ownedOnly) {
      return data.filter((b) => b.owners?.includes(id));
    }
    return data;
  }