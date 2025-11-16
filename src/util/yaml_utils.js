import { parse } from 'yaml';
import Showdown from "showdown";

export async function getBoatFromYAML(yaml) {
    const p = parse(yaml);
    const converter = new Showdown.Converter();
    p.short_description = converter.makeHtml(p.short_description);
    p.full_description = converter.makeHtml(p.full_description);
    (p?.for_sales || []).forEach((s) => {
      s.sales_text = converter(s.sales_text);
    });
    return p;
}