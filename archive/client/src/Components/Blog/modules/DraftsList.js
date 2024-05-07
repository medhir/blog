import React from 'react'
import PropTypes from 'prop-types'
import DraftListItem from './DraftListItem'

const DraftsList = props => {
  if (props.drafts === null) return null
  const drafts = props.drafts.map(draft => {
    return <DraftListItem draft={draft} key={draft.id} />
  })
  return <ul className="drafts">{drafts}</ul>
}

DraftsList.propTypes = {
  drafts: PropTypes.array,
}

export default DraftsList
