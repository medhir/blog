import React from "react";
import PropTypes from "prop-types";
import Link from "next/link";

import styles from "../blog.module.scss";
import { PostMetadata } from "..";

interface DraftListItemProps {
  draft: PostMetadata;
}

const DraftListItem = ({ draft }: DraftListItemProps) => {
  const locale = "en-US";
  const localeStringOptions: Intl.DateTimeFormatOptions = {
    month: "long", // long month format
    day: "numeric", // numeric day format
    year: "numeric", // numeric year format
    hour: "numeric", // numeric hour format
    minute: "numeric", // numeric minute format
    hour12: true, // use 12-hour clock (AM/PM)
  };
  const saved = draft.saved_on
    ? new Date(draft.saved_on).toLocaleTimeString(locale, localeStringOptions)
    : "";
  return (
    <li className={styles.draft}>
      <Link href={`/blog/edit/draft/${draft.id}`}>
        <h3>{draft.title}</h3>
        <p suppressHydrationWarning>{`Last saved at ${saved}`}</p>
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
