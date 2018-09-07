import React from 'react';
import PropTypes from 'prop-types'
import JoinForm from './forms'
import {AuthConsumer} from '../AuthContext'
import Timeline from './Timeline'

const WelcomePage = ({history}) => (
    
    <AuthConsumer>
          {
            ({authUser})=>authUser?
                        <Timeline/>
                          :
                        <JoinForm {...{history}}/>
                       
                          
          }   
    </AuthConsumer> 
       
    );

    WelcomePage.propTypes={
        history:PropTypes.shape({}).isRequired,
    }

export default WelcomePage;
