import React,{Component} from 'react'
import {Container,Segment, Form, TextArea,Button,Confirm } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import DropzoneComponent from 'react-dropzone-component'
import {client} from '../../feathers'

const componentConfig = {
  iconFiletypes: ['.jpg', '.png', '.gif'],
  showFiletypeIcon: true,
  postUrl: 'no-url'
};

const djsConfig = { 
  maxFiles:1,
  maxFilesize:2,
  autoDiscover : false, // Disabling autoDiscover, otherwise Dropzone will try to attach twice
  autoProcessQueue: false,
  addRemoveLinks: true,
  acceptedFiles: "image/jpeg,image/png,image/gif",
  dictDefaultMessage:'Drop an image for this story or click here to upload one',
  dictFileTooBig:'Kindly compress to atmost 2 MB',
  dictInvalidFileType:'Kindly stick to valid image types',
  dictCancelUpload:'Cancel upload',
  dictRemoveFile:'Remove image'
}

class PostField extends Component{

  state={
    id:'',
    open: false,
    showUploadDropzone:false,
    myDropzone:null,
      post:null,
  }
  
  

  onChange = (e, { name,value }) => this.setState((prevState)=>({
    post:{
      ...prevState.post,
     [name]:value
    }
   }));

  onSubmit = () =>{
    const {post}=this.state
    const {authUser:{id}}=this.props
    if (post)
    client.service('posts').create({userId:id,...post}).then(
      ()=>this.setState({
        showUploadDropzone:false,
        myDropzone:null,
        post:null,
      })
    )
    else
    this.setState({ open: true })
  }

  handleClose = () => this.setState({ open: false })

  toggleShowUploadDropzone = (e) =>{
    this.setState(({showUploadDropzone})=>({showUploadDropzone:!showUploadDropzone}))
    e.preventDefault()
  }

  handleInnitializeDropzone=dropzone=>this.setState({myDropzone:dropzone})

  handleFileUploadProgress=(file,progress,bytesSent) =>{
    // do stuff as file uploads to server
    document.querySelector(".dz-success-mark").style.color = "orange";
    document.querySelector(".dz-error-mark").style.opacity = "0";
      console.log('progress ...:  ', progress, ' %');
      console.log('progress ...:  ', bytesSent, ' bytes uploaded');
  }
  
  handleSuccess = (file,response)=> {
    // do stuff after successful upload
    document.querySelector(".dz-success-mark").style.color = "green";
    document.querySelector(".dz-error-mark").style.opacity = "0";
    console.log('uploaded ...:  ', file);
    console.log('resulted ...:  ', response);
     
  }
  
  handleError = file => {
    // do stuff when error occurs
    document.querySelector(".dz-error-mark").style.opacity = "1";
    document.querySelector(".dz-error-mark").style.color = "red";
    document.querySelector(".dz-success-mark").style.opacity = "0";
    console.log('failed ...:  ', file);
  }
  
  handleCompleted = ()=>{
    const {myDropbox}=this.state
    if (myDropbox) {myDropbox.removeFile();}
  } 

  handleMaxFileExceeded = file =>{
    const {myDropzone}=this.state
  myDropzone.removeAllFiles();
myDropzone.addFile(file);
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

  render(){
  
   const {showUploadDropzone,post,open}=this.state
   
   const eventHandlers = { 
    init: this.handleInnitializeDropzone.bind(this),
    maxfilesexceeded: this.handleMaxFileExceeded.bind(this),
    addedfile:this.handleAddedFile.bind(this),
    uploadprogress: this.handleFileUploadProgress.bind(this),
    success: this.handleSuccess.bind(this),
    error: this.handleError.bind(this),
    complete:this.handleCompleted.bind(this),
    removedfile:this.handleRemovedFile.bind(this),
   }
    return (
      <Container text textalign='center'>
    <Segment>
    <Form onSubmit={this.onSubmit}>
      <TextArea name='message' value={post ? post.message:''} placeholder='Say something' autoHeight onChange={this.onChange}/>
      {showUploadDropzone && 
      <DropzoneComponent config={componentConfig} eventHandlers={eventHandlers} djsConfig={djsConfig} />
     }
     
      
      <Button.Group fluid>
      <Button color='olive' onClick={this.toggleShowUploadDropzone}>{
        showUploadDropzone? 'Hide photo dropzone' :'Show photo dropzone'
      }</Button>
      <Button color='teal'>Make Post</Button>
    </Button.Group>
    </Form>
    </Segment>
    <Confirm
          header='Post Is Empty'
          content='This post appears to be blank. Please write something or attach a photo to post.'
          open={open}
          confirmButton="Alright I got it"
          onCancel={this.handleClose}
          onConfirm={this.handleClose}
          size='small'
        />
    </Container>
    )
  }

}

PostField.propTypes={
  authUser:PropTypes.shape({}),
}

PostField.defaultProps={
  authUser:null
}


export default PostField