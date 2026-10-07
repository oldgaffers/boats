import React from 'react';
import { Stage, Layer, Label, Text, Line, Arrow, Path, Tag, Group } from 'react-konva';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Switch } from '@mui/material';
import { m2f } from '../util/format';

function param(label, value, metric = false) {
    if (value === undefined || value === null) {
        return label;
    }
    if (metric) {
        return `${label}=${value.toFixed(2)} m`;
    }
    return `${label}=${m2f(value)}`;
}

function HorizontalDimension({ x, y, length, label }) {
    return (<Group x={x} y={y}>
        <Line points={[0, -30, 0, 30]} stroke="blue" strokeWidth={1} dash={[4, 4]} />
        <Line points={[length, -30, length, 30]} stroke="blue" strokeWidth={1} dash={[4, 4]} />
        <Arrow points={[0, 0, length, 0]} stroke="blue" pointerAtBeginning={true} strokeWidth={1} fill="blue" />
        <Label x={length / 2 - 45} y={-8} >
            <Tag fill="white" />
            <Text text={label} fill="blue" fontSize={15} />
        </Label>
    </Group>);
}

function VerticalDimension({ x, y, length, label }) {
    return (<Group x={x} y={y}>
        <Line points={[-30, 0, 30, 0]} stroke="blue" strokeWidth={1} dash={[4, 4]} />
        <Line points={[-30, length, 30, length]} stroke="blue" strokeWidth={1} dash={[4, 4]} />
        <Arrow points={[0, 0, 0, length]} stroke="blue" pointerAtBeginning={true} strokeWidth={1} fill="blue" />
        <Label x={-8} y={length / 2 - 8} >
            <Tag fill="white" />
            <Text text={label} fill="blue" fontSize={15} />
        </Label>
    </Group>);
}

function GaffMast({ x, y }) {
    return (<Group x={x} y={y}>
        <Line
            name="boom"
            points={[50, 300, 400, 320]}
            stroke="black"
            strokeWidth={8}
            lineCap="round"
            lineJoin="round"
            y={5}
        />
        <Line
            name="mast"
            points={[410, 360, 410, -80]}
            stroke="black"
            strokeWidth={10}
            y={5}
        />
        <Line
            name="gaff"
            points={[200, -100, 400, 30]}
            stroke="black"
            strokeWidth={8}
            lineCap="round"

            y={5}
        />
        <Line
            name="mainsail"
            points={[50, 290, 400, 310, 400, 40, 200, -90, 50, 290]}
            stroke="green"
            strokeWidth={1}
            y={5}
        />
    </Group>);
}

function GaffMeasurements({ x, y, sail, metric = false }) {
    return (<Group x={x} y={y}>
        <Arrow
            name="B"
            points={[50, 280, 400, 300]}
            stroke="blue"
            fill="blue"
            pointerAtBeginning={true}
            strokeWidth={1}
            y={5}
        />
        <Label x={245} y={285} >
            <Tag fill="white" />
            <Text text={param("B", sail?.foot, metric)} fill="blue" fontSize={20} />
        </Label>
        <Arrow
            name="H"
            points={[380, 305, 380, 40]}
            stroke="blue"
            fill="blue"
            pointerAtBeginning={true}
            strokeWidth={1}
            y={5}
        />
        <Label x={372} y={170} >
            <Tag fill="white" />
            <Text text={param("H", sail?.luff, metric)} fill="blue" fontSize={20} />
        </Label>
        <Arrow
            name="G"
            points={[200, -80, 400, 50]}
            stroke="blue"
            fill="blue"
            pointerAtBeginning={true}
            strokeWidth={1}
            y={5}
        />
        <Label x={285} y={-20} >
            <Tag fill="white" />
            <Text text={param("G", sail?.head, metric)} fill="blue" fontSize={20} />
        </Label>
    </Group>);
}

function TopsailMeasurements({ x, y, sail, metric = false }) {
    return (<Group x={x} y={y}>
        <Arrow
            name="TI"
            points={[200, -110, 400, -110]}
            stroke="blue"
            fill="blue"
            pointerAtBeginning={true}
            strokeWidth={1}
            y={5}
        />
        <Label x={300} y={-115} >
            <Tag fill="white" />
            <Text text={param("TI", sail?.perpendicular, metric)} fill="blue" fontSize={20} />
        </Label>
        <Arrow
            name="TH"
            points={[390, 20, 390, -190]}
            stroke="blue"
            fill="blue"
            pointerAtBeginning={true}
            strokeWidth={1}
            y={5}
        />
        <Label x={372} y={-60} >
            <Tag fill="white" />
            <Text text={param("TH", sail?.luff, metric)} fill="blue" fontSize={20} />
        </Label>
    </Group>);
}

function WaterLine({ x, y, length = 750, scale = { x: 1, y: 1 } }) {
    return (<Group x={x} y={y} scale={scale}>
        <Line
            points={[0, 346, length, 346]}
            stroke="blue"
            strokeWidth={1}
            lineCap="round"
            lineJoin="round"
            y={5}
        />
        <Text x={length - 200} y={335} text="Water" fill="black" fontSize={15} />
        <Text x={length - 200} y={355} text="Line" fill="black" fontSize={15} />
    </Group>);
}


function BeamMeasurement({ x, y, scale = { x: 1, y: 1 }, boat, metric = false }) {
    return (<Group x={x} y={y} scale={scale}>
        <HorizontalDimension x={0} y={0} length={138} label={param("Beam", boat.handicap_data?.beam, metric)} />
        <VerticalDimension x={40} y={67.5} length={67} label={param("Draft", boat.handicap_data?.draft, metric)} />
    </Group>);
}

function ForeTriangleMeasurements({ x, y, scale = { x: 1, y: 1 }, boat, metric = false }) {
    return (<Group x={x} y={y} scale={scale}>
        <Arrow
            name="I"
            points={[435, 360, 435, -150]}
            stroke="blue"
            fill="blue"
            pointerAtBeginning={true}
            strokeWidth={1}
            y={5}
        />
        <Label x={432} y={120} >
            <Tag fill="white" />
            <Text text={param("I", boat.handicap_data?.fore_triangle_height, metric)} fill="blue" fontSize={20} />
        </Label>
        <Arrow
            name="J"
            points={[420, 300, 675, 300]}
            stroke="blue"
            fill="blue"
            pointerAtBeginning={true}
            strokeWidth={1}
            y={5}
        />
        <Label x={545} y={295} >
            <Tag fill="white" />
            <Text text={param("J", boat.handicap_data?.fore_triangle_base, metric)} fill="blue" fontSize={20} />
        </Label>
    </Group>);
}

export function BermudanMast({ x, y, sail, scale = { x: 1, y: 1 }, metric = false }) {
    return (<Group x={x} y={y} scale={scale}>
        <Line
            name="boom"
            points={[50, 300, 400, 320]}
            stroke="black"
            strokeWidth={8}
            lineCap="round"
            lineJoin="round"
            y={5}
        />
        <Line
            name="mast"
            points={[410, 360, 410, -190]}
            stroke="black"
            strokeWidth={10}
            y={5}
        />
        <Line
            name="mainsail"
            points={[50, 290, 400, 310, 400, -190, 50, 290]}
            stroke="green"
            strokeWidth={1}
            y={5}
        />
        <HorizontalDimension x={50} y={290} length={350} label={param("B", sail?.foot, metric)} />
        <VerticalDimension x={390} y={-185} length={500} label={param("H", sail?.luff, metric)} />
    </Group>);
}

export function GaffWithTopSail({ x, y, main, topsail, scale = { x: 1, y: 1 }, metric = false }) {
    return (<Group x={x} y={y} scale={scale}>
        <GaffMast x={0} y={0} />
        <Line
            name="topmast"
            points={[410, 60, 410, -210]}
            stroke="black"
            strokeWidth={10}
            y={5}
        />
        <Line
            name="topsail"
            points={[200, -110, 400, 20, 400, -190, 200, -110]}
            stroke="green"
            strokeWidth={1}
            y={5}
        />
        <GaffMeasurements x={0} y={0} sail={main} metric={metric} />
        <TopsailMeasurements x={0} y={0} sail={topsail} metric={metric} />
    </Group>);
}


export function HullSideView({ x, y, scale = { x: 1, y: 1 } }) {
    return (<Group x={x} y={y - 160} scale={scale}>
        <Path x={0} y={0} stroke="black"
            data="M20.26667,444.81331c-0.21333,-0.12 -3.33333,-2.93333 -1.30667,-0.70667c2.04,2.21333 7.42667,9.33333 13.49333,14.01333c6.06667,4.68 13.85333,9.85333 22.89333,14.04933c9.05333,4.19067 23.88,8.07333 31.38666,11.092c7.50667,3.02 8.44,-2.95733 13.66667,7.02533c5.22667,9.98267 12.8,43.87466 17.72,52.87066c4.93333,8.99733 7.64,-1.47867 11.82667,1.10933c6.02667,0 14.57333,-0.36933 24.36,-1.10933l38.04,-0.36933l38.02666,-1.10933c15.76,-0.616 37.42666,0.24667 56.49333,-2.588c19.08,-2.83467 35.57333,-5.66933 57.97333,-14.42c22.4,-8.74933 41.42666,-18.60933 67.21333,-30.31733c25.78667,-11.708 33.66666,-20.812 44.66666,-31.06c11,-10.25333 26.36,-19.05333 27.24,-24.54667c4.54667,-4.74667 27.17333,-8.68 -12.82667,-7.25333l-233.10665,9.98667l-217.75999,3.33333l0.00001,0.00001z" />
        <Path x={0} y={0} stroke="black"
            data="M115.35999,545.59997c-6.18667,-3.06267 -12.37333,-6.12533 -17.98667,-10.5c-5.62667,-4.376 -12,-10.12533 -15.74667,-15.75067c-3.74667,-5.62533 -5.62667,-13.75067 -6.74667,-18.00133c-1.13333,-4.24933 -1,-5.62533 0,-7.5c1,-1.87467 3.86667,-2.75067 6,-3.75067c2.12,-1 3.86667,-2.37467 6.74667,-2.24933c2.86667,0.12533 6.68,1.56267 10.49333,3" />

    </Group>);
}

export function HullEndView({ x, y, scale = { x: 1, y: 1 } }) {
    return (<Group x={x} y={y - 160} scale={scale}>
        <Line points={[595, 432, 731, 432]} strokeWidth={2} stroke="black" />
        <Path x={0}
            y={-0}
            stroke="black"
            data="M594.4133,431.51998c-0.46667,11.8 -0.93333,23.6 2.38667,33.6c3.33333,10 11.06667,19.73333 17.6,26.4c6.53333,6.66667 15.06667,8.53333 21.6,13.6c6.53333,5.06667 13.86667,10.26667 17.6,16.8c3.73333,6.53333 3.33333,17.46667 4.8,22.4c1.46667,4.93333 2.73333,6.06667 4,7.2" />
        <Path x={0} y={0} stroke="black"
            data="M730.38662,431.51998c0.46667,11.8 0.93333,23.6 -2.4,33.6c-3.32,10 -11.05333,19.73333 -17.58667,26.4c-6.53333,6.66667 -15.06667,8.53333 -21.6,13.6c-6.53333,5.06667 -13.86667,10.26667 -17.6,16.8c-3.73333,6.53333 -3.33333,17.46667 -4.8,22.4c-1.46667,4.93333 -2.73333,6.06667 -4,7.2" />

    </Group>);
}

export function Forestays({ x, y, scale = { x: 1, y: 1 } }) {
    return (<Group x={x} y={y} scale={scale}>
        <Line
            name="bowsprit"
            points={[550, 355, 680, 345]}
            stroke="black"
            strokeWidth={8}
            lineCap="round"
            lineJoin="round"
            y={5}
        />
        <Line
            name="forestay"
            points={[410, 0, 590, 350]}
            stroke="black"
            strokeWidth={1}
            y={5}
        />
        <Line
            name="jibstay"
            points={[410, -100, 680, 345]}
            stroke="black"
            strokeWidth={1}
            y={5}
        />
        <Line
            name="topjibstay"
            points={[410, -160, 680, 345]}
            stroke="black"
            strokeWidth={1}
            y={5}
        />
    </Group>);
}

function MastWithSails({ x, y, scale = { x: 1, y: 1 }, mainsail_type, main, topsail, metric = false }) {
    console.log("MastWithSails", mainsail_type, main, topsail);
    if (['gaff', 'junk', 'spritsail', 'lug', 'balanced lug', 'dipping lug', 'standing lug'].includes(mainsail_type)) {
        return (<GaffWithTopSail x={x} y={y} scale={scale} main={main} topsail={topsail} metric={metric} />);
    }
    if (['gunter', 'bermudan', 'lateen', 'leg-o-mutton'].includes(mainsail_type)) {
        return (<BermudanMast x={x} y={y} scale={scale} sail={main} metric={metric} />);
    }
    return '';
}

export function HandicapDiagram({ boat, metric = false }) {
    //console.log(boat.handicap_data);
    return (
        <Stage width={1200} height={700}>
            <Layer>
                {
                    (['Cutter', 'Sloop'].includes(boat.rig_type)) &&
                    <Group x={120} y={190}>
                        <MastWithSails x={0} y={0} mainsail_type={boat.mainsail_type} main={boat.handicap_data.main} topsail={boat.handicap_data.topsail} metric={metric} />
                        <ForeTriangleMeasurements x={0} y={0} scale={{ x: 1, y: 1 }} boat={boat} metric={metric} />
                        <HullEndView x={0} y={0} scale={{ x: 1.2, y: 1.2 }} />
                        <HullSideView x={0} y={0} scale={{ x: 1.2, y: 1.2 }} />
                        <Forestays x={0} y={0} scale={{ x: 1, y: 1 }} />
                        <BeamMeasurement x={712} y={340} boat={boat} metric={metric} scale={{ x: 1.2, y: 1.2 }} />
                        <Group scale={{ x: 1.2, y: 1.2 }}>
                            <HorizontalDimension x={17} y={330} length={475} label={param("LOD", boat.handicap_data?.length_on_deck, metric)} />
                            <HorizontalDimension x={100} y={370} length={330} label={param("LWL", boat.handicap_data?.length_on_waterline, metric)} />
                        </Group>
                        <WaterLine x={0} y={0} scale={{ x: 1.2, y: 1.2 }} />
                    </Group>
                }
                {
                    (['Cat Boat', 'Single Sail'].includes(boat.rig_type)) &&
                    <Group x={120} y={190}>
                        <MastWithSails x={100} y={-7} mainsail_type={boat.mainsail_type} main={boat.handicap_data.main} metric={metric} />
                        <HullEndView x={0} y={0} scale={{ x: 1.2, y: 1.2 }} />
                        <HullSideView x={0} y={0} scale={{ x: 1.2, y: 1.2 }} />
                        <BeamMeasurement x={712} y={340} boat={boat} metric={metric} scale={{ x: 1.2, y: 1.2 }} />
                        <Group scale={{ x: 1.2, y: 1.2 }}>
                            <HorizontalDimension x={17} y={330} length={475} label={param("LOD", boat.handicap_data?.length_on_deck, metric)} />
                            <HorizontalDimension x={100} y={370} length={330} label={param("LWL", boat.handicap_data?.length_on_waterline, metric)} />
                        </Group>
                        <WaterLine x={0} y={0} scale={{ x: 1.2, y: 1.2 }} />
                    </Group>
                }
                {
                    (['Schooner'].includes(boat.rig_type)) &&
                    <Group x={350} y={210} scale={{ x: 0.9, y: 0.9 }}>
                        <Group x={0} y={0} scale={{ x: 1.1, y: 1.1 }}>
                            <MastWithSails x={-400} y={-27} mainsail_type={boat.mainsail_type} main={boat.handicap_data.main} metric={metric} />
                        </Group>
                        <MastWithSails x={0} y={0} mainsail_type={boat.mainsail_type} main={boat.handicap_data.fore} metric={metric} />
                        <ForeTriangleMeasurements x={0} y={0} scale={{ x: 1, y: 1 }} boat={boat} metric={metric} />
                        <HullEndView x={0} y={0} scale={{ x: 1.2, y: 1.2 }} />
                        <HullSideView x={-300} y={0} scale={{ x: 1.8, y: 1.2 }} />
                        <Forestays x={0} y={0} scale={{ x: 1, y: 1 }} />
                        <BeamMeasurement x={712} y={340} boat={boat} metric={metric} scale={{ x: 1.2, y: 1.2 }} />
                        <Group scale={{ x: 1.2, y: 1.2 }}>
                            <HorizontalDimension x={-222} y={330} length={715} label={param("LOD", boat.handicap_data?.length_on_deck, metric)} />
                            <HorizontalDimension x={-100} y={370} length={500} label={param("LWL", boat.handicap_data?.length_on_waterline, metric)} />
                        </Group>
                        <WaterLine x={-300} y={0} length={1000} scale={{ x: 1.2, y: 1.2 }} />
                    </Group>
                }
                {
                    (['Ketch', 'Yawl'].includes(boat.rig_type)) &&
                    <Group x={200} y={190}>
                        <MastWithSails x={-220} y={152} scale={{ x: 0.6, y: 0.6 }} mainsail_type={boat.mainsail_type} main={boat.handicap_data.mizzen} metric={metric} />
                        <MastWithSails x={0} y={0} mainsail_type={boat.mainsail_type} main={boat.handicap_data.main} metric={metric} />
                        <ForeTriangleMeasurements x={0} y={0} scale={{ x: 1, y: 1 }} boat={boat} metric={metric} />
                        <HullEndView x={0} y={0} scale={{ x: 1.2, y: 1.2 }} />
                        <HullSideView x={-140} y={0} scale={{ x: 1.5, y: 1.2 }} />
                        <Forestays x={0} y={0} scale={{ x: 1, y: 1 }} />
                        <BeamMeasurement x={712} y={340} boat={boat} metric={metric} scale={{ x: 1.2, y: 1.2 }} />
                        <Group scale={{ x: 1.2, y: 1.2 }}>
                            <HorizontalDimension x={-95} y={330} length={590} label={param("LOD", boat.handicap_data?.length_on_deck, metric)} />
                            <HorizontalDimension x={5} y={370} length={417} label={param("LWL", boat.handicap_data?.length_on_waterline, metric)} />
                        </Group>
                        <WaterLine x={0} y={0} scale={{ x: 1.2, y: 1.2 }} />
                    </Group>
                }
            </Layer>
        </Stage>
    )
}

export default function HandicapForm({ boat }) {
    const [metric, setMetric] = React.useState(false);
    const handleChange = (event) => {
        setMetric(event.target.checked);
    };
    return (
        <>
            <Typography>To assist with keeping the boat register up to date and accurate members have been asked
                to remeasure their boats hull and sail plan. Many boats have been re rigged over the years
                and it is correct to update the national OGA boat register data base with accurate figures.
                Standard production boats with the builders / designers sail plan should not need to
                remeasure as their measurements will be readily available. If however, you have a more
                modern gaffer with a custom sail plan then we need to know the new sail details.
            </Typography>
            <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ userSelect: "none" }}
            >
                {/* Left label */}
                <Typography variant="body1">feet</Typography>

                {/* Switch */}
                <Switch
                    checked={metric}
                    onChange={handleChange}
                    inputProps={{ "aria-label": "two-label-switch" }}
                />

                {/* Right label */}
                <Typography variant="body1">metres</Typography>
            </Stack>
            <HandicapDiagram boat={boat} metric={metric} />
            <Stack>
                <Typography variant='h6'>Sail Dimensions</Typography>
                <Typography>Mainsail, mizzen and main and mizzen
                    topsails, and schooners’ foresails and
                    fore-topsails, are measured as the
                    actual sail dimensions, not the spar
                    lengths. Headsails - it is the size of the
                    foretriangle that is measured.</Typography>
                <Typography variant='h6'>Foretriangle</Typography>
                <Typography>I is measured from deck to the top of
                    the highest headsail halyard sheave
                    (for jib topsail if one can be flown).
                </Typography>
                <Typography>J is
                    measured from the foreside of the mast to the eye of the fitting which sets the tack of the furthest forward headsail, or to the sheave of
                    the jib outhaul at the end of the bowsprit.</Typography>
                <Typography variant='h6'>Hull</Typography>
                <Typography>
                    LOD is length on deck, LWL excludes the rudder and Beam is the widest part of the hull (outside
                    measurement) excluding rubbing strakes and other appendages.</Typography>
                <Typography variant='h6'>Additional Information used in the handicap calculation</Typography>
                <Typography color="blue">Rig Type = {boat?.rig_type}</Typography>
                <Typography color="blue">Propellor Type = {boat.handicap_data?.propellor?.type || 'not specified'}</Typography>
                <Typography color="blue">Displacement = {boat.handicap_data.displacement || 'not known'} kg</Typography>
                <Typography color="blue">Hull Shape (Solent) = {boat.handicap_data?.solent?.hull_shape || 'not known'}</Typography>
            </Stack>
        </>
    );
};
