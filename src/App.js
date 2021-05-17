import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';
import { Avatar} from '@material-ui/core';
import FlipCameraIosIcon from '@material-ui/icons/FlipCameraIos';
import RefreshIcon from '@material-ui/icons/Refresh';
import './App.css';
import logo from './spotify-logo.png';
import spfetch from './spfetch';
import RadarChart from 'react-svg-radar-chart';
import 'react-svg-radar-chart/build/css/index.css'
import Flippy, { FrontSide, BackSide } from 'react-flippy';

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
      musicTempoData: {},
      graphToolipValue:null
    };
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
    this.getLocalTime = this.getLocalTime.bind(this);
    this.handleToolTip = this.handleToolTip.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
}
 
  async componentDidMount() {
    await this.getTracks();
    await this.getMe();
    document.addEventListener('mousemove', this.handleMouseMove);
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

  handleMouseMove = e => {
    this.mousePos = [e.pageX, e.pageY];
  };

  handleToolTip = dot =>{
    this.setState({
      graphToolipValue: dot.value
    })
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

  async getTracks() {
    let trackIDList = [], tempoDataList = {}, sumD = 0, sumT = 0, sumA = 0, sumE = 0, sumV = 0;
    const{
      items: trackList
    } = await spfetch('v1/me/top/tracks?time_range=short_term');
    trackList.forEach(element => {
      trackIDList.push(element.id);
    });
    const{
      audio_features: musicTempoList
    } = await spfetch('v1/audio-features?ids=' + trackIDList.join('%2C'));
    var normalized_musicTempoList = musicTempoList;
    normalized_musicTempoList.forEach(element => {
      element.tempo = Math.abs((element.tempo-100)/100);
      sumD+=element.danceability;
      sumT+=element.tempo;
      sumA+=element.acousticness;
      sumE+=element.energy;
      sumV+=element.valence;
    });
    let length = normalized_musicTempoList.length;
    tempoDataList["danceability"] = sumD/length;
    tempoDataList["tempo"] = sumT/length;
    tempoDataList["acousticness"] = sumA/length;
    tempoDataList["energy"] = sumE/length;
    tempoDataList["valence"] = sumV/length;

    this.setState({musicTempoData:tempoDataList});

    return true;
  }
  render() {
    const {
      name,
      imageUrl,
      numFollowers,
      musicTempoData,
      graphToolipValue
    } = this.state;
    const cards = [
      {
        id: 1,
        name: "Leanne Graham",
        username: "Bret",
        email: "Sincere@april.biz"
      },
      {
        id: 2,
        name: "Tommy Zhou",
        username: "Bret",
        email: "Sincere@april.biz"
      },
      {
        id: 3,
        name: "Kevin Li",
        username: "Bret",
        email: "Sincere@april.biz"
      },
    ];
    const data = [
      {
        data: {
          danceability: parseFloat(musicTempoData['danceability']),
          acoustic: parseFloat(musicTempoData['acousticness']),
          valence: parseFloat(musicTempoData['valence']),
          energy: parseFloat(musicTempoData['energy']),
          tempo: parseFloat(musicTempoData['tempo'])
        },
        meta: { color: 'red' }
      }
    ];
    const captions = {
      // columns
      danceability: 'danceability',
      acoustic: 'acoustic',
      valence: 'valence',
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
        mouseEnter: (dot) => { this.handleToolTip(dot) },
        mouseLeave: (dot) => { this.handleToolTip(dot) }
      })
    };
    let userAvatar = null, userImage = null;
    if(imageUrl == null){
      userAvatar =  <Avatar alt="Remy Sharp" style={{ height: '70px', width: '70px', margin: '20px'}}>{this.state.firstName}</Avatar>
      userImage = <img alt="" style={{width: '320px', height: '350px'}}></img>
    }
    else{
      userAvatar = <Avatar alt="Remy Sharp" src={imageUrl} style={{ height: '70px', width: '70px', margin: '20px'}}></Avatar>
      userImage = <img src={imageUrl} alt={this.state.firstName} style={{width: '320px', height: '350px'}}></img>
    }
    if(this.state.logout){
      return <App />
    }
    return name && (
      <div className="App"> 
        <div style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          }}> 
          {userAvatar}
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
                borderRadius: '10px'
              }}   
            >
            <LightTooltip title="Flip The Profile Card To See More" placement="top-start" arrow>
              <FlipCameraIosIcon style={{ width: '50px', height: '50px', left: '0px', top: '-5px',color:'green', position: 'absolute'}}></FlipCameraIosIcon>
            </LightTooltip>
            {userImage}
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
              borderRadius: '10px'
            }}   
          >
          <div className = "radarWrapper" style={{top:"80px", position: 'relative'}}>
            
            <RadarChart
              captions={captions}
              data={data}
              size={300}
              options={customizedOptions}
            />
             {graphToolipValue && (
                <div
                  className="tooltip"
                  style={{ left: this.mousePos[0]-30, top: this.mousePos[1]-220,position:'absolute' }}
                >
                {parseFloat(graphToolipValue).toFixed(3)}
                </div>
              )}
          </div>
          </BackSide>
        </Flippy>
        <div style={{display: 'flex',position: 'absolute', left: "50px", backgroundColor: '#1DB954',padding: '25px',borderRadius: '10px'}}>
        <div style={{position: 'absolute', top: '-8px', left:'-8px'}}>
        <IconButton aria-label="refresh">
          <RefreshIcon fontSize="large"/>
        </IconButton>
        </div>
        {cards.map(cards => (
        <Card style={{padding:'10px',margin:'10px'}}>
          {cards.name}
          <CardMedia className="CardMedia" image={imageUrl} title={name} />
        </Card>))}
        </div>
      </div>
    );
  }
}

export default App;
