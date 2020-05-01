import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import { DraftMetadata } from '../types'
import styles from '../blog.module.scss'

interface DraftListItemProps {
  draft: DraftMetadata
}

const DraftListItem = ({ draft }: DraftListItemProps) => {
  const saved = new Date(draft.saved).toString()
  return (
    <li className={styles.draft}>
      <h3>{draft.title}</h3>
      <p>{`Last saved at: ${saved}`}</p>
      <Link href={`/blog/edit/draft/${draft.id}`}>View in Editor</Link>
    </li>
  )
}

interface DraftsListProps {
  drafts: Array<DraftMetadata>
}

const DraftsList = ({ drafts }: DraftsListProps) => {
  if (!drafts) return null
  const draftListItems = drafts.map((draft) => {
    return <DraftListItem draft={draft} key={draft.id} />
  })
  return <ul className={styles.drafts}>{draftListItems}</ul>
}

DraftsList.propTypes = {
  drafts: PropTypes.array,
}

export default DraftsList
