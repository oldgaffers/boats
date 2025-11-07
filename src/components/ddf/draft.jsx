import React, { useState } from 'react';
import { useFieldApi } from "@data-driven-forms/react-form-renderer";
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { ContentState, convertFromHTML, convertToRaw, Editor, EditorState } from 'draft-js';
import 'draft-js/dist/Draft.css';
import draftToHtml from 'draftjs-to-html';

export default function HtmlEditor({ component, name, title = '', helperText = '', height = 2, maxLength, initialValue }) {
    // console.log('editor TODO maxLength', maxLength);
    const { input } = useFieldApi({ component, name });
    const [editorState, setEditorState] = useState(
        () => {
            const blocksFromHTML = convertFromHTML(input.value || initialValue);
            const state = ContentState.createFromBlockArray(
                blocksFromHTML.contentBlocks,
                blocksFromHTML.entityMap,
            );
            EditorState.createWithContent(state);
        }
    );

    const handleChange = (state) => {
        setEditorState(state)
        const rawContentState = convertToRaw(editorState.getCurrentContent());
        const html = draftToHtml(rawContentState);
        input.onChange(html);
    }

    return (
        <>
            <Stack direction='column'>
                <Typography sx={{ paddingTop: "1em" }}>{title}</Typography>
                <Box height={`${2 + 4 * height}pc`}>
                    <Editor editorState={editorState} onChange={handleChange} />
                </Box>
                <Typography variant='caption'>{helperText}</Typography>
            </Stack>
        </>
    );

}
