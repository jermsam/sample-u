# sample-u

> a react app for a sample social media app. 

## About

This project uses is bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app) and served by [sample-s](https://github.com/jermsam/sample-s)through [@feathers/client](https://docs.feathersjs.com/api/client.html) api and realtime [socket.io-client](https://github.com/socketio/socket.io-client)client.
The main 3rd party libraries used are:
1. [dropzone](https://www.dropzonejs.com)and [react-dropzone-component](https://github.com/felixrieseberg/React-Dropzone-Component) for image uploading 
2. [react-graceful-image](https://github.com/linasmnew/react-graceful-image) for graceful image rendering
3. [semantic-ui-react](https://react.semantic-ui.com) for a css-framework


## To Run it

Getting up and running is as easy as 1, 2, 3.

1. Clone the repository.
2. Install your dependencies

    ```
    cd path/to/sample-u; yarn
    ```

4. Start your app

    ```
    yarn start
    ```

## Testing

Simply run `yarn test` and all your tests in the `test/` directory will be run.

## Bad Practises

In this particular example I exposed my bucket url ... you dont want to do that ... instead use .env to keep these secret

