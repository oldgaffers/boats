import { useEffect, useState } from 'react';
import { getFilterable } from '../util/api';

export function useBoats(id, ownedOnly, membersBoatsOnly) {
    const [data, setData] = useState();
  
    useEffect(() => {
      if (!data) {
        getFilterable().then((r) => {
          setData(r);
        }).catch((e) => console.log(e));
      }
    }, [data]);
  
    if (!data) return undefined;
  
    if (membersBoatsOnly) {
      return data.filter((b) => b.owners?.length > 0);
    }
    if (ownedOnly) {
      return data.filter((b) => b.owners?.includes(id));
    }
    return data;
  }