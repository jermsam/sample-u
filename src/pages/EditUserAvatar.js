import React,{Component} from 'react'
import {Container, Confirm,Form } from 'semantic-ui-react'
import DropzoneComponent from 'react-dropzone-component'
import PropTypes from 'prop-types'
import {imghost} from '../feathers'

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
  dictDefaultMessage:'Drop an avatar for this story or click here to upload one',
  dictFileTooBig:'Kindly compress to atmost 2 MB',
  dictInvalidFileType:'Kindly stick to valid avatar types',
  dictCancelUpload:'Cancel upload',
  dictRemoveFile:'Remove avatar'
}

export default class EditUserAvatar extends Component{

  state={
    myDropzone:null,
  }
  


  handleInnitializeDropzone=dropzone=>{
    const {user:{avatar}} =this.props
        if(avatar){
            // Create the mock file:
        const mockFile = {name: avatar}
        // Call the default addedfile event handler
        dropzone.emit("addedfile", mockFile);
        // And optionally show the thumbnail of the file:
        dropzone.emit("thumbnail", mockFile, `${imghost}/${avatar}`);
        // Make sure that there is no progress bar, etc...
        dropzone.emit("complete", mockFile);
        } 
    this.setState({myDropzone:dropzone})
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
  
   const {user,onChange,
     open4Edit,handleDiscardChanges,handleSaveChanges,handleAddedFile,handleRemovedFile}=this.props
   const eventHandlers = { 
    init: this.handleInnitializeDropzone.bind(this),
    maxfilesexceeded: this.handleMaxFileExceeded.bind(this),
    addedfile:handleAddedFile.bind(this),
    complete:this.handleCompleted.bind(this),
    removedfile:handleRemovedFile.bind(this),
   }
    return (
      <Container text textalign='center'>
    
    <Confirm
          header='Edit Avatar'
          content={
              <Container text>
              <Form>
              <Form.Group widths='equal'>
            <Form.Input name='firstname' value={user? user.firstname:''} placeholder='First Name' {...{onChange}}/>
            <Form.Input name='lastname' value={user? user.lastname:''} placeholder='Last Name' {...{onChange}}/>
              </Form.Group>
              <Form.Input name='email' value={user? user.email:''} placeholder='Email' {...{onChange}}/>
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
    
    </Container>
    )
  }

}


EditUserAvatar.propTypes={
  user:PropTypes.shape({}),
  open4Edit:PropTypes.bool.isRequired,
  onChange:PropTypes.func.isRequired,
  handleDiscardChanges:PropTypes.func.isRequired,
  handleSaveChanges:PropTypes.func.isRequired,
  handleAddedFile:PropTypes.func.isRequired,
  handleRemovedFile:PropTypes.func.isRequired,
}

EditUserAvatar.defaultProps={
  user:null,
}