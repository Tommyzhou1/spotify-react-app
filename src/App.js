import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import FlipCameraIosIcon from '@material-ui/icons/FlipCameraIos';
import { withStyles } from '@material-ui/core/styles';
import { Avatar } from '@material-ui/core';
import Flippy, { FrontSide, BackSide } from 'react-flippy';
import logo from './spotify-logo.png';
import './App.css';
import spfetch from './spfetch';
import RadarChart from 'react-svg-radar-chart';
import 'react-svg-radar-chart/build/css/index.css'

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[2],
    fontSize: 15,
  },
}))(Tooltip);

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

    const data = [
      {
        data: {
          danceability: 0.7,
          acoustic: .8,
          loudness: 0.9,
          energy: 0.67,
          tempo: 0.8
        },
        meta: { color: 'blue' }
      }
    ];
    const captions = {
      // columns
      danceability: 'danceability',
      acoustic: 'acoustic',
      loudness: 'loudness',
      energy: 'energy',
      tempo: 'tempo'
    };
    const customizedOptions = {
      size: 200,
      axes: true, // show axes?
      dots: true, // show dots?
      zoomDistance: 1.2, // where on the axes are the captions?
      captionProps: () => ({
        className: 'caption',
        textAnchor: 'middle',
        fontSize: 16,
        fontFamily: 'sans-serif'
      }),
      dotProps: () => ({
        className: 'dot',
        mouseEnter: (dot) => { console.log(dot) },
        mouseLeave: (dot) => { console.log(dot) }
      })
    };

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
        <Flippy
          flipOnHover={false} // default false
          flipOnClick={true} // default false
          flipDirection="horizontal" // horizontal or vertical
          ref={(r) => this.flippy = r} // to use toggle method like this.flippy.toggle()
          style={{ width: '350px', height: '500px', margin: '50px', color: '191414'}}
        >
          <FrontSide
              style={{
                backgroundColor: '#1DB954',
              }}   
            >
            <LightTooltip title="Flip The Profile Card To See More" placement="top-start" arrow>
              <FlipCameraIosIcon style={{ width: '50px', height: '50px', left: '0px', top: '-5px',color:'green', position: 'absolute'}}></FlipCameraIosIcon>
            </LightTooltip>
            <img src={imageUrl} alt="description" style={{width: '320px', height: '350px'}}></img>
            <div className = "bioWrapper" style={{top:"20px", position: 'relative'}}>
              <Typography gutterBottom variant="h4" component="h2" align="center">
                {name}
              </Typography>
              <Typography gutterBottom variant="h5" component="h5" align="center">Followers: {numFollowers}</Typography>
            </div>
          </FrontSide>
          <BackSide
            style={{
              backgroundColor: '#1DB954',
            }}   
          >
          <div className = "radarWrapper" style={{top:"80px", position: 'relative'}}>
            <RadarChart
              captions={captions}
              data={data}
              size={300}
              options={customizedOptions}
            />
          </div>
          </BackSide>
        </Flippy>
      </div>
    );
  }
}

export default App;
