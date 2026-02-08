import React from 'react';

export default function GenericPage({ title }) {
  return (
    <div>
      <h1>{title}</h1>
      <p>This is placeholder content for the <strong>{title}</strong> page. Replace with real content or connect to your backend later.</p>
      <p>Sample filler text to demonstrate layout and typography. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
    </div>
  );
}
