import React from 'react'
import {Container,Divider,Icon,Statistic} from 'semantic-ui-react'
import Image from 'react-graceful-image'
import PropTypes from 'prop-types'
import {bucket} from '../../feathers'


const PostBody =({post:{message,image,likes,shares,}})=>
<Container textAlign='justified'>
<Divider hidden/>

{message}

    <Container textAlign='center'>
    {image &&
    <Image src={`${bucket}/${image}`} 
    width="100%"
    height="auto"
    style={{padding: '20px'}}
    alt="post image"
    retry={{count: 15, delay: 3, accumulate: 'add'}}
    />
    }
    </Container>
    
    <Container textAlign='center'>
   
    <Statistic.Group widths='four'>
    <Statistic size='mini'>
      <Statistic.Value>
      <Icon name='like' size='mini' color='red' />
        
      </Statistic.Value>
      <Statistic.Label> {likes} Likes</Statistic.Label>
    </Statistic>
    <Statistic size='mini'>
    <Statistic.Value>
    <Icon name='share' size='mini' color='green' />
      
    </Statistic.Value>
    <Statistic.Label>{shares} Shares</Statistic.Label>
  </Statistic>
  </Statistic.Group>
      </Container>
      <Divider section hidden/>
</Container>
;

PostBody.propTypes={
    post:PropTypes.shape({}).isRequired
}

export default PostBody;