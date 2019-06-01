import React from 'react';

const Preview = props => {
  const generateHTML = () => {
    return {
      __html: props.parsedContent,
    };
  };
  return <article dangerouslySetInnerHTML={generateHTML()} />;
};

export default Preview;
