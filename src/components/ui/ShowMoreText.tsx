import React, { useState } from 'react';

interface ShowMoreTextProps {
  text: string;
  maxLength: number;
  className?: string;
  style?: React.CSSProperties;
}

const ShowMoreText: React.FC<ShowMoreTextProps> = ({ text, maxLength, className, style }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleIsExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <span className={className} style={style}>
      {isExpanded ? text : `${text.slice(0, maxLength)}...`}
      {text.length > maxLength && (
        <span onClick={toggleIsExpanded} className="text-primary cursor-pointer ml-1">
          {isExpanded ? 'Show less' : 'Show more'}
        </span>
      )}
    </span>
  );
};

export default ShowMoreText;
