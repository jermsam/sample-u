import React from 'react'
import {Container,Segment,Divider} from 'semantic-ui-react'
import PropTypes from 'prop-types'
import PostHeader from './PostHeader'
import PostBody from './PostBody'
import PostFooter from './PostFooter'


const PostCase =({post,authUser})=><Container text textalign='center'>
<Divider section hidden/>
<Segment raised>
<PostHeader {...{post}} {...{authUser}}/>
<PostBody {...{post}}/>
<PostFooter {...{authUser}} {...{post}}/>
</Segment>
<Divider section hidden/>
</Container>;

PostCase.propTypes={
    authUser:PropTypes.shape({}),
    post:PropTypes.shape({}).isRequired
}

PostCase.defaultProps={
    authUser:null
  }

export default PostCase;