import React from "react";
import PropTypes from "prop-types";
import Link from "next/link";

import styles from "../blog.module.scss";
import { PostMetadata } from "..";

interface DraftListItemProps {
  draft: PostMetadata;
}

const DraftListItem = ({ draft }: DraftListItemProps) => {
  const saved = draft.saved_on ? new Date(draft.saved_on).toString() : "";
  return (
    <li className={styles.draft}>
      <Link href={`/blog/edit/draft/${draft.id}`}>
        <a>
          <h3>{draft.title}</h3>
          <p>{`Last saved at: ${saved}`}</p>
        </a>
      </Link>
    </li>
  );
};

interface DraftsListProps {
  drafts: Array<PostMetadata>;
}

const DraftsList = ({ drafts }: DraftsListProps) => {
  if (!drafts) return null;
  const draftListItems = drafts.map((draft) => {
    return <DraftListItem draft={draft} key={draft.id} />;
  });
  return <ul className={styles.drafts}>{draftListItems}</ul>;
};

DraftsList.propTypes = {
  drafts: PropTypes.array,
};

export default DraftsList;
