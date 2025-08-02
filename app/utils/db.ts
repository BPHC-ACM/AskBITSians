import { supabase } from './supabaseClient';
import { Message, Chat } from './types';

export async function saveMessage(message: Message) {
	const { data, error } = await supabase
		.from('chats')
		.select('messages')
		.eq('roomid', message.roomid)
		.single();

	if (error) {
		console.error('Error fetching messages:', error);
		throw new Error(`Failed to fetch messages: ${error.message}`);
	}

	const currentMessages = data.messages || [];
	const updatedMessages = [...currentMessages, message];

	const { data: updateData, error: updateError } = await supabase
		.from('chats')
		.update({ messages: updatedMessages })
		.eq('roomid', message.roomid);

	if (updateError) {
		console.error('Error updating messages:', updateError);
		throw new Error(`Failed to update messages: ${updateError.message}`);
	}

	console.log('Message saved successfully:', updateData);
	return message;
}

export async function getChatHistory(roomid: string): Promise<Message[]> {
	const { data, error } = await supabase
		.from('chats')
		.select('messages')
		.eq('roomid', roomid)
		.single();

	if (error) {
		throw new Error(`Failed to fetch chat history: ${error.message}`);
	}
	return data.messages as Message[];
}

export async function getRoomsForUser(userId: string): Promise<Chat[]> {
	const { data, error } = await supabase
		.from('chats')
		.select('*')
		.or(`student_id.eq.${userId},consultant_id.eq.${userId}`);

	if (error) {
		throw new Error(`Failed to fetch rooms: ${error.message}`);
	}
	return data as Chat[];
}
