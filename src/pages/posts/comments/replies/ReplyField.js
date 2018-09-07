import React,{Component} from 'react'
import {Container, Form, TextArea,Confirm } from 'semantic-ui-react'
import DropzoneComponent from 'react-dropzone-component'
import PropTypes from 'prop-types'
import {client} from '../../../../feathers'

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

export default class ReplyField extends Component{

  state={
    open4Empty: false,
    myDropzone:null,
    reply:null,
  }
  
  onChange = (e, { name,value }) => this.setState((prevState)=>({
    reply:{
      ...prevState.reply,
     [name]:value
    }
   }));

  handleCloseEmpty = () => this.setState({ open4Empty: false })


  handleInnitializeDropzone=dropzone=>{
    this.setState({myDropzone:dropzone})
  }

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

handleSaveChanges=()=>{
  const {authUser}=this.props
  const{reply}=this.state
  const {comment:{id}}=this.props
 client.service('replies').create({userId:authUser.id,commentId:id,...reply}).then(
   ()=>this.handleClosereply()
 )
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
                                  reply:{
                                    ...prevState.reply,
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
     reply:{
        ...prevState.reply,
        image:null
      }
     }))
  ).catch(
    ()=>console.log(file, ' delete failed')
  )
 
}

handleClosereply=()=>{
  const {handleDiscardChanges}=this.props
  
  this.setState({
    open4Empty: false,
    myDropzone:null,
    reply:null,
  })
 handleDiscardChanges()
}

  render(){
  
   const {reply,open4Empty}=this.state
   const {open4Reply,}=this.props
   const eventHandlers = { 
    init: this.handleInnitializeDropzone.bind(this),
    maxfilesexceeded:this.handleMaxFileExceeded.bind(this),
    addedfile:this.handleAddedFile.bind(this),
    uploadprogress: this.handleFileUploadProgress.bind(this),
    success: this.handleSuccess.bind(this),
    error: this.handleError.bind(this),
    complete:this.handleCompleted.bind(this),
    removedfile:this.handleRemovedFile.bind(this),
   }
    return (
      <Container text textalign='center'>
    
    <Confirm
          header='reply on comment'
          content={
              <Container>
              <Form >
      <TextArea 
      name='message' 
      value={reply ? reply.message:''} 
      placeholder='Say something' 
      autoHeight 
      onChange={this.onChange}
      />
      
              <DropzoneComponent
              config={componentConfig} 
              eventHandlers={eventHandlers} 
              djsConfig={djsConfig}
                />;
              </Form>
              </Container>
          }
          open={open4Reply}
          confirmButton="Save Changes"
          cancelButton="Discard Changes"
          onCancel={this.handleClosereply}
          onConfirm={this.handleSaveChanges}
          size='small'
        />
    <Confirm
          header='reply Is Empty'
          content='This reply appears to be blank. Please write something or attach a photo to reply.'
          open={open4Empty}
          confirmButton="Alright I got it"
          onCancel={this.handleCloseEmpty}
          onConfirm={this.handleCloseEmpty}
          size='small'
        />
    </Container>
    )
  }

}

ReplyField.propTypes={
  authUser:PropTypes.shape({}),
  comment:PropTypes.shape({}),
  open4Reply:PropTypes.bool.isRequired,
  handleDiscardChanges:PropTypes.func.isRequired,
}
ReplyField.defaultProps={
  authUser:null,
  comment:null,
}