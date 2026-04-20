import { parse } from 'yaml';
import * as showdown from "showdown";
import { useEffect } from 'react';
import { useIndexedDB } from 'react-indexed-db-hook';
import { useBoats } from './boats';

export function useLoadBoats(id, ownedOnly, membersBoatsOnly) {
    const { getByID, add, clear } = useIndexedDB("boats");
    const boats = useBoats(id, ownedOnly, membersBoatsOnly);
    useEffect(() => {
      if (boats) {
        getByID(0).then((sb) => {
          console.log('IndexedDB sha', sb?.name);
          fetch('https://api.github.com/repos/oldgaffers/boatregister/git/refs/heads/main').then(r => r.json()).then(async (gh) => {
            const sha = gh?.object?.sha;
            console.log('sha', sha);
            if (sha !== sb?.name || sha === undefined && sb === undefined) {
              if (sb) {
                console.log('boat data is out of date, clearing cache');
                await clear();
              }
              console.log('no boat data in cache');
              await loadBoats(boats, add);
              await add({ oga_no: 0, name: sha });
            } else {
              console.log('boat data is up to date');
            }
          });
        });
      }
    }, [boats, add, clear]);
  }

export async function loadBoats(boats, add) {
  return boats.map(async (b) => {
    const r = await fetch(`https://oldgaffers.github.io/boatregister/boat/${b.oga_no}/boat.yml`);
    if (r.ok) {
      const yaml = await r.text();
      console.log('Loaded boat yaml', b.oga_no, yaml.length);
      const boatData = getBoatFromYAML(yaml);
      console.log('Adding boat to IndexedDB', boatData.name, boatData.oga_no);
      await add(boatData);
    }
  });
}

export async function getBoatFromYAML(yaml) {
    const p = parse(yaml);
    const converter = new showdown.Converter();
    p.short_description = converter.makeHtml(p.short_description);
    p.full_description = converter.makeHtml(p.full_description);
    (p?.for_sales || []).forEach((s) => {
      s.sales_text = converter.makeHtml(s.sales_text);
    });
    return p;
}