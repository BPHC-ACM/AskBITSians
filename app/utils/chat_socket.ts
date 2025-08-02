let socket = null;

export const connectWebSocket = () => {
	if (socket && socket.readyState === WebSocket.OPEN) {
		return;
	}

	socket = new WebSocket('wss://acc-website.onrender.com');

	socket.onopen = () => {
		console.log('Connected to WebSocket server');
	};

	socket.onclose = () => {
		console.log('Disconnected from WebSocket server');
	};

	socket.onerror = (event) => {
		console.error('WebSocket error:', event);
	};
};
