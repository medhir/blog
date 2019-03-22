import React, { Component, Fragment } from 'react';

const BlogDraft = (props) => {
    const saved = new Date(props.draft.saved).toString()
    return (
        <li className="draft">
            <h3>{ props.draft.title }</h3>
            <p>{ `Last saved at: ${ saved }` }</p>
        </li>
    )
}

const BlogDrafts = (props) => {
    if (props.drafts === null) return null
    const drafts = props.drafts.map(draft => {
        return <BlogDraft draft={ draft } key={ draft.id }/>
    })
    return <ul className="drafts">{ drafts }</ul>
}


class Drafts extends Component {
    constructor (props) {
        super(props)
    }
}