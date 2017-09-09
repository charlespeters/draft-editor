import { createElement as h, Component } from 'react'
import { Editor } from 'draft-js'
import { css } from 'glamor'
import './Editor.css'

const editorStyle = css({
  padding: 16,
  background: 'white',
  height: '100%',
  boxShadow: '0 -1px 0 #e0e0e0, 0 0 2px rgba(0,0,0,.12), 0 2px 4px rgba(0,0,0,.24)',
  width: '100%'
})

const Wrapper = ({ children }) => h(
  'article',
  {
    className: css(editorStyle)
  },
  children
)

export default class extends Component {
  render () {
    return h(Wrapper, {}, h(Editor, { ...this.props }))
  }
}
