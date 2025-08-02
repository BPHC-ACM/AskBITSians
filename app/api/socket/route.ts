import { NextResponse } from 'next/server';
import { Server as IOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { saveMessage } from '../../utils/db';
import type { Message } from '../../utils/types';

declare global {
	var io: IOServer | undefined;
}

const initializeSocketServer = (httpServer: HTTPServer) => {
	if (global.io) {
		return global.io;
	}

	const io = new IOServer(httpServer, {
		path: '/api/socket',
		cors: {
			origin: '*',
		},
	});

	io.on('connection', (socket) => {
		console.log(`Socket connected: ${socket.id}`);

		socket.on('join_room', (data: { roomid: string; userId: string }) => {
			try {
				socket.join(data.roomid);
			} catch (err) {
				socket.emit('error', { message: 'Failed to join room' });
			}
		});

		socket.on('leave_room', (data: { roomid: string; userId: string }) => {
			try {
				socket.leave(data.roomid);
			} catch (err) {
				socket.emit('error', { message: 'Failed to leave room' });
			}
		});

		socket.on('send_message', async (data: Message) => {
			try {
				await saveMessage(data);
				io.to(data.roomid).emit('receive_message', data);
			} catch (err: any) {
				socket.emit('error', {
					message: err.message || 'Failed to send message',
				});
			}
		});

		socket.on(
			'reconnect_rooms',
			(data: { userId: string; rooms: string[] }) => {
				try {
					data.rooms.forEach((roomid) => {
						socket.join(roomid);
					});
				} catch (err) {
					socket.emit('error', { message: 'Failed to rejoin rooms' });
				}
			}
		);

		socket.on('disconnect', (reason) => {
			console.log(`Socket disconnected: ${socket.id} due to ${reason}`);
		});
	});

	global.io = io;
	return io;
};

export async function GET(req: Request) {
	try {
		const res = (req as any).socket?.server;
		if (!res) {
			return NextResponse.json(
				{ error: 'No HTTP server available' },
				{ status: 500 }
			);
		}

		initializeSocketServer(res);
		return NextResponse.json({ message: 'Socket.IO server is running' });
	} catch (error) {
		return NextResponse.json(
			{ error: 'Failed to initialize Socket.IO' },
			{ status: 500 }
		);
	}
}

export const config = {
	api: {
		bodyParser: false,
	},
};
