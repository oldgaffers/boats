import React, { useMemo, useState } from 'react'
import FormatAlignLeft from '@material-ui/icons/FormatAlignLeft';
import FormatAlignRight from '@material-ui/icons/FormatAlignRight';
import FormatAlignCenter from '@material-ui/icons/FormatAlignCenter';
import FormatListBulleted from '@material-ui/icons/FormatListBulleted';
import FormatListNumbered from '@material-ui/icons/FormatListNumbered';
// import Movie from '@material-ui/icons/Movie';
import Link from '@material-ui/icons/Link/';
import FormatBold from '@material-ui/icons/FormatBold';
import FormatItalic from '@material-ui/icons/FormatItalic';
import LooksOne from '@material-ui/icons/LooksOne';
import LooksTwo from '@material-ui/icons/LooksTwo';
// import Looks3 from '@material-ui/icons/Looks3';
import { withReact, Slate } from 'slate-react'
import { withHistory } from 'slate-history';
import { createEditor } from 'slate';
import {
  AlignPlugin,
  BoldPlugin,
  EditablePlugins,
  HeadingPlugin,
  ItalicPlugin,
  LinkPlugin,
  ListPlugin,
  MediaEmbedPlugin,
  ParagraphPlugin,
  pipe,
  HeadingToolbar,
  ToolbarAlign,
  ToolbarElement,
  ToolbarLink,
  ToolbarList,
  ToolbarMark,
} from '@udecode/slate-plugins';
import { 
  deserializeHTMLToDocumentFragment,
  serializeHTMLFromNodes,
 } from '@udecode/slate-plugins';
import { getInlineTypes } from '@udecode/slate-plugins-core';
import { Transforms } from 'slate';
import { isBlockAboveEmpty } from '@udecode/slate-plugins';

const withPlugins = [withReact, withHistory];
const plugins = [
  AlignPlugin(),
  BoldPlugin(), 
  HeadingPlugin(), 
  ItalicPlugin(),
  LinkPlugin(), 
  ListPlugin(), 
  MediaEmbedPlugin(),
  ParagraphPlugin()
];

const ToolBarMin = () => {
  return (
    <HeadingToolbar>
      <ToolbarMark type="bold" icon={<FormatBold />} />
      <ToolbarMark type="italic" icon={<FormatItalic />} />
    </HeadingToolbar>
  );
}

const ToolBarMax = () => {
  return (
    <HeadingToolbar>
      <ToolbarMark type="bold" icon={<FormatBold />} />
      <ToolbarMark type="italic" icon={<FormatItalic />} />
      <ToolbarElement type="h1" icon={<LooksOne />} />
      <ToolbarElement type="h2" icon={<LooksTwo />} />
      <ToolbarAlign type='left' icon={<FormatAlignLeft />}/>
      <ToolbarAlign type='center' icon={<FormatAlignCenter />}/>
      <ToolbarAlign type='right' icon={<FormatAlignRight />}/>
      <ToolbarList typeList={'ul'} icon={<FormatListBulleted />}  />
      <ToolbarList typeList={'ol'} icon={<FormatListNumbered />}  />
      <ToolbarLink icon={<Link />} />
   </HeadingToolbar>
  );  
}

const preInsert = (fragment, plugins, editor) => {
  const inlineTypes = getInlineTypes(plugins);

  const firstNodeType = fragment[0].type | undefined;

  // replace the selected node type by the first block type
  if (
    isBlockAboveEmpty(editor) &&
    firstNodeType &&
    !inlineTypes.includes(firstNodeType)
  ) {
    Transforms.setNodes(editor, { type: fragment[0].type });
  }

  return fragment;
};

function preInsert2(fragment) {
  if(fragment.length === 1) {
    return fragment;
  }
  return fragment.map((item) => {
    if (item.type) {
      return item;
    }
    return { type: 'p', children: [item]};
  });
}

const RichTextEditor = ({html, onUpdate, variant='min' }) => {
  const editor = useMemo(() => pipe(createEditor(), ...withPlugins), []);
  const { body } = new DOMParser().parseFromString(html, 'text/html');

  let fragment = deserializeHTMLToDocumentFragment({
    plugins,
    element: body,
  });
  fragment = preInsert(fragment, plugins, editor);
  fragment = preInsert2(fragment);
  const initialValue = [{
    type: 'paragraph',
    children: fragment,
  }];
  const [value, setValue] = useState(initialValue);

  const handleChange = (val) => {
    setValue(val);
    const html = serializeHTMLFromNodes({ nodes: value, plugins });
    onUpdate(html);
  };

  return (
    <Slate editor={editor} value={value} onChange={handleChange}>
      {(variant==='min'?(<ToolBarMin/>):(<ToolBarMax/>))}
      <EditablePlugins plugins={plugins} placeholder="Enter some text..." />
    </Slate>
  )
}

export default RichTextEditor