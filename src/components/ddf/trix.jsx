import React, { forwardRef, useRef } from 'react';
import { useFieldApi } from "@data-driven-forms/react-form-renderer";
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
// eslint-disable-next-line no-unused-vars
import Trix from 'trix';
import 'trix/dist/trix.css'
import { TrixEditor } from "react-trix";
import { PropaneSharp } from '@mui/icons-material';

function DefaultToolbar({ id }) {
    return (
        <trix-toolbar id={id}>
            <div className="trix-button-row">
                <span className="trix-button-group trix-button-group--text-tools" data-trix-button-group="text-tools">
                    <button type="button" className="trix-button trix-button--icon trix-button--icon-bold" data-trix-attribute="bold" data-trix-key="b" title="Bold" tabIndex="-1">Bold</button>
                    <button type="button" className="trix-button trix-button--icon trix-button--icon-italic" data-trix-attribute="italic" data-trix-key="i" title="Italic" tabIndex="-1">Italic</button>
                    <button type="button" className="trix-button trix-button--icon trix-button--icon-link" data-trix-attribute="href" data-trix-action="link" data-trix-key="k" title="Link" tabIndex="-1">Link</button>
                </span>

                <span className="trix-button-group trix-button-group--block-tools" data-trix-button-group="block-tools">
                    <button type="button" className="trix-button trix-button--icon trix-button--icon-heading-1" data-trix-attribute="heading1" title="Heading" tabIndex="-1">Heading</button>
                    <button type="button" className="trix-button trix-button--icon trix-button--icon-quote" data-trix-attribute="quote" title="Quote" tabIndex="-1">Quote</button>
                    <button type="button" className="trix-button trix-button--icon trix-button--icon-code" data-trix-attribute="code" title="Code" tabIndex="-1">Code</button>
                    <button type="button" className="trix-button trix-button--icon trix-button--icon-bullet-list" data-trix-attribute="bullet" title="Bullets" tabIndex="-1">Bullets</button>
                    <button type="button" className="trix-button trix-button--icon trix-button--icon-number-list" data-trix-attribute="number" title="Numbers" tabIndex="-1">Numbers</button>
                    <button type="button" className="trix-button trix-button--icon trix-button--icon-decrease-nesting-level" data-trix-action="decreaseNestingLevel" title="Decrease Level" tabIndex="-1" disabled="">Decrease Level</button>
                    <button type="button" className="trix-button trix-button--icon trix-button--icon-increase-nesting-level" data-trix-action="increaseNestingLevel" title="Increase Level" tabIndex="-1" disabled="">Increase Level</button>
                </span>

                <span className="trix-button-group trix-button-group--file-tools" data-trix-button-group="file-tools">
                    <button type="button" className="trix-button trix-button--icon trix-button--icon-attach" data-trix-action="attachFiles" title="Attach Files" tabIndex="-1">Attach Files</button>
                </span>

                <span className="trix-button-group-spacer"></span>

                <span className="trix-button-group trix-button-group--history-tools" data-trix-button-group="history-tools">
                    <button type="button" className="trix-button trix-button--icon trix-button--icon-undo" data-trix-action="undo" data-trix-key="z" title="Undo" tabIndex="-1" disabled="">Undo</button>
                    <button type="button" className="trix-button trix-button--icon trix-button--icon-redo" data-trix-action="redo" data-trix-key="shift+z" title="Redo" tabIndex="-1" disabled="">Redo</button>
                </span>
            </div>

            <div className="trix-dialogs" data-trix-dialogs="">
                <div className="trix-dialog trix-dialog--link" data-trix-dialog="href" data-trix-dialog-attribute="href">
                    <div className="trix-dialog__link-fields">
                        <input type="url" name="href" className="trix-input trix-input--dialog" placeholder="Enter a URL…" aria-label="URL" data-trix-validate-href="" required="" data-trix-input="" disabled="disabled" />
                        <div className="trix-button-group">
                            <input type="button" className="trix-button trix-button--dialog" value="Link" data-trix-method="setAttribute" />
                            <input type="button" className="trix-button trix-button--dialog" value="Unlink" data-trix-method="removeAttribute" />
                        </div>
                    </div>
                </div>
            </div>
        </trix-toolbar>
    );
}

const MediumToolbar = forwardRef((props, ref) => {
    return (
        <trix-toolbar ref={ref} id={props.id}>
            <div className="trix-button-row">
                <span className="trix-button-group trix-button-group--text-tools" data-trix-button-group="text-tools">
                    <button type="button" className="trix-button trix-button--icon trix-button--icon-bold" data-trix-attribute="bold" data-trix-key="b" title="Bold" tabIndex="-1">Bold</button>
                    <button type="button" className="trix-button trix-button--icon trix-button--icon-italic" data-trix-attribute="italic" data-trix-key="i" title="Italic" tabIndex="-1">Italic</button>
                    <button type="button" className="trix-button trix-button--icon trix-button--icon-strike" data-trix-attribute="strike" title="Strikethrough" tabIndex="-1">Strikethrough</button>
                    <button type="button" className="trix-button trix-button--icon trix-button--icon-link" data-trix-attribute="href" data-trix-action="link" data-trix-key="k" title="Link" tabIndex="-1">Link</button>
                </span>

                <span className="trix-button-group trix-button-group--block-tools" data-trix-button-group="block-tools">
                    <button type="button" className="trix-button trix-button--icon trix-button--icon-heading-1" data-trix-attribute="heading1" title="Heading" tabIndex="-1">Heading</button>
                    <button type="button" className="trix-button trix-button--icon trix-button--icon-quote" data-trix-attribute="quote" title="Quote" tabIndex="-1">Quote</button>
                    <button type="button" className="trix-button trix-button--icon trix-button--icon-bullet-list" data-trix-attribute="bullet" title="Bullets" tabIndex="-1">Bullets</button>
                    <button type="button" className="trix-button trix-button--icon trix-button--icon-number-list" data-trix-attribute="number" title="Numbers" tabIndex="-1">Numbers</button>
                    <button type="button" className="trix-button trix-button--icon trix-button--icon-decrease-nesting-level" data-trix-action="decreaseNestingLevel" title="Decrease Level" tabIndex="-1" disabled="">Decrease Level</button>
                    <button type="button" className="trix-button trix-button--icon trix-button--icon-increase-nesting-level" data-trix-action="increaseNestingLevel" title="Increase Level" tabIndex="-1" disabled="">Increase Level</button>
                </span>

                <span className="trix-button-group-spacer"></span>

                <span className="trix-button-group trix-button-group--history-tools" data-trix-button-group="history-tools">
                    <button type="button" className="trix-button trix-button--icon trix-button--icon-undo" data-trix-action="undo" data-trix-key="z" title="Undo" tabIndex="-1" disabled="">Undo</button>
                    <button type="button" className="trix-button trix-button--icon trix-button--icon-redo" data-trix-action="redo" data-trix-key="shift+z" title="Redo" tabIndex="-1" disabled="">Redo</button>
                </span>
            </div>

            <div className="trix-dialogs" data-trix-dialogs="">
                <div className="trix-dialog trix-dialog--link" data-trix-dialog="href" data-trix-dialog-attribute="href">
                    <div className="trix-dialog__link-fields">
                        <input type="url" name="href" className="trix-input trix-input--dialog" placeholder="Enter a URL…" aria-label="URL" data-trix-validate-href="" required="" data-trix-input="" disabled="disabled" />
                        <div className="trix-button-group">
                            <input type="button" className="trix-button trix-button--dialog" value="Link" data-trix-method="setAttribute" />
                            <input type="button" className="trix-button trix-button--dialog" value="Unlink" data-trix-method="removeAttribute" />
                        </div>
                    </div>
                </div>
            </div>
        </trix-toolbar>
    );
});

const SmallToolbar = forwardRef((props, ref) => {
    return (
        <trix-toolbar ref={ref} id={props.id}>
            <div className="trix-button-row">
                <span className="trix-button-group trix-button-group--text-tools" data-trix-button-group="text-tools">
                    <button type="button" className="trix-button trix-button--icon trix-button--icon-bold" data-trix-attribute="bold" data-trix-key="b" title="Bold" tabIndex="-1">Bold</button>
                    <button type="button" className="trix-button trix-button--icon trix-button--icon-italic" data-trix-attribute="italic" data-trix-key="i" title="Italic" tabIndex="-1">Italic</button>
                </span>
            </div>
        </trix-toolbar>
    );
});

export default function HtmlEditor({ component, name, title = '', helperText = '', height = 2, maxLength, initialValue }) {
    // console.log('editor TODO maxLength', maxLength);
    const tb = useRef(null);
    const { input } = useFieldApi({ component, name });
    const handleChange = (html, text) => {
        // html is the new html content
        // text is the new text content
        input.onChange(html);
    }
    const handleEditorReady = () => {
        console.log(name, 'editor ready');
    }

    const toolbarId = `${name}-tb`;
    return (
        <>
            <Stack direction='column'>
                <Typography sx={{ paddingTop: "1em" }}>{title}</Typography>
                {(name === 'short_description') ? <SmallToolbar ref={tb} id={toolbarId} /> : <MediumToolbar ref={tb} id={`${name}-tb`} />}
                <Box height={`${2 + 4 * height}pc`}>
                    <TrixEditor
                        value={input.value || initialValue}
                        onChange={handleChange}
                        onEditorReady={handleEditorReady}
                        toolbar={toolbarId}
                           onKeyDown={(e) => { e.key === 'Enter' && e.preventDefault() }}

                    />
                </Box>
                <Typography variant='caption'>{helperText}</Typography>
            </Stack>
        </>
    );

}

