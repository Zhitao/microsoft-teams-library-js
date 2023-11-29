import React, { ReactElement } from 'react';

import { ApiWithTextInput } from './utils';
import { ModuleWrapper } from './utils/ModuleWrapper';
import { NaaMock } from './utils/naaMock';

const NaaRequest = (): ReactElement =>
  ApiWithTextInput<NestedAppAuthRequest>({
    name: 'nestedAppAuthMock',
    title: 'NAA Mock',
    onClick: {
      validateInput: (input) => {
        if (!input.requestId) {
          throw new Error('requestId is required');
        }
      },
      submit: async (input) => {
        const naaMock = new NaaMock();
        const listener = (response): void => {
          console.log(response);
          const parsedResponse = JSON.parse(response);
          if (parsedResponse.requestId !== input.requestId) {
            alert('Received response for a different request: ' + JSON.stringify(response));
          }
          alert('Received response: ' + JSON.stringify(parsedResponse));
          naaMock.removeEventListener(listener);
        };
        try {
          naaMock.addEventListener(listener);
        } catch (e) {
          return 'Error while adding event listener: ' + e;
        }
        try {
          naaMock.postMessage(JSON.stringify(input));
        } catch (e) {
          return 'Error while posting message: ' + e;
        }
        return 'done';
      },
    },
  });

const NestedAppAuthAPIs = (): ReactElement => (
  <ModuleWrapper title="NAA">
    <NaaRequest />
  </ModuleWrapper>
);

type NestedAppAuthRequest = {
  requestId: string;
  body?: string;
};

export default NestedAppAuthAPIs;