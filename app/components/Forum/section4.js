'use client';
import Section from '../section';
import Forums from './forum';
import { useUser } from '@/context/userContext';
export default function Section4() {
	const { user } = useUser();
	return <Section title='Community' content={<Forums user={user} />} />;
}
