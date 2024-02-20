import { useState, SetStateAction, useEffect } from "react"
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, TextField, Button, Stack, IconButton, Box } from "@mui/material"
import DeleteIcon from '@mui/icons-material/Delete';
import Photodrop from "./PhotoDrop"
import { getPrivateImage, postPhotos } from "./lib/postphotos"

function PrivateImage({ src, alt, width, height }) {
    const [s, setS] = useState(`https://placehold.co/${width}x${height}?text=please+wait`);

    function errorHandler(e) {
        e.target.src = `https://placehold.co/${width}x${height}?text=image+not+loading`;
    }

    useEffect(() => {
        if (s.includes('placehold')) {
            getPrivateImage(src).then((r) => {
                setS(r);
            });
        }
    });

    return <img
        crossOrigin="anonymous"
        style={{ width: '100%' }}
        src={s}
        alt={alt}
        loading="lazy"
        onError={errorHandler}
    />;
}

function HeroImage({ src, alt, width, height }: { src: string, alt: string, width: number, height: number }) {

    function errorHandler(e: any) {
        console.log(e);
        e.target.src = `https://placehold.co/${width}x${height}?text=image+not+loading`;
    }

    if (src.includes('boatregister-public')) {
        return <PrivateImage src={src} alt={alt} width={width} height={height} />;
    }

    return <img
        style={{ width: '100%' }}
        src={src}
        alt={alt}
        loading="lazy"
        onError={errorHandler}
    />;
}

function CardImage({ picture, alt, editEnabled, onDelete }: CardImageProps) {
    const w = 300;
    const h = 200;
    if (editEnabled) {
        return <>
            <HeroImage src={picture} alt={alt} width={w} height={h} />
            <Box sx={{ position: "relative", color: "white", top: -45, left: "1%", width: 50, }}>
                <IconButton
                    sx={{ color: 'white', background: 'rgba(100, 100, 100, 0.2)', }}
                    aria-label='delete'
                    onClick={() => onDelete()}
                >
                    <DeleteIcon />
                </IconButton>
            </Box>
        </>;
    }
    return <HeroImage src={picture} alt={alt} width={w} height={h} />;
}

export default function EditableCardImage({ editEnabled, id, name, email, pictures, onAddImage, onDeleteImage, onUseAvatar }: EditableCardImageProps) {
    const [imageChoice, setImageChoice] = useState('nothing');
    const [url, setUrl] = useState('');
    const [web, setWeb] = useState('');

    useEffect(() => {
        let timeoutId: any | undefined;
        if (url !== '') {
            timeoutId = setTimeout(() => {
                if (url !== '') {
                    handleAddImage(url);
                }
            }, 2000);
        }

        // Cleanup function to clear the timeout if the component unmounts
        if (timeoutId) {
            return () => clearTimeout(timeoutId);
        }
    }, [url]);

    function handleAddImage(value: string) {
        if (onAddImage) {
            onAddImage(value);
        }
    }

    function handleChange(e: { target: { value: SetStateAction<string> } }) {
        setImageChoice(e.target.value);
        if (onUseAvatar) {
            onUseAvatar(e.target.value === 'avatar');
        }
    }

    function onDrop(files: File[]) {
        if (files.length === 0) {
            return;
        }
        postPhotos(files, '', email, id, undefined, () => { }).then(
            (r: any) => {
                setUrl(r[0]);
            }
        );
    }

    function handleWebImage() {
        if (web !== '')
            handleAddImage(web);
    }

    function handleDeleteImage() {
        // console.log('handle delete');
        setImageChoice('nothing');
        if (onDeleteImage) {
            onDeleteImage();
        }
        if (onUseAvatar) {
            onUseAvatar(false);
        }
    }

    if (pictures.length > 0) {
        return <CardImage picture={pictures[0]} alt={name} editEnabled={editEnabled} onDelete={handleDeleteImage} />;
    }

    if (!editEnabled) {
        return '';
    }

    return <>
        <FormControl>
            <FormLabel id="demo-radio-buttons-group-label">Show an image?</FormLabel>
            <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                name="radio-buttons-group"
                value={imageChoice}
                onChange={handleChange}
            >
                <FormControlLabel value="nothing" control={<Radio />} label="No Picture" />
                <FormControlLabel value="avatar" control={<Radio />} label="My Login Picture" />
                <FormControlLabel value="web" control={<Radio />} label="From Web" />
                <FormControlLabel value="upload" control={<Radio />} label="From This Device" />
            </RadioGroup>
        </FormControl>
        {
            (imageChoice === 'web')
                ?
                <Stack direction='row'>
                    <TextField
                        value={web}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setWeb(event.target.value)}
                        placeholder='type or paste a url'
                    />
                    <Button onClick={handleWebImage}>set</Button>
                </Stack>
                :
                (imageChoice === 'upload')
                    ?
                    <>
                        <Photodrop onDrop={onDrop} preview={false} />
                    </>
                    :
                    ''
        }
    </>;
}
