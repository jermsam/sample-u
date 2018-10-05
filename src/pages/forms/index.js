import React,{Component} from 'react';
import {Menu,Grid,Container,Form,Button,Divider,Statistic,Icon,Header} from 'semantic-ui-react'
import PropTypes from 'prop-types'
import {app} from '../../feathers'

const SignIn= ({data:{email,password},onChange,onSignin}) => (
      <Form>
      <Form.Group>
        <Form.Input placeholder='email' name='email' value={email} {...{onChange}}/>
        <Form.Input placeholder='password' name='password' value={password} {...{onChange}}/>
        <Button onClick={onSignin}>Sign in</Button>
      </Form.Group>
      </Form>
    );

    SignIn.propTypes={
        data:PropTypes.shape({}).isRequired,
        onChange:PropTypes.func.isRequired,
        onSignin:PropTypes.func.isRequired,
    }

    const SignUp= ({data:{email,password,firstname,lastname},onChange,onSignup}) => (
      
      <Form>
      <Divider hidden/>
      <Form.Group widths='equal'>
      <Form.Input placeholder='First Name' name='firstname' value={firstname} {...{onChange}}/>
      <Form.Input placeholder='Last Name' name='lastname' value={lastname} {...{onChange}}/>
      </Form.Group>
      <Divider hidden/>
        <Form.Input placeholder='email' name='email' value={email} {...{onChange}}/>
        <Divider hidden/>
        <Form.Input placeholder='password' name='password' value={password} {...{onChange}}/>
        <Divider hidden/>
        <Button color='teal' onClick={onSignup}>Sign up</Button> 
        <Divider hidden/>
      </Form>
    );

    SignUp.propTypes={
        data:PropTypes.shape({}).isRequired,
        onChange:PropTypes.func.isRequired,
        onSignup:PropTypes.func.isRequired,
    }


    const INNITIAL_STATE={
      firstname:'',
      lastname:'',
      email:'',
      password:'',
  }

    export default class JoinForm extends Component{
      state={
          data:INNITIAL_STATE
      }

  
      onChange=(e,{name,value})=>this.setState(
          (prevState)=>({
              data:{
                ...prevState.data,
              [name]:value
              }
          })
      )
  
      onSignin = () =>{
        const {data} =this.state
        this.doAuth(data)
      }
  
      onSignup = () =>{
          const {data} =this.state
          app.service('users').create(data)
          .then(()=>this.doAuth(data))
          .then(()=>this.setState({data:INNITIAL_STATE}))
      }

      doAuth= data=>app.authenticate({
          strategy:'local',
          ...data
        }).then(()=>window.location.reload())
      
  

      render(){
          const {data}=this.state
          return (
            <div>
            <Menu secondary color='teal' inverted>
            <Menu.Item>
            <Statistic>
              <Statistic.Value><Icon name='braille'/></Statistic.Value>
              <Statistic.Label>Slogan</Statistic.Label>
            </Statistic>
            </Menu.Item>
            <Menu.Menu position='right'>
            <Menu.Item>
            <SignIn {...{data}} onChange={this.onChange} onSignin={this.onSignin}/>
            </Menu.Item>
            </Menu.Menu>
            </Menu>
           
            <Grid columns={2} verticalAlign='middle' textAlign='center'>
            <Grid.Column width={10}>
            <Header color='teal' as='h1'>Welcome Message</Header>
            <Divider hidden/>
            <p>Say anything cool that will let folks join you. Keep it precise</p>
            </Grid.Column>
            <Grid.Column width={5}>
            <Container textAlign='justified' >
            <SignUp {...{data}} onChange={this.onChange} onSignup={this.onSignup}/>
            </Container>
            </Grid.Column>
            </Grid>
           
            </div>
          )    
      }
  }

  JoinForm.propTypes={
    history:PropTypes.shape({}).isRequired,
}

