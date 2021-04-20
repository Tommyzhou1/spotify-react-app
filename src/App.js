import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import logo from './spotify-logo.png';
import './App.css';
import spfetch from './spfetch';
import RadarChart from 'react-svg-radar-chart';
import 'react-svg-radar-chart/build/css/index.css'

class App extends Component {
  // We might be logged in on load if the token could be extracted from the url hash
  state = { isLoggedIn: spfetch.isLoggedIn() };

  handleLoginClick = async () => {
    this.setState({
      isLoggedIn: await spfetch.login()
    });
  };

  render() {
    const { isLoggedIn } = this.state;
    return isLoggedIn ? (
      <LoggedInScreen />
    ) : (
      <React.Fragment>
        <div className="loginMenu">
          <img className = "loginLogo" src={logo} alt="Logo" />,
          <div className="loginBtn">
            <Button
              variant="contained"
              color="primary"
              className={''}
              onClick={this.handleLoginClick}
            >
              Log In With Your Account in Spotify
            </Button>
          </div>
        </div>
      </React.Fragment>
      
    );
  }
}

class LoggedInScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: null,
      href: null,
      imageUrl: null,
      numFollowers: null,
      logout: null,
    };

    this.handleLogoutClick = this.handleLogoutClick.bind(this);
}
 
  async componentDidMount() {
    await this.getMe();
  }
  async handleLogoutClick(){
    spfetch.logout();
    this.setState({
      logout: "true"
    })
  }

  async getMe() {
    const {
      display_name: name,
      href,
      images: [{ url: imageUrl } = {}] = [],
      followers: { total: numFollowers }
    } = await spfetch('/v1/me');

    this.setState({ name, href, imageUrl, numFollowers});
    return true;
  }


  render() {
    const {
      name,
      imageUrl,
      numFollowers,
    } = this.state;
    if(this.state.logout){
      return <App />
    }
    return (
      <div className="App">
        <CssBaseline />
        {name && (
          <Card className="Card">
            <CardActionArea>
              <CardMedia className="CardMedia" image={imageUrl} title={name} />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {name}
                </Typography>
                <Typography component="p">Followers: {numFollowers}</Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        )}
        <Button className="logoutBtn" variant="contained" onClick={this.handleLogoutClick}>Logout</Button>
        <div className = "radarChart">
          <RadarChart
            captions={{
              // columns
              battery: 'Battery Capacity',
              design: 'Design',
              useful: 'Usefulness',
              speed: 'Speed',
              weight: 'Weight'
            }}
            data={[
              // data
              {
                data: {
                  battery: 0.7,
                  design: .8,
                  useful: 0.9,
                  speed: 0.67,
                  weight: 0.8
                },
                meta: { color: '#58FCEC' }
              },
            ]}
            size={400}
    
          />
          </div>
        </div>
    );
  }
}

export default App;
