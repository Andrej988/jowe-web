import { type PropsWithChildren } from 'react';

export interface PropsWithToastMessaging {
  onSendToastMsgHandler: (icon: string | string[], title: string, message: string) => void;
}

export interface PropsWithChildrenAndToastMessaging extends PropsWithChildren {
  onSendToastMsgHandler: (icon: string | string[], title: string, message: string) => void;
}
