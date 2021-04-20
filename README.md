# spotify-react-app

spotify-react-app is a react app for evaluating the types of music you listen to and make best recommendations out of it.

## Installation

Use [git clone] to first clone the project from the github repo.

```bash
git clone https://github.com/Tommyzhou1/spotify-react-app
```

Change to the main folder of the project and install the required packages

```bash
cd main && npm install
```

## Usage

Start the development server
```bash
npm start
```

Runs on the local server
```browser
localhost:3000
```

P.S. Sets the app to offline (loads faster) in index.js

~~serviceWorker.unregister()~~ -> serviceWorker.register()

## File Top-level Layout
    .
    ├── public                  # Assets and template files
    ├── src                     # Source files (alternatively `lib` or `app`)
    ├── Dockerfile
    └── README.md

## Using Tech Stacks
Redux, React, Node.js, docker, python

![alt text](https://github.com/Tommyzhou1/spotify-react-app/blob/master/src/WireFrame.JPG)

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
