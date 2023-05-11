import { w3cwebsocket as W3CWebSocket } from 'websocket';

export const WebSocketServer = new W3CWebSocket(`ws://${window.location.hostname}:8000`)