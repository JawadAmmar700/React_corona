import React, { useState, useEffect, useRef } from 'react'
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import './chart.css'
import App from '../App'


const url = 'https://disease.sh/v3/covid-19/countries';
const urlAll = 'https://disease.sh/v3/covid-19/all';


function Chart() {
    const name = useRef('');
    const [countries, setCountries] = useState([]);
    const [custom, setCustom] = useState({});
    const [selected, setSelected] = useState('WorldWide');
    const [list, setList] = useState({});
    const [open, setOpen] = useState(false);
    const date = [];
    const cases = [];
    const casesforday = [];

    useEffect(() => {
        fetch(url)
            .then(res => res.json())
            .then(data => {
                setCountries(data);
            })

    }, [])


    useEffect(() => {
        setCustom({})
        if (selected === 'WorldWide') {
            fetch(urlAll)
                .then(res => res.json())
                .then(data => {
                    setCustom(data);

                })
            axios.get(`https://disease.sh/v3/covid-19/historical/all?lastdays=8`)
                .then(country => {

                    setList(country.data?.cases);

                })

        }
        else {
            fetch(`https://disease.sh/v3/covid-19/countries/${selected}`)
                .then(res => res.json())
                .then(data => {
                    setCustom(data);

                })
        }

    }, [selected])




    useEffect(() => {
        if (selected != "WorldWide") {

            axios.get(`https://disease.sh/v3/covid-19/historical/${selected}?lastdays=8`)
                .then(country => {

                    setList(country.data.timeline?.cases);

                })
        }

    }, [selected])

    const setingUpData = () => {
        Object.entries(list).map(item => {
            cases.push(item[1])
            date.push(item[0])

        })

        for (let i = 0; i < cases.length - 1; i++) {
            casesforday.push((cases[i] - cases[i + 1]) * -1)
        }
        // Object.entries(last8daysDeath).map(item => {
        //     deaths.push(item[1])

        // })

    }
    setingUpData()

    const data = {
        labels: date.splice(1, 7),
        datasets: [
            {
                label: 'Cases per day',
                backgroundColor: 'rgba(255,99,132,0.2)',
                borderColor: 'rgba(255,99,132,1)',
                borderWidth: 3,
                hoverBorderColor: 'rgba(255,99,132,1)',
                data: casesforday
            }
        ]
    }
    let id = 1;

    const handleClick = (e) => {
        e.preventDefault();
        setOpen(!open);
    }

    return (
        <div className="App">
            <div className="leftside">

                <div className="selector">


                    <select className="displayValue" onChange={e => {
                        e.preventDefault()
                        setSelected(e.target.value)
                    }}>
                        <option value="WorldWide">WorldWide</option>
                        {
                            countries.sort((a, b) => a.country > b.country ? 1 : -1).map(item => {
                                return (

                                    <option key={id++} value={item.country}>{item.country}</option>


                                )
                            })
                        }

                    </select>

                </div>



                <div className="container">
                    <div className="cases">
                        <h3>Cases</h3>
                        <p>{custom.cases}</p>
                    </div>
                    <div className="recoverd">
                        <h3>Recoverd</h3>
                        <p>{custom.recovered}</p>
                    </div>
                    <div className="deaths">
                        <h3>Deaths</h3>
                        <p>{custom.deaths}</p>
                    </div>

                </div>


                <div className="graph">
                    <Line
                        data={data}
                        width={100}
                        height={200}
                        options={{
                            maintainAspectRatio: false
                        }}
                    />
                </div>
            </div>

            <div className="rightside">
                <div className="tableWrap">
                    <h4>country Cases</h4>
                    <div className="table">

                        <table>

                            {
                                countries.sort((a, b) => a.cases < b.cases ? 1 : -1).map(item => {
                                    return (

                                        <tr key={id++}>
                                            <td>{item.country}</td>
                                            <td className="tablecases">{item.cases}</td>
                                        </tr>

                                    )

                                })
                            }

                        </table>

                    </div>
                </div>






            </div>
            {/* <App click="yes" /> */}
        </div >
    );
}

export default Chart;