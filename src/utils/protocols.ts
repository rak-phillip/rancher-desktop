import path from 'path';
import { URL } from 'url';

import { app, ProtocolRequest, ProtocolResponse, protocol } from 'electron';

import Latch from '@/utils/latch';

/**
 * Checks if Rancher Desktop is running in a development or test environment
 * @returns True if Rancher Desktop is running in a development or test
 * environment
 */
const isDevEnv = /^(?:dev|test)/i.test(process.env.NODE_ENV || '');

/**
 * Create a URL that consists of a base combined with the provided path
 * @param relPath The destination path for the requested resource
 * @returns A URL that consists of the combined base (http://localhost:8888)
 * and provided path
 */
function redirectedUrl(relPath: string) {
  if (isDevEnv) {
    return `http://localhost:8888${ relPath }`;
  }

  return path.join(app.getAppPath(), 'dist', 'app', relPath);
}

/**
 * Constructs an appropriate protocol response based on the environment
 * (dev, prod, etc...). Used for the registered protocol.
 * @param request The original Electron ProtocolRequest
 * @param redirectUrl The fully-qualified redirect URL
 * @param relPath The relative path to the requested resource
 * @returns A properly structured result for the registered protocol
 */
function getProtocolResponse(
  request: ProtocolRequest,
  redirectUrl: string,
  relPath: string,
): ProtocolResponse {
  if (isDevEnv) {
    return {
      method:   request.method,
      referrer: request.referrer,
      url:      redirectUrl,
    };
  }

  const mimeTypeMap: Record<string, string> = {
    css:  'text/css',
    html: 'text/html',
    js:   'text/javascript',
    json: 'application/json',
    png:  'image/png',
    svg:  'image/svg+xml',
  };
  const mimeType = mimeTypeMap[path.extname(relPath).toLowerCase().replace(/^\./, '')];

  return {
    path:     redirectUrl,
    mimeType: mimeType || 'text/html',
  };
}

// Latch that is set when the app:// protocol handler has been registered.
// This is used to ensure that we don't attempt to open the window before we've
// done that, when the user attempts to open a second instance of the window.
export const protocolRegistered = Latch();

/**
 * Set up protocol handler for app://
 * This is needed because in packaged builds we'll not be allowed to access
 * file:// URLs for our resources. Use the same app:// protocol for both dev and
 * production environments.
 */
export function setupProtocolHandler() {
  const registrationProtocol = isDevEnv ? protocol.registerHttpProtocol : protocol.registerFileProtocol;

  registrationProtocol('app', (request, callback) => {
    const relPath = decodeURI(new URL(request.url).pathname);

    console.log('NOT FAIL', 'REGISTER APP PROTOCOL');
    const redirectUrl = redirectedUrl(relPath);

    console.log('APP RELPATH', { relPath });
    const result = getProtocolResponse(request, redirectUrl, relPath);

    callback(result);
  });

  protocolRegistered.resolve();
}

export function setupProtocolDashboard() {
  protocol.registerFileProtocol('dashboard', (request, callback) => {
    console.log('NOT FAIL', 'REGISTER DASHBOARD PROTOCOL');
    const relPath = decodeURI(new URL(request.url).pathname);

    console.log('DASHBOARD RELPATH', { relPath });
    const redirectPath = path.join(app.getAppPath(), 'resources', 'rancher-dashboard', relPath);

    console.log('DASHBOARD REDIRECTPATH', { redirectPath });

    const mimeTypeMap: Record<string, string> = {
      css:  'text/css',
      html: 'text/html',
      js:   'text/javascript',
      json: 'application/json',
      png:  'image/png',
      svg:  'image/svg+xml',
    };
    const mimeType = mimeTypeMap[path.extname(relPath).toLowerCase().replace(/^\./, '')];

    const result: ProtocolResponse = {
      path:     redirectPath,
      mimeType: mimeType || 'text/html',
    };

    callback(result);
  });

  protocolRegistered.resolve();
}
