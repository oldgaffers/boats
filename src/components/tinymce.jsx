import React from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useFieldApi } from "@data-driven-forms/react-form-renderer";
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/material';

const apiKey = 'qz08zjvk6zkns9zh9akpuiq1w53sajkkok2ody3sjslag0f9';

const defaultToolbar = 'undo redo | blocks | ' +
    'bold italic forecolor | alignleft aligncenter ' +
    'alignright alignjustify | bullist numlist outdent indent | ' +
    'removeformat | help';

export default function HtmlEditor({
    component, name, title = '', helperText = '', toolbar = defaultToolbar, height = 10, maxLength, initialValue }) {
    console.log('editor TODO maxLength', maxLength);
    const { input } = useFieldApi({ component, name });
    return (
        <>
            <Stack direction='column'>
                <Typography sx={{ paddingTop: "1em" }}>{title}</Typography>
                <Editor
                    apiKey={apiKey}
                    onChange={(event, editor) => {
                        const data = editor.getContent();
                        console.log('editor onChange', { event, editor, data });
                        input.onChange(data);
                    }}
                    initialValue={input.value || initialValue}
                    init={{
                        height: 70 * height,
                        menubar: false,
                        plugins: [
                            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                        ],
                        toolbar,
                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                    }}
                />
                <Typography variant='caption'>{helperText}</Typography>
            </Stack>
        </>
    );

}

