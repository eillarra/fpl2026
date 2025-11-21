import type { QNotifyCreateOptions } from 'quasar';

import { Notify as QuasarNotify } from 'quasar';

import type { ApiError } from '@evan/api/client';

import { iconCached, iconCheck, iconError, iconInfo, iconWarning } from '@/icons';

type StatusMap = { [key: number]: string };

class Notify {
  create(opts: QNotifyCreateOptions): void {
    QuasarNotify.create({
      ...opts,
      position: 'bottom',
    });
  }

  apiError(error: ApiError): void {
    const types: StatusMap = {
      400: 'warning',
      401: 'warning',
      403: 'warning',
      500: 'negative',
    };

    const textColors: StatusMap = {
      400: 'grey-8',
      401: 'grey-8',
      403: 'grey-8',
      500: 'white',
    };

    const type = types[error.status] || 'warning';
    const caption = `${error.status} ${error.statusText}`.toUpperCase() || '';
    let msg = '';

    // 400 Bad Request || 403 Forbidden
    if (error.status === 400 || error.status === 403) {
      const errors: string[] = [];
      if (error.data) {
        Object.keys(error.data).forEach((k) => {
          if (typeof error.data[k] === 'string') {
            errors.push(`<strong>${k}</strong>: ${error.data[k]}`);
          } else if (Array.isArray(error.data[k])) {
            error.data[k].forEach((v: string) => {
              errors.push(`<strong>${k}</strong>: ${v}`);
            });
          }
        });
      }
      msg = errors.join('<br>') || error.message;
    }

    // 500 Internal Server Error
    if (error.status === 500) {
      const detail = error.data && typeof error.data === 'object' && 'detail' in error.data ? error.data.detail : null;
      msg = (typeof detail === 'string' ? detail : null) || error.message;
    }

    this.create({
      timeout: 10000,
      progress: true,
      html: true,
      message: msg,
      caption: caption,
      type: type,
      icon: type === 'negative' ? iconError : iconWarning,
      actions: [
        {
          label: '✕',
          color: textColors[error.status] || 'grey-8',
        },
      ],
      attrs: {
        role: 'alert',
      },
    });
  }

  error(msg: string): void {
    this.create({
      type: 'negative',
      message: msg,
      timeout: 5000,
      icon: iconError,
    });
  }

  info(msg: string): void {
    this.create({
      message: msg,
      timeout: 2500,
      icon: iconInfo,
    });
  }

  ongoing(msg: string, timeout: number): void {
    this.create({
      type: 'ongoing',
      message: msg,
      timeout: timeout,
      spinner: false,
      progress: true,
    });
  }

  success(msg: string): void {
    this.create({
      type: 'positive',
      message: msg,
      timeout: 2500,
      icon: iconCheck,
    });
  }

  warning(msg: string): void {
    this.create({
      type: 'warning',
      message: msg,
      timeout: 5000,
      icon: iconWarning,
    });
  }

  reload(): void {
    this.create({
      color: 'dark',
      icon: iconCached,
      message: 'We have updated the website. Please refresh the page.',
      timeout: 0,
      multiLine: true,
      position: 'bottom',
      actions: [
        {
          label: 'Refresh',
          color: 'lime',
          handler: () => {
            window.location.reload();
          },
        },
      ],
    });
  }
}

export const notify = new Notify();
