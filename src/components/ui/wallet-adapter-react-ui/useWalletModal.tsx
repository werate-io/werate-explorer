'use client';
import { createContext, useContext } from 'react';

export interface WalletModalContextState {
  visible: boolean;
  setVisible: (open: boolean) => void;
}

const DEFAULT_CONTEXT = {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  setVisible(_open: boolean) {
    /* eslint-enable @typescript-eslint/no-unused-vars */
    console.error(constructMissingProviderErrorMessage('call', 'setVisible'));
  },
  visible: false
};
Object.defineProperty(DEFAULT_CONTEXT, 'visible', {
  get() {
    console.error(constructMissingProviderErrorMessage('read', 'visible'));
    return false;
  }
});

function constructMissingProviderErrorMessage(action: string, valueName: string) {
  return (
    'You have tried to ' +
    ` ${action} "${valueName}"` +
    ' on a WalletModalContext without providing one.' +
    ' Make sure to render a WalletModalProvider' +
    ' as an ancestor of the component that uses ' +
    'WalletModalContext'
  );
}

export const WalletModalContext = createContext<WalletModalContextState>(
  DEFAULT_CONTEXT as WalletModalContextState
);

export function useWalletModal(): WalletModalContextState {
  return useContext(WalletModalContext);
}
