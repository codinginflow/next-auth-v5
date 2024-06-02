// pages/index.tsx

import React from 'react';
import { PageQuery, PageQueryVariables } from '../../tina/__generated__/types';

export const HomePage = (props: {data: PageQuery; variables: PageQueryVariables; query: string; }) => {
  return (
    <div>
      <h1>Welcome to My Next.js Home Page</h1>
      <p>
        {props.data.page?.subtitle}
      </p>
      {/* Add your content here */}
    </div>
  );
};

export default HomePage;
