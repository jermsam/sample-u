import React,{Component} from 'react'
import {Comment, Icon,Container,Confirm,Header} from 'semantic-ui-react'
import PropTypes from 'prop-types'
import Image from 'react-graceful-image'
import moment from 'moment'
import faker from 'faker'
import {app,bucket} from '../../../feathers'
import EditCommentField from './EditCommentField'
import ReplyField from './replies/ReplyField'
import ReplyWidget from './replies/ReplyWidget'

export default class CommentWidget extends Component{
    state={
        replies:[],
        open4Delete: false,
        open4Edit: false,
        open4Reply:false,
    }  

    componentDidMount(){
        const {comment}=this.props
        this.setState({ data: comment })
        const {id}=comment
        this.fetchFromRemote(id);

  app.service('replies').on('created',()=>this.fetchFromRemote(id));
  app.service('replies').on('patched',()=>this.fetchFromRemote(id));
  app.service('replies').on('removed',()=>this.fetchFromRemote(id));
  app.service('users').on('patched',()=>this.fetchFromRemote(id))
    }

    fetchFromRemote =(id)=>app.service('replies').find({
        query: {
            commentId:id,
              $sort: {
                  createdAt: 1 // sort them by price descending
                }
             }
        }).then(
            ({ data})=>{
               // if(this._isMounted)
                this.setState({replies:data})
            }
         )
    

    onChange = (e, { name,value }) => this.setState((prevState)=>({
        data:{
          ...prevState.data,
         [name]:value
        }
       }));

       handleSaveChanges = () => {
        const {data}=this.state
        app.service('comments').patch(data.id,{...data}).then(
            ()=>this.setState({ 
                data,
                id:'',
                open4Delete: false,
                open4Edit:false,
            })
        )
        }      

    handleLike =()=>{
        const {data:{id,likes}} =this.state
       console.log(id," : ",likes);
       app.service('comments').patch(id,{likes:likes+1});
     }

     handleEdit = () => this.setState({ open4Edit: true })

    handleDelete = () => this.setState({ open4Delete: true })
    
    handleReply = () => {
        const {open4Reply}=this.state
        this.setState({ open4Reply: true })
        console.log(open4Reply)
    }

     handleConfimedDelete=()=>{
        const {data:{id}} =this.state
        app.service('comments').remove(id).then(
            ()=>this.setState({ open4Delete: false }) 
         )
    }

    handleClose=()=>this.setState({ open4Delete: false }) 

    handleAddedFile = file =>{
        // We want to upload
      const uploadService = app.service('uploads'); 
      const reader = new window.FileReader()
      reader.readAsDataURL(file)
      reader.onload = () =>uploadService.on('created',
                                      uploadService.create({uri:reader.result})
                                      .then(({id})=>this.setState((prevState)=>({
                                          id,
                                        data:{
                                          ...prevState.data,
                                          image:id
                                        }
                                       })))
                                      ) 
      reader.onerror = (error) =>  console.error('Base 64 Error: ', error)          
      }
      
      handleRemovedFile = (file) =>{
       const uploadService = app.service('uploads'); 
        const {id}= this.state 
        uploadService.remove(id).then(
          ()=>this.setState((prevState)=>({
              id:'',
            data:{
              ...prevState.data,
              image:null
            }
           }))
        ).catch(
          ()=>console.log(file, ' delete failed')
        )
       
      }

      handleDiscardChanges = () => {
        const{comment}=this.props
        this.setState({ 
            data:comment,
            id:'',
            open4Delete: false,
            open4Edit: false,
            open4Reply:false,
        })
    }

    render(){
        const {data,open4Delete,open4Edit,open4Reply,replies}=this.state
        const {comment:{createdAt,message,likes,image,user:{id,firstname,lastname,avatar}},authUser} =this.props 
        const src = (avatar) ? `${bucket}/${avatar}`:faker.internet.avatar();
        return <div>
        <Comment>
              <Comment.Avatar src={src} />
              <Comment.Content>
                <Comment.Author as='a'>{`${firstname} ${lastname}`}</Comment.Author>
                <Comment.Metadata>
                  <div>{moment(createdAt).fromNow()}</div>
                </Comment.Metadata>
                <Comment.Text>{message}</Comment.Text>
                <Container textAlign='center'>
                    {image &&
                    <Image src={`${bucket}/${image}`} 
                    width="100%"
                    height="auto"
                    style={{padding: '10px'}}
                    alt="comment image"
                    retry={{count: 15, delay: 3, accumulate: 'add'}}
                    />
                    }
                </Container>
                <Comment.Actions>
                  <Comment.Action onClick={this.handleLike}>
                  { <span><Icon name='like' color='red' /> {likes} likes</span>}
                  </Comment.Action>
                  
                  <Comment.Action onClick={this.handleEdit}>
                  {authUser.id===id && <span><Icon name='edit'/> edit </span>}
                  </Comment.Action>
                    
                    
                  <Comment.Action onClick={this.handleDelete}>
                  {authUser.id===id &&<span><Icon name='delete'/> delete </span>}
                </Comment.Action>
                  
                    <Comment.Action onClick={this.handleReply}>Reply</Comment.Action>
                    
                </Comment.Actions>
                </Comment.Content>
                <div style={{textAlign:'justified',backgroundColor: '#e3eaf3e3', margin:'-1em', padding:'1.2em'}}>
            {
            <Comment.Group>
                <Header as='h5' dividing>
                Replies
                </Header>
            {replies.map((reply)=>
                <ReplyWidget key={reply.id} {...{reply}} {...{authUser}}/>)}
            </Comment.Group>
            }
            </div>  
            </Comment>
            
            <Confirm
          header='Delete comment'
          content='Are you sure you want to delete this comment?'
          open={open4Delete}
          confirmButton="Delete"
          cancelButton="cancel"
          onCancel={this.handleClose}
          onConfirm={this.handleConfimedDelete}
          size='small'
        />
        <EditCommentField 
        comment={data}
        {...{open4Edit}} 
        handleDiscardChanges={this.handleDiscardChanges} 
        handleSaveChanges={this.handleSaveChanges}
        onChange={this.onChange}
        handleAddedFile={this.handleAddedFile}
        handleRemovedFile={this.handleRemovedFile}
            />
            <ReplyField
            {...{authUser}}
            comment={data}
            {...{open4Reply}} 
            handleDiscardChanges={this.handleDiscardChanges} 
            />    
       </div>
    }
}

CommentWidget.propTypes={
    authUser:PropTypes.shape({}).isRequired,
    comment:PropTypes.shape({}).isRequired
}