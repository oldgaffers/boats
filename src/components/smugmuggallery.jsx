import { Box } from '@mui/material';

const url = 'https://oga.smugmug.com/frame/slideshow'
const queryString = 'autoStart=1&captions=1&navigation=1'
    + '&playButton=1&randomize=1&speed=3&transition=fade&transitionSpeed=2'

export default function SmugMugGallery({ albumKey, ogaNo, name }) {
    if (albumKey) {
        return (
            <Box
                sx={{
                    width: { xs: '100vw', sm: '75vw', md: '800px'},
                    height: { xs: '50vh', sm: '360px', md: '600px'},
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    overflow: 'hidden',
                }}
        >
                <iframe
                    src={`${url}?key=${albumKey}&${queryString}`}
                    frameborder="no"
                    title={`Slide show for OGA boat number ${ogaNo} named ${name}`}
                    style={{
                        width: '100%',
                        height: '100%',
                        border: 'none',
                    }}
                />
            </Box>
        );
    }
    return null;
};
