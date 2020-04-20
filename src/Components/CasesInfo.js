import React, { Component } from 'react'
import './CaseInfo.css'

export default class CasesInfo extends Component {

    state = {
        results: [],
        value: '', 
        caseData: [],
        selectedCountry: null,
        newsForSelectedCountry: []
    }

    componentDidMount(){
        fetch("https://covid19-data.p.rapidapi.com/all", {
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "covid19-data.p.rapidapi.com",
                "x-rapidapi-key": "36d86838d4mshba08a92dbba7104p1ae352jsnf92cd7cb9983"
            }
        })
        .then(response => response.json()).then(data => 
            this.setState({caseData: data
            }))
        .catch(err => {
        console.log(err);
        });
        }

    handleResultSelect = (e, { result }) => this.setState({ value: result.title })

    sortSearch = (caseData) => {
        const results = caseData.map(country => [country, this.fuzzyMatch(country.country, this.state.value)]);
        results.sort((a, b) => b[1] - a[1]);
        const filteredResults = results.filter(result => result[1] > 0)
        return filteredResults
    }

    handleSearchChange = (e) => {
        if (e.target.value.length === 0){
            this.setState({
                value: "",
                results: this.sortSearch(this.state.caseData)
            })
        } else {
            this.setState({ value: e.target.value })
            const matches = this.sortSearch(this.state.caseData)
            this.setState({
                results: matches,
                selectedCountry: null,
                newsForSelectedCountry: []
            })
        }
    }

    handlePickCountry = (e) => {
        this.setState({
            selectedCountry: e.target.textContent,
            results: [],
            value: ''
    })
            fetch(`https://gnews.io/api/v3/search?q=${e.target.textContent}%20coronavirus%20news&token=6385a60f5d387a9bf5fd4f8d033f4168`)
            .then(response => response.json()).then(news => 
                this.setState({newsForSelectedCountry: news.articles
            }))
            .catch(err => {
                console.log(err);
            });
    }

    fuzzyMatch = (compareTerm ,term) => {
        if (term.length === 0)
            return 1;
        let string = compareTerm.toLowerCase();
        let compare = term.toLowerCase();
        let matches = 0;
        for (let i = 0; i < compare.length; i++) {
            string.indexOf(compare[i]) > -1 ? matches += 1 : matches -=1;
        }
        return matches / compareTerm.length;
    }

    render() {
        const sortedNews = 
        this.state.newsForSelectedCountry&& this.state.newsForSelectedCountry[0]? this.state.newsForSelectedCountry.sort((a,b) => {
            return new Date(b.publishedAt) - new Date(a.publishedAt);
          }) 
          : 
        undefined
        
        const filteredNews = sortedNews&& sortedNews.filter(article => article.title.includes(this.state.selectedCountry)) 
        const top3News = filteredNews? filteredNews.slice(0, 3) : undefined
        const { results } = this.state
        const country = this.state.caseData.find(country => country.country === this.state.selectedCountry)

        function numberWithCommas(number) {
            return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

        return (
            <div className='search-div'>
                <h1 className='txt'>Case Info</h1>
                <h3 className='txt'>Search for a country to get info on cases</h3>
                <input className='search' type='text' value={this.state.value} onChange={this.handleSearchChange}/><br/>
                {results.map(result => (
                    <button onClick={this.handlePickCountry} className='btn' name={result[0].country}>{result[0].country}</button>
                ))}

                <div className='result'> 
                    {this.state.selectedCountry&&
                    <>
                    <div className='case-box'>
                        <h1 className='txt'>Country: {country.country_name}</h1>
                        <h2 className='new-case-txt'>Cases: {numberWithCommas(country.confirmed)}</h2>
                        <h2 className='new-death-txt'>Deaths: {numberWithCommas(country.deaths)}</h2>
                        <h2 className='recover-txt'>Total Recovered: {country.recovered === 0? "Insufficient Data" : numberWithCommas(country.recovered)}</h2>
                        <h3 className='txt'>Percent of infected who have died: {(parseFloat(country.deaths)/parseFloat(country.confirmed) * 100).toFixed(2) + "%"}</h3>
                        <h3 className='txt'>Percent of infected who have recovered: {country.recovered === 0? "Insufficient Data" : (parseFloat(country.recovered)/parseFloat(country.confirmed) * 100).toFixed(2) + "%"}</h3>
                    </div>
                    <div className='case-box'>
                        <h1 className='txt'>Latest News:</h1>
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
            </div>

        )
    }
}

