import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

const DraftListItem = props => {
  const saved = new Date(props.draft.saved).toString()
  return (
    <li className="draft">
      <h3>{props.draft.title}</h3>
      <p>{`Last saved at: ${saved}`}</p>
      <Link
        to={{
          pathname: `/blog/edit/draft/${props.draft.id}`,
          state: props.draft,
        }}
      >
        View in Editor
      </Link>
    </li>
  )
}

DraftListItem.propTypes = {
  draft: PropTypes.shape({
    id: PropTypes.string,
    markdown: PropTypes.string,
    saved: PropTypes.number,
    title: PropTypes.string,
  }),
}

export default DraftListItem
