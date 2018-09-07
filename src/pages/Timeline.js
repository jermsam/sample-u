import React from 'react'
import {Container,Grid} from 'semantic-ui-react'
import {PostCase,WithPosts,PostField} from './posts'
import {AuthConsumer} from '../AuthContext'
import UserDetails from './UserDetails'

const Timeline = () =>(
    <AuthConsumer> 
           {
            ({authUser})=>
    <Container text textAlign='justified'>
        <Grid columns={3}>
        <Grid.Column width={5}>
        <UserDetails {...{authUser}}/>
        </Grid.Column>
            <Grid.Column width={10}>
           
            <div>
            <PostField {...{authUser}}/>
            <WithPosts
            render={
                ({posts})=>posts.map(post=><PostCase key={post.id} {...{post}} {...{authUser}} />)
            }
            />
            </div>
         
            </Grid.Column>
        </Grid>
    </Container>
}   
</AuthConsumer>
)

export default Timeline
