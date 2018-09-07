import React,{Component} from 'react'
import {Label,Dropdown,Confirm} from 'semantic-ui-react'
import PropTypes from 'prop-types'
import {client} from '../../feathers'
import EditPostField from './EditPostField'
import CommentField from './comments/CommentField'

const colors = [
    'olive',
    'green',
    'teal',
  ]

export default class PostMenu extends Component{
    state={
        post:{message:''},
        id:'',
        open4Delete: false,
        open4Edit:false,
        open4Comment:false,
    }

    componentDidMount(){
        const {post}=this.props
        this.setState({post,id:post.image})
    }

    onChange = (e, { name,value }) => this.setState((prevState)=>({
        post:{
          ...prevState.post,
         [name]:value
        }
       }));

    handleSaveChanges = () => {
    const {post}=this.state
    client.service('posts').patch(post.id,{...post}).then(
        ()=>this.setState({ 
            post,
            id:'',
            open4Delete: false,
            open4Edit:false,
        })
    )
    }   

    handleLike =()=>{
       const {post:{id,likes}} =this.state
       client.service('posts').patch(id,{likes:likes+1})
    }

    handleEdit = () => this.setState({ open4Edit: true })
    

    handleComment = () => {
        const {open4Comment}=this.state
        this.setState({ open4Comment: true })
        console.log(open4Comment)
    }

    handleAddedFile = file =>{
        // We want to upload
      const uploadService = client.service('uploads'); 
      const reader = new window.FileReader()
      reader.readAsDataURL(file)
      reader.onload = () =>uploadService.on('created',
                                      uploadService.create({uri:reader.result})
                                      .then(({id})=>this.setState((prevState)=>({
                                          id,
                                        post:{
                                          ...prevState.post,
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
            post:{
              ...prevState.post,
              image:null
            }
           }))
        ).catch(
          ()=>console.log(file, ' delete failed')
        )
       
      }

    handleDiscardChanges = () => {
        const{post}=this.props
        this.setState({ 
            post,
            id:'',
            open4Delete: false,
            open4Edit:false,
            open4Comment:false,
        })
    }
    

    handleDelete = () => this.setState({ open4Delete: true })

    handleConfimedDelete=()=>{
        const {post:{id}} =this.state
        client.service('posts').remove(id).then(
            ()=>this.setState({ open4Delete: false }) 
         )
    }

    handleClose=()=>this.setState({ open4Delete: false }) 
    

 
    render(){
        const {open4Delete,post,open4Edit,open4Comment}=this.state
        
       const{authUser}=this.props

        return <div>
        <Dropdown
        trigger={<div>{colors.map(color => <Label size='mini' circular color={color} empty key={color} />)}</div>}
        icon={null}
        pointing='top right'
        >
            <Dropdown.Menu>
              <Dropdown.Item icon='like' text='like post' onClick={this.handleLike}/>
              <Dropdown.Item icon='share' text='share post'/>
              <Dropdown.Item icon='comment' text='comment on post' onClick={this.handleComment}/>
              {post&&(authUser.id===post.userId)&&<Dropdown.Divider />}
              {post&&(authUser.id===post.userId)&&
                <Dropdown.Item icon='edit outline' text='edit post' onClick={this.handleEdit}/>}
              {post&&(authUser.id===post.userId)&&
                <Dropdown.Item icon='delete' text='delete post' onClick={this.handleDelete}/>}
            </Dropdown.Menu>
          </Dropdown>
          <Confirm
          header='Delete Post'
          content='This will be removed from your timeline. You can edit this post if you want to change something.'
          open={open4Delete}
          confirmButton="Delete"
          cancelButton="Edit"
          onCancel={this.handleClose}
          onConfirm={this.handleConfimedDelete}
          size='small'
        />
        <EditPostField 
        {...{post}} 
        {...{open4Edit}} 
        handleDiscardChanges={this.handleDiscardChanges} 
        handleSaveChanges={this.handleSaveChanges}
        onChange={this.onChange}
        handleAddedFile={this.handleAddedFile}
        handleRemovedFile={this.handleRemovedFile}
        />
        <CommentField
        {...{authUser}}
        {...{post}} 
        {...{open4Comment}} 
        handleDiscardChanges={this.handleDiscardChanges} 
        />
          </div>
    }

}
PostMenu.propTypes={
    authUser:PropTypes.shape({}),
    post:PropTypes.shape({}).isRequired
}

PostMenu.defaultProps={
    authUser:null
  }