import React from 'react'
import { Link } from 'react-router-dom'
import Auth from '../../../Auth'

const DraftListItem = (props) => {
    const saved = new Date(props.draft.saved).toString()
    return (
        <li className="draft">
            <h3>{ props.draft.title }</h3>
            <p>{ `Last saved at: ${ saved }` }</p>
            <Link to={ { 
                pathname: `/blog/edit/drafts/${ props.draft.id }`, 
                state: props.draft
            } }>View in Editor</Link>
        </li>
    )
}

export default DraftListItem