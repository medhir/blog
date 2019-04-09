import React, { Component } from 'react' 
import Marked from 'marked';
import api from '../../api'
import Loading from '../../../../Layout/Loading'
import './Post.css';

const Display = (props) => {
    const generateHTML = () => {
        return {
            __html: props.parsedContent
        }
    }
    return (
        <section className="display">
            <article dangerouslySetInnerHTML={generateHTML()}></article>
        </section>
    )
}

class Post extends Component {
    constructor (props) {
        super(props)
        this.state = {
            post: null
        }
    }

    componentDidMount = () => {
        api.getPost(this.props.match.params.titlePath)
        .then((response) => {
            this.setState({ post: response.data })
        })
    }

    Display = (props) => {
        const generateHTML = () => {
            return {
                __html: props.parsedContent
            }
        }
        return <article dangerouslySetInnerHTML={generateHTML()}></article>
    }

    render () {
        if (this.state.post) {
            const parsed = Marked(this.state.post.markdown)
            return <Display parsedContent={ parsed } />
        } else {
            return <Loading />
        }
    }
}

export default Post