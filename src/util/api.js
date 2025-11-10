import boatsByHomePort from './boatsbyhomeport';
import boatsByPlaceBuilt from './boatsByPlaceBuilt';
import { boatRegisterHome } from './constants';
import { parse } from 'yaml';
import Showdown from "showdown";

const api1 = 'https://3q9wa2j7s1.execute-api.eu-west-1.amazonaws.com';
const api2 = 'https://v2z7n3g4mb5lfkbgeyln3ksjya0qsrpm.lambda-url.eu-west-1.on.aws';
const api3 = 'https://fxaj7udnm64v43j6fjo4zqer5u0xmhra.lambda-url.eu-west-1.on.aws';

const stage = 'default'

export async function putGeneralEnquiry(scope, subject, data) {
  return (await fetch(
    `${api1}/${stage}/${scope}/${subject}`,
    {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: { 'content-type': 'application/json' }
    }
  )).json();
}

export async function shuffleBoats() {
  return (await fetch(
    `${api1}/${stage}/shuffle`,
    {
      method: 'POST',
    }
  )).json();
}

export async function postBoatData(data) {
  // console.log('postBoatData', data);
  // return { ok: true };
  return fetch(
    'https://t5lcpwbufg6ewyxswawwsbtkjq0kupbb.lambda-url.eu-west-1.on.aws/',
    {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'content-type': 'application/json' }
    }
  );
}

export async function postScopedData(scope, subject, data, accessToken) {
  const headers = {
    'content-type': 'application/json',
  };
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }
  return fetch(
    `${api1}/${stage}/${scope}/${subject}`,
    {
      method: 'POST',
      body: JSON.stringify(data),
      headers,
    },
  );
}

export async function postGeneralEnquiry(scope, subject, data) {
  return fetch(
    `${api1}/${stage}/${scope}/${subject}`,
    {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'content-type': 'application/json' }
    }
  );
}

export async function postCrewEnquiry(data) {
  return fetch(
    'https://bne25yrc5scp5qgffis2yfqaj40txzef.lambda-url.eu-west-1.on.aws/',
    {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'content-type': 'application/json' }
    }
  );
}

function processBoatData(data) {
  data?.for_sales?.sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));
  ['generic_type', 'builder', 'designer'].forEach((key) => {
    if (!Array.isArray(data[key])) {
      data[key] = [data[key]];
    }
    data[key] = data[key].filter((v) => v);
  });
  return data;
}

export async function getBoatData(ogaNo) {
  const r = await fetch(`${boatRegisterHome}/boatregister/page-data/boat/${ogaNo}/page-data.json`);
  if (!r.ok) {
    return undefined;
  }
  const data = await r.json();
  return processBoatData(data?.result?.pageContext?.boat);
}

export async function getPicklists() {
  return (await fetch(`${boatRegisterHome}/boatregister/pickers.json`)).json();
}

export async function getPicklist(name) {
  return (await fetch(`${boatRegisterHome}/boatregister/${name}.json`)).json();
}

export async function getExtra() {
  /* try {
    return getScopedData('public', 'crewing');
  } catch(e) {
    console.log(e);
  }
    */
  return undefined;
}

export async function getFilterable() {
  const extra = await getExtra();
  // console.log('crewing', extra);
  const ex = Object.fromEntries((extra?.Items || []).map((item) => [item.oga_no, item]));
  const filterable = await (await fetch(`${boatRegisterHome}/boatregister/filterable.json`)).json();
  return filterable.map((b) => {
    if (ex[b.oga_no]) {
      return { ...b, ...ex[b.oga_no] };
    }
    return b;
  });
}

export async function getPlaces() {
  return (await fetch(`${boatRegisterHome}/boatregister/places.json`)).json();
}

export async function getUploadCredentials() {
  return (await fetch(`${api1}/${stage}/upload_credentials`)).json();
}

export async function createPhotoAlbum(name, ogaNo) {
  return fetch(`${api2}/`,
    {
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name, oga_no: ogaNo }),
      method: 'POST',
    }
  );
}

export async function getAlbumKey(name, oga_no) {
  const r = await fetch(`${api2}/album?oga_no=${oga_no}&name=${encodeURIComponent(name)}`);
  if (r.ok) {
    return r.json();
  }
  return undefined;
}

export async function getThumb(albumKey) {
  return (await fetch(`${api2}/thumb?album_key=${albumKey}`)).json();
}

export async function getLargestImage(albumKey) {
  return (await fetch(`${api2}/li?album_key=${albumKey}`)).json();
}

export async function nextOgaNo() {
  return (await fetch(api3)).json();
}

export async function disposeOgaNo(oga_no) {
  const r = await fetch(api3,
    {
      method: 'POST',
      body: oga_no,
      headers: { 'content-type': 'application/json' }
    }
  );
  return r.json();
}

const localTables = [
  { subject: 'place_built', action: boatsByPlaceBuilt },
  { subject: 'home_port', action: boatsByHomePort },
];

export async function getScopedData(scope, subject, filters, accessToken) {
  const local = localTables.find((l) => l.subject === subject);
  if (local) {
    return local.action(filters);
  }
  if (subject === 'place_built') {
    return boatsByPlaceBuilt(filters);
  }
  const headers = {
    'content-type': 'application/json',
  };
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }
  const r = await fetch(
    `${api1}/${stage}/${scope}/${subject}?${new URLSearchParams(filters)}`,
    {
      headers,
    });
  return r.json();
}

export async function getFleets(scope, filter, accessToken) {
  const r = await getScopedData(scope, 'fleets', filter, accessToken);
  const f = r?.Items || [];
  f.sort((a, b) => a.name.localeCompare(b.name))
  return f;
}

export async function getBoatLastModified(oga_no) {
  const r = await fetch(`https://api.github.com/repos/oldgaffers/boatregister/commits?path=boat/${oga_no}/boat.yml&page=1&per_page=1`);
  const d = await r.json();
  return d[0].commit.author.date;
}

export async function geolocate(place) {
  const r = await fetch(`${api1}/${stage}/public/place?name=${place}`);
  if (r.ok) {
    return r.json()
  }
  return undefined;
}

export async function getYAML(path, branch) {
  const api = 'https://api.github.com/repos/oldgaffers/boatregister';
  const url = `${api}/contents/${path}?ref=${branch}`;
  const r = await fetch(url);
  if (r.ok) {
    return r.json();
  } else {
    console.log('failure getting yaml file');
  }
}

export async function openPr(oga_no) {
  const branch = `up${oga_no}`;
  const api = 'https://api.github.com/repos/oldgaffers/boatregister';
  const url = `${api}/pulls?state=open&base=main&head=oldgaffers:${branch}`;
  const r = await fetch(url);
  if (!r.ok) {
    return undefined;
  }
  const list = await r.json();
  if (list.length === 0) {
    return undefined;
  }
  const curl = list[0].commits_url;
  const c = await fetch(curl);
  if (!c.ok) {
    console.log('Bad commits for PR', list);
  }
  const commits = await c.json();
  const files = await Promise.all(commits.map(async (c) => {
    const r = await fetch(c.url);
    if (!r.ok) { return undefined; }
    const commit = await r.json();
    return commit.files.map((f) => f.filename);
  }));
  const b = `boat/${oga_no}/boat.yml`;
  if (files.flat().filter((f) => f?.includes(b))) {
    console.log('Open PR includes changes to boat');
    const yaml = await getYAML(b, branch);
    const p = parse(atob(yaml.content));
    const converter = new Showdown.Converter();
    p.short_description = converter.makeHtml(p.short_description);
    p.full_description = converter.makeHtml(p.full_description);
    (p?.for_sales || []).forEach((s) => {
      s.sales_text = converter(s.sales_text);
      console.log(s);
    });
    return p;
  }
  return undefined;
}