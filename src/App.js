import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { Avatar } from '@material-ui/core';
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
      firstName: null,
      href: null,
      imageUrl: null,
      numFollowers: null,
      logout: null,
      playerState: {},
      timeInGreeting: null,
    };
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
    this.getLocalTime = this.getLocalTime.bind(this);
}
 
  async componentDidMount() {
    await this.getMe();
  }

  getLocalTime() {
    var currentTime = new Date();
    var h = currentTime.getHours(); 
    console.log(h);
      if(h>=6 && h<12){
        this.setState({timeInGreeting: "Morning"});
      }
      else if(h>=12 && h<18){
        this.setState({timeInGreeting: "Afternoon"});
      }
      else if(h>=18){
        this.setState({timeInGreeting: "Evening"});
      }
      else{
        this.setState({timeInGreeting: "Night"});
      }
  }

  handleLogoutClick(){
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

    this.setState({ name, href, imageUrl, numFollowers,firstName: (name.split(' '))[0]});
    this.getLocalTime();
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
        <div style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          }}> 
          <Avatar alt="Remy Sharp" src={imageUrl} style={{ height: '70px', width: '70px', margin: '20px'}}></Avatar>
          <p style={{fontSize:40, position: 'absolute', left: "10%", color: 'white'}}>Good {this.state.timeInGreeting} {this.state.firstName}</p>
          <Button style={{left: '90%', position: 'absolute'}} variant="contained" color="primary" onClick={this.handleLogoutClick}>Logout</Button>
        </div>
        {name && (
          <Card className="Card">
            <CardActionArea>
              <CardMedia className="CardMedia" image={imageUrl} title={name} />
              <CardContent >
                <Typography gutterBottom variant="h5" component="h2" align="center">
                  {name}
                </Typography>
                <Typography gutterBottom variant="h6" component="h5" align="center">Followers: {numFollowers}</Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        )}
      </div>
    );
  }
}

export default App;
