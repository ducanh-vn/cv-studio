'use client';

import React from 'react';

export const CVReadOnlyContext = React.createContext<boolean>(false);

export const useCVReadOnly = () => React.useContext(CVReadOnlyContext);
