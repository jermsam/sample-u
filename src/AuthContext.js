import React from 'react';
import PropTypes from 'prop-types';
import { app } from './feathers';

const AuthContext = React.createContext();

class AuthProvider extends React.Component {
  state = { authUser: null };

  componentDidMount() {
    const token = localStorage.getItem('feathers-jwt');
    console.log(token)
    if (token) {
      app
        .authenticate()
        .then(({ accessToken }) => this.handleAuth(accessToken));
    }
  }

  handleAuth = async accessToken => {
    try {
      const { userId } = await app.passport.verifyJWT(accessToken);

      const authUser = await app.service('users').get(userId);
      // console.log(authUser)
      this.setState({ authUser });
      return authUser;
    } catch (err) {
      return null;
    }
  };

  logout = () => app.logout().then(() => window.location.reload());

  render() {
    const { authUser } = this.state;
    const { children } = this.props;
    return (
      <AuthContext.Provider
        value={{
          authUser,
          logout: this.logout
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  }
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

const AuthConsumer = AuthContext.Consumer;
export { AuthProvider, AuthConsumer };