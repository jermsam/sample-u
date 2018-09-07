import React,{Component} from 'react'
import {Card,Icon,} from 'semantic-ui-react'
import Image from 'react-graceful-image'
import PropTypes from 'prop-types'
import faker from 'faker'
import moment from 'moment'
import {client,imghost} from '../feathers'
import EditUserAvatar from './EditUserAvatar'

class UserDetails extends Component{
  state={
    id:'',
    user:{
      id:'',
      avatar:'',
      email:'',
      passord:'',
      firstname:'',
      lastname:''
    },
    open4Edit:false,
  }

  componentDidMount(){
    const {authUser}=this.props
    this.setState({user:authUser,id:authUser.avatar})
    client.service('users').on('patched',this.fetchUser)
}



onChange = (e, { name,value }) => this.setState((prevState)=>({
  user:{
    ...prevState.user,
   [name]:value
  }
 }));

 fetchUser = async ()=>{
   const {authUser:{id}}=this.props
   const user= await client.service('users').get(id)
  // console.log(user)
  this.setState({user}) 
 }

  handleSaveChanges = () => {
    const {user}=this.state
    client.service('users').patch(user.id,{...user}).then(
        ()=>this.setState({ 
           user,
            open4Edit:false,
        })
    )
    } 

    handleEdit = () => this.setState({ open4Edit: true })

    handleAddedFile = file =>{
      // We want to upload
    const uploadService = client.service('uploads'); 
    const reader = new window.FileReader()
    reader.readAsDataURL(file)
    reader.onload = () =>uploadService.on('created',
                                    uploadService.create({uri:reader.result})
                                    .then(({id})=>this.setState((prevState)=>({
                                        id,
                                      user:{
                                        ...prevState.user,
                                        avatar:id
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
          user:{
            ...prevState.user,
            avatar:null
          }
         }))
      ).catch(
        ()=>console.log(file, ' delete failed')
      )
     
    }

  handleDiscardChanges = () => {
      const{user}=this.state
      this.setState({ 
          user,
          id:'',
          open4Edit:false,
      })
  }
  

  render(){
    const {open4Edit,user}=this.state
    const src = (user&&user.avatar) ? `${imghost}/${user.avatar}`:faker.internet.avatar();
    // const {authUser:{avatar,firstname,lastname,email,createdAt}}=this.props
     
      return(
        <div>
        {user&&
        <div>
          <Card onClick={this.handleEdit}>
      <Image src={src} 
      width="100%"
    height="auto"
    style={{padding: '20px'}}
    alt="post image"
    retry={{count: 15, delay: 3, accumulate: 'add'}}
      />
      <Card.Content >
        <Card.Header>{user.firstname} {user.lastname}</Card.Header>
        <Card.Meta>Joined {moment(user.createdAt).fromNow()}</Card.Meta>
        <Card.Description>
        Email: {user.email}
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <div>
          <Icon name='user' />
          10 Friends
        </div>
      </Card.Content>
    </Card>
    <EditUserAvatar 
        {...{user}}
        {...{open4Edit}} 
        onChange={this.onChange}
        handleDiscardChanges={this.handleDiscardChanges} 
        handleSaveChanges={this.handleSaveChanges}
        handleAddedFile={this.handleAddedFile}
        handleRemovedFile={this.handleRemovedFile}
        />
    </div>
        }
      </div>
        )
      }   

}

UserDetails.propTypes={
    authUser:PropTypes.shape({}).isRequired
}

export default UserDetails