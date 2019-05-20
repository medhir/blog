export default `# Adventures in Building a Dev-Centric Blogging System

Since first endeavoring on a mission to build a blogging platform from scratch, I've desired a way to share my technical learnings.

\`\`\`jsx live=true
class Counter extends React.Component {
  constructor() {
    super()
    this.state = { count: 0 }
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.setState(state => ({ count: state.count + 0.01 }))
    }, 10)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  render() {
    return (
      <center style={
        { border: '1px dotted darkblue',
          padding: '10px',
          margin: '10px auto',
          backgroundColor: 'lightblue',
          width: '60px', 
          borderRadius: '40px' }}>
        <h3>
          {Number.parseFloat(this.state.count).toFixed(2)}
        </h3>
      </center>
    )
  }
}
\`\`\`














`