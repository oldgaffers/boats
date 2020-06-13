import React from 'react';
import queryString from 'query-string';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';

export default function FillJot({ className, boat, email, disabled, children }) {

  function m2f(m) {
    return (100*m/2.54/12);
  }

  async function handleClick() {
    const form = 'https://form.jotform.com/201591501001335';
    /* https://form.jotform.com/201591501001335?
    basicHull%5B0%5D=22.5
    basicHull%5B1%5D=8
    builder=Enterprise%20Small%20Craft
    constructionMethod=carvel
    construction_details=Carvel%20pitch%20pine%20on%20oak%20and%20elm
    construction_material=wood
    construction_notes
    design_class
    design_type=One%20off
    designer=D.A.%20Rayner
    draft=4.5
    email=a%40g
    full_description=%3Cp%3E%26quot%3BWhen%20his%20last%20boat%2C%20the%2042%26%2339%3B%20Tredwin%20barge%20Perl%2C%20was%20burnt%20out%20on%20moorings%2C%20Mr.%20Denys%20Rayner%20decided%20to%20try%20his%20hand%20at%20designing%20a%20boat%2C%20after%20studying%20the%20%26quot%3BHow%20To%26quot%3B%20articles%20in%20the%20Y.M.%20Economy%20limited%20the%20size%20to%20less%20than%2023%26%2339%3B%20overall%2C%20while%20a%20plea%20from%20the%20Shipmate%20was%20more%20or%20less%20an%20order%20for%206ft%20headroom.%26quot%3B%3C%2Fp%3E%0D%0A%0D%0A%3Cp%3EThe%20preceding%20extract%20from%20the%20February%201937%20issue%20of%20Yachting%20Monthly%20was%20penned%20by%20Maurice%20Griffith.%3C%2Fp%3E%0D%0A%0D%0A%3Cp%3ERobinetta%20was%20designed%20from%20the%20outset%20for%20single%20handing%2C%20with%20all%20lines%20except%20the%20jib%20halyard%20let%20to%20the%20cockpit.%20She%20is%20strongly%20built%20with%20pine%20planking%20on%20an%20oak%20frame%20with%20an%20iron%20keel%20and%20a%20good%20deal%20of%20lead%20ballast.%20Her%20main%20cabin%20is%20cavernous%20for%20such%20a%20tiny%20boat.%20Part%20of%20this%20stems%20from%20the%20extension%20of%20the%20hull%20upwards%20to%20form%20the%20cabin%20sides.%20Griffith%20goes%20on%20to%20say%20%26quot%3BPerhaps%20the%20most%20striking%20feature%20of%20this%20experimental%20design%20is%20the%20fullness%20of%20the%20hull%2C%20the%20pronounced%20tumblehome%20of%20the%20topsides%20from%20amidships%20aft%2C%20and%20the%20enormous%20quarters%2C%20which%20appear%20to%20be%20based%20on%20those%20of%20the%20French%20crabbers.%26quot%3B%3C%2Fp%3E%0D%0A%0D%0A%3Cp%3ERobinetta%20is%20mostly%20original.%20Significant%20changes%20were%20made%20by%20Mike%20Garnham%20who%20replaced%20the%20previous%20engine%20by%20the%20current%20Yanmar%201GM10%20and%20re-worked%20the%20cockpit.%20Major%20structural%20repairs%20were%20performed%20during%20the%20winter%20of%202007%2F2008%20strengthening%20the%20keel%20fixings%20and%20doubling%20several%20ribs.%3C%2Fp%3E%0D%0A%0D%0A%3Cp%3EShe%20was%20re-caulked%20with%20new%20gaff%20and%20sails%20in%202012.%3Cbr%20%2F%3E%0D%0APrevious%20sail%20dimensions%3A%20Mainsail%20Head%3A%209.17%20ft%20Topsail%20Perpendicular%3A%206ft%20Topsail%20luff%2013%20ft%3C%2Fp%3E%0D%0A%0D%0A%3Cp%3EDeck%20beam%20replaced%20and%20other%20repairs%20winter%202017%2F18.%3C%2Fp%3E%0D%0A%0D%0A%3Cp%3ERead%20articles%20about%20Robinetta%20from%20the%20Royal%20Cruising%20Club%20Journal%2C%201938%2C%20%3Ca%20href%3D%22http%3A%2F%2Fwww.sailing-by.org.uk%2Fcontent%2Fstanding-waves-and-submarines%22%3Eon%20%26%2339%3BSailing%20by%26%2339%3B%3C%2Fa%3E%20and%20%3Ca%20href%3D%22http%3A%2F%2Frobinetta-log.blogspot.co.uk%2F%22%20target%3D%22_blank%22%3Eexplore%20her%20blog%3C%2Fa%3E%20with%20a%20detailed%20history%20of%20ownership%20and%20other%20exploits.%3C%2Fp%3E
    generic_type=Yacht
    home_country=GBR
    home_port=Tollesbury
    hull_form=long_keel_deep_forefoot
    image_key=9NV8KW
    keel_laid
    launched
    mainsail_type=gaff
    name=Robinetta
    oga_no=315
    otherRegistrations%5B0%5D=131134
    otherRegistrations%5B1%5D=MKDZ8
    otherRegistrations%5B2%5D
    otherRegistrations%5B3%5D=1717
    otherRegistrations%5B4%5D
    otherRegistrations%5B5%5D=315
    otherRegistrations%5B6%5D
    place_built=Rock%20Ferry%20Birkenhead&previous_names&public=true&rig_type=Cutter&short_description=Robinetta%20is%20a%2022%27%206%22%20tabloid%20cruiser%2C%20designed%20by%20Denys%20Rayner%20and%20built%20for%20him%20by%20the%20Enterprise%20Small%20Craft%20Company%2C%20Rock%20Ferry%2C%20Birkenhead.&website=https%3A%2F%2Frobinetta-log.blogspot.com%2Fp%2Frobinetta.html
    */
    const params = {
        email,
        name: boat.name,
        oga_no: boat.oga_no,
        image_key: boat.image_key,
        design_type: (boat.designClassByDesignClass && boat.designClassByDesignClass.name)?"Customised example of a production class":"One off",
        home_country: boat.home_country,
        home_port: boat.home_port,
        hull_form: boat.hull_form,
        website: boat.website,
        short_description: boat.short_description,
        rig_type: boat.rigTypeByRigType.name,
        designer: boat.designerByDesigner.name,
        builder: boat.builderByBuilder.name,
        generic_type: boat.generic_type,
        "year[1]": boat.year,
        "year[2]": boat.year_is_approximate,
        'otherRegistrations[0]': boat.ssr,
        'otherRegistrations[1]': boat.callsign,
        'otherRegistrations[2]': boat.nhsr,
        'otherRegistrations[3]': boat.nsbr,
        'otherRegistrations[4]': boat.fishing_number,
        'otherRegistrations[5]': boat.sail_number,
        'otherRegistrations[6]': boat.mssi,
        "basicHull[0]":m2f(boat.length_on_deck),
        "basicHull[1]":m2f(boat.draft),
        mainsail_type: boat.mainsail_type.name,
        full_description: boat.full_description,
        /*
        keel_laid: boat.keel_laid,
        launched: boat.launched,
        place_built: boat.place_built,
        previous_names:  boat.previous_names,
        public: boat.public,
        beam: m2f(boat.beam),
        design_class: boat.designClassByDesignClass && boat.designClassByDesignClass.name,
        construction_material: boat.constructionMaterialByConstructionMaterial.name,
        constructionMethod: boat.constructionMethodByConstructionMethod.name,
        construction_details: boat.construction_details,
        construction_notes: boat.construction_notes,
        for_sale_state: boat.for_sale_state.name,

        handicap_data:{}
        // engine:"",
        spar_material:"",
        //"q52_propeller":"","q73_
        // ,"q68_hullMeasurements":{"field_1":"","field_7":"","field_3":"","field_8":""},"q42_sailArea":"","q44_foreTriangle":{"field_1":"","field_2":""},"q45_biggestStaysail":{"field_1":"","field_2":"","field_3":""},"q46_biggestJib":{"field_1":"","field_2":"","field_3":""},"q47_biggestDownwind":{"field_1":"","field_2":"","field_3":""},"q48_mainsail":{"field_1":"","field_2":"","field_3":""},"q51_mizen":{"field_1":"","field_2":"","field_3":""},"q49_topsail":{"field_1":"","field_2":""},"q50_mizenTopsail":{"field_1":"","field_2":""},
        "function[0]":"Leisure",
        "function[1]":"Leisure",
        */
      };
    const query = queryString.stringify(params);
    window.open(`${form}?${query}`, "_blank");
  }

  return (<Button
    size="small"
    variant="contained"
    color="primary"
    disabled={disabled}
    className={className}
    endIcon={<Icon>send</Icon>}
    onClick={handleClick}
  >
    {children}
  </Button>);
}

