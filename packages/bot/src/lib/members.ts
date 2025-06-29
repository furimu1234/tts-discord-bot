import type { Guild } from 'discord.js';

export const fetchMember = async (
	guild: Guild,
	filter: { memberId: string },
) => {
	let members = guild.members.cache;

	if (members.size < 2) {
		members = await guild.members.fetch();
	}

	return members.find((x) => x.id === filter.memberId);
};
