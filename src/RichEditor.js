import Draft from 'draft-js'
import React from 'react'

import { css } from 'glamor'
import { Flex } from 'glamor/jsxstyle'
import { createElement } from 'glamor/react'

require('./RichEditor.css')

/* @jsx createElement */

const editorStyle = css({
  padding: 16,
  background: 'white',
  height: '100%',
  boxShadow: '0 -1px 0 #e0e0e0, 0 0 2px rgba(0,0,0,.12), 0 2px 4px rgba(0,0,0,.24)',
  width: '100%'
})

const { Editor, RichUtils } = Draft

export default class RichEditor extends React.Component {
  constructor(props) {
    super(props)
    this.state = { editorState: this.props.editorState }
    this.focus = () => this.refs.editor.focus()
    this.onChange = editorState => this.props.onChange(editorState)
    this.handleKeyCommand = this._handleKeyCommand.bind(this)
    this.onTab = this._onTab.bind(this)
    this.toggleBlockType = this._toggleBlockType.bind(this)
    this.toggleInlineStyle = this._toggleInlineStyle.bind(this)
  }
  _handleKeyCommand(command, editorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command)
    if (newState) {
      this.onChange(newState)
      return true
    }
    return false
  }
  _onTab(e) {
    const maxDepth = 4
    this.onChange(RichUtils.onTab(e, this.props.editorState, maxDepth))
  }
  _toggleBlockType(blockType) {
    this.onChange(RichUtils.toggleBlockType(this.props.editorState, blockType))
  }
  _toggleInlineStyle(inlineStyle) {
    this.onChange(
      RichUtils.toggleInlineStyle(this.props.editorState, inlineStyle)
    )
  }
  render() {
    const { editorState } = this.props
    // If the user changes block type before entering any text, we can
    // either style the placeholder or hide it. Let's just hide it now.
    let className = 'RichEditor-editor'
    var contentState = editorState.getCurrentContent()
    if (!contentState.hasText()) {
      if (contentState.getBlockMap().first().getType() !== 'unstyled') {
        className += ' RichEditor-hidePlaceholder'
      }
    }

    return (
      <div className='OuterEditor' style={{ height: '100%' }}>
        <ToolBar
          editorState={editorState}
          onToggleInlineStyle={this.toggleInlineStyle} onToggleBlockType={this.toggleBlockType}
        />
        <div className={`${css(editorStyle)} ${className}`} onClick={this.focus}>
          <Editor
            blockStyleFn={getBlockStyle}
            customStyleMap={styleMap}
            editorState={editorState}
            handleKeyCommand={this.handleKeyCommand}
            onChange={this.onChange}
            onTab={this.onTab}
            placeholder="Tell a story..."
            ref="editor"
            spellCheck={true}
          />
        </div>
      </div>
    )
  }
}


// Custom overrides for "code" style.
const styleMap = {
  CODE: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: 'Input Mono, "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2
  }
}

function getBlockStyle(block) {
  switch (block.getType()) {
    case 'blockquote':
      return 'RichEditor-blockquote'
    default:
      return null
  }
}

class StyleButton extends React.Component {
  constructor() {
    super()
    this.onToggle = e => {
      e.preventDefault()
      this.props.onToggle(this.props.style)
    }
  }
  render() {
    let className = 'RichEditor-styleButton'
    if (this.props.active) {
      className += ' RichEditor-activeButton'
    }
    return (
      <span css={{ flex: 1 }} className={className} onMouseDown={this.onToggle}>
        {this.props.label}
      </span>
    )
  }
}
const BLOCK_TYPES = [
  { label: 'H1', style: 'header-one' },
  { label: 'H2', style: 'header-two' },
  { label: 'H3', style: 'header-three' },
  { label: 'H4', style: 'header-four' },
  { label: 'H5', style: 'header-five' },
  { label: 'H6', style: 'header-six' },
  { label: 'Blockquote', style: 'blockquote' },
  { label: 'UL', style: 'unordered-list-item' },
  { label: 'OL', style: 'ordered-list-item' },
  { label: 'Code Block', style: 'code-block' }
]


const BlockStyleControls = props => {
  const { editorState } = props
  const selection = editorState.getSelection()
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType()
  return (
    <Flex width={props.width} className="RichEditor-controls">
      {BLOCK_TYPES.map(type => (
        <StyleButton
          key={type.label}
          active={type.style === blockType}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}

        />
      ))}
    </Flex>
  )
}

var INLINE_STYLES = [
  { label: 'Bold', style: 'BOLD' },
  { label: 'Italic', style: 'ITALIC' },
  { label: 'Underline', style: 'UNDERLINE' },
  { label: 'Monospace', style: 'CODE' }
]

const InlineStyleControls = ({ editorState, onToggle, width }) => {
  const currentStyle = editorState.getCurrentInlineStyle()
  return (
    <Flex width={width} className='RichEditor-controls'>
      {INLINE_STYLES.map(({ style, label }) => (
        <StyleButton
          key={label}
          active={currentStyle.has(style)}
          label={label}
          onToggle={onToggle}
          style={style}
        />
      ))}
    </Flex>
  )
}

const toolBarStyle = css({

})

const ToolBar = ({ editorState, onToggleBlockType, onToggleInlineStyle }) => (
  <Flex className={css(toolBarStyle)}>
    <BlockStyleControls
      width='50%'
      editorState={editorState}
      onToggle={onToggleBlockType}
    />
    <InlineStyleControls
      width='50%'
      editorState={editorState}
      onToggle={onToggleInlineStyle}
    />
  </Flex>
)
