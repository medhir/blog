import React, { Component } from 'react'

const DailyCost = 8
const QuitTime = 1570073546352

interface QuitProps {}

interface QuitState {
  years: number
  months: number
  weeks: number
  days: number
  hours: number
  minutes: number
  seconds: number
  savings: number
  dollars: string
  cents: string
}

/**
 * MedhirQuits is a ticker giving the time since Medhir last used marijuana. Inspired by https://github.com/jakealbaugh/jake-quits
 */
class MedhirQuits extends Component<QuitProps, QuitState> {
  constructor(props: QuitProps) {
    super(props)
    this.state = {
      years: null,
      months: null,
      weeks: null,
      days: null,
      hours: null,
      minutes: null,
      seconds: null,
      savings: null,
      dollars: null,
      cents: null,
    }
  }
  componentDidMount() {
    setInterval(this.update.bind(this), 1000)
  }
  update() {
    const now = new Date().getTime()
    const seconds = (now - QuitTime) / 1000
    const days = seconds / 86400
    const savings = days * DailyCost
    this.setState({
      years: seconds / 31556952,
      months: seconds / 2592000,
      weeks: seconds / 604800,
      days,
      hours: seconds / 3600,
      minutes: seconds / 60,
      seconds,
      savings,
      dollars: Math.floor(savings)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ','),
      cents: (savings - Math.floor(savings)).toFixed(2).split('.')[1],
    })
  }
  render() {
    const {
      years,
      months,
      weeks,
      days,
      hours,
      minutes,
      seconds,
      dollars,
      cents,
    } = this.state
    return (
      <section className="MedhirQuits">
        <h1>quits</h1>
        <h2>
          medhir quit weed. he's memorializing a ticker to stay motivated.
          inspired by <a href="https://jakequits.com/">jakequits.com</a>
        </h2>
        <div className="Progresses">
          {seconds && (
            <>
              <p>{Math.round(seconds)} seconds.</p>
              <p>{Math.round(minutes)} minutes.</p>
              <p>{hours.toFixed(1)} hours.</p>
              <p>{days.toFixed(2)} days.</p>
              <p>{weeks.toFixed(2)} weeks.</p>
              <p>{months.toFixed(3)} months.</p>
              <p>{years.toFixed(4)} years.</p>
              <p>
                Savings: ${dollars}.{cents}
              </p>
            </>
          )}
        </div>
      </section>
    )
  }
}

export default MedhirQuits
