import React from 'react'
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js'
import { css } from 'glamor'
import { createElement } from 'glamor/react'
import { Block, Flex } from 'glamor/jsxstyle'
// import DWEditor from './Editor'
import RichEditor from './RichEditor'
import Button from './Button'
import uuid from 'uuid/v4'
import format from 'date-fns/format'
import 'level.css'

/* @jsx createElement */

const sharedStyle = css({
  padding: 8
})

const outputStyle = css({
  color: '#00A5DD',
  flex: 0,
  fontSize: 12,
  wordBreak: 'break-all'
})

const listStyle = css({
  listStyle: 'none inside',
  marginBottom: 32
})

const metaStyle = css({
  fontSize: 12,
  opacity: 0.5
})

const listItemStyle = css({
  cursor: 'pointer',
  '&:not(:first-of-type)': {
    paddingTop: 8
  },
  '&:not(:last-of-type)': {
    paddingBottom: 8,
    borderBottom: '1px solid #CCC'
  }
})

const Item = ({ post, onClick }) => (
  <li className={css(listItemStyle)}>
    <h4 onClick={() => onClick(post)}>{post.title}</h4>
    <span className={css(metaStyle)}>{format(post.date, 'hh:mm A | dddd MMM D, YYYY')}</span>
  </li>
)

export default class Draft extends React.Component {
  state = {
    editorState: EditorState.createEmpty(),
    posts: [],
    error: false,
    selectedPost: {},
    selection: false
  }

  componentWillMount () {
    this.getPosts()
  }

  getPosts = () => {
    fetch('/posts')
      .then(res => res.json())
      .then(data => this.setState({ posts: data, error: false }))
      .catch(err => this.setState({ error: true }, console.error(err)))
  }

  onUpdate = () => {
    const { title, id } = this.state.selectedPost
    const ContentState = this.state.editorState.getCurrentContent()

    const body = JSON.stringify({
      title,
      id,
      content: convertToRaw(ContentState),
      date: new Date()
    })

    fetch(`/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body
    })
      .then(console.log)
      .then(() => console.log(body))
      .then(() => this.getPosts())
  }

  onSave = () => {
    const ContentState = this.state.editorState.getCurrentContent()
    const title = uuid()
    const body = JSON.stringify({
      title,
      content: convertToRaw(ContentState),
      date: new Date()
    })

    fetch('/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body
    })
      .then(console.log)
      .then(() => this.getPosts())
      .then(() => this.state.posts)
      .then(() => console.log(body))

    // const postsFinder = (title) => {
    //   this.state.posts.find((p) => {
    //     if (p.title === title) {
    //       this.onSelect(p)
    //     } else {
    //       console.log(p)
    //     }
    //   })
    // }
  }

  onSelect = (p) => this.setState({
    selection: true,
    selectedPost: p,
    editorState: EditorState.createWithContent(convertFromRaw(p.content))
  })

  onChange = editorState => this.setState({ editorState })

  render() {
    const { selection, editorState, posts, selectedPost } = this.state
    const ContentState = this.state.editorState.getCurrentContent()

    return (
      <Flex height="100%" fontFamily="Operator Mono">
        <Block flex={1} className={css(sharedStyle)}>
          <ul css={{ borderTop: '1px solid red' }} className={css(listStyle)}>
            {
              posts.length > 0 && posts.map(
                (p, i) => <Item onClick={() => this.onSelect(p)} post={p} key={i} />
              )
            }
          </ul>

          <Block className={css(outputStyle)}>
            {
              JSON.stringify(convertToRaw(ContentState))
            }
          </Block>
        </Block>
        <Block flex={4} className={css(sharedStyle)}>
          <Flex marginBottom={16} alignItems='center' justifyContent='space-between'>
            <h1>{selection ? selectedPost.title : 'New Post'}</h1>
            {
              !selection
              ? <Button onClick={() => this.onSave()}>Save</Button>
              : <Button onClick={() => this.onUpdate()}>Update</Button>
            }
          </Flex>
          <RichEditor
            editorState={editorState}
            onChange={this.onChange}
          />
        </Block>
      </Flex>
    )
  }
}
