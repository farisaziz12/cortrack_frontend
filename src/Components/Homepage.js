import React, { Component } from "react";
import "./Homepage.css";
import { Link } from "react-router-dom";
// import * as data from "../data/countries.geojson";


export default class Homepage extends Component {

    state = {
        latestNews: []
    }


    componentDidMount(){
        fetch(`https://gnews.io/api/v3/search?q=coronavirus%20news&token=6385a60f5d387a9bf5fd4f8d033f4168`)
            .then(response => response.json()).then(news => 
                this.setState({latestNews: news.articles&& news.articles
            }))
            .catch(err => {
                console.log(err);
            });
    }

  render() {
    const sortedNews  = this.state.latestNews&& this.state.latestNews[0]? this.state.latestNews.sort((a,b) => {
        return new Date(b.publishedAt) - new Date(a.publishedAt);
    }):
    undefined

    const top5News = sortedNews? sortedNews.slice(0, 5) : undefined

    return (
      <div className="div">
        <h1 className="h1">CorTrack</h1>
        <Link to="/map">
          <button className="nav-btn">Map</button>
        </Link>
        <Link to="/case-info">
          <button className="nav-btn">Cases Info</button>
        </Link>
        {this.state.latestNews&& this.state.latestNews[0]&&
        <h1 className="h1 news-title"><u>Latest Global News</u></h1>
        }
        <div className='latest-news'>
            {top5News&&
            top5News.map(newsPiece => (
                <h3 className='news-txt'><a className='news-txt' href={newsPiece.url}>{newsPiece.title}</a></h3>
            ))}
        </div>
        
      </div>
    );
  }
}