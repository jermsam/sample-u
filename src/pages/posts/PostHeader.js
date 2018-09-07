import React from 'react'
import {Grid,Container,Feed,Header,} from 'semantic-ui-react'
import PropTypes from 'prop-types'
import moment from 'moment'
import faker from 'faker'
import PostMenu from './PostMenu'
import {imghost} from '../../feathers'

function PostHeader({post,authUser}){
  const src = (post.user.avatar) ? `${imghost}/${post.user.avatar}`:faker.internet.avatar();
 return (
<Grid columns={2} verticalAlign='middle'>
<Grid.Column width={14}>
<Container>
<Feed>
    <Feed.Event>
      <Feed.Label image={src} />
      <Feed.Content>
        <Feed.Summary>
          <Header>{`${post.user.firstname} ${post.user.lastname}`}</Header>.
        </Feed.Summary>
        <Feed.Date>{moment(post.createdAt).fromNow()}</Feed.Date>
      </Feed.Content>
    </Feed.Event>
  </Feed>
</Container>
</Grid.Column>
<Grid.Column width={2}>

<PostMenu {...{post}} {...{authUser}}/>

</Grid.Column>
</Grid>
);
}

PostHeader.propTypes={
  authUser:PropTypes.shape({}),
    post:PropTypes.shape({}).isRequired
}
PostHeader.defaultProps={
  authUser:null
}

export default PostHeader;