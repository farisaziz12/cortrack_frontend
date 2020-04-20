import React, { Component } from "react";
import "./Homepage.css";
import { Link } from "react-router-dom";


export default class Homepage extends Component {

    state = {
        latestNews: [], 
        newsForCurrentCountry: [],
        currentCountry: null,
        caseData: []
    }


    componentDidMount(){
        fetch(`https://gnews.io/api/v3/search?q=coronavirus%20news&token=6385a60f5d387a9bf5fd4f8d033f4168`)
            .then(response => response.json()).then(news => 
                this.setState({latestNews: news.articles&& news.articles
            }))
            .catch(err => {
                console.log(err);
            });

        fetch("https://coronavirus-monitor.p.rapidapi.com/coronavirus/cases_by_country.php", {
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "coronavirus-monitor.p.rapidapi.com",
                "x-rapidapi-key": "36d86838d4mshba08a92dbba7104p1ae352jsnf92cd7cb9983"
            }
        })
        .then(response => response.json()).then(data => 
            this.setState({caseData: data.countries_stat
            }))
        .catch(err => {
        console.log(err);
        })


        fetch("https://ipapi.co/8.8.8.8/json/").then(resp => resp.json()).then(resp => 
        fetch(`https://gnews.io/api/v3/search?q=${resp.country_name}%20coronavirus%20news&token=6385a60f5d387a9bf5fd4f8d033f4168`)
            .then(response => response.json()).then(news => 
                this.setState({newsForCurrentCountry: news.articles, currentCountry: resp.country_name
            }))
            .catch(err => {
                console.log(err);
            })
        )
    }

  render() {
    const sortedNews  = this.state.latestNews&& this.state.latestNews[0]? this.state.latestNews.sort((a,b) => {
        return new Date(b.publishedAt) - new Date(a.publishedAt);
    }):
    undefined

    const top5News = sortedNews? sortedNews.slice(0, 5) : undefined
    const { currentCountry, caseData, newsForCurrentCountry } = this.state
    const currentCountryCaseData = caseData[0]&& currentCountry? caseData.filter(Ccase => Ccase.country_name === currentCountry) : []
    console.log(currentCountryCaseData, currentCountry)
    const currentCountrySortedNews = 
        newsForCurrentCountry&& newsForCurrentCountry[0]? newsForCurrentCountry.sort((a,b) => {
            return new Date(b.publishedAt) - new Date(a.publishedAt);
          }) 
          : 
        undefined
        
    const filteredNews = currentCountrySortedNews&& currentCountrySortedNews.filter(article => article.title.includes(currentCountry)) 
    const top3News = filteredNews? filteredNews.slice(0, 3) : undefined

    return (
      <div className="div">
        <h1 className="h1">CorTrack</h1>
        <Link to="/map">
          <button className="nav-btn">Map</button>
        </Link>
        <Link to="/case-info">
          <button className="nav-btn">Cases Info</button>
        </Link> <br/>

        <div className='result'> 
            {currentCountry&& currentCountryCaseData[0]&&
            <>
            <div className='case-box'>
                <h1 className='txt'>Current Country: {currentCountryCaseData[0].country_name}</h1>
                <h2 className='txt'>Cases: {currentCountryCaseData[0].cases}</h2>
                <h2 className='txt'>Deaths: {currentCountryCaseData[0].deaths}</h2>
                <h2 className='new-case-txt'>New Cases: {currentCountryCaseData[0].new_cases}</h2>
                <h2 className='new-death-txt'>New Deaths: {currentCountryCaseData[0].new_deaths}</h2>
                <h2 className='recover-txt'>Total Recovered: {currentCountryCaseData[0].total_recovered}</h2>
                <h3 className='txt'>Percent of infected who have died: {(parseFloat(currentCountryCaseData[0].deaths.replace(/,/g, ''))/parseFloat(currentCountryCaseData[0].cases.replace(/,/g, '')) * 100).toFixed(2) + "%"}</h3>
                <h3 className='txt'>Percent of infected who have recovered: {(parseFloat(currentCountryCaseData[0].total_recovered.replace(/,/g, ''))/parseFloat(currentCountryCaseData[0].cases.replace(/,/g, '')) * 100).toFixed(2) + "%"}</h3>
            </div>
            <div className='case-box'>
              <h1 className='txt'>{currentCountryCaseData[0].country_name}'s Latest News:</h1>
                {!top3News? <h2 className='txt'>None</h2> : undefined}
                {top3News&& 
                top3News.map(article => (
                    <h3 className='news-txt'><a className='news-txt' href={article.url}>{article.title}</a></h3>
                ))
                }
            </div> <br/>
            </>
            }
        </div>

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