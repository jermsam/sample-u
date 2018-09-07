import React,{Component} from 'react'
import {Comment, Icon,Container,Confirm} from 'semantic-ui-react'
import PropTypes from 'prop-types'
import Image from 'react-graceful-image'
import moment from 'moment'
import faker from 'faker'
import {client,imghost} from '../../../../feathers'
import EditReplyField from './EditReplyField'

export default class ReplyWidget extends Component{
    state={
        
        open4Delete: false,
        open4Edit:false,
    }  

    componentDidMount(){
        const {reply}=this.props
        this.setState({data:reply})
    }

    onChange = (e, { name,value }) => this.setState((prevState)=>({
        data:{
          ...prevState.data,
         [name]:value
        }
       }));

       handleSaveChanges = () => {
        const {data}=this.state
        client.service('replies').patch(data.id,{...data}).then(
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
       client.service('replies').patch(id,{likes:likes+1});
     }

     handleEdit = () => this.setState({ open4Edit: true })

     handleDelete = () => this.setState({ open4Delete: true })

     handleConfimedDelete=()=>{
        const {data:{id}} =this.state
        client.service('replies').remove(id).then(
            ()=>this.setState({ open4Delete: false }) 
         )
    }

    handleClose=()=>this.setState({ open4Delete: false }) 

    handleAddedFile = file =>{
        // We want to upload
      const uploadService = client.service('uploads'); 
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
       const uploadService = client.service('uploads'); 
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
        const{reply}=this.props
        this.setState({ 
            data:reply,
            id:'',
            open4Delete: false,
            open4Edit:false,
        })
    }

    render(){
        const {data,open4Delete,open4Edit,}=this.state
        const {reply:{createdAt,message,likes,image,user:{id,firstname,lastname,avatar}},authUser} =this.props 
        const src = (avatar) ? `${imghost}/${avatar}`:faker.internet.avatar();
        return <div>
        
            <Comment style={{backgroundColor:'#f2f2f2'}}>
          <Comment.Avatar src={src} />
          <Comment.Content>
            <Comment.Author as='a'>{`${firstname} ${lastname}`}</Comment.Author>
            <Comment.Metadata>
              <div>{moment(createdAt).fromNow()}</div>
            </Comment.Metadata>
                    <Comment.Text>{message}</Comment.Text>
                    <Container textAlign='center'>
                    {image &&
                    <Image src={`${imghost}/${image}`} 
                    width="100%"
                    height="auto"
                    style={{padding: '10px'}}
                    alt="reply image"
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
              
          
            </Comment.Actions>
          </Comment.Content>
        </Comment>
            <Confirm
          header='Delete reply'
          content='Are you sure you want to delete this reply?'
          open={open4Delete}
          confirmButton="Delete"
          cancelButton="cancel"
          onCancel={this.handleClose}
          onConfirm={this.handleConfimedDelete}
          size='small'
        />
        <EditReplyField 
        reply={data}
        {...{open4Edit}} 
        handleDiscardChanges={this.handleDiscardChanges} 
        handleSaveChanges={this.handleSaveChanges}
        onChange={this.onChange}
        handleAddedFile={this.handleAddedFile}
        handleRemovedFile={this.handleRemovedFile}
        />
       </div>
    }
}

ReplyWidget.propTypes={
    authUser:PropTypes.shape({}).isRequired,
    reply:PropTypes.shape({}).isRequired
}