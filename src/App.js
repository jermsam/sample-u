import React from 'react';
import {Route,Redirect}  from 'react-router-dom'
import PropTypes from 'prop-types'
import {WelcomePage,ProfilePage} from './pages';
import MainHeading from './pages/navs'
import {AuthConsumer} from './AuthContext'


const App = () => (
      <div>
      <MainHeading/>
        <Route exact path='/' component={WelcomePage}/>
        
        <ProtectedRoute exact path='/profile' component={ProfilePage}/>
       
      </div>
    );

    function ProtectedRoute({ component: Component, ...rest }){
      return(
          <AuthConsumer>
            {({ authUser }) => (
              <Route
              {...rest}
                render={
                  props =>
                  (
                    authUser ? <Component {...props} /> 
                    : <Redirect to={{
                      pathname: '/',
                      state: { from: props.location }
                    }} />
                  )
                    
                }
               
              />
            )}
          </AuthConsumer>
        )
      }
        ProtectedRoute.propTypes={
          location:PropTypes.shape({}),
          component:PropTypes.func.isRequired
        }
        ProtectedRoute.defaultProps={
          location:null
        }

export default App;
