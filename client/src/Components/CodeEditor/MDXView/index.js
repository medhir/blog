import React, { Component } from 'react'

class MDXView extends Component {
    render () {
        return (
            <div className="mdxView">
                <iframe src={ this.props.url }></iframe>
            </div>
        )
    }
}

export default MDXView