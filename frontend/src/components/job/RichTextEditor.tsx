import React, { useEffect, useRef, useState } from 'react';

interface RichTextEditorProps {
  value: string; // HTML string
  onChange: (html: string) => void;
  placeholder?: string;
}

const FONT_FAMILIES = [
  { label: '-apple-system', value: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
  { label: 'Arial', value: 'Arial, Helvetica, sans-serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Times New Roman', value: '"Times New Roman", Times, serif' },
  { label: 'Courier New', value: '"Courier New", Courier, monospace' },
  { label: 'Verdana', value: 'Verdana, Geneva, sans-serif' },
];

const FONT_SIZES = ['11pt', '13pt', '15pt', '17pt', '19pt', '24pt', '32pt'];

const PARAGRAPH_STYLES = [
  { label: 'Paragraph', value: 'p' },
  { label: 'Heading 1', value: 'h1' },
  { label: 'Heading 2', value: 'h2' },
  { label: 'Heading 3', value: 'h3' },
  { label: 'Heading 4', value: 'h4' },
  { label: 'Preformatted', value: 'pre' },
];

const btnCls =
  'px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed';
const selectCls =
  'px-2 py-1 text-sm bg-white border border-gray-300 rounded cursor-pointer outline-none';

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, placeholder }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<'visual' | 'text'>('visual');
  const [textValue, setTextValue] = useState(value);
  const [paragraphStyle, setParagraphStyle] = useState('p');
  const [fontFamily, setFontFamily] = useState(FONT_FAMILIES[0].value);
  const [fontSize, setFontSize] = useState('15pt');

  // Keep the contentEditable DOM in sync when switching back to Visual
  // or when the value changes from outside (e.g. loading a job to edit)
  useEffect(() => {
    if (mode === 'visual' && editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
    setTextValue(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, mode]);

  const focusEditor = () => editorRef.current?.focus();

  const syncFromEditor = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const exec = (command: string, arg?: string) => {
    focusEditor();
    document.execCommand(command, false, arg);
    syncFromEditor();
  };

  const handleParagraphStyle = (value: string) => {
    setParagraphStyle(value);
    exec('formatBlock', `<${value}>`);
  };

  const handleFontFamily = (value: string) => {
    setFontFamily(value);
    exec('fontName', value);
  };

  const handleFontSize = (value: string) => {
    setFontSize(value);
    // execCommand fontSize only accepts 1-7; apply via CSS on the selection wrapper instead
    focusEditor();
    document.execCommand('fontSize', false, '7');
    if (editorRef.current) {
      const fontElements = editorRef.current.querySelectorAll('font[size="7"]');
      fontElements.forEach((el) => {
        el.removeAttribute('size');
        (el as HTMLElement).style.fontSize = value;
      });
    }
    syncFromEditor();
  };

  const handleLink = () => {
    const url = window.prompt('Enter URL:', 'https://');
    if (url) exec('createLink', url);
  };

  const handleUnlink = () => exec('unlink');

  const handleClearFormatting = () => exec('removeFormat');

  const handleSpecialChar = () => exec('insertText', '…');

  const handleHorizontalRule = () => exec('insertHorizontalRule');

  const handleTextColor = () => {
    const color = window.prompt('Enter a color (name or hex):', '#000000');
    if (color) exec('foreColor', color);
  };

  const switchToText = () => {
    if (editorRef.current) setTextValue(editorRef.current.innerHTML);
    setMode('text');
  };

  const switchToVisual = () => {
    onChange(textValue);
    setMode('visual');
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      {/* Top bar: Add Media / Add Form (stubs) + Visual/Text tabs */}
      <div className="flex items-center justify-between px-2 py-1.5 bg-gray-50 border-b border-gray-300 flex-wrap gap-2">
        <div className="flex gap-2">
          <button type="button" className={btnCls} disabled>
            🖼️ Add Media
          </button>
          <button type="button" className={btnCls} disabled>
            📋 Add Form
          </button>
        </div>
        <div className="flex rounded-md border border-gray-300 overflow-hidden text-sm font-medium">
          <button
            type="button"
            onClick={switchToVisual}
            className={`px-4 py-1 cursor-pointer ${
              mode === 'visual' ? 'bg-white text-gray-900' : 'bg-gray-100 text-gray-500'
            }`}
          >
            Visual
          </button>
          <button
            type="button"
            onClick={switchToText}
            className={`px-4 py-1 cursor-pointer border-l border-gray-300 ${
              mode === 'text' ? 'bg-white text-gray-900' : 'bg-gray-100 text-gray-500'
            }`}
          >
            Text
          </button>
        </div>
      </div>

      {mode === 'visual' && (
        <>
          {/* Menu row: File / Edit / View / Insert / Format / Tools / Table (visual stubs) */}
          <div className="flex flex-wrap gap-4 px-3 py-1.5 bg-gray-50 border-b border-gray-300 text-sm text-gray-600">
            {['File', 'Edit', 'View', 'Insert', 'Format', 'Tools', 'Table'].map((m) => (
              <span key={m} className="flex items-center gap-1 cursor-default select-none">
                {m} <span className="text-[10px]">▾</span>
              </span>
            ))}
          </div>

          {/* Row 1: paragraph style, bold/italic/quote, lists, align, link/unlink, undo/redo */}
          <div className="flex flex-wrap items-center gap-1.5 px-2 py-1.5 border-b border-gray-200">
            <select
              value={paragraphStyle}
              onChange={(e) => handleParagraphStyle(e.target.value)}
              className={selectCls}
            >
              {PARAGRAPH_STYLES.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>

            <button type="button" onClick={() => exec('bold')} className={`${btnCls} font-bold`}>
              B
            </button>
            <button type="button" onClick={() => exec('italic')} className={`${btnCls} italic`}>
              I
            </button>
            <button type="button" onClick={() => exec('formatBlock', '<blockquote>')} className={btnCls}>
              " "
            </button>
            <button type="button" onClick={() => exec('insertUnorderedList')} className={btnCls}>
              • List
            </button>
            <button type="button" onClick={() => exec('insertOrderedList')} className={btnCls}>
              1. List
            </button>
            <button type="button" onClick={() => exec('justifyLeft')} className={btnCls}>
              ⯇
            </button>
            <button type="button" onClick={() => exec('justifyCenter')} className={btnCls}>
              ☰
            </button>
            <button type="button" onClick={() => exec('justifyRight')} className={btnCls}>
              ⯈
            </button>
            <button type="button" onClick={handleLink} className={btnCls}>
              🔗
            </button>
            <button type="button" onClick={handleUnlink} className={btnCls}>
              ⛔🔗
            </button>
            <button type="button" onClick={() => exec('undo')} className={btnCls}>
              ↶
            </button>
            <button type="button" onClick={() => exec('redo')} className={btnCls}>
              ↷
            </button>
          </div>

          {/* Row 2: font family, font size, indent/outdent, clear formatting, special char, hr, text color, table, help */}
          <div className="flex flex-wrap items-center gap-1.5 px-2 py-1.5 border-b border-gray-300">
            <select
              value={fontFamily}
              onChange={(e) => handleFontFamily(e.target.value)}
              className={selectCls}
              style={{ maxWidth: '150px' }}
            >
              {FONT_FAMILIES.map((f) => (
                <option key={f.label} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>

            <select
              value={fontSize}
              onChange={(e) => handleFontSize(e.target.value)}
              className={selectCls}
            >
              {FONT_SIZES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <button type="button" onClick={() => exec('indent')} className={btnCls} title="Indent">
              ➡︎¶
            </button>
            <button type="button" onClick={() => exec('outdent')} className={btnCls} title="Outdent">
              ⬅︎¶
            </button>
            <button type="button" onClick={handleClearFormatting} className={btnCls} title="Clear formatting">
              🧹
            </button>
            <button type="button" onClick={handleSpecialChar} className={btnCls} title="Special character">
              Ω
            </button>
            <button type="button" onClick={handleHorizontalRule} className={btnCls} title="Horizontal rule">
              ▬
            </button>
            <button type="button" onClick={handleTextColor} className={btnCls} title="Text color">
              A▾
            </button>
            <button type="button" className={btnCls} disabled title="Insert table (not available)">
              ⊞▾
            </button>
            <button type="button" className={btnCls} disabled title="Help">
              ❓
            </button>
          </div>

          {/* Editable content area */}
          <div
            ref={editorRef}
            contentEditable
            onInput={syncFromEditor}
            onBlur={syncFromEditor}
            className="p-3 min-h-[220px] outline-none text-sm leading-relaxed"
            data-placeholder={placeholder}
            suppressContentEditableWarning
          />
        </>
      )}

      {mode === 'text' && (
        <textarea
          value={textValue}
          onChange={(e) => setTextValue(e.target.value)}
          onBlur={() => onChange(textValue)}
          className="w-full p-3 min-h-[280px] outline-none text-sm font-mono leading-relaxed resize-y"
          placeholder={placeholder}
        />
      )}
    </div>
  );
};

export default RichTextEditor;