import React from 'react';
import { Stage, Layer, Label, Text, Line, Arrow, Path, Tag } from 'react-konva';
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

export function BaseBoat({ x, y, scale = 1 }) {
    return (<>
        <Line points={[x + 712, y + 358, x + 877, y + 358]} strokeWidth={2} stroke="black" />
        <Line
            name="bowsprit"
            points={[x + 550, y + 355, x + 680, y + 345]}
            stroke="black"
            strokeWidth={8}
            lineCap="round"
            lineJoin="round"
            y={5}
        />
        <Line
            name="boom"
            points={[x + 50, y + 300, x + 400, y + 320]}
            stroke="black"
            strokeWidth={8}
            lineCap="round"
            lineJoin="round"
            y={5}
        />
        <Line
            name="mast"
            points={[x + 410, y + 360, x + 410, 0]}
            stroke="black"
            strokeWidth={10}
            y={5}
        />
        <Line
            name="gaff"
            points={[x + 200, y - 100, x + 400, y + 30]}
            stroke="black"
            strokeWidth={8}
            lineCap="round"

            y={5}
        />
        <Line
            name="mainsail"
            points={[x + 50, y + 290, x + 400, y + 310, x + 400, y + 40, x + 200, y - 90, x + 50, y + 290]}
            stroke="green"
            strokeWidth={1}
            y={5}
        />
        <Line
            name="topsail"
            points={[x + 200, y - 110, x + 400, y + 20, x + 400, 0, x + 200, y - 110]}
            stroke="green"
            strokeWidth={1}
            y={5}
        />
        <Line
            name="forestay"
            points={[x + 410, y, x + 590, y + 350]}
            stroke="black"
            strokeWidth={1}
            y={5}
        />
        <Line
            name="jibstay"
            points={[x + 410, y - 100, x + 680, y + 345]}
            stroke="black"
            strokeWidth={1}
            y={5}
        />
        <Line
            name="topjibstay"
            points={[x + 410, y - 160, x + 680, y + 345]}
            stroke="black"
            strokeWidth={1}
            y={5}
        />
        <Path x={x}
            y={y - 160}
            stroke="black"
            scaleX={scale}
            scaleY={scale}
            data="M594.4133,431.51998c-0.46667,11.8 -0.93333,23.6 2.38667,33.6c3.33333,10 11.06667,19.73333 17.6,26.4c6.53333,6.66667 15.06667,8.53333 21.6,13.6c6.53333,5.06667 13.86667,10.26667 17.6,16.8c3.73333,6.53333 3.33333,17.46667 4.8,22.4c1.46667,4.93333 2.73333,6.06667 4,7.2" />
        <Path x={x} y={y - 160} stroke="black"
            scaleX={scale}
            scaleY={scale}
            data="M730.38662,431.51998c0.46667,11.8 0.93333,23.6 -2.4,33.6c-3.32,10 -11.05333,19.73333 -17.58667,26.4c-6.53333,6.66667 -15.06667,8.53333 -21.6,13.6c-6.53333,5.06667 -13.86667,10.26667 -17.6,16.8c-3.73333,6.53333 -3.33333,17.46667 -4.8,22.4c-1.46667,4.93333 -2.73333,6.06667 -4,7.2" />
        <Path x={x} y={y - 160} stroke="black"
            scaleX={scale}
            scaleY={scale}
            data="M20.26667,444.81331c-0.21333,-0.12 -3.33333,-2.93333 -1.30667,-0.70667c2.04,2.21333 7.42667,9.33333 13.49333,14.01333c6.06667,4.68 13.85333,9.85333 22.89333,14.04933c9.05333,4.19067 23.88,8.07333 31.38666,11.092c7.50667,3.02 8.44,-2.95733 13.66667,7.02533c5.22667,9.98267 12.8,43.87466 17.72,52.87066c4.93333,8.99733 7.64,-1.47867 11.82667,1.10933c6.02667,0 14.57333,-0.36933 24.36,-1.10933l38.04,-0.36933l38.02666,-1.10933c15.76,-0.616 37.42666,0.24667 56.49333,-2.588c19.08,-2.83467 35.57333,-5.66933 57.97333,-14.42c22.4,-8.74933 41.42666,-18.60933 67.21333,-30.31733c25.78667,-11.708 33.66666,-20.812 44.66666,-31.06c11,-10.25333 26.36,-19.05333 27.24,-24.54667c4.54667,-4.74667 27.17333,-8.68 -12.82667,-7.25333l-233.10665,9.98667l-217.75999,3.33333l0.00001,0.00001z" />
        <Path x={x} y={y - 160} stroke="black"
            scaleX={scale}
            scaleY={scale}
            data="M115.35999,545.59997c-6.18667,-3.06267 -12.37333,-6.12533 -17.98667,-10.5c-5.62667,-4.376 -12,-10.12533 -15.74667,-15.75067c-3.74667,-5.62533 -5.62667,-13.75067 -6.74667,-18.00133c-1.13333,-4.24933 -1,-5.62533 0,-7.5c1,-1.87467 3.86667,-2.75067 6,-3.75067c2.12,-1 3.86667,-2.37467 6.74667,-2.24933c2.86667,0.12533 6.68,1.56267 10.49333,3" />

    </>);
}

export function HandicapDiagram({ boat, metric = false }) {
    const scale = 1.2;
    const x = 0;
    const y = 190;
    console.log(boat.handicap_data);
    return (
        <Stage scale={0.5} width={910} height={700}>
            <Layer>
                <BaseBoat x={x} y={y} scale={scale} />
                <Line
                    points={[0, y + 415, x + 900, y + 415]}
                    stroke="blue"
                    strokeWidth={1}
                    lineCap="round"
                    lineJoin="round"
                    y={5}
                />
                <Arrow points={[x + 590, y + 420, x + 590, y + 500]} stroke="blue" pointerAtBeginning={true} strokeWidth={1} fill="blue" />
                <Arrow points={[x + 710, y + 340, x + 875, y + 340]} stroke="blue" pointerAtBeginning={true} strokeWidth={1} fill="blue" />
                <Arrow points={[x + 20, y + 400, x + 590, y + 400]} stroke="blue" pointerAtBeginning={true} strokeWidth={1} fill="blue" />
                <Arrow points={[x + 100, y + 440, x + 520, y + 440]} stroke="blue" pointerAtBeginning={true} strokeWidth={1} fill="blue" />
                <Text x={x + 720} y={y + 320} text={param("Beam", boat.handicap_data?.beam, metric)} width={150} align="center" fill="blue" fontSize={20} />
                <Text x={x + 650} y={y + 400} text="Water" fill="black" fontSize={20} />
                <Text x={x + 650} y={y + 420} text="Line" fill="black" fontSize={20} />
                <Label x={x + 600} y={y + 450} >
                    <Tag fill="white" />
                    <Text text={param("Draft", boat.handicap_data?.draft, metric)} fill="blue" fontSize={20} />
                </Label>
                <Label x={x + 300} y={y + 390} >
                    <Tag fill="white" />
                    <Text text={param("LOD", boat.handicap_data?.length_on_deck, metric)} fill="blue" fontSize={20} />
                </Label>
                <Label x={x + 300} y={y + 430} >
                    <Tag fill="white" />
                    <Text text={param("LWL", boat.handicap_data?.length_on_waterline, metric)} fill="blue" fontSize={20} />
                </Label>
                <Arrow
                    name="B"
                    points={[x + 50, y + 280, x + 400, y + 300]}
                    stroke="blue"
                    fill="blue"
                    pointerAtBeginning={true}
                    strokeWidth={1}
                    y={5}
                />
                <Label x={x + 245} y={y + 285} >
                    <Tag fill="white" />
                    <Text text={param("B", boat.handicap_data?.main?.foot, metric)} fill="blue" fontSize={20} />
                </Label>
                <Arrow
                    name="H"
                    points={[x + 380, y + 305, x + 380, y + 40]}
                    stroke="blue"
                    fill="blue"
                    pointerAtBeginning={true}
                    strokeWidth={1}
                    y={5}
                />
                <Label x={x + 372} y={y + 170} >
                    <Tag fill="white" />
                    <Text text={param("H", boat.handicap_data?.main?.luff, metric)} fill="blue" fontSize={20} />
                </Label>
                <Arrow
                    name="G"
                    points={[x + 200, y - 80, x + 400, y + 50]}
                    stroke="blue"
                    fill="blue"
                    pointerAtBeginning={true}
                    strokeWidth={1}
                    y={5}
                />
                <Label x={x + 285} y={y - 20} >
                    <Tag fill="white" />
                    <Text text={param("G", boat.handicap_data?.main?.head, metric)} fill="blue" fontSize={20} />
                </Label>
                <Arrow
                    name="I"
                    points={[x + 435, y + 360, x + 435, y - 150]}
                    stroke="blue"
                    fill="blue"
                    pointerAtBeginning={true}
                    strokeWidth={1}
                    y={5}
                />
                <Label x={x + 432} y={y + 120} >
                    <Tag fill="white" />
                    <Text text={param("I", boat.handicap_data?.fore_triangle_height, metric)} fill="blue" fontSize={20} />
                </Label>
                <Arrow
                    name="J"
                    points={[x + 420, y + 300, x + 675, y + 300]}
                    stroke="blue"
                    fill="blue"
                    pointerAtBeginning={true}
                    strokeWidth={1}
                    y={5}
                />
                <Label x={x + 545} y={y + 295} >
                    <Tag fill="white" />
                    <Text text={param("J", boat.handicap_data?.fore_triangle_base, metric)} fill="blue" fontSize={20} />
                </Label>
                <Arrow
                    name="TI"
                    points={[x + 200, y - 110, x + 400, y - 110]}
                    stroke="blue"
                    fill="blue"
                    pointerAtBeginning={true}
                    strokeWidth={1}
                    y={5}
                />
                <Label x={x + 300} y={y - 115} >
                    <Tag fill="white" />
                    <Text text={param("TI", boat.handicap_data?.topsail?.perpendicular, metric)} fill="blue" fontSize={20} />
                </Label>
                <Arrow
                    name="TH"
                    points={[x + 390, y + 20, x + 390, 0]}
                    stroke="blue"
                    fill="blue"
                    pointerAtBeginning={true}
                    strokeWidth={1}
                    y={5}
                />
                <Label x={x + 372} y={y - 60} >
                    <Tag fill="white" />
                    <Text text={param("TH", boat.handicap_data?.topsail?.luff, metric)} fill="blue" fontSize={20} />
                </Label>
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
            </Stack>
        </>
    );
};
