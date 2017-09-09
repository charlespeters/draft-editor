import { createElement as h } from 'react'
import { css } from 'glamor'

const btnSty = css({
  fontFamily: 'inherit',
  fontSize: 16,
  fontStyle: 'italic',
  appearance: 'none',
  backgroundColor: '#ffba00',
  color: '#093750',
  border: 0,
  paddingTop: 8,
  paddingBottom: 8,
  paddingLeft: 16,
  paddingRight: 16,
  lineHeight: 1,
  borderRadius: 8,
  '&:hover': {
    backgroundColor: '#ffd973'
  },
  '&:focus': {
    backgroundColor: '#fc7753'
  }
})

export default ({ onClick, children }) => h('button', {
  className: css(btnSty),
  onClick
}, children)
