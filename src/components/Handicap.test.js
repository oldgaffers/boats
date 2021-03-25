import { boatm2f, boatf2m, foretriangle_area } from './Handicap';
import { thcf, fGaffSA, fTopSA, fForeTriangle, fMSA, fL, fMR, fBD, fSqrtS, fR } from '../util/THCF';

const Transcur = {"id":"656e0e94-c298-408e-90e2-1bafd5bdd824","name":"Transcur","previous_names":undefined,"year":1889,"year_is_approximate":false,"place_built":"Brightlingsea","home_port":"Pin Mill","home_country":"GBR","ssr":undefined,"sail_number":"CK365","nhsr":undefined,"nsbr":undefined,"oga_no":2932,"fishing_number":undefined,"callsign":"","mssi":undefined,"full_description":"<p>Transcur CK 365 was built in 1889, it seems to replace a larger 17 ton smack of the same name that was registered out of Maldon as MN11 in 1871. It was in 1898 that the Maldon &#39;Transcur&#39; did not appear in the register and &#39;Transcur CK 365&#39; was first registered.</p>\r\n\r\n<p>Her early history is rather vague and the only thing we know is that she worked from the Essex River Crouch and was owned by the Smith Brothers, well known oyster merchants of the area. In 1924 she came out of the register and was sold for conversion to a yacht. Coamings and skylights were added. In 1937 her first engine was fitted on the starboard quarter. She passed through several hands, each owner keeping her for approximatly five years. Most of this time was spent on the east coast of England.</p>\r\n\r\n<p>In 1998 the Thomas family bought Transcur from Lymington on the Solent where she had been for 19 years. Not in a sound enough condition to be sailed back to the east coast, she came back overland to the front garden where the family spent the next two years restoring her, keeping the floors but the rest of the boat was so rotten it needed replacing. She was returned to her original gaff rig which she lost in the late 50s. Since her restoration she has been sailed regularly to Holland each year for family holidays.</p>\r\n\r\n<p>Unlike many smacks, she is sailed by a family and cruised extensivly.</p>","image_key":"grRdbV","uk_part1":undefined,"spar_material":"wood","rig_type":"Cutter","construction_material":"wood","construction_method":"carvel","construction_details":"Trad ","draft":1.3960009753718605,"generic_type":"Smack","handicap_data":{"propellor":{"type":"folding"},"beam":3.279687881004633,"main":{"foot":7.010485247500609,"head":5.029261155815655,"luff":5.4864667154352595},"thcf":1.025,"draft":1.4020970495001217,"topsail":{"luff":6.705681541087539,"perpendicular":2.43842965130456},"sailarea":81.06451902911611,"length_over_all":10.790051207022676,"fore_triangle_base":7.315288953913679,"length_on_waterline":8.686905632772493,"fore_triangle_height":10.05852231163131},"hull_form":"long keel deep forefoot","keel_laid":undefined,"launched":undefined,"length_on_deck":10.796147281150938,"mainsail_type":"gaff","short_description":"'Transcur' was built in 1889 as an oyster dredger working on the east coast of England. She is just over 35ft long weighing 12 tons. 'Transcur' was totally rebuilt between 1999 and 2001, when she was relaunched.","updated_at":"2021-02-07T07:39:42.886262+00:00","website":"","beam":3.301024140453548,"air_draft":undefined,"reference":undefined,"builder":"78bc9e97-d57d-481e-b855-b10261a92e4d","designer":"74db1b7f-49fa-49d4-8e3f-9f172cd58673","design_class":undefined,"constructionMaterialByConstructionMaterial":{"name":"wood"},"constructionMethodByConstructionMethod":{"name":"carvel"},"designClassByDesignClass":undefined,"designerByDesigner":{"name":"Aldous"},"rigTypeByRigType":{"name":"Cutter"},"genericTypeByGenericType":{"name":"Smack"},"builderByBuilder":{"name":"Aldous Ltd.","notes":undefined},"for_sale_state":{"text":"not_for_sale"},"for_sales":[],"engine_installations":[]};
const Robinetta = {"id":"85315666-4359-47f7-8d8d-4dd2905b7aa2","name":"Robinetta","previous_names":undefined,"year":1937,"year_is_approximate":false,"place_built":"Rock Ferry Birkenhead","home_port":"Tollesbury","home_country":"GBR","ssr":"131134","sail_number":"315","nhsr":undefined,"nsbr":"1717","oga_no":315,"fishing_number":undefined,"callsign":"MKDZ8","mssi":undefined,"full_description":"\"When his last boat, the 42' Tredwin barge Pearl, was burnt out on moorings, Mr. Denys Rayner decided to try his hand at designing a boat, after studying the &quot;How To&quot; articles in the Y.M. Economy limited the size to less than 23&#39; overall, while a plea from the Shipmate was more or less an order for 6ft headroom.&quot;</p><p>The preceding extract from the February 1937 issue of Yachting Monthly was penned by Maurice Griffith.</p><p>Robinetta was designed from the outset for single handing, with all lines except the jib halyard let to the cockpit. She is strongly built with pine planking on an oak frame with an iron keel and a good deal of lead ballast. Her main cabin is cavernous for such a tiny boat. Part of this stems from the extension of the hull upwards to form the cabin sides. Griffith goes on to say &quot;Perhaps the most striking feature of this experimental design is the fullness of the hull, the pronounced tumblehome of the topsides from amidships aft, and the enormous quarters, which appear to be based on those of the French crabbers.&quot;</p><p>Robinetta is mostly original. Significant changes were made by Mike Garnham who replaced the previous engine by the current Yanmar 1GM10 and re-worked the cockpit. Major structural repairs were performed during the winter of 2007/2008 strengthening the keel fixings and doubling several ribs.</p><p>She was re-caulked with new gaff and sails in 2012.<br />Previous sail dimensions: Mainsail Head: 9.17 ft Topsail Perpendicular: 6ft Topsail luff 13 ft</p><p>Deck beam replaced and other repairs winter 2017/18.</p><p>Read articles about Robinetta from the Royal Cruising Club Journal, 1938, on <a href=\"http://www.sailing-by.org.uk/content/standing-waves-and-submarines\">Sailing by</a> and explore her <a href=\"http://robinetta-log.blogspot.co.uk/\" target=\"_blank\">blog</a> with a detailed history of ownership and other exploits.","image_key":"9NV8KW","uk_part1":"165315","rig_type":"Cutter","construction_material":"wood","construction_method":"carvel","spar_material":"wood","construction_details":"Carvel pitch pine on oak and elm","draft":1.3716166788588149,"generic_type":"Yacht","handicap_data":{"propellor":{"type":"fixed"},"beam":2.43842965130456,"main":{"foot":3.9990246281394777,"head":4.26725188978298,"luff":4.319068519873201},"draft":1.3716166788588149,"length_over_all":6.858083394294074,"fore_triangle_base":1.5240185320653499,"length_on_waterline":6.0960741282613995,"fore_triangle_height":4.57205559619605},"hull_form":"long keel deep forefoot","keel_laid":undefined,"launched":undefined,"length_on_deck":6.858083394294074,"mainsail_type":"gaff","sail_type":{"name":"gaff"},"short_description":"<i>Robinetta</i> is a 22' 6\" tabloid cruiser, designed by Denys Rayner and built for him by the Enterprise Small Craft Company, Rock Ferry, Birkenhead.","updated_at":"2021-01-31T17:02:41.408611+00:00","website":"https://robinetta-log.blogspot.com/p/robinetta.html","beam":2.43842965130456,"air_draft":undefined,"reference":undefined,"builder":"a27bca50-d155-428a-be49-a542d64ba316","designer":"afc68d59-e7ba-466e-861f-741e2eeae526","design_class":undefined,"constructionMaterialByConstructionMaterial":{"name":"wood"},"constructionMethodByConstructionMethod":{"name":"carvel"},"designClassByDesignClass":undefined,"designerByDesigner":{"name":"D.A. Rayner"},"rigTypeByRigType":{"name":"Cutter"},"genericTypeByGenericType":{"name":"Yacht"},"builderByBuilder":{"name":"Enterprise Small Craft","notes":undefined},"for_sale_state":{"text":"not_for_sale"},"for_sales":[],"engine_installations":[]};
const CrystalII = {"main":{"foot":5.24,"head":3,"luff":5.7},"length_overall":9.2964,"calculated_thcf":0.946,"length_over_spars":10.8692,"fore_triangle_base":4.0295,"length_on_waterline":6.7056,"fore_triangle_height":7.111};
/*
Luff 5.7 m or 18.696
Head 3 m or 9.84 feet
Leach 5.7 m or 29.2576 feet
Foot 5.24 m or 17.1872 feet
*/



test('boatm2f', () => {
    const a = {"1":1, q:{a:2}};
    expect(boatm2f(a)).toStrictEqual(a);
  });
  
  const tcf = {
       "beam": 10.76,
       "draft": 4.6,
       "fore_triangle_base": 24,
       "fore_triangle_height": 33,
       "length_on_waterline": 28.5,
       "length_over_all": 35.4,
       "propellor": { "type": "folding"},
       "main":  {
         "foot": 23,
         "head": 16.5,
         "luff": 18,
       },
       "sailarea": 872.55,
       "thcf": 1.025,
       "topsail":  {
         "luff": 22,
         "perpendicular": 8,
       },
     };

     const rcf = {
      "beam": 8,
      "draft": 4.5,
      "fore_triangle_base": 5,
      "fore_triangle_height": 15,
      "length_on_waterline": 20,
      "length_over_all": 22.5,
      "propellor": { "type": "fixed"},
      "main":  {
        "foot": 13.12,
        "head": 14,
        "luff": 14.17,
      },
     };

test('boatm2f Transcur feet', () => {
    expect(boatm2f(Transcur.handicap_data)).toStrictEqual(tcf);
  });
  
test('boatm2f Robinetta feet', () => {
    const m = Robinetta.handicap_data;
    console.log(m);
    const f = boatm2f(m);
    console.log(f);
    expect(f).toStrictEqual(rcf);
  });
  
  test('boatm2f Transcur metres', () => {
    const t = boatm2f(Transcur);
    console.log(t);
    expect(boatf2m(t)).toStrictEqual(Transcur);
  });
  
test('boatm2f Robinetta metres', () => {
    expect(boatf2m(boatm2f(Robinetta))).toStrictEqual(Robinetta);
  });

  test('Transcur foretriangle_area', () => {
    const f = foretriangle_area(tcf);
    expect(f).toEqual(336.6);
  });
  
test('Robinetta foretriangle_area', () => {
    const f = foretriangle_area(rcf);
    expect(f).toEqual(31.875);
  });
  
  test('Transcur fGaffSA', () => {
    expect(fGaffSA(tcf.main)).toEqual(447.95085079741887);
  });
  test('Transcur fTopSA', () => {
    expect(fTopSA(tcf.topsail)).toEqual(88);
  });
  
  test('Transcur fForeTriangle', () => {
    expect(Math.round(fForeTriangle(tcf))).toEqual(Math.round(336.6/.85));
  });
  test('Transcur fMSA', () => {
    expect(Math.round(100*fMSA(tcf))).toEqual(Math.round((100*tcf.sailarea)));
  });

  test('Transcur fL', () => {
    expect(fL(tcf)).toEqual((tcf.length_on_waterline+tcf.length_over_all)/2);
  });

  test('Transcur fBD', () => {
    const b = boatm2f(Transcur);
    expect(fBD(b)).toEqual(.67*b.beam*b.beam);
  });
 
  test('Transcur fSqrtS', () => {
    const x = .96*Math.sqrt(tcf.sailarea);
    expect(fSqrtS(boatm2f(Transcur))).toEqual(x);
  });

  test('Transcur C', () => {
    expect(.67*tcf.beam*tcf.beam).toEqual(77.570992);
  });
  
  test('Transcur fMR', () => {
    expect(fMR(boatm2f(Transcur))).toEqual(27.39220355836388);
  });
  
  test('Transcur fR', () => {
    expect(fR(boatm2f(Transcur))).toEqual(26.981320504988425);
  });
  
  test('Transcur T(H)CF', () => {
    expect(thcf(boatm2f(Transcur))).toEqual(1.025);
  });
  
  test('t1', () => {
    expect(0.125*(Math.sqrt(27.04)+3)).toEqual(1.025);
  });

test('Robinetta T(H)CF', () => {
    expect(thcf(boatm2f(Robinetta))).toEqual(0.946);
  });
