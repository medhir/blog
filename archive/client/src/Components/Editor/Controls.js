import React, { Fragment } from 'react'
import Deleter from 'Controls/Deleter'
import { GreenButton, RedButton, MagentaButton } from 'Controls/Buttons'

const Controls = props => {
  return (
    <div className="editor-controls">
      {props.edit === true ? (
        <Fragment>
          <GreenButton onClick={props.saveDraft}>Save Draft</GreenButton>
          <Deleter endpoint={props.deleteURI} callback={props.deleteCallback} />
        </Fragment>
      ) : (
        <Fragment>
          <RedButton onClick={props.openEditor}>Edit</RedButton>
          <MagentaButton onClick={props.publish}>Publish</MagentaButton>
        </Fragment>
      )}
    </div>
  )
}

export default Controls
