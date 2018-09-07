import React,{Component} from 'react'
import {Statistic,Icon,Menu,Button} from 'semantic-ui-react'
import {Link} from 'react-router-dom'
import {AuthConsumer} from '../../AuthContext'

export default class MainHeading extends Component {
    state = { activeItem: 'home' }
  
    handleItemClick = (e, { name }) => this.setState({ activeItem: name })
  
    render() {
      const { activeItem } = this.state
  
      return (
        <AuthConsumer>
        { ({authUser,logout}) => authUser &&
        <Menu secondary pointing className='topHeader'>
            <Menu.Item>
            <Statistic size='mini'>
              <Statistic.Value><Icon name='braille'/></Statistic.Value>
              <Statistic.Label>Slogan</Statistic.Label>
            </Statistic>
            </Menu.Item>
            <Menu.Item 
            as={Link} to='/' name='home' active={activeItem === 'home'}
             onClick={this.handleItemClick}>Home</Menu.Item>
             <Menu.Item 
             as={Link} to= 'profile' name='profile' active={activeItem === 'profile'}
              onClick={this.handleItemClick}>Profile</Menu.Item>
            <Menu.Menu position='right'>
                <Menu.Item>
                <Statistic size='mini'>
                    <Statistic.Value><Button circular icon='sign out' onClick={logout}/></Statistic.Value>
                    <Statistic.Label>sign out</Statistic.Label>
                </Statistic>
             </Menu.Item>
            </Menu.Menu>
        </Menu>
        }
        </AuthConsumer>
       
      )
    }
  }