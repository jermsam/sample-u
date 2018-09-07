import React,{Component} from 'react'
import {Comment,Header,} from 'semantic-ui-react'
import PropTypes from 'prop-types'
import CommentWidget from './comments/CommentWidget'
import {client} from '../../feathers'



class PostFooter extends Component{
    state={
        comments:[],
    }

componentDidMount(){
   const {post:{id}}=this.props
    
    this.fetchFromRemote(id);

  client.service('comments').on('created',()=>this.fetchFromRemote(id));
  client.service('comments').on('patched',()=>this.fetchFromRemote(id));
  client.service('comments').on('removed',()=>this.fetchFromRemote(id));
  client.service('users').on('patched',()=>this.fetchFromRemote(id))
}

    
componentWillUnmount() {
    this.setState({ comments: [] })
}    
    

fetchFromRemote =(id)=>client.service('comments').find({
    query: {
        postId:id,
          $sort: {
              createdAt: 1 // sort them by price descending
            }
         }
    }).then(
        ({ data})=>{
           // if(this._isMounted)
            this.setState({comments:data})
        }
)

    render(){
        const{comments}=this.state
        const {authUser}=this.props
        return(
            <div style={{textAlign:'justified',backgroundColor: '#e3eaf3e3', margin:'-1em', padding:'1.2em'}}>
            {
            <Comment.Group>
                <Header as='h3' dividing>
                Comments
                </Header>
            {comments.map((comment)=>
                <CommentWidget key={comment.id} {...{comment}} {...{authUser}}/>)}
            </Comment.Group>
            }
            </div>
        )
    }
} 

PostFooter.propTypes={
    authUser:PropTypes.shape({}).isRequired,
    post:PropTypes.shape({}).isRequired
}


export default PostFooter;