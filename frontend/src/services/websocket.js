
class WebSocketService {
  constructor(url) {
    this.url = url || 'ws://localhost:8000/api/v1/agents/ws';
    this.ws = null;
this.listeners = [];
this.reconnectAttempts = 0;
this.maxReconnectAttempts = 5;
}
connect() {
try {
this.ws = new WebSocket(this.url);
  this.ws.onopen = () => {
    console.log('WebSocket connected');
    this.reconnectAttempts = 0;
  };

  this.ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    this.notifyListeners(data);
  };

  this.ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  this.ws.onclose = () => {
    console.log('WebSocket disconnected');
    this.reconnect();
  };
} catch (error) {
  console.error('WebSocket connection error:', error);
}
}
reconnect() {
if (this.reconnectAttempts < this.maxReconnectAttempts) {
this.reconnectAttempts++;
const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
console.log(Reconnecting in ${delay}ms...);
setTimeout(() => this.connect(), delay);
}
}
send(data) {
if (this.ws && this.ws.readyState === WebSocket.OPEN) {
this.ws.send(JSON.stringify(data));
}
}
subscribe(callback) {
this.listeners.push(callback);
return () => {
this.listeners = this.listeners.filter(listener => listener !== callback);
};
}
notifyListeners(data) {
this.listeners.forEach(listener => listener(data));
}
disconnect() {
if (this.ws) {
this.ws.close();
this.ws = null;
}
}
}
export default new WebSocketService();
