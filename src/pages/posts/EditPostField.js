import React,{Component} from 'react'
import {Container, Form, TextArea,Confirm } from 'semantic-ui-react'
import DropzoneComponent from 'react-dropzone-component'
import PropTypes from 'prop-types'
import {imghost} from '../../feathers'

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

export default class EditPostField extends Component{

  state={
    open4Empty: false,
    myDropzone:null,
  }
  
  handleCloseEmpty = () => this.setState({ open4Empty: false })


  handleInnitializeDropzone=dropzone=>{
    const {post:{image}} =this.props
        if(image){
            // Create the mock file:
        const mockFile = {name: image}
        // Call the default addedfile event handler
        dropzone.emit("addedfile", mockFile);
        // And optionally show the thumbnail of the file:
        dropzone.emit("thumbnail", mockFile, `${imghost}/${image}`);
        // Make sure that there is no progress bar, etc...
        dropzone.emit("complete", mockFile);
        } 
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

  

  render(){
  
   const {open4Empty}=this.state
   const {post,open4Edit,handleDiscardChanges,onChange,handleSaveChanges,handleAddedFile,handleRemovedFile}=this.props
   const eventHandlers = { 
    init: this.handleInnitializeDropzone.bind(this),
    maxfilesexceeded: this.handleMaxFileExceeded.bind(this),
    addedfile:handleAddedFile.bind(this),
    uploadprogress: this.handleFileUploadProgress.bind(this),
    success: this.handleSuccess.bind(this),
    error: this.handleError.bind(this),
    complete:this.handleCompleted.bind(this),
    removedfile:handleRemovedFile.bind(this),
   }
    return (
      <Container text textalign='center'>
    
    <Confirm
          header='Edit Post'
          content={
              <Container>
              <Form >
      <TextArea 
      name='message' 
      value={post ? post.message:''} 
      placeholder='Say something' 
      autoHeight 
      onChange={onChange}
      />
      
              <DropzoneComponent
              config={componentConfig} 
              eventHandlers={eventHandlers} 
              djsConfig={djsConfig}
                />;
              </Form>
              </Container>
          }
          open={open4Edit}
          confirmButton="Save Changes"
          cancelButton="Discard Changes"
          onCancel={handleDiscardChanges}
          onConfirm={handleSaveChanges}
          size='small'
        />
    <Confirm
          header='Post Is Empty'
          content='This post appears to be blank. Please write something or attach a photo to post.'
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


EditPostField.propTypes={
  post:PropTypes.shape({}),
  open4Edit:PropTypes.bool.isRequired,
  onChange:PropTypes.func.isRequired,
  handleDiscardChanges:PropTypes.func.isRequired,
  handleSaveChanges:PropTypes.func.isRequired,
  handleAddedFile:PropTypes.func.isRequired,
  handleRemovedFile:PropTypes.func.isRequired,
}

EditPostField.defaultProps={
  post:null,
}